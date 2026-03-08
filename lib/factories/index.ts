/**
 * AI Business Factory — modular architecture.
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

};

export type FactoryId = keyof typeof FACTORIES;

/**
 * Factories shown on dashboard
 */
export function getDashboardFactories(): FactoryConfig[] {
  const factories = Object.values(FACTORIES).filter(
    (f) => f.available && f.showOnDashboard
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
]
