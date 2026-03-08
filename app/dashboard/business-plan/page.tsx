"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, FileText, Loader2, Sparkles } from "lucide-react";
import { Suggestions } from "@/components/factories/Suggestions";
import { PreviewGallery } from "@/components/factories/PreviewGallery";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { getSuggestionsForFactory } from "@/lib/factories";
import { getPreviewImage } from "@/lib/dashboard-marketplace";

const PREVIEW_IMAGES = [
  { src: getPreviewImage("businessPlan"), alt: "Business plan" },
  { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80", alt: "Strategy" },
  { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80", alt: "Planning" },
];

export default function BusinessPlanPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestions = getSuggestionsForFactory("businessPlan");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/factory/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factoryId: "businessPlan", prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      setResult(data.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-violet-400" />
          AI Business Plan Factory
        </h1>
        <p className="text-slate-400 mb-8">
          Create complete business plans: executive summary, market analysis, financial model, revenue streams, roadmap.
        </p>

        <PreviewGallery images={PREVIEW_IMAGES} columns={3} className="mb-8" />

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={suggestions} onSelect={setPrompt} loading={loading} className="mb-6" />
          <div>
            <Label className="text-slate-400">Business or plan type</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Startup business plan, executive summary"
              className="mt-2 bg-white/5 border-white/20 text-white"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Business Plan
          </Button>
        </div>

        <AnimatePresence>{loading && <FactorySkeleton lines={4} className="mb-8" />}</AnimatePresence>
        {error && !loading && <p className="mb-6 text-red-400 text-sm">{error}</p>}

        {!loading && result != null && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Result
            </h2>
            <ResultToolbar
              factoryId="businessPlan"
              factoryName="AI Business Plan Factory"
              prompt={prompt}
              resultData={result}
              resultPreview={typeof result === "string" ? result.slice(0, 120) : JSON.stringify(result).slice(0, 120)}
              onRegenerate={handleGenerate}
            />
            <pre className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 overflow-auto max-h-96">
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </pre>
          </motion.section>
        )}
      </main>
    </div>
  );
}
