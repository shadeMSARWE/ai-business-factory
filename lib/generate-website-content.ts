import type { BusinessType } from "./business-types";
import { detectBusinessType, TEMPLATE_DEFAULTS } from "./business-types";
import { fetchUnsplashImages } from "./image-queries";
import { getBusinessImages } from "./image-generator";

const AI_PROMPT = `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string (2-3 sentences)","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`;

export function buildFromTemplate(
  prompt: string,
  aiContent: {
    business_name?: string;
    tagline?: string;
    description?: string;
    services?: { title: string; description: string }[];
    testimonials?: { name: string; text: string; role: string }[];
    contact_text?: string;
  } | null,
  businessType: BusinessType,
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

export async function generateWebsiteContent(
  prompt: string,
  businessType: BusinessType,
  unsplashKey?: string,
  openaiKey?: string
) {
  const [aiContent, galleryImages] = await Promise.all([
    openaiKey
      ? (async () => {
          try {
            const { default: OpenAI } = await import("openai");
            const openai = new OpenAI({ apiKey: openaiKey });
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
    unsplashKey
      ? fetchUnsplashImages(businessType, unsplashKey)
      : Promise.resolve(getBusinessImages(businessType)),
  ]);

  return buildFromTemplate(prompt, aiContent, businessType, galleryImages);
}
