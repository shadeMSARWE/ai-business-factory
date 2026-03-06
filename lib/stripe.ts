import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/env";

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    priceId: null as string | null,
    priceMonthly: 0,
    sitesLimit: 1,
    generationsLimit: 5,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    priceMonthly: 19,
    sitesLimit: 10,
    generationsLimit: 100,
  },
  business: {
    id: "business",
    name: "Business",
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || "",
    priceMonthly: 39,
    sitesLimit: 50,
    generationsLimit: 1000,
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceId: process.env.STRIPE_AGENCY_PRICE_ID || "",
    priceMonthly: 99,
    sitesLimit: -1,
    generationsLimit: -1,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlanLimits(planId: PlanId) {
  const plan = PLANS[planId] || PLANS.free;
  return {
    sitesLimit: plan.sitesLimit,
    generationsLimit: plan.generationsLimit,
  };
}

export function canCreateSite(planId: PlanId, currentSites: number): boolean {
  const { sitesLimit } = getPlanLimits(planId);
  if (sitesLimit === -1) return true;
  return currentSites < sitesLimit;
}

export function canGenerate(planId: PlanId, currentGenerations: number): boolean {
  const { generationsLimit } = getPlanLimits(planId);
  if (generationsLimit === -1) return true;
  return currentGenerations < generationsLimit;
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(STRIPE_SECRET_KEY);
  }
  return stripeClient;
}
