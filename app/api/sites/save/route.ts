import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { prompt, html, slug } = body;
    if (!html) return NextResponse.json({ error: "html required" }, { status: 400 });

    const { data: site, error } = await supabase
      .from("sites")
      .insert({ user_id: user.id, prompt: prompt || null, html, slug: slug || null })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Save site error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
    return NextResponse.json({ id: site.id, created_at: site.created_at });
  } catch (e) {
    console.error("Save site error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
