import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deductCredits, hasEnoughCredits } from "@/lib/credits-service";
import type { CreditAction } from "@/lib/credits";

const VALID_ACTIONS: CreditAction[] = ["website", "logo", "seo", "ads", "businessFinderSearch", "businessFinderBulk50", "businessFinderBulk100", "businessFinderBulk500", "businessWebsite", "autoOutreachSearch", "autoOutreachGenerate", "autoOutreachMessage", "autoOutreachSend"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const action = body?.action as string;
  if (!action || !VALID_ACTIONS.includes(action as CreditAction)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const hasCredits = await hasEnoughCredits(user.id, action as CreditAction);
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Upgrade your plan." },
      { status: 403 }
    );
  }

  const ok = await deductCredits(user.id, action as CreditAction);
  if (!ok) {
    return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
