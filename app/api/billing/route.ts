import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlanAndUsage } from "@/lib/billing";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const billing = await getUserPlanAndUsage(user.id);
  if (!billing) return NextResponse.json({ error: "Failed to load billing" }, { status: 500 });
  return NextResponse.json(billing);
}
