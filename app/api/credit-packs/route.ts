import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("credit_packs")
    .select("*")
    .order("credits", { ascending: true });

  if (error) {
    return NextResponse.json({ packs: [] });
  }
  return NextResponse.json({ packs: data || [] });
}
