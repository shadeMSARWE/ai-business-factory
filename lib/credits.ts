/**
 * Credit-based billing — costs per AI action
 */
export const CREDIT_COSTS = {
  website: 10,
  logo: 5,
  seo: 3,
  ads: 3,
  businessFinderSearch: 5,
  businessWebsite: 20,
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
