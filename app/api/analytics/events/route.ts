import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ events: [] });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ events: [] });

  const { data } = await supabase
    .from("analytics_events")
    .select("event_type, slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const byType: Record<string, number> = {};
  for (const e of data || []) {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
  }

  return NextResponse.json({ events: data || [], summary: byType });
}
