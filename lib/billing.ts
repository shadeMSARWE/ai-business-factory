import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, canCreateSite, canGenerate, type PlanId } from "@/lib/stripe";

const periodStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

export async function getUserPlanAndUsage(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [subRes, usageRes, sitesRes] = await Promise.all([
    supabase.from("subscriptions").select("plan, status, stripe_subscription_id").eq("user_id", userId).maybeSingle(),
    supabase
      .from("usage")
      .select("sites_count, generations_count")
      .eq("user_id", userId)
      .eq("period_start", periodStart())
      .maybeSingle(),
    supabase.from("sites").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const planId = (subRes.data?.plan as PlanId) || "free";
  const planLimits = getPlanLimits(planId);
  const usage = usageRes.data || { sites_count: 0, generations_count: 0 };
  const sitesCount = sitesRes.count ?? 0;

  return {
    planId,
    planName: planLimits.sitesLimit === -1 ? "Agency" : planId.charAt(0).toUpperCase() + planId.slice(1),
    sitesCount,
    sitesLimit: planLimits.sitesLimit,
    generationsCount: usage.generations_count,
    generationsLimit: planLimits.generationsLimit,
    canCreateSite: canCreateSite(planId, sitesCount),
    canGenerate: canGenerate(planId, usage.generations_count),
    status: subRes.data?.status || "active",
    hasSubscription: !!subRes.data?.stripe_subscription_id,
  };
}
