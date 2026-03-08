/**
 * Agent registry — lookup and list agents.
 */

import type { AgentConfig, AgentId } from "./agents";
import { AGENTS } from "./agents";

export function getAgent(agentId: string): AgentConfig | null {
  return AGENTS[agentId] ?? null;
}

export function getAllAgents(): AgentConfig[] {
  return Object.values(AGENTS);
}

export function getAgentsByCategory(
  category: "core" | "marketing" | "growth" | "advanced"
): AgentConfig[] {
  const core = ["businessAgent", "brandingAgent", "websiteAgent", "storeAgent"];
  const marketing = ["marketingAgent", "seoAgent", "adsAgent", "contentAgent", "videoAgent"];
  const growth = ["growthAgent", "analyticsAgent", "automationAgent"];
  const advanced = ["competitorAgent", "productAgent", "salesAgent"];

  const map: Record<string, string[]> = {
    core,
    marketing,
    growth,
    advanced,
  };
  const ids = map[category] ?? [];
  return ids
    .map((id) => AGENTS[id])
    .filter(Boolean) as AgentConfig[];
}

export { AGENTS, type AgentConfig, type AgentId } from "./agents";
