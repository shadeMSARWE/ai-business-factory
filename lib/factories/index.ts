/**
 * AI Business Factory — modular architecture for future expansion.
 * Each factory is a self-contained module (Website, Store, App, Logo, SEO, Ads, Video).
 */
export const FACTORIES = {
  website: { id: "website", name: "Website Factory", path: "/dashboard/create", available: true },
  store: { id: "store", name: "Store Factory", path: "/dashboard/store", available: false },
  app: { id: "app", name: "App Factory", path: "/dashboard/app", available: false },
  logo: { id: "logo", name: "Logo Factory", path: "/dashboard/logo", available: false },
  seo: { id: "seo", name: "SEO Factory", path: "/dashboard/seo", available: false },
  ads: { id: "ads", name: "Ads Factory", path: "/dashboard/ads", available: false },
  video: { id: "video", name: "Video Factory", path: "/dashboard/video", available: false },
} as const;

export type FactoryId = keyof typeof FACTORIES;
