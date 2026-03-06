import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [leadsRes, businessLeadsRes, outreachRes, analyticsRes] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("business_leads").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("auto_outreach_jobs").select("id, status", { count: "exact", head: false }).eq("user_id", user.id),
    supabase.from("analytics_events").select("event_type").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const outreachJobs = outreachRes.data || [];
  const sent = outreachJobs.filter((j) => j.status === "sent").length;
  const converted = outreachJobs.filter((j) => j.status === "converted").length;

  const analytics = analyticsRes.data || [];
  const byType: Record<string, number> = {};
  for (const e of analytics) {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
  }

  const businessSearch = byType["business_search"] || 0;
  const demoGenerated = byType["demo_generated"] || 0;
  const outreachSent = byType["outreach_sent"] || sent;

  const leadsDiscovered = businessLeadsRes.count ?? 0;
  const crmLeads = leadsRes.count ?? 0;

  const recommendations: string[] = [];
  if (leadsDiscovered > 0 && outreachSent < leadsDiscovered * 0.3) {
    recommendations.push(`You discovered ${leadsDiscovered} leads. Send outreach now to convert them.`);
  }
  if (leadsDiscovered > 10 && demoGenerated < 3) {
    recommendations.push("Generate demo websites for your top leads to increase conversion.");
  }
  if (crmLeads > 5) {
    recommendations.push("Follow up with your CRM leads to close more deals.");
  }

  return NextResponse.json({
    leadsDiscovered: businessLeadsRes.count ?? 0,
    crmLeads: leadsRes.count ?? 0,
    outreachSent: sent,
    conversions: converted,
    businessSearch,
    demoGenerated,
    recommendations: recommendations.slice(0, 3),
  });
}
