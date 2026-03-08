"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Video, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Suggestions } from "@/components/factories/Suggestions";
import { PreviewGallery } from "@/components/factories/PreviewGallery";
import { ResultCard } from "@/components/factories/ResultCard";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { getSuggestionsForFactory } from "@/lib/factories";

const IDEA_TEMPLATES = [
  (t: string) => `5 ${t} tools that will blow your mind`,
  (t: string) => `This ${t} can replace your job`,
  (t: string) => `I tested the smartest ${t} on earth`,
  (t: string) => `3 ${t} websites nobody knows`,
  (t: string) => `The future of ${t} in 60 seconds`,
  (t: string) => `This ${t} can design a website instantly`,
  (t: string) => `I tried building a business with ${t}`,
  (t: string) => `${t} vs humans challenge`,
  (t: string) => `The most dangerous ${t} ever created`,
  (t: string) => `Can ${t} make you rich?`,
  (t: string) => `What they don't tell you about ${t}`,
  (t: string) => `I spent 24 hours using only ${t}`,
];

const VIDEO_PREVIEW_IMAGES = [
  { src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80", alt: "TikTok style" },
  { src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80", alt: "YouTube Shorts" },
  { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80", alt: "Social video" },
  { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80", alt: "Content" },
  { src: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80", alt: "Thumbnail" },
  { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80", alt: "Preview" },
];

function generateMockIdeas(topic: string): string[] {
  const normalized = topic.trim() || "AI";
  const cap = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  return IDEA_TEMPLATES.map((fn) => fn(cap));
}

export default function ViralVideoIdeasPage() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const suggestions = getSuggestionsForFactory("viralVideoIdeas");

  const handleGenerate = async () => {
    setLoading(true);
    setIdeas([]);
    await new Promise((r) => setTimeout(r, 1200));
    setIdeas(generateMockIdeas(topic));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            Demo Mode – No AI API connected
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Video className="h-8 w-8 text-violet-400" />
          Viral Video Ideas Factory
        </h1>
        <p className="text-slate-400 mb-8">
          Generate viral video ideas for TikTok, YouTube Shorts, and Reels. Use suggestions or enter a topic.
        </p>

        {/* Thumbnail-style preview gallery */}
        <PreviewGallery images={VIDEO_PREVIEW_IMAGES} columns={3} className="mb-8" />

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={suggestions} onSelect={(p) => setTopic(p)} loading={loading} className="mb-6" />
          <div className="space-y-4">
            <div>
              <Label className="text-slate-400">Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI, fitness, cooking, crypto"
                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Ideas"
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {loading && <FactorySkeleton lines={4} className="mb-8" />}
        </AnimatePresence>

        {!loading && ideas.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Ideas for &quot;{topic.trim() || "AI"}&quot;
            </h2>
            <div className="grid gap-3">
              {ideas.map((idea, i) => (
                <ResultCard key={i} title={`Idea ${i + 1}`} value={idea} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
