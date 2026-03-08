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
  { src: getPreviewImage("copywritingFactory"), alt: "Copy" },
  { src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80", alt: "Writing" },
  { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80", alt: "Content" },
];

export default function CopywritingFactoryPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestions = getSuggestionsForFactory("copywritingFactory");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/factory/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factoryId: "copywritingFactory", prompt: prompt.trim() }),
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
          AI Copywriting Factory
        </h1>
        <p className="text-slate-400 mb-8">
          Generate professional copy: sales pages, ad copy, email sequences, landing page copy.
        </p>

        <PreviewGallery images={PREVIEW_IMAGES} columns={3} className="mb-8" />

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={suggestions} onSelect={setPrompt} loading={loading} className="mb-6" />
          <div>
            <Label className="text-slate-400">Copy type or topic</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Sales page copy, headline, benefits, CTA"
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
            Generate Copy
          </Button>
        </div>

        <AnimatePresence>{loading && <FactorySkeleton lines={3} className="mb-8" />}</AnimatePresence>
        {error && !loading && <p className="mb-6 text-red-400 text-sm">{error}</p>}

        {!loading && result != null && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Result
            </h2>
            <ResultToolbar
              factoryId="copywritingFactory"
              factoryName="AI Copywriting Factory"
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
