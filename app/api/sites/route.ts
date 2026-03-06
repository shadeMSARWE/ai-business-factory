import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ sites: [] });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ sites: [] });

  const { data, error } = await supabase
    .from("sites")
    .select("id, prompt, html, slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ sites: [] });
  return NextResponse.json({ sites: data || [] });
}
