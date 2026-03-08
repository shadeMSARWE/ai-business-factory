import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaypalBaseUrl } from "@/lib/paypal-config";
import { creditsForAmount } from "@/lib/credits";
import { addUserCredits } from "@/lib/user-credits-service";

function getPaypalAuth() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;
  return Buffer.from(`${clientId}:${secret}`).toString("base64");
}

/**
 * POST /api/paypal/capture-order
 * Body: { orderId: string }
 * Captures the order and adds credits to user_credits.
 */
export async function POST(request: NextRequest) {
  const auth = getPaypalAuth();
  if (!auth) return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const orderId = body?.orderId;
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const baseUrl = getPaypalBaseUrl();
  try {
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return NextResponse.json({ error: "PayPal auth failed" }, { status: 500 });

    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const captureData = await captureRes.json();
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: captureData.message || "Capture failed" }, { status: 400 });
    }

    const purchaseUnit = captureData.purchase_units?.[0];
    const customId = purchaseUnit?.custom_id;
    const amount = purchaseUnit?.payments?.captures?.[0]?.amount?.value;
    const payerId = captureData.payer?.payer_id;

    if (!customId || customId !== user.id) {
      return NextResponse.json({ error: "Order does not belong to current user" }, { status: 403 });
    }

    const amountNum = amount ? parseFloat(amount) : 0;
    const credits = creditsForAmount(Math.round(amountNum));
    if (credits <= 0) {
      return NextResponse.json({ error: "Invalid amount for credits" }, { status: 400 });
    }

    await addUserCredits(user.id, credits);
    return NextResponse.json({ success: true, credits, orderId, payerId });
  } catch (e) {
    console.error("[paypal/capture-order]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
