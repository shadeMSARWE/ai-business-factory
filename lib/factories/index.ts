/**
 * AI Business Factory — single source of truth for all factories.
 * Categories: core | growth | tools
 *
 * Engine system: see engine.ts, prompts.ts, generators.ts, registry.ts
 * - Each factory is mapped to an engine (text, image, website, marketing, video_ideas)
 * - Use runFactoryEngine(factoryId, { prompt }) from registry to run the correct generator
 */

export type FactoryStatus = "ready" | "generating" | "new";
export type FactoryCategory = "core" | "growth" | "tools";

export interface FactoryConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  available: boolean;
  status: FactoryStatus;
  popular?: boolean;
  showOnDashboard?: boolean;
  category?: FactoryCategory;
}

export const FACTORIES: Record<string, FactoryConfig> = {
  businessFinder: {
    id: "businessFinder",
    name: "AI Business Finder Factory",
    description: "Find local businesses on Google Maps and generate demo websites.",
    path: "/dashboard/business-finder",
    available: true,
    status: "ready",
    popular: true,
    showOnDashboard: true,
    category: "core",
  },
  autoOutreach: {
    id: "autoOutreach",
    name: "Auto Outreach AI",
    description: "Generate demo websites and send automated outreach.",
    path: "/dashboard/auto-outreach",
    available: true,
    status: "ready",
    popular: true,
    showOnDashboard: true,
    category: "core",
  },
  website: {
    id: "website",
    name: "AI Website Factory",
    description: "Generate full websites with SEO and integrations.",
    path: "/builder",
    available: true,
    status: "ready",
    popular: true,
    showOnDashboard: true,
    category: "core",
  },
  logo: {
    id: "logo",
    name: "AI Logo Factory",
    description: "Generate brand logos using AI.",
    path: "/dashboard/logo-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  seo: {
    id: "seo",
    name: "AI SEO Factory",
    description: "Generate SEO titles, keywords and blog articles.",
    path: "/dashboard/seo-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  ads: {
    id: "ads",
    name: "AI Ads Factory",
    description: "Generate Facebook, Google and Instagram ads.",
    path: "/dashboard/ad-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  landingPage: {
    id: "landingPage",
    name: "AI Landing Page Factory",
    description: "Generate high converting landing pages.",
    path: "/dashboard/create",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "tools",
  },
  mobileApps: {
    id: "mobileApps",
    name: "Mobile App Factory",
    description: "Create Android and iOS apps using AI.",
    path: "/dashboard/mobile-apps",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
  },
  store: {
    id: "store",
    name: "AI Store Factory",
    description: "Generate ecommerce stores.",
    path: "/dashboard/store",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
  },
  universalBuilder: {
    id: "universalBuilder",
    name: "Universal Builder Factory",
    description: "Generate SaaS, mobile apps or AI tools.",
    path: "/dashboard/universal-builder",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
  },
  imageGenerator: {
    id: "imageGenerator",
    name: "AI Image Generator",
    description: "Generate images with AI.",
    path: "/dashboard/image-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "tools",
  },
  viralVideoIdeas: {
    id: "viralVideoIdeas",
    name: "Viral Video Ideas Factory",
    description: "Generate viral video ideas for TikTok and YouTube Shorts.",
    path: "/dashboard/viral-video-ideas",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  websiteTemplates: {
    id: "websiteTemplates",
    name: "AI Website Templates Factory",
    description: "Generate ready-made website templates with hero, services, about, contact.",
    path: "/dashboard/website-templates",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "tools",
    popular: true,
  },
  storeBuilder: {
    id: "storeBuilder",
    name: "AI Store Builder Factory",
    description: "Create a ready-to-launch ecommerce store with branding and product categories.",
    path: "/dashboard/store-builder",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
    popular: true,
  },
  appBuilder: {
    id: "appBuilder",
    name: "AI App Builder Factory",
    description: "Generate mobile and web app structure with features and UI layout.",
    path: "/dashboard/app-builder",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
  },
  brandKit: {
    id: "brandKit",
    name: "AI Brand Kit Factory",
    description: "Generate full brand identity: logo ideas, colors, typography, social style.",
    path: "/dashboard/brand-kit",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
    popular: true,
  },
  socialContent: {
    id: "socialContent",
    name: "AI Social Content Factory",
    description: "Generate social media content packs: posts, captions, hashtags, calendar.",
    path: "/dashboard/social-content",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  landingPageAI: {
    id: "landingPageAI",
    name: "AI Landing Page Generator",
    description: "Generate high-converting landing pages with headline, features, testimonials, CTA.",
    path: "/dashboard/landing-page-ai",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "tools",
    popular: true,
  },
  saasBuilder: {
    id: "saasBuilder",
    name: "AI SaaS Builder Factory",
    description: "Generate full SaaS concept: idea, features, pricing, landing sections, dashboard, tech stack.",
    path: "/dashboard/saas-builder",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
    popular: true,
  },
  videoFactory: {
    id: "videoFactory",
    name: "AI Video Factory",
    description: "Generate viral video concepts: script, scenes, image prompts, voiceover, captions, hashtags.",
    path: "/dashboard/video-factory",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
    popular: true,
  },
  automationFactory: {
    id: "automationFactory",
    name: "AI Automation Factory",
    description: "Create automation workflows: ideas, integrations, Zapier/Make flows, webhooks, steps.",
    path: "/dashboard/automation-factory",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "tools",
  },
  marketingStrategy: {
    id: "marketingStrategy",
    name: "AI Marketing Strategy Factory",
    description: "Generate complete marketing strategies: audience, funnel, ads, content plan, growth tactics.",
    path: "/dashboard/marketing-strategy",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
    popular: true,
  },
  productGenerator: {
    id: "productGenerator",
    name: "AI Product Generator",
    description: "Create product ideas for ecommerce: ideas, brand names, descriptions, packaging, pricing.",
    path: "/dashboard/product-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
  },
  courseCreator: {
    id: "courseCreator",
    name: "AI Course Creator",
    description: "Create online courses: title, outline, lessons, video scripts, marketing plan.",
    path: "/dashboard/course-creator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  copywritingFactory: {
    id: "copywritingFactory",
    name: "AI Copywriting Factory",
    description: "Generate professional copy: sales pages, ad copy, email sequences, landing copy.",
    path: "/dashboard/copywriting-factory",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
    popular: true,
  },
  startupValidator: {
    id: "startupValidator",
    name: "AI Startup Validator",
    description: "Analyze startup ideas: market analysis, competitors, opportunity score, risks, recommendations.",
    path: "/dashboard/startup-validator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  contentCalendar: {
    id: "contentCalendar",
    name: "AI Content Calendar Factory",
    description: "Generate social content calendars: weekly, monthly, platform posts, captions, hashtags.",
    path: "/dashboard/content-calendar",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  businessPlan: {
    id: "businessPlan",
    name: "AI Business Plan Factory",
    description: "Create complete business plans: executive summary, market, financials, revenue, roadmap.",
    path: "/dashboard/business-plan",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
    popular: true,
  },
  brandingStudio: {
    id: "brandingStudio",
    name: "AI Branding Studio Factory",
    description: "Generate full brand identity: logo concepts, colors, typography, social style.",
    path: "/dashboard/branding-studio",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  funnelBuilder: {
    id: "funnelBuilder",
    name: "AI Funnel Builder Factory",
    description: "Generate marketing funnels: structure, landing pages, email sequences, conversion strategy.",
    path: "/dashboard/funnel-builder",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "growth",
  },
  businessGenerator: {
    id: "businessGenerator",
    name: "AI Business Generator",
    description: "Generate a complete AI business kit in one click: branding, website, store, SEO, ads, content, video.",
    path: "/dashboard/business-generator",
    available: true,
    status: "ready",
    showOnDashboard: true,
    category: "core",
    popular: true,
  },
};

export type FactoryId = keyof typeof FACTORIES;

/**
 * Returns factories to show on dashboard. Only includes entries with
 * available === true and showOnDashboard === true. Order follows FACTORY_ORDER.
 */
export function getDashboardFactories(): FactoryConfig[] {
  const factories = Object.values(FACTORIES).filter(
    (f) => f.available === true && f.showOnDashboard === true
  );
  const orderMap = new Map(FACTORY_ORDER.map((id, i) => [id, i]));
  return factories.sort((a, b) => {
    const ai = orderMap.get(a.id as FactoryId) ?? 9999;
    const bi = orderMap.get(b.id as FactoryId) ?? 9999;
    return ai - bi;
  });
}

export const FACTORY_ORDER: FactoryId[] = [
  "businessFinder",
  "autoOutreach",
  "website",
  "logo",
  "seo",
  "ads",
  "landingPage",
  "mobileApps",
  "store",
  "universalBuilder",
  "imageGenerator",
  "viralVideoIdeas",
  "websiteTemplates",
  "storeBuilder",
  "appBuilder",
  "brandKit",
  "socialContent",
  "landingPageAI",
  "saasBuilder",
  "videoFactory",
  "automationFactory",
  "marketingStrategy",
  "productGenerator",
  "courseCreator",
  "copywritingFactory",
  "startupValidator",
  "contentCalendar",
  "businessPlan",
  "brandingStudio",
  "funnelBuilder",
  "businessGenerator",
];

// Re-export engine system for API routes and server usage
export { getEngineForFactory, type EngineType, type EngineContext, type EngineResult } from "./engine";
export { getPrompt, PROMPTS, type PromptKey } from "./prompts";
export { generators, textGenerator, imageGenerator, websiteGenerator, marketingGenerator, videoIdeaGenerator } from "./generators";
export {
  runFactoryEngine,
  getFactoryEngineConfig,
  FACTORY_ENGINE_REGISTRY,
  type FactoryEngineConfig,
  type OutputType,
} from "./registry";
export { getSuggestionsForFactory, FACTORY_SUGGESTIONS, type SuggestionItem } from "./suggestions-config";
