import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import { detectBusinessType, TEMPLATE_DEFAULTS, type BusinessType } from "@/lib/business-types";
import { fetchUnsplashImages } from "@/lib/image-queries";
import { OPENAI_API_KEY, UNSPLASH_ACCESS_KEY } from "@/lib/env";
import { getUserPlanAndUsage } from "@/lib/billing";
import { rateLimit } from "@/lib/rate-limit";
import { trackAutoOutreachEvent } from "@/lib/analytics-track";

const AI_PROMPT = `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string (2-3 sentences)","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`;

function buildFromTemplate(
  businessName: string,
  businessType: string,
  city: string,
  detectedType: BusinessType,
  aiContent: Record<string, unknown> | null,
  galleryImages: string[],
  address: string,
  phone: string
) {
  const template = TEMPLATE_DEFAULTS[detectedType] || TEMPLATE_DEFAULTS.restaurant;
  const name = (aiContent?.business_name as string) || businessName;
  const tagline = (aiContent?.tagline as string) || template.heroSubtitle;
  const description = (aiContent?.description as string) || `We are a ${businessType} in ${city} dedicated to quality and service.`;
  const svc = aiContent?.services as { title: string; description: string }[] | undefined;
  const tst = aiContent?.testimonials as { name: string; text: string; role: string }[] | undefined;
  const services = svc?.length ? svc : template.services;
  const testimonials = tst?.length ? tst : template.testimonials;

  return {
    businessName: name,
    businessType,
    tagline,
    heroTitle: `Welcome to ${name}`,
    heroSubtitle: tagline,
    aboutTitle: template.aboutTitle,
    aboutContent: description,
    services,
    testimonials,
    galleryImages,
    extraSections: template.extraSections || [],
    contactInfo: {
      address: address || "See our location",
      phone: phone || "",
      email: "info@example.com",
      whatsapp: "",
      contactText: (aiContent?.contact_text as string) || "Get in touch with us today.",
    },
  };
}

function getBaseUrl(): string {
  const vercel = process.env.VERCEL_URL;
  const app = process.env.NEXT_PUBLIC_APP_URL;
  if (vercel) return `https://${vercel}`;
  if (app) return app.replace(/\/$/, "");
  return "https://instantbizsite.ai";
}

function createSlug(name: string): string {
  const base = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 30) || "demo";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `demo-${base}-${suffix}`;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const { ok } = rateLimit(`auto-outreach:${ip}`);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hasCredits = await hasEnoughCredits(user.id, "autoOutreachGenerate");
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Demo generation costs 20 credits." },
      { status: 403 }
    );
  }

  const billing = await getUserPlanAndUsage(user.id);
  if (!billing?.canCreateSite) {
    return NextResponse.json({ error: "Website limit reached. Upgrade your plan." }, { status: 403 });
  }

  const body = await request.json();
  const businessName = (body?.businessName || "").trim();
  const businessType = (body?.businessType || "restaurant").trim();
  const city = (body?.city || "").trim();
  const address = (body?.address || "").trim();
  const phone = (body?.phone || "").trim();
  const placeId = (body?.placeId || "").trim();

  if (!businessName) {
    return NextResponse.json({ error: "businessName is required" }, { status: 400 });
  }

  const prompt = `Create a website for ${businessName}, a ${businessType} in ${city}.`;
  const detectedType = detectBusinessType(prompt) as BusinessType;
  const galleryImages = await fetchUnsplashImages(detectedType, UNSPLASH_ACCESS_KEY);

  let aiContent: Record<string, unknown> | null = null;
  if (OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: AI_PROMPT },
          { role: "user", content: `Business: ${businessName}. Type: ${businessType}. City: ${city}.` },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });
      const text = completion.choices[0]?.message?.content || "{}";
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      aiContent = JSON.parse(cleaned);
    } catch {
      aiContent = null;
    }
  }

  const result = buildFromTemplate(
    businessName,
    businessType,
    city,
    detectedType,
    aiContent,
    galleryImages,
    address,
    phone
  );

  const slug = createSlug(businessName);
  const html = JSON.stringify(result);

  const { error } = await supabase.from("sites").insert({
    user_id: user.id,
    prompt: `Auto Outreach demo: ${businessName}`,
    html,
    slug,
  });

  if (error) {
    console.error("Save demo site error:", error);
    return NextResponse.json({ error: "Failed to publish demo" }, { status: 500 });
  }

  await deductCredits(user.id, "autoOutreachGenerate");

  const demoUrl = `${getBaseUrl()}/s/${slug}`;

  await supabase.from("auto_outreach_jobs").insert({
    user_id: user.id,
    business_name: businessName,
    city: city || null,
    country: null,
    email: null,
    phone: phone || null,
    website: null,
    generated_demo_url: demoUrl,
    outreach_message: null,
    status: "demo_ready",
  } as Record<string, unknown>);

  await trackAutoOutreachEvent(user.id, "demo_generated", { businessName, slug });

  return NextResponse.json({
    demo_url: demoUrl,
    slug,
    data: result,
  });
}
