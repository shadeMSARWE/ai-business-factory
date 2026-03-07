"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Video, Loader2, Sparkles } from "lucide-react";

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

/** Demo mode: generates mock viral video ideas. No API calls. */
function generateMockIdeas(topic: string): string[] {
  const normalized = topic.trim() || "AI";
  const cap = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  return IDEA_TEMPLATES.map((fn) => fn(cap));
}

export default function ViralVideoIdeasPage() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Video className="h-8 w-8 text-violet-400" />
          Viral Video Ideas Factory
        </h1>
        <p className="text-slate-400 mb-10">
          Generate viral video ideas for TikTok, YouTube Shorts, and Reels. Enter a topic and get instant ideas.
        </p>

        <Card className="border-white/10 bg-white/5 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Generate Ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
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
          </CardContent>
        </Card>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
              <p className="text-slate-400">Coming up with viral ideas...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">
              Ideas for &quot;{topic.trim() || "AI"}&quot;
            </h2>
            <div className="grid gap-3">
              {ideas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="border-white/10 bg-white/5 hover:border-violet-500/20 transition-colors">
                    <CardContent className="py-4 flex items-center gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 font-semibold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <p className="text-white font-medium">{idea}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
