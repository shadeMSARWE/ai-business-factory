import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import { STRIPE_WEBHOOK_SECRET } from "@/lib/env";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  if (!STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id || "pro";
        if (!userId) break;

        const subscriptionId = session.subscription as string;
        const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
        const customerId = session.customer as string;
        const status = subscription?.status || "active";

        const { data: existing } = await admin.from("subscriptions").select("id").eq("user_id", userId).single();
        const row = {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId || null,
          plan: planId,
          status,
          updated_at: new Date().toISOString(),
        };
        if (existing) {
          await admin.from("subscriptions").update(row as never).eq("user_id", userId);
        } else {
          await admin.from("subscriptions").insert(row as never);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const planId = sub.status === "active" ? (sub.metadata?.plan_id || "pro") : "free";
        await admin
          .from("subscriptions")
          .update({
            plan: planId,
            status: sub.status,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("stripe_subscription_id", sub.id);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
