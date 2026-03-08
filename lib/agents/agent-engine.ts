/**
 * Agent engine — runs an agent by orchestrating factories via runFactoryEngine.
 * Does not modify the factory engine; only calls runFactoryEngine for each task.
 */

import { runFactoryEngine } from "@/lib/factories";
import { getAgent } from "./agent-registry";

export interface AgentRunResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

/**
 * Run an agent: execute each factory in the agent's tasks and aggregate results.
 */
export async function runAgent(
  agentId: string,
  prompt: string
): Promise<AgentRunResult> {
  const agent = getAgent(agentId);
  if (!agent) {
    return { success: false, error: `Unknown agent: ${agentId}` };
  }

  const data: Record<string, unknown> = {};
  const context = { prompt, options: {} };

  for (const factoryId of agent.tasks) {
    const result = await runFactoryEngine(factoryId, context);
    const key = factoryId;
    if (result.success && result.data != null) {
      data[key] = result.data;
    } else {
      data[key] = { error: result.error ?? "Generation failed" };
    }
  }

  return { success: true, data };
}
