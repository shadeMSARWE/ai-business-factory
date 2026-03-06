import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserCredits } from "@/lib/credits-service";
import { CREDIT_PLANS } from "@/lib/credits";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const credits = await getUserCredits(user.id);
  if (!credits) return NextResponse.json({ error: "Failed to load billing" }, { status: 500 });

  const planCredits = CREDIT_PLANS[credits.planId]?.credits ?? 50;

  return NextResponse.json({
    planId: credits.planId,
    planName: credits.planName,
    credits: credits.credits,
    creditsUsed: credits.creditsUsed,
    creditsLimit: planCredits,
    canUseCredits: credits.canUseCredits,
    creditsLow: credits.credits < 10,
    creditsExhausted: credits.credits === 0,
  });
}
