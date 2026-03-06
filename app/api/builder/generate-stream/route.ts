import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { detectBusinessType, TEMPLATE_DEFAULTS } from "@/lib/business-types";
import { fetchUnsplashImages } from "@/lib/image-queries";
import { OPENAI_API_KEY, UNSPLASH_ACCESS_KEY } from "@/lib/env";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import type { WebsiteSection } from "@/lib/builder/section-types";

const AI_PROMPT = `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string (2-3 sentences)","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`;

const BUILD_STEPS = [
  "layout",
  "hero",
  "about",
  "services",
  "gallery",
  "testimonials",
  "contact",
  "theme",
  "footer",
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (user) {
    const hasCredits = await hasEnoughCredits(user.id, "website");
    if (!hasCredits) {
      return new Response(
        JSON.stringify({ error: "credits_exceeded", message: "Insufficient credits. Upgrade your plan." }),
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const prompt = body?.prompt || "";
  if (!prompt || typeof prompt !== "string") {
    return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`${event}:${JSON.stringify(data)}\n`));
      };

      try {
        const businessType = detectBusinessType(prompt);

        send("step", { step: "layout", status: "running", message: "Creating project structure" });

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

        const template = TEMPLATE_DEFAULTS[businessType as keyof typeof TEMPLATE_DEFAULTS];
        const ac = aiContent as {
          business_name?: string;
          tagline?: string;
          description?: string;
          services?: { title: string; description: string }[];
          testimonials?: { name: string; text: string; role: string }[];
          contact_text?: string;
        } | null;

        const name = ac?.business_name || template.heroTitle.replace(/Welcome to |Our |Your /, "").trim() || "Business";
        const tagline = ac?.tagline || template.heroSubtitle;
        const description = ac?.description || `We are a ${businessType.replace("_", " ")} dedicated to quality and service.`;
        const services = ac?.services?.length ? ac.services : template.services;
        const testimonials = ac?.testimonials?.length ? ac.testimonials : template.testimonials;

        const sections: WebsiteSection[] = [];

        const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

        send("step", { step: "layout", status: "done", message: "Project structure ready" });
        await delay(100);

        send("step", { step: "hero", status: "running", message: "Generating hero section" });
        sections.push({
          type: "hero",
          data: {
            heroTitle: `Welcome to ${name}`,
            heroSubtitle: tagline,
            heroImage: galleryImages[0],
          },
        });
        send("section", { type: "hero", data: sections[sections.length - 1].data });
        send("step", { step: "hero", status: "done", message: "Hero section complete" });
        await delay(120);

        send("step", { step: "about", status: "running", message: "Creating about section" });
        sections.push({
          type: "about",
          data: { aboutTitle: template.aboutTitle, aboutContent: description },
        });
        send("section", { type: "about", data: sections[sections.length - 1].data });
        send("step", { step: "about", status: "done", message: "About section complete" });
        await delay(100);

        send("step", { step: "services", status: "running", message: "Generating services section" });
        sections.push({ type: "services", data: { services } });
        send("section", { type: "services", data: sections[sections.length - 1].data });
        send("step", { step: "services", status: "done", message: "Services section complete" });
        await delay(100);

        send("step", { step: "gallery", status: "running", message: "Adding gallery" });
        sections.push({ type: "gallery", data: { galleryImages } });
        send("section", { type: "gallery", data: sections[sections.length - 1].data });
        send("step", { step: "gallery", status: "done", message: "Gallery complete" });
        await delay(100);

        send("step", { step: "testimonials", status: "running", message: "Creating testimonials" });
        sections.push({ type: "testimonials", data: { testimonials } });
        send("section", { type: "testimonials", data: sections[sections.length - 1].data });
        send("step", { step: "testimonials", status: "done", message: "Testimonials complete" });
        await delay(100);

        send("step", { step: "contact", status: "running", message: "Building contact form" });
        sections.push({
          type: "contact",
          data: {
            contactInfo: {
              address: "123 Main Street",
              phone: "+1234567890",
              email: "info@example.com",
              whatsapp: "1234567890",
            },
            contactText: ac?.contact_text || "Get in touch with us today.",
          },
        });
        send("section", { type: "contact", data: sections[sections.length - 1].data });
        send("step", { step: "contact", status: "done", message: "Contact form complete" });
        await delay(100);

        send("step", { step: "theme", status: "running", message: "Applying theme and colors" });
        sections.push({ type: "theme", data: { primaryColor: "#8b5cf6" } });
        send("section", { type: "theme", data: sections[sections.length - 1].data });
        send("step", { step: "theme", status: "done", message: "Theme applied" });
        await delay(80);

        send("step", { step: "footer", status: "running", message: "Finalizing layout" });
        sections.push({ type: "footer", data: { businessName: name } });
        send("section", { type: "footer", data: sections[sections.length - 1].data });
        send("step", { step: "footer", status: "done", message: "Layout complete" });

        const flatData = {
          businessName: name,
          businessType,
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
            contactText: ac?.contact_text || "Get in touch with us today.",
          },
          primaryColor: "#8b5cf6",
        };

        send("complete", { data: flatData, sections });

        if (user) {
          await deductCredits(user.id, "website");
        }
      } catch (e) {
        console.error("Stream error:", e);
        send("error", { message: e instanceof Error ? e.message : "Generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
