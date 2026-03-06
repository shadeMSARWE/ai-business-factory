import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { CREDIT_PLANS } from "@/lib/credits";
import { paypalConfig, validatePaypalConfig, getPaypalBaseUrl } from "@/lib/paypal-config";

/**
 * PayPal webhook handler.
 * Configure webhook in PayPal Dashboard: https://developer.paypal.com/dashboard/
 * Events: BILLING.SUBSCRIPTION.ACTIVATED, BILLING.SUBSCRIPTION.CANCELLED
 */
async function verifyWebhookSignature(
  body: string,
  headers: Headers,
  webhookId: string
): Promise<boolean> {
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo") || "SHA256withRSA";
  const transmissionSig = headers.get("paypal-transmission-sig");

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig) {
    return false;
  }

  const authRes = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${paypalConfig.clientId}:${paypalConfig.secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const authData = await authRes.json();
  const accessToken = authData.access_token;
  if (!accessToken) return false;

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(body);
  } catch {
    return false;
  }

  const verifyRes = await fetch(`${getPaypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });
  const verifyData = await verifyRes.json();
  return verifyData.verification_status === "SUCCESS";
}

export async function POST(request: NextRequest) {
  try {
    validatePaypalConfig();
  } catch {
    return NextResponse.json({ error: "Missing PayPal environment configuration" }, { status: 503 });
  }

  const body = await request.text();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID || "";
  if (webhookId && !(await verifyWebhookSignature(body, request.headers, webhookId))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

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
        [paypalConfig.plans.pro]: "pro",
        [paypalConfig.plans.business]: "business",
        [paypalConfig.plans.agency]: "agency",
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

      await supabase.from("billing_history").insert({
        user_id: customId,
        type: "subscription",
        amount: null,
        credits: planCredits,
        description: `Subscription activated: ${planId}`,
        paypal_id: subId,
        status: "completed",
      } as never);
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
      const customId = event.resource?.custom_id;
      const subId = event.resource?.id;
      if (customId) {
        await supabase.from("subscriptions").update({ status: "cancelled" } as never).eq("user_id", customId);
        await supabase.from("billing_history").insert({
          user_id: customId,
          type: "subscription",
          amount: null,
          credits: null,
          description: "Subscription cancelled",
          paypal_id: subId,
          status: "cancelled",
        } as never);
      }
    } else if (eventType === "PAYMENT.SALE.COMPLETED") {
      const customId = event.resource?.custom;
      const amount = event.resource?.amount?.total;
      const paypalId = event.resource?.id;
      if (customId && amount) {
        await supabase.from("billing_history").insert({
          user_id: customId,
          type: "credit_purchase",
          amount: parseFloat(amount),
          credits: null,
          description: "Payment completed",
          paypal_id: paypalId,
          status: "completed",
        } as never);
      }
    } else if (eventType === "PAYMENT.CAPTURE.DENIED" || eventType === "PAYMENT.CAPTURE.REFUNDED") {
      const customId = event.resource?.custom;
      const paypalId = event.resource?.id;
      if (customId) {
        await supabase.from("billing_history").insert({
          user_id: customId,
          type: "payment_failed",
          amount: null,
          credits: null,
          description: eventType.includes("REFUNDED") ? "Payment refunded" : "Payment denied",
          paypal_id: paypalId,
          status: "failed",
        } as never);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("PayPal webhook error:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
