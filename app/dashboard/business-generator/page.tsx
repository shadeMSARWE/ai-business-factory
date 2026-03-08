"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, Rocket, Loader2, Sparkles } from "lucide-react";
import { Suggestions } from "@/components/factories/Suggestions";
import { PreviewGallery } from "@/components/factories/PreviewGallery";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { ResultCard } from "@/components/factories/ResultCard";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { getSuggestionsForFactory } from "@/lib/factories";
import { getPreviewImage } from "@/lib/dashboard-marketplace";

interface BusinessKitResult {
  businessName: string;
  slogan: string;
  logoConcept: unknown;
  brandColors: unknown;
  typography: unknown;
  websiteStructure: unknown;
  storePlan: unknown;
  seoStrategy: unknown;
  adCampaigns: unknown;
  socialContentPlan: unknown;
  videoIdeas: unknown;
}

function toValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  return JSON.stringify(v, null, 2);
}

const PREVIEW_IMAGES = [
  { src: getPreviewImage("businessGenerator"), alt: "Business" },
  { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80", alt: "Workspace" },
  { src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80", alt: "Launch" },
];

export default function BusinessGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<BusinessKitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestions = getSuggestionsForFactory("businessGenerator");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/business-generator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      setResult(data.data as BusinessKitResult);
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
          <Rocket className="h-8 w-8 text-violet-400" />
          AI Business Generator
        </h1>
        <p className="text-slate-400 mb-8">
          Create an entire AI business kit in one click: branding, website, store, SEO, ads, content, and video ideas.
        </p>

        <PreviewGallery images={PREVIEW_IMAGES} columns={3} className="mb-8" />

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={suggestions} onSelect={setPrompt} loading={loading} className="mb-6" />
          <div>
            <Label className="text-slate-400">Describe your business idea</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. coffee shop in Haifa"
              className="mt-2 bg-white/5 border-white/20 text-white"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate full business kit
          </Button>
        </div>

        <AnimatePresence>
          {loading && <FactorySkeleton lines={5} className="mb-8" />}
        </AnimatePresence>

        {error && !loading && (
          <p className="mb-6 text-red-400 text-sm">{error}</p>
        )}

        {!loading && result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                Your AI business kit
              </h2>
              <ResultToolbar
                factoryId="businessGenerator"
                factoryName="AI Business Generator"
                prompt={prompt}
                resultData={result}
                resultPreview={result.businessName + " — " + toValue(result.seoStrategy).slice(0, 80)}
                onRegenerate={handleGenerate}
              />
            </div>

            <div>
              <h3 className="text-md font-semibold text-violet-300 mb-3">Branding</h3>
              <div className="space-y-3">
                <ResultCard title="Business name" value={result.businessName || "—"} index={0} />
                {result.slogan ? (
                  <ResultCard title="Slogan" value={result.slogan} index={1} />
                ) : null}
                {result.logoConcept != null && (
                  typeof result.logoConcept === "string" && result.logoConcept.startsWith("data:") ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm text-slate-400 mb-2">Logo concept (image)</p>
                      <img
                        src={result.logoConcept}
                        alt="Logo concept"
                        className="rounded-lg max-h-48 object-contain"
                      />
                    </div>
                  ) : (
                    <ResultCard
                      title="Logo concept"
                      value={toValue(result.logoConcept)}
                      index={2}
                    />
                  )
                )}
                {result.brandColors != null && (
                  <ResultCard title="Brand colors" value={toValue(result.brandColors)} index={3} />
                )}
                {result.typography != null && (
                  <ResultCard title="Typography" value={toValue(result.typography)} index={4} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-violet-300 mb-3">Website</h3>
              <div className="space-y-3">
                {result.websiteStructure != null && (
                  <ResultCard
                    title="Website structure"
                    value={toValue(result.websiteStructure)}
                    index={5}
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-violet-300 mb-3">Store</h3>
              <div className="space-y-3">
                {result.storePlan != null && (
                  <ResultCard title="Store plan" value={toValue(result.storePlan)} index={6} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-violet-300 mb-3">Marketing</h3>
              <div className="space-y-3">
                {result.seoStrategy != null && (
                  <ResultCard title="SEO strategy" value={toValue(result.seoStrategy)} index={7} />
                )}
                {result.adCampaigns != null && (
                  <ResultCard title="Ad campaigns" value={toValue(result.adCampaigns)} index={8} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-violet-300 mb-3">Content</h3>
              <div className="space-y-3">
                {result.socialContentPlan != null && (
                  <ResultCard
                    title="Social content plan"
                    value={toValue(result.socialContentPlan)}
                    index={9}
                  />
                )}
                {result.videoIdeas != null && (
                  <ResultCard title="Video ideas" value={toValue(result.videoIdeas)} index={10} />
                )}
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
