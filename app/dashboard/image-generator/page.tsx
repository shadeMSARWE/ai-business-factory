"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ImageIcon, Loader2, Download, RefreshCw } from "lucide-react";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageDataUrl(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate image. Please try again.");
        return;
      }

      if (data.image) {
        setImageDataUrl(data.image);
      } else {
        setError("Failed to generate image. Please try again.");
      }
    } catch {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
  };

  const handleRegenerate = () => {
    setImageDataUrl(null);
    setError(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ImageIcon className="h-8 w-8 text-violet-400" />
          AI Image Generator
        </h1>
        <p className="text-slate-400 mb-10">
          Generate images with AI. Enter a prompt and click Generate.
        </p>

        <Card className="border-white/10 bg-white/5 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Create Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">Prompt</Label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cozy coffee shop interior with warm lighting"
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
                  Generating image...
                </>
              ) : (
                "Generate Image"
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
              className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl border border-white/10 bg-white/5"
            >
              <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
              <p className="text-slate-400">Generating image...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && imageDataUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            <Card className="border-white/10 bg-white/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 aspect-square max-w-md mx-auto">
                  <img
                    src={imageDataUrl}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="border-white/20 text-slate-300 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
