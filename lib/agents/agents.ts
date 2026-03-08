/**
 * AI Agents — intelligent assistants that orchestrate factories.
 * Each agent has tasks = list of factory ids to run via runFactoryEngine.
 */

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  tasks: string[];
}

export const AGENTS: Record<string, AgentConfig> = {
  businessAgent: {
    id: "businessAgent",
    name: "Business Agent",
    description: "Creates business models and revenue ideas.",
    icon: "Briefcase",
    tasks: ["businessPlan", "saasBuilder"],
  },
  brandingAgent: {
    id: "brandingAgent",
    name: "Branding Agent",
    description: "Builds brand identity.",
    icon: "Palette",
    tasks: ["brandingStudio", "logo"],
  },
  websiteAgent: {
    id: "websiteAgent",
    name: "Website Agent",
    description: "Generates website structure.",
    icon: "Globe",
    tasks: ["websiteTemplates", "landingPageAI"],
  },
  storeAgent: {
    id: "storeAgent",
    name: "Store Agent",
    description: "Builds ecommerce store ideas.",
    icon: "Store",
    tasks: ["storeBuilder", "productGenerator"],
  },
  marketingAgent: {
    id: "marketingAgent",
    name: "Marketing Agent",
    description: "Creates marketing strategies.",
    icon: "Megaphone",
    tasks: ["marketingStrategy", "ads"],
  },
  seoAgent: {
    id: "seoAgent",
    name: "SEO Agent",
    description: "Generates SEO plans.",
    icon: "Search",
    tasks: ["seo"],
  },
  adsAgent: {
    id: "adsAgent",
    name: "Ads Agent",
    description: "Creates advertising campaigns.",
    icon: "Target",
    tasks: ["ads", "copywritingFactory"],
  },
  contentAgent: {
    id: "contentAgent",
    name: "Content Agent",
    description: "Creates content strategies.",
    icon: "FileText",
    tasks: ["socialContent", "contentCalendar"],
  },
  videoAgent: {
    id: "videoAgent",
    name: "Video Agent",
    description: "Generates video content ideas.",
    icon: "Video",
    tasks: ["videoFactory", "viralVideoIdeas"],
  },
  growthAgent: {
    id: "growthAgent",
    name: "Growth Agent",
    description: "Generates growth hacking ideas.",
    icon: "TrendingUp",
    tasks: ["funnelBuilder", "marketingStrategy"],
  },
  analyticsAgent: {
    id: "analyticsAgent",
    name: "Analytics Agent",
    description: "Suggests metrics and growth insights.",
    icon: "BarChart3",
    tasks: ["marketingStrategy"],
  },
  automationAgent: {
    id: "automationAgent",
    name: "Automation Agent",
    description: "Builds automation workflows.",
    icon: "Zap",
    tasks: ["automationFactory"],
  },
  competitorAgent: {
    id: "competitorAgent",
    name: "Competitor Agent",
    description: "Analyzes competitors.",
    icon: "Users",
    tasks: ["startupValidator"],
  },
  productAgent: {
    id: "productAgent",
    name: "Product Agent",
    description: "Generates product improvements.",
    icon: "Package",
    tasks: ["productGenerator"],
  },
  salesAgent: {
    id: "salesAgent",
    name: "Sales Agent",
    description: "Creates sales funnels.",
    icon: "ShoppingCart",
    tasks: ["funnelBuilder", "copywritingFactory"],
  },
};

export type AgentId = keyof typeof AGENTS;
