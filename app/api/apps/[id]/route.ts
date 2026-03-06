import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data: app, error: appError } = await supabase
    .from("apps")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (appError || !app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const [screensRes, buildsRes] = await Promise.all([
    supabase.from("app_screens").select("*").eq("app_id", id).order("created_at"),
    supabase.from("app_builds").select("*").eq("app_id", id).order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    app,
    screens: screensRes.data || [],
    builds: buildsRes.data || [],
  });
}
