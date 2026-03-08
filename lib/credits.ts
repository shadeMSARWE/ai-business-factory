/**
 * Credit-based billing — costs per AI action
 */
export const CREDIT_COSTS = {
  website: 10,
  logo: 5,
  seo: 3,
  ads: 3,
  businessFinderSearch: 5,
  businessFinderBulk50: 10,
  businessFinderBulk100: 15,
  businessFinderBulk500: 25,
  businessWebsite: 20,
  autoOutreachSearch: 5,
  autoOutreachGenerate: 20,
  autoOutreachMessage: 1,
  autoOutreachSend: 1,
  appGenerate: 25,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export const CREDIT_PLANS = {
  free: { credits: 50, name: "Free" },
  pro: { credits: 100, name: "Starter" },
  business: { credits: 500, name: "Pro" },
  agency: { credits: 2000, name: "Business" },
} as const;

export type CreditPlanId = keyof typeof CREDIT_PLANS;

export const SITES_LIMIT: Record<CreditPlanId, number> = {
  free: 1,
  pro: 3,
  business: 10,
  agency: -1,
};

export function getSitesLimit(planId: CreditPlanId): number {
  return SITES_LIMIT[planId] ?? 1;
}

export function getCreditCost(action: CreditAction): number {
  return CREDIT_COSTS[action] ?? 0;
}

export function getPlanCredits(planId: CreditPlanId): number {
  return CREDIT_PLANS[planId]?.credits ?? 50;
}

export const CREDITS_LOW_THRESHOLD = 10;

/** One-time credit packs for PayPal purchase (Starter $9/100, Pro $29/500, Business $79/2000) */
export const CREDIT_PACKS = {
  starter: { name: "Starter Plan", price: 9, credits: 100 },
  pro: { name: "Pro Plan", price: 29, credits: 500 },
  business: { name: "Business Plan", price: 79, credits: 2000 },
} as const;

export type CreditPackId = keyof typeof CREDIT_PACKS;

export function getCreditPack(packId: CreditPackId) {
  return CREDIT_PACKS[packId];
}

export function creditsForAmount(amountUsd: number): number {
  const byPrice: Record<number, number> = { 9: 100, 29: 500, 79: 2000 };
  return byPrice[amountUsd] ?? 0;
}
