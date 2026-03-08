import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runAgent } from "@/lib/agents/agent-engine";
import { getUserCreditsBalance, deductUserCredits, checkAiRateLimit } from "@/lib/user-credits-service";
import { getAgentCreditCost } from "@/lib/credit-costs";

const AGENT_COST = getAgentCreditCost();

/**
 * POST /api/agents/run
 * Body: { agentId: string, prompt: string }
 * Checks credits (4), rate limit, deducts, then runs agent.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agentId = typeof body?.agentId === "string" ? body.agentId.trim() : "";
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!agentId || !prompt) {
      return NextResponse.json(
        { error: "agentId and prompt are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await getUserCreditsBalance(user.id);
    if (balance < AGENT_COST) {
      return NextResponse.json(
        { error: "No credits remaining", code: "NO_CREDITS" },
        { status: 402 }
      );
    }

    const withinRateLimit = await checkAiRateLimit(user.id);
    if (!withinRateLimit) {
      return NextResponse.json(
        { error: "Too many requests. Maximum 100 AI requests per hour." },
        { status: 429 }
      );
    }

    const deduct = await deductUserCredits(user.id, AGENT_COST);
    if (!deduct.ok) {
      return NextResponse.json(
        { error: "No credits remaining", code: "NO_CREDITS" },
        { status: 402 }
      );
    }

    const result = await runAgent(agentId, prompt);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Agent run failed" },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (e) {
    console.error("[agents/run]", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
