import { createClient } from "@/lib/supabase/server";
import { getSitesLimit, CREDIT_PLANS, type CreditPlanId } from "@/lib/credits";
import { hasEnoughCredits } from "@/lib/credits-service";

const periodStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

export async function getUserPlanAndUsage(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [subRes, usageRes, sitesRes] = await Promise.all([
    supabase.from("subscriptions").select("plan, status, stripe_subscription_id").eq("user_id", userId).maybeSingle(),
    supabase
      .from("usage")
      .select("sites_count, generations_count, credits")
      .eq("user_id", userId)
      .eq("period_start", periodStart())
      .maybeSingle(),
    supabase.from("sites").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const planId = (subRes.data?.plan as CreditPlanId) || "free";
  const sitesLimit = getSitesLimit(planId);
  const usage = usageRes.data || { sites_count: 0, generations_count: 0, credits: 0 };
  const sitesCount = sitesRes.count ?? 0;

  const canGenerate = await hasEnoughCredits(userId, "ads");

  return {
    planId,
    planName: CREDIT_PLANS[planId]?.name ?? planId.charAt(0).toUpperCase() + planId.slice(1),
    sitesCount,
    sitesLimit: sitesLimit === -1 ? -1 : sitesLimit,
    generationsCount: usage.generations_count,
    generationsLimit: -1,
    canCreateSite: sitesLimit === -1 || sitesCount < sitesLimit,
    canGenerate,
    status: subRes.data?.status || "active",
    hasSubscription: !!subRes.data?.stripe_subscription_id,
  };
}
