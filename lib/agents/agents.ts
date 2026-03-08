/**
 * AI Agents — intelligent assistants that orchestrate factories.
 * Each agent has tasks = list of factory ids to run via runFactoryEngine.
 * suggestedPrompts = chips shown on the agent page for quick selection.
 */

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  tasks: string[];
  suggestedPrompts: string[];
}

export const AGENTS: Record<string, AgentConfig> = {
  businessAgent: {
    id: "businessAgent",
    name: "Business Agent",
    description: "Creates business models, revenue ideas, and startup plans.",
    icon: "Briefcase",
    tasks: ["businessPlan", "saasBuilder"],
    suggestedPrompts: [
      "Launch a B2B SaaS for project management",
      "Business model for a subscription box",
      "Revenue streams for a consulting agency",
      "Startup plan for an AI tool",
    ],
  },
  brandingAgent: {
    id: "brandingAgent",
    name: "Branding Agent",
    description: "Builds brand identity, logos, and visual guidelines.",
    icon: "Palette",
    tasks: ["brandingStudio", "logo"],
    suggestedPrompts: [
      "Brand identity for a fintech startup",
      "Logo and colors for a coffee shop",
      "Visual identity for a fitness app",
      "Brand kit for an ecommerce store",
    ],
  },
  websiteAgent: {
    id: "websiteAgent",
    name: "Website Agent",
    description: "Generates website structure and landing page ideas.",
    icon: "Globe",
    tasks: ["websiteTemplates", "landingPageAI"],
    suggestedPrompts: [
      "Landing page for a SaaS product",
      "Portfolio website structure",
      "Website for a local restaurant",
      "Multi-page site for a consulting firm",
    ],
  },
  storeAgent: {
    id: "storeAgent",
    name: "Store Agent",
    description: "Builds ecommerce store ideas and product catalogs.",
    icon: "Store",
    tasks: ["storeBuilder", "productGenerator"],
    suggestedPrompts: [
      "Ecommerce store for handmade jewelry",
      "Product lineup for a skincare brand",
      "Online store for digital products",
      "Dropshipping store niche ideas",
    ],
  },
  marketingAgent: {
    id: "marketingAgent",
    name: "Marketing Agent",
    description: "Creates marketing strategies and campaigns.",
    icon: "Megaphone",
    tasks: ["marketingStrategy", "ads"],
    suggestedPrompts: [
      "Launch a new SaaS product",
      "Promote a coffee shop",
      "Marketing strategy for an AI tool",
      "Social media campaign plan",
    ],
  },
  seoAgent: {
    id: "seoAgent",
    name: "SEO Agent",
    description: "Generates SEO plans and keyword strategies.",
    icon: "Search",
    tasks: ["seo"],
    suggestedPrompts: [
      "SEO plan for a startup",
      "Keyword strategy for ecommerce",
      "Google ranking strategy",
      "Local SEO for a service business",
    ],
  },
  adsAgent: {
    id: "adsAgent",
    name: "Ads Agent",
    description: "Creates advertising campaigns and copy.",
    icon: "Target",
    tasks: ["ads", "copywritingFactory"],
    suggestedPrompts: [
      "Facebook ads for a course launch",
      "Google Ads for a local service",
      "Instagram ad campaign for a brand",
      "Retargeting ad copy",
    ],
  },
  contentAgent: {
    id: "contentAgent",
    name: "Content Agent",
    description: "Creates content strategies and calendars.",
    icon: "FileText",
    tasks: ["socialContent", "contentCalendar"],
    suggestedPrompts: [
      "30 TikTok content ideas",
      "Instagram marketing plan",
      "Blog content strategy",
      "LinkedIn thought leadership plan",
    ],
  },
  videoAgent: {
    id: "videoAgent",
    name: "Video Agent",
    description: "Generates video content ideas and scripts.",
    icon: "Video",
    tasks: ["videoFactory", "viralVideoIdeas"],
    suggestedPrompts: [
      "Viral video strategy for a brand",
      "YouTube Shorts ideas for a channel",
      "TikTok content ideas for a product",
      "Explainer video concepts",
    ],
  },
  growthAgent: {
    id: "growthAgent",
    name: "Growth Agent",
    description: "Generates growth hacking ideas and funnels.",
    icon: "TrendingUp",
    tasks: ["funnelBuilder", "marketingStrategy"],
    suggestedPrompts: [
      "Marketing campaign",
      "Startup growth strategy",
      "Product launch plan",
      "Viral growth strategy",
    ],
  },
  analyticsAgent: {
    id: "analyticsAgent",
    name: "Analytics Agent",
    description: "Suggests metrics and growth insights.",
    icon: "BarChart3",
    tasks: ["marketingStrategy"],
    suggestedPrompts: [
      "Key metrics for a SaaS",
      "Growth dashboard KPIs",
      "Conversion funnel analysis",
      "Cohort analysis strategy",
    ],
  },
  automationAgent: {
    id: "automationAgent",
    name: "Automation Agent",
    description: "Builds automation workflows.",
    icon: "Zap",
    tasks: ["automationFactory"],
    suggestedPrompts: [
      "Automate lead follow-up",
      "Workflow for content publishing",
      "Customer onboarding automation",
      "Sales pipeline automation",
    ],
  },
  competitorAgent: {
    id: "competitorAgent",
    name: "Competitor Agent",
    description: "Analyzes competitors and market fit.",
    icon: "Users",
    tasks: ["startupValidator"],
    suggestedPrompts: [
      "Competitive analysis for a startup",
      "Market validation for an app idea",
      "SWOT analysis for a business",
      "Differentiation strategy",
    ],
  },
  productAgent: {
    id: "productAgent",
    name: "Product Agent",
    description: "Generates product ideas and improvements.",
    icon: "Package",
    tasks: ["productGenerator"],
    suggestedPrompts: [
      "Product ideas for a niche",
      "Feature roadmap for an app",
      "Product line expansion",
      "Bundling strategy",
    ],
  },
  salesAgent: {
    id: "salesAgent",
    name: "Sales Agent",
    description: "Creates sales funnels and copy.",
    icon: "ShoppingCart",
    tasks: ["funnelBuilder", "copywritingFactory"],
    suggestedPrompts: [
      "Sales funnel for a course",
      "Checkout page copy",
      "Email sequence for a launch",
      "Upsell and cross-sell strategy",
    ],
  },
};

export type AgentId = keyof typeof AGENTS;
