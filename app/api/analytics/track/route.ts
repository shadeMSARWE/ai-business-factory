import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ ok: true });
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const body = await request.json();
    const { event_type, slug, site_id, event_data } = body;
    if (!event_type || typeof event_type !== "string") {
      return NextResponse.json({ error: "event_type required" }, { status: 400 });
    }

    await supabase.from("analytics_events").insert({
      user_id: user?.id || null,
      site_id: site_id || null,
      slug: slug || null,
      event_type: event_type.slice(0, 100),
      event_data: typeof event_data === "object" ? event_data : {},
    } as never);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
