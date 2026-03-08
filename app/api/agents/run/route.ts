import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runAgent } from "@/lib/agents/agent-engine";

/**
 * POST /api/agents/run
 * Body: { agentId: string, prompt: string }
 * Runs an agent by orchestrating factories via runFactoryEngine.
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
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
