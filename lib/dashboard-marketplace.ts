/**
 * Dashboard marketplace display config.
 * Maps factories to marketplace categories and preview images.
 * Does not change lib/factories — internal engine unchanged.
 */

export type MarketplaceCategoryId =
  | "business-creation"
  | "branding"
  | "marketing"
  | "growth"
  | "media";

export const MARKETPLACE_CATEGORIES: Record<
  MarketplaceCategoryId,
  { title: string; description: string }
> = {
  "business-creation": {
    title: "Business Creation",
    description: "Tools that help you build websites, apps and stores.",
  },
  branding: {
    title: "Branding",
    description: "Create logos, images and brand assets.",
  },
  marketing: {
    title: "Marketing",
    description: "Generate ads, SEO and marketing content.",
  },
  growth: {
    title: "Growth",
    description: "Find leads and automate outreach.",
  },
  media: {
    title: "Media",
    description: "Generate visuals and viral content.",
  },
};

export const MARKETPLACE_CATEGORY_ORDER: MarketplaceCategoryId[] = [
  "business-creation",
  "branding",
  "marketing",
  "growth",
  "media",
];

/** Map factory id → marketplace category for display. */
export const FACTORY_TO_MARKETPLACE: Record<string, MarketplaceCategoryId> = {
  website: "business-creation",
  landingPage: "business-creation",
  store: "business-creation",
  mobileApps: "business-creation",
  universalBuilder: "business-creation",
  websiteTemplates: "business-creation",
  storeBuilder: "business-creation",
  appBuilder: "business-creation",
  logo: "branding",
  brandKit: "branding",
  imageGenerator: "branding",
  seo: "marketing",
  ads: "marketing",
  socialContent: "marketing",
  businessFinder: "growth",
  autoOutreach: "growth",
  viralVideoIdeas: "media",
  landingPageAI: "business-creation",
};

/** Preview image URL per factory (Unsplash). */
export const FACTORY_PREVIEW_IMAGES: Record<string, string> = {
  logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  seo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
  ads: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
  imageGenerator: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80",
  viralVideoIdeas: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80",
  website: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80",
  landingPage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80",
  businessFinder: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80",
  autoOutreach: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
  mobileApps: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
  store: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  universalBuilder: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
  websiteTemplates: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80",
  storeBuilder: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  appBuilder: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
  brandKit: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  socialContent: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80",
  landingPageAI: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
};

export function getMarketplaceCategory(factoryId: string): MarketplaceCategoryId {
  return FACTORY_TO_MARKETPLACE[factoryId] ?? "business-creation";
}

export function getPreviewImage(factoryId: string): string {
  return (
    FACTORY_PREVIEW_IMAGES[factoryId] ??
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80"
  );
}

export type DifficultyLevel = "easy" | "medium" | "advanced";

/** Optional difficulty badge per factory. */
export const FACTORY_DIFFICULTY: Record<string, DifficultyLevel> = {
  seo: "easy",
  logo: "easy",
  imageGenerator: "easy",
  viralVideoIdeas: "easy",
  socialContent: "easy",
  ads: "medium",
  websiteTemplates: "medium",
  landingPageAI: "medium",
  website: "medium",
  landingPage: "medium",
  storeBuilder: "medium",
  appBuilder: "medium",
  brandKit: "medium",
  businessFinder: "medium",
  autoOutreach: "advanced",
  store: "medium",
  mobileApps: "medium",
  universalBuilder: "advanced",
};

/** Estimated generation time in seconds (for display). */
export const FACTORY_ESTIMATED_TIME: Record<string, number> = {
  seo: 10,
  logo: 15,
  ads: 15,
  imageGenerator: 20,
  viralVideoIdeas: 12,
  socialContent: 15,
  websiteTemplates: 30,
  storeBuilder: 45,
  appBuilder: 25,
  brandKit: 30,
  landingPageAI: 25,
  website: 40,
  landingPage: 30,
  businessFinder: 20,
  autoOutreach: 30,
  store: 35,
  mobileApps: 30,
  universalBuilder: 35,
};

export function getDifficulty(factoryId: string): DifficultyLevel | null {
  return FACTORY_DIFFICULTY[factoryId] ?? null;
}

export function getEstimatedTime(factoryId: string): number | null {
  return FACTORY_ESTIMATED_TIME[factoryId] ?? null;
}
