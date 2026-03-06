"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft, Store, Loader2 } from "lucide-react";

export default function StoreBuilderPage() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      alert("Store builder: Generate e-commerce store from prompt. Integrate with website generator API for full store creation.");
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-3xl font-bold text-white mb-2">{t("tools.storeBuilder")}</h1>
        <p className="text-slate-400 mb-8">
          Generate a simple e-commerce store with products, cart, and checkout.
        </p>

        <Card className="border-white/10 bg-white/5 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Store className="h-5 w-5" />
              Create Store
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">Describe your store</Label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Online jewelry store with handmade necklaces and bracelets"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Store className="h-4 w-4 mr-2" />}
              Generate Store
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
