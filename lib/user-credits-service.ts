/**
 * User credits service — uses user_credits table.
 * New users get 100 credits. Deduct before factory/agent/chat; add after purchase.
 */

import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_CREDITS = 100;

export async function getUserCreditsBalance(userId: string): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;
  const { data, error } = await supabase.rpc("ensure_user_credits", { p_user_id: userId });
  if (error) return 0;
  return typeof data === "number" ? data : 0;
}

export async function deductUserCredits(userId: string, amount: number): Promise<{ ok: boolean; balance: number }> {
  const supabase = await createClient();
  if (!supabase || amount <= 0) {
    const balance = await getUserCreditsBalance(userId);
    return { ok: true, balance };
  }
  const { data, error } = await supabase.rpc("deduct_user_credits", {
    p_user_id: userId,
    p_amount: amount,
  });
  if (error) return { ok: false, balance: -1 };
  const balance = typeof data === "number" ? data : -1;
  return { ok: balance >= 0, balance: balance >= 0 ? balance : await getUserCreditsBalance(userId) };
}

export async function addUserCredits(userId: string, amount: number): Promise<number> {
  const supabase = await createClient();
  if (!supabase || amount <= 0) return await getUserCreditsBalance(userId);
  const { data, error } = await supabase.rpc("add_user_credits", {
    p_user_id: userId,
    p_amount: amount,
  });
  if (error) return 0;
  return typeof data === "number" ? data : 0;
}

export async function ensureUserHasCredits(userId: string): Promise<number> {
  return getUserCreditsBalance(userId);
}

export async function checkAiRateLimit(userId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return true;
  const { data, error } = await supabase.rpc("check_and_increment_ai_rate", { p_user_id: userId });
  if (error) return true;
  return data === true;
}

export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const balance = await getUserCreditsBalance(userId);
  return balance >= amount;
}
