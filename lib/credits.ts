/**
 * Credit-based billing — costs per AI action
 */
export const CREDIT_COSTS = {
  website: 10,
  logo: 5,
  seo: 3,
  ads: 3,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export const CREDIT_PLANS = {
  free: { credits: 50, name: "Free" },
  pro: { credits: 500, name: "Pro" },
  business: { credits: 2000, name: "Business" },
  agency: { credits: 5000, name: "Agency" },
} as const;

export type CreditPlanId = keyof typeof CREDIT_PLANS;

export function getCreditCost(action: CreditAction): number {
  return CREDIT_COSTS[action] ?? 0;
}

export function getPlanCredits(planId: CreditPlanId): number {
  return CREDIT_PLANS[planId]?.credits ?? 50;
}

export const CREDITS_LOW_THRESHOLD = 10;
