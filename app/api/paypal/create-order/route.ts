import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaypalBaseUrl } from "@/lib/paypal-config";
import { CREDIT_PACKS, type CreditPackId } from "@/lib/credits";

function getPaypalAuth() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;
  return Buffer.from(`${clientId}:${secret}`).toString("base64");
}

/**
 * POST /api/paypal/create-order
 * Body: { packId: 'starter' | 'pro' | 'business' }
 * Creates a one-time PayPal order; custom_id = userId for capture.
 */
export async function POST(request: NextRequest) {
  const auth = getPaypalAuth();
  if (!auth) return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const packId = body?.packId as CreditPackId;
  if (!packId || !CREDIT_PACKS[packId]) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const pack = CREDIT_PACKS[packId];
  const baseUrl = getPaypalBaseUrl();
  const origin = request.nextUrl.origin;

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

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: String(pack.price) },
            custom_id: user.id,
            description: `${pack.name} — ${pack.credits} credits`,
          },
        ],
        application_context: {
          brand_name: "AI Business Factory",
          return_url: `${origin}/dashboard/billing?success=1`,
          cancel_url: `${origin}/dashboard/billing?cancel=1`,
          user_action: "PAY_NOW",
        },
      }),
    });
    const orderData = await orderRes.json();
    const orderId = orderData.id;
    const approveLink = orderData.links?.find((l: { rel: string }) => l.rel === "approve")?.href;
    if (!orderId || !approveLink) {
      return NextResponse.json({ error: orderData.message || "Failed to create order" }, { status: 500 });
    }
    return NextResponse.json({ orderId, url: approveLink });
  } catch (e) {
    console.error("[paypal/create-order]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
