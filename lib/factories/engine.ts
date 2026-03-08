/**
 * AI Factory Engine — unified engine types for the modular factory system.
 * Each factory is mapped to one engine type; engines are implemented in generators.ts.
 */

export type EngineType =
  | "text"
  | "image"
  | "website"
  | "marketing"
  | "video_ideas";

export interface EngineContext {
  prompt: string;
  options?: Record<string, unknown>;
}

export interface EngineResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EngineDefinition<TInput = EngineContext, TOutput = unknown> {
  type: EngineType;
  run(context: TInput): Promise<EngineResult<TOutput>>;
}

/**
 * Engine type for each factory. Used by registry to route factory requests.
 */
export const ENGINE_BY_FACTORY: Record<string, EngineType> = {
  logo: "image",
  seo: "text",
  ads: "marketing",
  imageGenerator: "image",
  website: "website",
  landingPage: "website",
  viralVideoIdeas: "video_ideas",
  businessFinder: "website",
  autoOutreach: "website",
  mobileApps: "text",
  store: "website",
  universalBuilder: "text",
  websiteTemplates: "website",
  storeBuilder: "website",
  appBuilder: "text",
  brandKit: "text",
  socialContent: "marketing",
  landingPageAI: "website",
};

export function getEngineForFactory(factoryId: string): EngineType | null {
  return ENGINE_BY_FACTORY[factoryId] ?? null;
}
