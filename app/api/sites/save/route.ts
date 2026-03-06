import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlanAndUsage } from "@/lib/billing";

function sanitizeHtml(html: string): string {
  return html.slice(0, 500_000);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const billing = await getUserPlanAndUsage(user.id);
  if (!billing?.canCreateSite) {
    return NextResponse.json({ error: "Website limit reached. Upgrade your plan." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { prompt, html, slug } = body;
    if (!html || typeof html !== "string") return NextResponse.json({ error: "html required" }, { status: 400 });

    const slugVal = typeof slug === "string" ? slug.slice(0, 200).replace(/[^a-z0-9-]/g, "") : null;
    const sanitizedHtml = sanitizeHtml(html);

    const { data: site, error } = await supabase
      .from("sites")
      .insert({ user_id: user.id, prompt: (prompt || "").slice(0, 2000) || null, html: sanitizedHtml, slug: slugVal })
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
