"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, Loader2, Sparkles, Bot } from "lucide-react";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { ResultCard } from "@/components/factories/ResultCard";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { getAgent } from "@/lib/agents/agent-registry";
import { getAgentIcon } from "@/components/agents/agent-icons";

function toDisplayValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "error" in v) {
    return String((v as { error: string }).error);
  }
  return JSON.stringify(v, null, 2);
}

export default function AgentRunPage({ params }: { params: { agentId: string } }) {
  const { agentId } = params;
  const agent = getAgent(agentId);

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Icon = agent ? getAgentIcon(agent.icon) : Bot;

  const handleRun = async () => {
    if (!agent || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Agent run failed");
        return;
      }
      setResult((data.data as Record<string, unknown>) ?? {});
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <Logo showSubtitle />
            <DashboardNav />
          </div>
        </header>
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <p className="text-slate-400">Agent not found.</p>
          <Link href="/dashboard/agents" className="text-violet-400 hover:underline mt-4 inline-block">
            Back to Agents
          </Link>
        </main>
      </div>
    );
  }

  const resultPreview =
    result != null
      ? Object.keys(result)
          .slice(0, 2)
          .map((k) => `${k}: ${toDisplayValue(result[k]).slice(0, 40)}...`)
          .join(" | ")
      : "";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/dashboard/agents"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon className="h-8 w-8 text-violet-400" />
          {agent.name}
        </h1>
        <p className="text-slate-400 mb-8">{agent.description}</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <div>
            <Label className="text-slate-400">What do you need help with?</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Launch a SaaS for project management"
              className="mt-2 bg-white/5 border-white/20 text-white"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleRun}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Run Agent
          </Button>
        </div>

        <AnimatePresence>
          {loading && <FactorySkeleton className="mb-8" />}
        </AnimatePresence>

        {error && !loading && (
          <p className="text-red-400 mb-8">{error}</p>
        )}

        {!loading && result != null && Object.keys(result).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
            <ResultToolbar
              factoryId={agent.id}
              factoryName={agent.name}
              prompt={prompt}
              resultData={result}
              resultPreview={resultPreview}
              onRegenerate={handleRun}
              className="mb-6"
            />
            <div className="space-y-4">
              {Object.entries(result).map(([key, value], i) => (
                <ResultCard
                  key={key}
                  title={key}
                  value={toDisplayValue(value)}
                  index={i}
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
