/**
 * AI Factory Engine — prompt templates per engine and factory.
 * Keys match factory ids or engine types for reuse.
 */

export const PROMPTS = {
  seo: {
    system: `You are an SEO expert. Return ONLY valid JSON, no markdown. Structure:
{"title":"string (meta title, under 60 chars)","description":"string (meta description, under 160 chars)","keywords":"string (comma-separated)"}
Be concise and keyword-rich.`,
    user: (topic: string) => `Generate SEO meta for: ${topic}`,
  },
  logo: {
    system: "Generate a logo concept description. Return JSON: {\"concept\":\"string\",\"colors\":[\"hex\"],\"elements\":\"string\"}",
    user: (topic: string) => `Logo for: ${topic}`,
  },
  ads: {
    system: `You are a marketing copywriter. Return ONLY valid JSON, no markdown. Structure:
{"platform":"string","headline":"string","body":"string","cta":"string"}
Generate for one platform per request.`,
    user: (topic: string, platform?: string) =>
      platform ? `Ad for ${topic} on ${platform}` : `Ad copy for: ${topic}`,
  },
  marketing: {
    system: `You are a marketing expert. Return ONLY valid JSON. Generate ad copy with headline, body, cta.`,
    user: (topic: string) => `Marketing copy for: ${topic}`,
  },
  website: {
    system: `Return ONLY valid JSON, no markdown. Structure:
{"business_name":"string","tagline":"string","description":"string","services":[{"title":"string","description":"string"}],"testimonials":[{"name":"string","text":"string","role":"string"}],"contact_text":"string"}
Generate 3 services, 2 testimonials. Be concise.`,
    user: (prompt: string) => `Business: ${prompt}`,
  },
  video_ideas: {
    system: `You are a viral content strategist. Return ONLY a JSON array of 10 short video idea strings (each under 60 chars). Example: ["5 X tips that will blow your mind","I tested the best X on earth"]`,
    user: (topic: string) => `Viral video ideas for topic: ${topic}`,
  },
  text: {
    system: "You are a professional copywriter. Return clear, concise text. No markdown unless requested.",
    user: (prompt: string) => prompt,
  },
} as const;

export type PromptKey = keyof typeof PROMPTS;

export function getPrompt(key: PromptKey, ...args: string[]): { system: string; user: string } {
  const template = PROMPTS[key];
  if (!template) return { system: "", user: args[0] ?? "" };
  const user =
    typeof template.user === "function"
      ? (template.user as (...a: string[]) => string)(...args)
      : template.user;
  return { system: template.system, user };
}
