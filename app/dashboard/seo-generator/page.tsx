"use client";

import { useState } from "react";
import Link from "next/link";
import { useCredits } from "@/components/providers/credits-provider";
import { useCreditsAction } from "@/hooks/use-credits-action";
import { CreditsExhaustedModal } from "@/components/credits-exhausted-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, Sparkles, Loader2, Search } from "lucide-react";
import { Suggestions } from "@/components/factories/Suggestions";
import { ResultCard } from "@/components/factories/ResultCard";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { getSuggestionsForFactory } from "@/lib/factories";

function generateSEO(name: string, type: string, city: string) {
  const typeLabel = type || "business";
  return {
    title: `Best ${typeLabel} in ${city} | ${name}`,
    description: `${name} - Your trusted ${typeLabel} in ${city}. Quality service, professional care. Contact us today for the best experience.`,
    keywords: [
      `${name}`,
      `${typeLabel} ${city}`,
      `best ${typeLabel} ${city}`,
      `${typeLabel} near me`,
      city,
    ].join(", "),
  };
}

export default function SEOGeneratorPage() {
  const { billing, refetch } = useCredits();
  const { deductAndRun, showModal, setShowModal } = useCreditsAction("seo");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<ReturnType<typeof generateSEO> | null>(null);
  const [loading, setLoading] = useState(false);
  const creditsExhausted = billing?.creditsExhausted ?? false;
  const suggestions = getSuggestionsForFactory("seo");

  const handleSuggestion = (prompt: string) => {
    const parts = prompt.split(",").map((s) => s.trim());
    if (parts.length >= 3) {
      setName(parts[0] ?? "");
      setType(parts[1] ?? "");
      setCity(parts[2] ?? "");
    }
  };

  const handleGenerate = () => {
    if (!name.trim() || !type.trim() || !city.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    deductAndRun(async () => {
      setLoading(true);
      setResult(null);
      setTimeout(() => {
        setResult(generateSEO(name.trim(), type.trim(), city.trim()));
        setLoading(false);
        refetch();
      }, 600);
    });
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
          <Search className="h-8 w-8 text-violet-400" />
          AI SEO Generator
        </h1>
        <p className="text-slate-400 mb-8">
          Generate SEO title, meta description, and keywords. Use suggestions or enter your details.
        </p>

        {/* Search preview cards — contextual visual */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 mb-8"
        >
          <p className="text-sm font-medium text-slate-400 mb-3">Search preview</p>
          <div className="space-y-2">
            <div className="h-4 rounded bg-white/10 w-3/4 max-w-md" />
            <div className="h-3 rounded bg-white/5 w-full max-w-lg" />
            <div className="h-3 rounded bg-white/5 w-2/3 max-w-md" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Your meta will appear like this in search results.</p>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={suggestions} onSelect={handleSuggestion} loading={loading} className="mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-slate-400">Business name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Pizza"
                className="mt-2 bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Business type</Label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Pizza restaurant"
                className="mt-2 bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Haifa"
                className="mt-2 bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !name.trim() || !type.trim() || !city.trim() || creditsExhausted}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate SEO
          </Button>
        </div>

        <AnimatePresence>
          {loading && (
            <FactorySkeleton lines={3} className="mb-8" />
          )}
        </AnimatePresence>

        {!loading && result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
          >
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Result
            </h2>
            <ResultToolbar
              factoryId="seo"
              factoryName="AI SEO Generator"
              prompt={`${name} | ${type} | ${city}`}
              resultData={result}
              resultPreview={result.title?.slice(0, 60)}
              onRegenerate={handleGenerate}
              className="mb-6"
            />
            <div className="space-y-4">
              <ResultCard title="SEO Title" value={result.title} index={0} />
              <ResultCard title="Meta Description" value={result.description} index={1} />
              <ResultCard title="Keywords" value={result.keywords} index={2} />
            </div>
          </motion.section>
        )}
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
