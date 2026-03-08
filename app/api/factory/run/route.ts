import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFactoryEngine } from "@/lib/factories";
import { getUserCreditsBalance, deductUserCredits, checkAiRateLimit } from "@/lib/user-credits-service";
import { getFactoryCreditCost } from "@/lib/credit-costs";

/**
 * POST /api/factory/run
 * Body: { factoryId: string, prompt: string, platform?: string }
 * Checks credits, rate limit, deducts, then runs the engine.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const factoryId = body?.factoryId ?? body?.factory_id;
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!factoryId || !prompt) {
      return NextResponse.json(
        { error: "factoryId and prompt are required" },
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

    const cost = getFactoryCreditCost(factoryId);
    const balance = await getUserCreditsBalance(user.id);
    if (balance < cost) {
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

    const deduct = await deductUserCredits(user.id, cost);
    if (!deduct.ok) {
      return NextResponse.json(
        { error: "No credits remaining", code: "NO_CREDITS" },
        { status: 402 }
      );
    }

    const result = await runFactoryEngine(factoryId, {
      prompt,
      options: {},
      platform: body?.platform,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Generation failed" },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (e) {
    console.error("[factory/run]", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
