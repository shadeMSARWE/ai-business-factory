import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFactoryEngine } from "@/lib/factories";

/**
 * POST /api/factory/run
 * Body: { factoryId: string, prompt: string, platform?: string }
 * Runs the engine for the given factory. Requires auth for credit deduction in future.
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
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
