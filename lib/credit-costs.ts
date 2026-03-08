/**
 * Credit cost per tool — used before running factory, agent, or chat.
 * Simple: 1, Medium: 2, Heavy: 3, Business Generator: 5, Agents: 4, Chat: 1.
 */

const SIMPLE_FACTORIES = new Set([
  "seo",
  "logo",
  "viralVideoIdeas",
  "socialContent",
  "contentCalendar",
  "productGenerator",
  "startupValidator",
]);
const MEDIUM_FACTORIES = new Set([
  "ads",
  "websiteTemplates",
  "landingPageAI",
  "storeBuilder",
  "appBuilder",
  "brandKit",
  "marketingStrategy",
  "copywritingFactory",
  "funnelBuilder",
  "videoFactory",
  "imageGenerator",
  "businessFinder",
  "autoOutreach",
  "landingPage",
  "mobileApps",
  "store",
]);
const HEAVY_FACTORIES = new Set([
  "website",
  "universalBuilder",
  "saasBuilder",
  "automationFactory",
  "courseCreator",
  "businessPlan",
  "brandingStudio",
]);

export const CREDIT_COST = {
  factorySimple: 1,
  factoryMedium: 2,
  factoryHeavy: 3,
  businessGenerator: 5,
  agent: 4,
  chat: 1,
} as const;

export function getFactoryCreditCost(factoryId: string): number {
  if (factoryId === "businessGenerator") return CREDIT_COST.businessGenerator;
  if (SIMPLE_FACTORIES.has(factoryId)) return CREDIT_COST.factorySimple;
  if (MEDIUM_FACTORIES.has(factoryId)) return CREDIT_COST.factoryMedium;
  if (HEAVY_FACTORIES.has(factoryId)) return CREDIT_COST.factoryHeavy;
  return CREDIT_COST.factoryMedium;
}

export function getAgentCreditCost(): number {
  return CREDIT_COST.agent;
}

export function getChatCreditCost(): number {
  return CREDIT_COST.chat;
}
