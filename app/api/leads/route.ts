import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const slug = searchParams.get("slug");
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const leadScoreMin = searchParams.get("lead_score_min");
  const search = searchParams.get("search");

  let query = supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (slug && slug !== "all") query = query.eq("slug", slug);
  if (city && city !== "all") query = query.eq("city", city);
  if (category && category !== "all") query = query.eq("category", category);
  if (leadScoreMin) query = query.gte("lead_score", parseInt(leadScoreMin, 10));

  const { data: rawData, error } = await query;
  let data = rawData || [];

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    data = data.filter(
      (l: { name?: string; email?: string; message?: string }) =>
        (l.name || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.message || "").toLowerCase().includes(q)
    );
  }
  if (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
  return NextResponse.json({ leads: data });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const { ok } = rateLimit(`leads:${ip}`);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await request.json();
  const slug = (body?.slug || "").trim();
  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const phone = (body?.phone || "").trim();
  const message = (body?.message || "").trim();

  if (!slug || !name || !email) {
    return NextResponse.json({ error: "slug, name, and email are required" }, { status: 400 });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, user_id")
    .eq("slug", slug)
    .single();

  if (!site?.user_id) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      user_id: site.user_id,
      site_id: site.id,
      slug,
      name,
      email,
      phone: phone || null,
      message: message || null,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Lead insert error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  return NextResponse.json({ success: true, lead });
}
