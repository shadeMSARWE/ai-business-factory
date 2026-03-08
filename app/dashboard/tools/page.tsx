"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft, Wand2 } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { getDashboardFactories } from "@/lib/factories";

function getMockResult(tool: string, prompt: string) {
  const p = prompt || "business";
  if (tool === "logo") {
    return { concept: `Modern logo for ${p}`, colors: ["#8b5cf6", "#d946ef"], elements: "Clean geometric shapes" };
  }
  if (tool === "ad") {
    return { headline: `Discover ${p}`, body: "Quality service. Visit us today.", cta: "Learn More" };
  }
  return { title: `${p} - Best in Town`, description: `Professional ${p} services. Contact us for more information.` };
}

function AIToolsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tool = searchParams.get("tool") || "logo";
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const tools = getDashboardFactories().map((f) => ({
    id: f.id,
    title: f.name,
    desc: f.description,
    path: f.path,
  }));

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setResult(getMockResult(tool, prompt));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
            AI Business Factory
          </Link>
          <DashboardNav />
        </div>
      </header>

      <main className="pt-24 pb-20 container mx-auto px-4">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">{t("tools.title")}</h1>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {tools.map((t) => (
            <Link key={t.id} href={t.path}>
              <Card className={`border-white/10 transition ${tool === t.id ? "ring-2 ring-violet-500" : "bg-white/5 hover:bg-white/10"}`}>
                <CardContent className="pt-6">
                  <p className="font-medium text-white">{t.title}</p>
                  <p className="text-sm text-slate-400">{t.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="border-white/10 bg-white/5 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white">{tools.find((x) => x.id === tool)?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">Prompt</Label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tool === "logo" ? "Pizza restaurant" : tool === "ad" ? "Facebook ad for pizza" : "Pizza restaurant website"}
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-slate-400">Additional context (optional)</Label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-2 bg-white/5 border-white/20"
                rows={3}
              />
            </div>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl rounded-xl border border-white/20 bg-white/5 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950 flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <AIToolsContent />
    </Suspense>
  );
}

