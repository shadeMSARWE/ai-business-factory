import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const leadId = (body?.leadId || "").trim();
  const type = (body?.type || "").trim();
  const description = (body?.description || "").trim();
  const metadata = body?.metadata || {};

  if (!leadId || !type) {
    return NextResponse.json({ error: "leadId and type are required" }, { status: 400 });
  }

  const validTypes = ["email_sent", "email_opened", "reply_received", "follow_up_scheduled", "status_changed", "note_added"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("user_id", user.id)
    .single();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { data: event, error } = await supabase
    .from("lead_events")
    .insert({
      lead_id: leadId,
      type,
      description: description.slice(0, 1000),
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("Lead event insert error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
  return NextResponse.json({ event });
}
