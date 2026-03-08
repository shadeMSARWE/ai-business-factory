"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Bot,
  Lightbulb,
  Target,
  ListChecks,
  ArrowRightCircle,
} from "lucide-react";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { ResultCard } from "@/components/factories/ResultCard";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { ErrorFallback } from "@/components/factories/ErrorFallback";
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

function extractBullets(text: string): string[] {
  const lines = text.split(/\n/).map((s) => s.trim()).filter(Boolean);
  const bullets: string[] = [];
  for (const line of lines) {
    const m = line.match(/^[-*•]\s*(.+)$/) || line.match(/^\d+\.\s*(.+)$/);
    if (m) bullets.push(m[1]);
    else if (line.length > 20) bullets.push(line);
  }
  return bullets.slice(0, 8);
}

export default function AgentRunPage({ params }: { params: { agentId: string } }) {
  const { agentId } = params;
  const agent = getAgent(agentId);

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Icon = agent ? getAgentIcon(agent.icon) : Bot;
  const suggestedPrompts = agent?.suggestedPrompts ?? [];

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

  const entries = result != null ? Object.entries(result) : [];
  const firstValue = entries[0]?.[1];
  const secondValue = entries[1]?.[1];
  const strategyText = typeof firstValue === "string" ? firstValue : (firstValue != null ? toDisplayValue(firstValue) : "");
  const ideasText = typeof secondValue === "string" ? secondValue : (secondValue != null ? toDisplayValue(secondValue) : "");
  const allText = [strategyText, ideasText].filter(Boolean).join("\n\n");
  const recommendationBullets = extractBullets(allText);
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

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <Link
          href="/dashboard/agents"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-500/20 text-violet-300">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{agent.name}</h1>
              <p className="text-slate-400 max-w-2xl">{agent.description}</p>
            </div>
          </div>
        </motion.section>

        {/* Suggested prompts */}
        {suggestedPrompts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <Label className="text-slate-400 text-sm font-medium block mb-3">Suggested prompts</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white transition-all text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Input + Generate */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8"
        >
          <Label className="text-slate-400 block mb-2">What do you need help with?</Label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Launch a SaaS for project management"
            className="mb-4 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
            disabled={loading}
          />
          <Button
            onClick={handleRun}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Run Agent
          </Button>
        </motion.section>

        <AnimatePresence>
          {loading && <FactorySkeleton className="mb-8" />}
        </AnimatePresence>

        {error && !loading && (
          <ErrorFallback message={error} onRetry={handleRun} showBuyCredits className="mb-8" />
        )}

        {!loading && result != null && Object.keys(result).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-violet-400" />
                Results
              </h2>
              <ResultToolbar
                factoryId={agent.id}
                factoryName={agent.name}
                prompt={prompt}
                resultData={result}
                resultPreview={resultPreview}
                onRegenerate={handleRun}
              />
            </div>

            {/* Strategy */}
            {strategyText && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-sm font-semibold text-violet-300 flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4" />
                  Strategy
                </h3>
                <ResultCard title={entries[0]?.[0] ?? "Strategy"} value={strategyText} index={0} />
              </div>
            )}

            {/* Ideas */}
            {ideasText && entries.length > 1 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-sm font-semibold text-violet-300 flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4" />
                  Ideas
                </h3>
                <ResultCard title={entries[1]?.[0] ?? "Ideas"} value={ideasText} index={1} />
              </div>
            )}

            {/* Recommendations / structured list */}
            {recommendationBullets.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-sm font-semibold text-violet-300 flex items-center gap-2 mb-3">
                  <ListChecks className="h-4 w-4" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {recommendationBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <ArrowRightCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next actions — full output by task */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="text-sm font-semibold text-violet-300 flex items-center gap-2 mb-4">
                <ArrowRightCircle className="h-4 w-4" />
                Next actions
              </h3>
              <div className="space-y-4">
                {entries.map(([key, value], i) => (
                  <ResultCard
                    key={key}
                    title={key}
                    value={toDisplayValue(value)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
