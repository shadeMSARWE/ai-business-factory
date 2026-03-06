import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PayPal subscription creation.
 * Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.local when ready.
 * See: https://developer.paypal.com/docs/subscriptions/
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: "PayPal not configured",
      message: "Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to enable subscriptions.",
    }, { status: 503 });
  }

  const body = await request.json();
  const { planId } = body;
  if (!planId || !["pro", "business", "agency"].includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const authRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    const authData = await authRes.json();
    const accessToken = authData.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "PayPal auth failed" }, { status: 500 });
    }

    const planIds: Record<string, string> = {
      pro: process.env.PAYPAL_PRO_PLAN_ID || "",
      business: process.env.PAYPAL_BUSINESS_PLAN_ID || "",
      agency: process.env.PAYPAL_AGENCY_PLAN_ID || "",
    };
    const paypalPlanId = planIds[planId];
    if (!paypalPlanId) {
      return NextResponse.json({ error: `Plan ${planId} not configured` }, { status: 400 });
    }

    const subRes = await fetch("https://api-m.sandbox.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: paypalPlanId,
        custom_id: user.id,
        application_context: {
          brand_name: "InstantBizSite AI",
          return_url: `${request.nextUrl.origin}/dashboard/billing?success=true`,
          cancel_url: `${request.nextUrl.origin}/dashboard/billing?canceled=true`,
        },
      }),
    });
    const subData = await subRes.json();
    const approvalUrl = subData.links?.find((l: { rel: string }) => l.rel === "approve")?.href;
    if (!approvalUrl) {
      return NextResponse.json({ error: subData.message || "Failed to create subscription" }, { status: 500 });
    }
    return NextResponse.json({ url: approvalUrl });
  } catch (e) {
    console.error("PayPal error:", e);
    return NextResponse.json({ error: "PayPal error" }, { status: 500 });
  }
}
