import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = (body?.name || "").trim();
  const description = (body?.description || "").trim();
  const platform = (body?.platform || "both").trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ error: "App name is required" }, { status: 400 });
  }
  if (!["android", "ios", "both"].includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  const { data: app, error: appError } = await supabase
    .from("mobile_apps")
    .insert({
      user_id: user.id,
      name,
      description: description || null,
      platform,
      status: "draft",
    })
    .select()
    .single();

  if (appError || !app) {
    console.error("Mobile app insert error:", appError);
    return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
  }

  return NextResponse.json({ app });
}
