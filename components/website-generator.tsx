"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { Loader2 } from "lucide-react";
import { GenerationLoader } from "./generation-loader";

export interface GeneratedWebsite {
  businessName: string;
  businessType: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
  services: { title: string; description: string }[];
  testimonials: { name: string; text: string; role: string }[];
  galleryImages: string[];
  contactInfo: { address: string; phone: string; email: string; whatsapp: string };
}

export function WebsiteGenerator({
  onGenerated,
  initialPrompt = "",
}: {
  onGenerated: (data: GeneratedWebsite, prompt?: string) => void;
  initialPrompt?: string;
}) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const start = Date.now();
      const res = await fetch("/api/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      onGenerated(data, prompt.trim());
      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await new Promise((r) => setTimeout(r, 500 - elapsed));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <GenerationLoader key="loader" />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="relative rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex gap-3">
            <Input
              placeholder={t("hero.placeholder")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 bg-white/5 border-white/20 text-lg h-14"
              disabled={loading}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="h-14 px-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                t("hero.cta")
              )}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
