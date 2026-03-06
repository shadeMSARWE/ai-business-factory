"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from "lucide-react";

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
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<ReturnType<typeof generateSEO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!name.trim() || !type.trim() || !city.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(generateSEO(name.trim(), type.trim(), city.trim()));
      setLoading(false);
    }, 600);
  };

  const copyField = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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

        <h1 className="text-3xl font-bold text-white mb-2">AI SEO Generator</h1>
        <p className="text-slate-400 mb-10">Generate SEO title, meta description, and keywords for your website</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-slate-400">Business name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Pizza"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-slate-400">Business type</Label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Pizza restaurant"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-slate-400">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Haifa"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !name.trim() || !type.trim() || !city.trim()}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate SEO
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-slate-400">SEO Title</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyField(result.title, "title")}
                  className="text-slate-400 hover:text-white"
                >
                  {copied === "title" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-white font-medium">{result.title}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-slate-400">Meta Description</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyField(result.description, "desc")}
                  className="text-slate-400 hover:text-white"
                >
                  {copied === "desc" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-slate-300">{result.description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-slate-400">Keywords</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyField(result.keywords, "keywords")}
                  className="text-slate-400 hover:text-white"
                >
                  {copied === "keywords" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-slate-300 text-sm">{result.keywords}</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
