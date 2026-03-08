/**
 * Smart suggestions per factory — clickable chips for quick prompts.
 */

export interface SuggestionItem {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export const FACTORY_SUGGESTIONS: Record<string, SuggestionItem[]> = {
  seo: [
    { id: "seo-1", label: "Restaurant SEO", prompt: "Mario Pizza,Pizza restaurant,Haifa" },
    { id: "seo-2", label: "SaaS SEO", prompt: "CloudFlow,SaaS platform,San Francisco" },
    { id: "seo-3", label: "Local SEO", prompt: "QuickFix,Plumbing services,Boston" },
    { id: "seo-4", label: "Ecommerce SEO", prompt: "StyleHub,Fashion store,London" },
  ],
  logo: [
    { id: "logo-1", label: "Minimal logo", prompt: "Minimal modern logo, clean lines" },
    { id: "logo-2", label: "Luxury logo", prompt: "Luxury brand logo, premium feel" },
    { id: "logo-3", label: "Startup logo", prompt: "Tech startup logo, innovative" },
    { id: "logo-4", label: "AI company logo", prompt: "AI tech company logo, futuristic" },
  ],
  ads: [
    { id: "ads-1", label: "Facebook Ads", prompt: "Facebook ad, local business", icon: "facebook" },
    { id: "ads-2", label: "TikTok Ads", prompt: "TikTok ad, viral hook", icon: "tiktok" },
    { id: "ads-3", label: "Google Ads", prompt: "Google search ad, headline and description", icon: "google" },
    { id: "ads-4", label: "Instagram Ads", prompt: "Instagram ad, visual caption", icon: "instagram" },
  ],
  viralVideoIdeas: [
    { id: "video-1", label: "Viral TikTok", prompt: "TikTok viral trends" },
    { id: "video-2", label: "YouTube Shorts", prompt: "YouTube Shorts hook" },
    { id: "video-3", label: "Educational videos", prompt: "Educational how-to content" },
    { id: "video-4", label: "Storytelling", prompt: "Storytelling narrative" },
  ],
  imageGenerator: [
    { id: "img-1", label: "Product shot", prompt: "Professional product photography, white background" },
    { id: "img-2", label: "Social post", prompt: "Instagram-style social media image" },
    { id: "img-3", label: "Landing hero", prompt: "Hero image for landing page, modern" },
    { id: "img-4", label: "Brand mood", prompt: "Brand mood board, cohesive colors" },
  ],
  website: [
    { id: "web-1", label: "Restaurant", prompt: "Restaurant website, menu, reservations" },
    { id: "web-2", label: "Portfolio", prompt: "Creative portfolio, projects" },
    { id: "web-3", label: "Local business", prompt: "Local business, services, contact" },
    { id: "web-4", label: "SaaS landing", prompt: "SaaS product landing page" },
  ],
  businessFinder: [
    { id: "bf-1", label: "Restaurants", prompt: "restaurant" },
    { id: "bf-2", label: "Salons", prompt: "salon" },
    { id: "bf-3", label: "Dentists", prompt: "dentist" },
    { id: "bf-4", label: "Gyms", prompt: "gym" },
  ],
  landingPage: [
    { id: "lp-1", label: "Product launch", prompt: "Product launch landing page" },
    { id: "lp-2", label: "Event signup", prompt: "Event registration page" },
    { id: "lp-3", label: "Lead magnet", prompt: "Lead magnet, ebook signup" },
  ],
  store: [
    { id: "store-1", label: "Fashion store", prompt: "Fashion ecommerce store" },
    { id: "store-2", label: "Electronics", prompt: "Electronics online store" },
    { id: "store-3", label: "Handmade", prompt: "Handmade crafts store" },
  ],
  mobileApps: [
    { id: "app-1", label: "Fitness app", prompt: "Fitness tracking app" },
    { id: "app-2", label: "Ecommerce app", prompt: "Mobile shopping app" },
    { id: "app-3", label: "Social app", prompt: "Social community app" },
  ],
  universalBuilder: [
    { id: "ub-1", label: "SaaS MVP", prompt: "SaaS MVP structure" },
    { id: "ub-2", label: "Mobile app", prompt: "Mobile app project" },
    { id: "ub-3", label: "AI tool", prompt: "AI tool prototype" },
  ],
  websiteTemplates: [
    { id: "wt-1", label: "Restaurant", prompt: "Restaurant website template, hero, menu, contact" },
    { id: "wt-2", label: "Portfolio", prompt: "Portfolio template, projects, about" },
    { id: "wt-3", label: "Agency", prompt: "Agency template, services, testimonials" },
    { id: "wt-4", label: "SaaS", prompt: "SaaS landing template, features, pricing" },
  ],
  storeBuilder: [
    { id: "sb-1", label: "Fashion", prompt: "Fashion ecommerce store, clothing, accessories" },
    { id: "sb-2", label: "Electronics", prompt: "Electronics store, gadgets, tech" },
    { id: "sb-3", label: "Handmade", prompt: "Handmade crafts store" },
    { id: "sb-4", label: "Food & Beverage", prompt: "Food and beverage online store" },
  ],
  appBuilder: [
    { id: "ab-1", label: "Fitness app", prompt: "Fitness and workout app structure" },
    { id: "ab-2", label: "Productivity", prompt: "Productivity app, tasks, calendar" },
    { id: "ab-3", label: "Social app", prompt: "Social networking app structure" },
    { id: "ab-4", label: "Ecommerce app", prompt: "Mobile shopping app structure" },
  ],
  brandKit: [
    { id: "bk-1", label: "Tech startup", prompt: "Tech startup brand kit, modern, minimal" },
    { id: "bk-2", label: "Luxury brand", prompt: "Luxury brand identity, premium colors" },
    { id: "bk-3", label: "Creative agency", prompt: "Creative agency brand, bold typography" },
    { id: "bk-4", label: "Ecommerce", prompt: "Ecommerce brand kit, product-focused" },
  ],
  socialContent: [
    { id: "sc-1", label: "Instagram week", prompt: "Instagram content pack, 7 posts" },
    { id: "sc-2", label: "TikTok ideas", prompt: "TikTok content ideas and hashtags" },
    { id: "sc-3", label: "LinkedIn", prompt: "LinkedIn professional posts" },
    { id: "sc-4", label: "Content calendar", prompt: "Monthly content calendar, all platforms" },
  ],
  landingPageAI: [
    { id: "lpa-1", label: "Product launch", prompt: "Product launch landing page, headline, CTA" },
    { id: "lpa-2", label: "Webinar", prompt: "Webinar signup landing page" },
    { id: "lpa-3", label: "Lead magnet", prompt: "Lead magnet landing, ebook download" },
    { id: "lpa-4", label: "App download", prompt: "Mobile app download landing page" },
  ],
};

export function getSuggestionsForFactory(factoryId: string): SuggestionItem[] {
  return FACTORY_SUGGESTIONS[factoryId] ?? [];
}
