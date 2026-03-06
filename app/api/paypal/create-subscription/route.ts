import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paypalConfig, getPaypalBaseUrl, validatePaypalConfig } from "@/lib/paypal-config";

/**
 * PayPal subscription creation.
 * See: https://developer.paypal.com/docs/subscriptions/
 */
export async function POST(request: NextRequest) {
  try {
    validatePaypalConfig();
  } catch {
    return NextResponse.json({
      error: "Missing PayPal environment configuration",
    }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { planId } = body;
  if (!planId || !["pro", "business", "agency"].includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const baseUrl = getPaypalBaseUrl();
  try {
    const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${paypalConfig.clientId}:${paypalConfig.secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    const authData = await authRes.json();
    const accessToken = authData.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "PayPal auth failed" }, { status: 500 });
    }

    const paypalPlanId = paypalConfig.plans[planId as keyof typeof paypalConfig.plans];
    if (!paypalPlanId) {
      return NextResponse.json({ error: `Plan ${planId} not configured` }, { status: 400 });
    }

    const subRes = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
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
          cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
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
