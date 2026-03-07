"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react";

/**
 * Placeholder for OpenAI image generation.
 * Replace with actual OpenAI Images API (DALL-E) when ready.
 */
async function generateImagePlaceholder(prompt: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1500));
  const placeholderId = "1555396273-367ea4eb4db5";
  return `https://images.unsplash.com/photo-${placeholderId}?w=512&q=85`;
}

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);
    try {
      const url = await generateImagePlaceholder(prompt.trim());
      setImageUrl(url);
    } catch {
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-3xl font-bold text-white mb-2">AI Image Generator</h1>
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
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </CardContent>
        </Card>

        {imageUrl && (
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 aspect-square max-w-md">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
