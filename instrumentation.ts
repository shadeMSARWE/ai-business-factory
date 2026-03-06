/**
 * Next.js instrumentation — runs when the server starts.
 * Validates PayPal config when any PayPal env var is set (catches incomplete config).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const hasAnyPaypalVar =
    process.env.PAYPAL_CLIENT_ID ||
    process.env.PAYPAL_CLIENT_SECRET ||
    process.env.PAYPAL_PRO_PLAN_ID ||
    process.env.PAYPAL_BUSINESS_PLAN_ID ||
    process.env.PAYPAL_AGENCY_PLAN_ID ||
    process.env.PAYPAL_WEBHOOK_SECRET;

  if (hasAnyPaypalVar) {
    const { validatePaypalConfig } = await import("@/lib/paypal-config");
    validatePaypalConfig();
  }
}
