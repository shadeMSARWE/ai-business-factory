"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { WebsiteGenerator } from "@/components/website-generator";
import { WebsitePreview } from "@/components/website-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveWebsite } from "@/lib/storage";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import type { GeneratedWebsite } from "@/components/website-generator";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const template = searchParams.get("template");
  const mode = searchParams.get("mode");
  const business = searchParams.get("business");
  const [generatedData, setGeneratedData] = useState<GeneratedWebsite | Record<string, unknown> | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const defaultPrompt = business
    ? `Create a website for ${business}`
    : template
    ? `Create a website for a ${template.replace(/_/g, " ")}`
    : mode === "business"
    ? "Create a complete business with website, logo, and marketing"
    : "";

  const handleGenerated = (data: GeneratedWebsite, prompt?: string) => {
    setGeneratedData(data);
    setGenerationPrompt(prompt || "");
    const name = (data.businessName as string) || "website";
    setSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSave = async () => {
    if (!generatedData) return;
    setSaving(true);
    try {
      const name = typeof (generatedData as { businessName?: string }).businessName === "string"
        ? (generatedData as { businessName: string }).businessName
        : "My Website";
      const slugVal = slug || "website";

      if (user) {
        const res = await fetch("/api/sites/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: generationPrompt,
            html: JSON.stringify(generatedData),
            slug: slugVal,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to save");
        }
      }

      const site = saveWebsite({ slug: slugVal, name, data: generatedData as Record<string, unknown> });
      router.push(`/editor/${site.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setSaving(false);
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

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")} to {t("common.dashboard")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">{t("common.createWebsite")}</h1>

          {!generatedData ? (
            <div className="space-y-8">
              <WebsiteGenerator onGenerated={handleGenerated} initialPrompt={defaultPrompt} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Label className="text-white">{t("dashboard.yourSiteUrl")}</Label>
                <div className="flex gap-2 mt-2">
                  <span className="flex items-center text-slate-400">/s/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 bg-white/5 border-white/20"
                  />
                </div>
              </div>

              <WebsitePreview
                data={generatedData as Parameters<typeof WebsitePreview>[0]["data"]}
              />

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                >
                  {saving ? t("common.loading") : `${t("common.save")} & ${t("common.edit")}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedData(null)}
                  className="border-white/20"
                >
                  {t("dashboard.generateAgain")}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default function CreateWebsitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <CreateContent />
    </Suspense>
  );
}
