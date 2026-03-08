import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserCreditsBalance } from "@/lib/user-credits-service";

/**
 * GET /api/credits/balance
 * Returns current user credits from user_credits table (default 100 for new users).
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const credits = await getUserCreditsBalance(user.id);
    return NextResponse.json({ credits });
  } catch {
    return NextResponse.json({ error: "Failed to load credits" }, { status: 500 });
  }
}
