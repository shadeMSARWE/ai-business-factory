import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserCreditsBalance } from "@/lib/user-credits-service";
import { getUserCredits } from "@/lib/credits-service";
import { CREDIT_PLANS } from "@/lib/credits";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const balance = await getUserCreditsBalance(user.id);
  const legacy = await getUserCredits(user.id);
  const planId = legacy?.planId ?? "free";
  const planName = legacy?.planName ?? "Free";
  const planCredits = CREDIT_PLANS[planId]?.credits ?? 100;

  return NextResponse.json({
    planId,
    planName,
    credits: balance,
    creditsUsed: legacy?.creditsUsed ?? 0,
    creditsLimit: planCredits,
    canUseCredits: balance > 0,
    creditsLow: balance > 0 && balance < 10,
    creditsExhausted: balance <= 0,
  });
}
