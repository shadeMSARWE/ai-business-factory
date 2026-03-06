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
import type { GeneratedWebsite } from "@/components/website-generator";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  const mode = searchParams.get("mode");
  const business = searchParams.get("business");
  const [generatedData, setGeneratedData] = useState<GeneratedWebsite | Record<string, unknown> | null>(null);
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const defaultPrompt = business
    ? `Create a website for ${business}`
    : template
    ? `Create a website for a ${template.replace(/_/g, " ")}`
    : mode === "business"
    ? "Create a complete business with website, logo, and marketing"
    : "";

  const handleGenerated = (data: GeneratedWebsite) => {
    setGeneratedData(data);
    const name = (data.businessName as string) || "website";
    setSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSave = () => {
    if (!generatedData) return;
    setSaving(true);
    try {
      const site = saveWebsite({
        slug: slug || "website",
        name: (typeof (generatedData as { businessName?: string }).businessName === "string" ? (generatedData as { businessName: string }).businessName : "My Website"),
        data: generatedData as Record<string, unknown>,
      });
      router.push(`/editor/${site.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save");
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
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">
            Create Website
          </h1>

          {!generatedData ? (
            <div className="space-y-8">
              <WebsiteGenerator onGenerated={handleGenerated} initialPrompt={defaultPrompt} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Label className="text-white">Your site URL</Label>
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
                  {saving ? "Saving..." : "Save & Edit"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedData(null)}
                  className="border-white/20"
                >
                  Generate Again
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
