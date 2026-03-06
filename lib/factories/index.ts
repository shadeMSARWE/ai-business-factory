/**
 * AI Business Factory — modular architecture for future expansion.
 * Each factory is a self-contained module (Website, Store, App, Logo, SEO, Ads, Video).
 */
export const FACTORIES = {
  website: { id: "website", name: "AI Website Builder", path: "/builder", available: true },
  logo: { id: "logo", name: "AI Logo Generator", path: "/dashboard/logo-generator", available: true },
  seo: { id: "seo", name: "AI SEO Generator", path: "/dashboard/seo-generator", available: true },
  ads: { id: "ads", name: "AI Ads Generator", path: "/dashboard/ad-generator", available: true },
  businessFinder: { id: "businessFinder", name: "Business Finder", path: "/dashboard/business-finder", available: true },
  templates: { id: "templates", name: "Templates", path: "/dashboard/templates", available: true },
  store: { id: "store", name: "Store Factory", path: "/dashboard/store", available: true },
  app: { id: "app", name: "App Factory", path: "/dashboard/app", available: false },
  video: { id: "video", name: "Video Factory", path: "/dashboard/video", available: false },
} as const;

export type FactoryId = keyof typeof FACTORIES;
