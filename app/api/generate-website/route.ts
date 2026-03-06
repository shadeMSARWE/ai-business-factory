import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { detectBusinessType, TEMPLATE_DEFAULTS } from "@/lib/business-types";
import { fetchUnsplashImages } from "@/lib/image-queries";
import { OPENAI_API_KEY, UNSPLASH_ACCESS_KEY } from "@/lib/env";
import { getUserPlanAndUsage } from "@/lib/billing";

const AI_PROMPT = `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string (2-3 sentences)","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`;

function buildFromTemplate(
  prompt: string,
  aiContent: {
    business_name?: string;
    tagline?: string;
    description?: string;
    services?: { title: string; description: string }[];
    testimonials?: { name: string; text: string; role: string }[];
    contact_text?: string;
  } | null,
  businessType: ReturnType<typeof detectBusinessType>,
  galleryImages: string[]
) {
  const template = TEMPLATE_DEFAULTS[businessType];
  const name = aiContent?.business_name || template.heroTitle.replace(/Welcome to |Our |Your /, "").trim() || "Business";
  const tagline = aiContent?.tagline || template.heroSubtitle;
  const description = aiContent?.description || `We are a ${businessType.replace("_", " ")} dedicated to quality and service.`;
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
    contactInfo: {
      address: "123 Main Street",
      phone: "+1234567890",
      email: "info@example.com",
      whatsapp: "1234567890",
      contactText: aiContent?.contact_text || "Get in touch with us today.",
    },
  };
}

export async function POST(request: NextRequest) {
  let prompt = "";
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
    const { ok, remaining } = rateLimit(`gen:${ip}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    if (user) {
      const billing = await getUserPlanAndUsage(user.id);
      if (!billing?.canGenerate) {
        return NextResponse.json({ error: "AI generation limit reached for this month. Upgrade your plan." }, { status: 403 });
      }
    }

    const body = await request.json();
    prompt = body?.prompt || "";
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const businessType = detectBusinessType(prompt);

    const [aiContent, galleryImages] = await Promise.all([
      OPENAI_API_KEY
        ? (async () => {
            try {
              const { default: OpenAI } = await import("openai");
              const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
              const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: AI_PROMPT },
                  { role: "user", content: `Business: ${prompt}` },
                ],
                temperature: 0.7,
                max_tokens: 600,
              });
              const text = completion.choices[0]?.message?.content || "{}";
              const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
              return JSON.parse(cleaned);
            } catch {
              return null;
            }
          })()
        : Promise.resolve(null),
      fetchUnsplashImages(businessType, UNSPLASH_ACCESS_KEY),
    ]);

    const result = buildFromTemplate(prompt, aiContent, businessType, galleryImages);

    if (supabase && user) {
      await supabase.rpc("increment_usage", { p_user_id: user.id, p_sites_delta: 0, p_generations_delta: 1 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate website error:", error);
    const businessType = detectBusinessType(prompt || "restaurant");
    const galleryImages = await fetchUnsplashImages(businessType, UNSPLASH_ACCESS_KEY);
    return NextResponse.json(buildFromTemplate(prompt || "restaurant", null, businessType, galleryImages));
  }
}
