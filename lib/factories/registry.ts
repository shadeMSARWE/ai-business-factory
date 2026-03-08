/**
 * AI Factory Engine — registry linking factories to engines, prompts, and output.
 * Use with FACTORIES from index.ts for UI; use this for running the correct engine per factory.
 */

import type { EngineType } from "./engine";
import { getEngineForFactory } from "./engine";
import { generators } from "./generators";
import type { EngineContext, EngineResult } from "./engine";
import type { PromptKey } from "./prompts";

export type OutputType = "json" | "text" | "image" | "image_url";

export interface FactoryEngineConfig {
  id: string;
  name: string;
  description: string;
  category: "core" | "growth" | "tools";
  icon: string;
  engine: EngineType;
  prompts: PromptKey;
  output: OutputType;
}

/** Maps factory id to engine config. Used to run the right generator for each factory. */
export const FACTORY_ENGINE_REGISTRY: Record<string, Omit<FactoryEngineConfig, "id">> = {
  logo: {
    name: "AI Logo Factory",
    description: "Generate brand logos using AI.",
    category: "growth",
    icon: "palette",
    engine: "image",
    prompts: "logo",
    output: "image_url",
  },
  seo: {
    name: "AI SEO Factory",
    description: "Generate SEO titles, keywords and blog articles.",
    category: "growth",
    icon: "search",
    engine: "text",
    prompts: "seo",
    output: "json",
  },
  ads: {
    name: "AI Ads Factory",
    description: "Generate Facebook, Google and Instagram ads.",
    category: "growth",
    icon: "megaphone",
    engine: "marketing",
    prompts: "ads",
    output: "json",
  },
  imageGenerator: {
    name: "AI Image Generator",
    description: "Generate images with AI.",
    category: "tools",
    icon: "image",
    engine: "image",
    prompts: "text",
    output: "image_url",
  },
  website: {
    name: "AI Website Factory",
    description: "Generate full websites with SEO and integrations.",
    category: "core",
    icon: "globe",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  landingPage: {
    name: "AI Landing Page Factory",
    description: "Generate high converting landing pages.",
    category: "tools",
    icon: "layout",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  viralVideoIdeas: {
    name: "Viral Video Ideas Factory",
    description: "Generate viral video ideas for TikTok and YouTube Shorts.",
    category: "growth",
    icon: "video",
    engine: "video_ideas",
    prompts: "video_ideas",
    output: "json",
  },
  businessFinder: {
    name: "AI Business Finder Factory",
    description: "Find local businesses and generate demo websites.",
    category: "core",
    icon: "mapPin",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  autoOutreach: {
    name: "Auto Outreach AI",
    description: "Generate demo websites and send automated outreach.",
    category: "core",
    icon: "send",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  mobileApps: {
    name: "Mobile App Factory",
    description: "Create Android and iOS apps using AI.",
    category: "core",
    icon: "smartphone",
    engine: "text",
    prompts: "text",
    output: "json",
  },
  store: {
    name: "AI Store Factory",
    description: "Generate ecommerce stores.",
    category: "core",
    icon: "store",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  universalBuilder: {
    name: "Universal Builder Factory",
    description: "Generate SaaS, mobile apps or AI tools.",
    category: "core",
    icon: "box",
    engine: "text",
    prompts: "text",
    output: "json",
  },
  websiteTemplates: {
    name: "AI Website Templates Factory",
    description: "Generate ready-made website templates.",
    category: "tools",
    icon: "layout",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  storeBuilder: {
    name: "AI Store Builder Factory",
    description: "Create ready-to-launch ecommerce stores.",
    category: "core",
    icon: "store",
    engine: "website",
    prompts: "website",
    output: "json",
  },
  appBuilder: {
    name: "AI App Builder Factory",
    description: "Generate app structure and UI layout.",
    category: "core",
    icon: "smartphone",
    engine: "text",
    prompts: "text",
    output: "json",
  },
  brandKit: {
    name: "AI Brand Kit Factory",
    description: "Generate full brand identity.",
    category: "growth",
    icon: "palette",
    engine: "text",
    prompts: "text",
    output: "json",
  },
  socialContent: {
    name: "AI Social Content Factory",
    description: "Generate social media content packs.",
    category: "growth",
    icon: "share",
    engine: "marketing",
    prompts: "ads",
    output: "json",
  },
  landingPageAI: {
    name: "AI Landing Page Generator",
    description: "Generate high-converting landing pages.",
    category: "tools",
    icon: "layout",
    engine: "website",
    prompts: "website",
    output: "json",
  },
};

/**
 * Run the engine for a factory by id. Used by API routes or server actions.
 */
export async function runFactoryEngine(
  factoryId: string,
  context: EngineContext & { platform?: string }
): Promise<EngineResult<unknown>> {
  const engineType = getEngineForFactory(factoryId);
  const config = FACTORY_ENGINE_REGISTRY[factoryId];
  if (!engineType) {
    return { success: false, error: `No engine for factory: ${factoryId}` };
  }
  const runner = generators[engineType];
  if (!runner) {
    return { success: false, error: `Generator not implemented: ${engineType}` };
  }
  const ctx = config?.prompts
    ? { ...context, promptKey: config.prompts }
    : context;
  return runner(ctx as Parameters<typeof runner>[0]) as Promise<EngineResult<unknown>>;
}

/**
 * Get full engine config for a factory (for display or API).
 */
export function getFactoryEngineConfig(factoryId: string): FactoryEngineConfig | null {
  const config = FACTORY_ENGINE_REGISTRY[factoryId];
  if (!config) return null;
  return { id: factoryId, ...config };
}
