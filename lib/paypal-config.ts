/**
 * PayPal configuration — server-side only.
 * Never expose clientSecret, webhookSecret, or plan IDs to the frontend.
 * Only PAYPAL_CLIENT_ID may be used in the frontend PayPal SDK.
 */

const REQUIRED = [
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_PRO_PLAN_ID",
  "PAYPAL_BUSINESS_PLAN_ID",
  "PAYPAL_AGENCY_PLAN_ID",
  "PAYPAL_WEBHOOK_SECRET",
] as const;

function getEnv(key: string): string {
  return process.env[key] ?? "";
}

export function validatePaypalConfig(): void {
  const missing = REQUIRED.filter((key) => !getEnv(key).trim());
  if (missing.length > 0) {
    throw new Error("Missing PayPal environment configuration");
  }
}

export function isPaypalConfigured(): boolean {
  return REQUIRED.every((key) => !!getEnv(key).trim());
}

export const paypalConfig = {
  clientId: getEnv("PAYPAL_CLIENT_ID"),
  secret: getEnv("PAYPAL_CLIENT_SECRET"),
  plans: {
    pro: getEnv("PAYPAL_PRO_PLAN_ID"),
    business: getEnv("PAYPAL_BUSINESS_PLAN_ID"),
    agency: getEnv("PAYPAL_AGENCY_PLAN_ID"),
  },
  webhookSecret: getEnv("PAYPAL_WEBHOOK_SECRET"),
  env: getEnv("PAYPAL_ENV") || "live",
} as const;

export function getPaypalBaseUrl(): string {
  return paypalConfig.env === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}
