import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { CREDIT_PLANS } from "@/lib/credits";

/**
 * PayPal webhook handler.
 * Add PAYPAL_WEBHOOK_SECRET to .env.local.
 * Configure webhook in PayPal Dashboard: https://developer.paypal.com/dashboard/
 * Events: BILLING.SUBSCRIPTION.ACTIVATED, BILLING.SUBSCRIPTION.CANCELLED
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PAYPAL_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const event = JSON.parse(body);
    const eventType = event.event_type;

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const customId = event.resource?.custom_id;
      const subId = event.resource?.id;
      const paypalPlanId = event.resource?.plan_id || "";
      const planMap: Record<string, string> = {
        [process.env.PAYPAL_PRO_PLAN_ID || ""]: "pro",
        [process.env.PAYPAL_BUSINESS_PLAN_ID || ""]: "business",
        [process.env.PAYPAL_AGENCY_PLAN_ID || ""]: "agency",
      };
      const planId = planMap[paypalPlanId] || "pro";
      if (!customId || !subId) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
      }

      const planCredits = CREDIT_PLANS[planId as keyof typeof CREDIT_PLANS]?.credits ?? 500;
      const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

      const subRow = {
        user_id: customId,
        plan: planId,
        status: "active",
        stripe_subscription_id: subId,
      };
      await supabase.from("subscriptions").upsert(subRow as never, { onConflict: "user_id" });

      const usageRow = {
        user_id: customId,
        period_start: periodStart,
        sites_count: 0,
        generations_count: 0,
        credits: planCredits,
        credits_used: 0,
      };
      await supabase.from("usage").upsert(usageRow as never, { onConflict: "user_id,period_start" });
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
      const customId = event.resource?.custom_id;
      if (customId) {
        await supabase.from("subscriptions").update({ status: "cancelled" } as never).eq("user_id", customId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("PayPal webhook error:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
