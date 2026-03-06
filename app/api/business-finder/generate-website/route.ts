import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import { detectBusinessType, TEMPLATE_DEFAULTS, type BusinessType } from "@/lib/business-types";
import { fetchUnsplashImages } from "@/lib/image-queries";
import { OPENAI_API_KEY, UNSPLASH_ACCESS_KEY } from "@/lib/env";

const AI_PROMPT = `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string (2-3 sentences)","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`;

function buildFromTemplate(
  businessName: string,
  businessType: string,
  city: string,
  detectedType: BusinessType,
  aiContent: {
    business_name?: string;
    tagline?: string;
    description?: string;
    services?: { title: string; description: string }[];
    testimonials?: { name: string; text: string; role: string }[];
    contact_text?: string;
  } | null,
  galleryImages: string[]
) {
  const template = TEMPLATE_DEFAULTS[detectedType] || TEMPLATE_DEFAULTS.restaurant;
  const name = aiContent?.business_name || businessName;
  const tagline = aiContent?.tagline || template.heroSubtitle;
  const description = aiContent?.description || `We are a ${businessType} in ${city} dedicated to quality and service.`;
  const services = aiContent?.services?.length ? aiContent.services : template.services;
  const testimonials = aiContent?.testimonials?.length ? aiContent.testimonials : template.testimonials;

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
      address: "See our location",
      phone: "",
      email: "info@example.com",
      whatsapp: "",
      contactText: aiContent?.contact_text || "Get in touch with us today.",
    },
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hasCredits = await hasEnoughCredits(user.id, "businessWebsite");
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Website generation costs 20 credits." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const businessName = (body?.businessName || "").trim();
  const businessType = (body?.businessType || "restaurant").trim();
  const city = (body?.city || "").trim();
  const address = body?.address || "";
  const phone = body?.phone || "";
  const placeId = body?.placeId || "";

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
    aiContent as Parameters<typeof buildFromTemplate>[4],
    galleryImages
  );

  if (address || phone) {
    result.contactInfo.address = address || result.contactInfo.address;
    result.contactInfo.phone = phone || result.contactInfo.phone;
  }

  await deductCredits(user.id, "businessWebsite");

  await supabase.from("business_leads").insert({
    user_id: user.id,
    business_name: businessName,
    address: address || null,
    phone: phone || null,
    city: city || null,
    place_id: placeId || null,
    website_generated: true,
  } as Record<string, unknown>);

  return NextResponse.json(result);
}
