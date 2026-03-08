/**
 * AI Agents — intelligent assistants that orchestrate factories.
 */

export { AGENTS, type AgentConfig, type AgentId } from "./agents";
export { getAgent, getAllAgents, getAgentsByCategory } from "./agent-registry";
export { runAgent, type AgentRunResult } from "./agent-engine";
