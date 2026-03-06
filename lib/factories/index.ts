/**
 * AI Business Factory — modular architecture.
 * Each factory is a self-contained module with path, status, and metadata.
 */
export type FactoryStatus = "ready" | "generating" | "new";

export interface FactoryConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  available: boolean;
  status: FactoryStatus;
  popular?: boolean;
}

export const FACTORIES: Record<string, FactoryConfig> = {
  businessFinder: {
    id: "businessFinder",
    name: "AI Business Finder Factory",
    description: "Find local businesses on Google Maps, detect those without websites and auto-generate demo sites.",
    path: "/dashboard/business-finder",
    available: true,
    status: "ready",
    popular: true,
  },
  autoOutreach: {
    id: "autoOutreach",
    name: "Auto Outreach AI",
    description: "Find local businesses, generate demo websites and send automated offers.",
    path: "/dashboard/auto-outreach",
    available: true,
    status: "new",
    popular: true,
  },
  website: {
    id: "website",
    name: "AI Website Factory",
    description: "Generate full websites with SEO, booking forms, maps and WhatsApp integration.",
    path: "/builder",
    available: true,
    status: "ready",
    popular: true,
  },
  logo: {
    id: "logo",
    name: "AI Logo Factory",
    description: "Generate brand logos using AI.",
    path: "/dashboard/logo-generator",
    available: true,
    status: "ready",
  },
  seo: {
    id: "seo",
    name: "AI SEO Factory",
    description: "Generate SEO titles, keywords, meta tags and blog articles.",
    path: "/dashboard/seo-generator",
    available: true,
    status: "ready",
  },
  ads: {
    id: "ads",
    name: "AI Ads Factory",
    description: "Generate Facebook, Google and Instagram ads.",
    path: "/dashboard/ad-generator",
    available: true,
    status: "ready",
  },
  socialMedia: {
    id: "socialMedia",
    name: "AI Social Media Factory",
    description: "Generate social media posts, captions and content calendars.",
    path: "/dashboard/social-media",
    available: false,
    status: "new",
  },
  landingPage: {
    id: "landingPage",
    name: "AI Landing Page Factory",
    description: "Generate high converting landing pages.",
    path: "/dashboard/create",
    available: true,
    status: "ready",
  },
  app: {
    id: "app",
    name: "Mobile App Factory",
    description: "Generate Android & iOS apps with AI using React Native and Expo.",
    path: "/dashboard/apps",
    available: true,
    status: "ready",
  },
  store: {
    id: "store",
    name: "AI Store Factory",
    description: "Generate ecommerce stores with products and checkout.",
    path: "/dashboard/store",
    available: true,
    status: "ready",
  },
  videoAds: {
    id: "videoAds",
    name: "AI Video Ads Factory",
    description: "Generate short ad videos for TikTok, Instagram and YouTube.",
    path: "/dashboard/video-ads",
    available: false,
    status: "new",
    popular: true,
  },
};

export type FactoryId = keyof typeof FACTORIES;

export const FACTORY_ORDER: FactoryId[] = [
  "businessFinder",
  "autoOutreach",
  "website",
  "logo",
  "seo",
  "ads",
  "socialMedia",
  "landingPage",
  "app",
  "store",
  "videoAds",
];
