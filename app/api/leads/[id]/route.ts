import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const { data: existing } = await supabase.from("leads").select("status").eq("id", id).eq("user_id", user.id).single();

  if (body.status !== undefined) updates.status = String(body.status).slice(0, 50);
  if (body.notes !== undefined) updates.notes = String(body.notes).slice(0, 5000);
  if (body.follow_up_at !== undefined) updates.follow_up_at = body.follow_up_at || null;
  if (body.last_contacted_at !== undefined) updates.last_contacted_at = body.last_contacted_at || null;

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  if (body.status !== undefined && body.status !== existing?.status) {
    await supabase.from("lead_events").insert({
      lead_id: id,
      type: "status_changed",
      description: `Status changed to ${body.status}`,
      metadata: { from: existing?.status, to: body.status },
    } as Record<string, unknown>);
  }
  if (body.follow_up_at !== undefined && body.follow_up_at) {
    await supabase.from("lead_events").insert({
      lead_id: id,
      type: "follow_up_scheduled",
      description: `Follow-up scheduled for ${body.follow_up_at}`,
      metadata: { follow_up_at: body.follow_up_at },
    } as Record<string, unknown>);
  }

  return NextResponse.json({ lead: data });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { data: events } = await supabase
    .from("lead_events")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ lead, events: events || [] });
}
