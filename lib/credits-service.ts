import { createClient } from "@/lib/supabase/server";
import { getCreditCost, getPlanCredits, type CreditAction, type CreditPlanId } from "./credits";

const periodStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

export interface UserCredits {
  credits: number;
  creditsUsed: number;
  planId: CreditPlanId;
  planName: string;
  canUseCredits: (action: CreditAction) => boolean;
}

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const [usageRes, subRes] = await Promise.all([
    supabase
      .from("usage")
      .select("credits, credits_used")
      .eq("user_id", userId)
      .eq("period_start", periodStart())
      .maybeSingle(),
    supabase.from("subscriptions").select("plan").eq("user_id", userId).eq("status", "active").maybeSingle(),
  ]);

  const planId = (subRes.data?.plan as CreditPlanId) || "free";
  const planCredits = getPlanCredits(planId);
  const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

  let credits = usageRes.data?.credits ?? 0;
  let creditsUsed = usageRes.data?.credits_used ?? 0;

  if (!usageRes.data) {
    const initialCredits = planId === "free"
      ? (await (async () => {
          const { data: anyUsage } = await supabase.from("usage").select("id").eq("user_id", userId).limit(1).maybeSingle();
          return anyUsage ? 0 : 50;
        })())
      : planCredits;
    await supabase.from("usage").upsert(
      {
        user_id: userId,
        period_start: periodStart(),
        sites_count: 0,
        generations_count: 0,
        credits: initialCredits,
        credits_used: 0,
      },
      { onConflict: "user_id,period_start" }
    );
    credits = initialCredits;
    creditsUsed = 0;
  }

  return {
    credits,
    creditsUsed,
    planId,
    planName,
    canUseCredits: (action: CreditAction) => credits >= getCreditCost(action),
  };
}

export async function deductCredits(userId: string, action: CreditAction): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  const cost = getCreditCost(action);
  const { data, error } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: cost,
  });

  return !error && data === true;
}

export async function hasEnoughCredits(userId: string, action: CreditAction): Promise<boolean> {
  const uc = await getUserCredits(userId);
  return uc ? uc.canUseCredits(action) : false;
}
