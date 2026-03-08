"use client";

import { useState } from "react";
import Link from "next/link";
import { useCredits } from "@/components/providers/credits-provider";
import { useCreditsAction } from "@/hooks/use-credits-action";
import { CreditsExhaustedModal } from "@/components/credits-exhausted-modal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, Megaphone } from "lucide-react";
import { Suggestions } from "@/components/factories/Suggestions";
import { PreviewGallery } from "@/components/factories/PreviewGallery";
import { FactorySkeleton } from "@/components/factories/FactorySkeleton";
import { ResultToolbar } from "@/components/factories/ResultToolbar";
import { getSuggestionsForFactory } from "@/lib/factories";
import { getPreviewImage } from "@/lib/dashboard-marketplace";

const PLATFORMS = ["Facebook", "Instagram", "Google Ads", "TikTok"];

function generateAds(
  name: string,
  type: string,
  city: string,
  audience: string
): { platform: string; headline: string; description: string; cta: string }[] {
  const typeLabel = type || "business";
  return [
    {
      platform: "Facebook",
      headline: `Best ${typeLabel} in ${city} | ${name}`,
      description: `Discover why locals love ${name}. ${audience ? `Perfect for ${audience}. ` : ""}Quality service, great results. Visit us in ${city}!`,
      cta: "Learn More",
    },
    {
      platform: "Instagram",
      headline: `${name} — ${city}'s Favorite ${typeLabel}`,
      description: `✨ ${audience ? `Ideal for ${audience}. ` : ""}Fresh, authentic, unforgettable. 📍 ${city}`,
      cta: "Visit Us",
    },
    {
      platform: "Google Ads",
      headline: `Top ${typeLabel} in ${city} | ${name}`,
      description: `Book your appointment at ${name} today. ${audience ? `Serving ${audience} in ${city}. ` : ""}Highly rated.`,
      cta: "Get Started",
    },
    {
      platform: "TikTok",
      headline: `${name} in ${city} 🔥`,
      description: `${audience ? `${audience} approved! ` : ""}The best ${typeLabel} experience. Don't miss out!`,
      cta: "Order Now",
    },
  ];
}

export default function AdGeneratorPage() {
  const { billing, refetch } = useCredits();
  const { deductAndRun, showModal, setShowModal } = useCreditsAction("ads");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [audience, setAudience] = useState("");
  const [ads, setAds] = useState<ReturnType<typeof generateAds>>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const creditsExhausted = billing?.creditsExhausted ?? false;

  const handleGenerate = () => {
    if (!name.trim() || !type.trim() || !city.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    deductAndRun(async () => {
      setLoading(true);
      setTimeout(() => {
        setAds(generateAds(name.trim(), type.trim(), city.trim(), audience.trim()));
        setLoading(false);
        refetch();
      }, 800);
    });
  };

  const copyAd = (ad: { platform: string; headline: string; description: string; cta: string }) => {
    const text = `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(ad.platform);
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

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-violet-400" />
          AI Ads Generator
        </h1>
        <p className="text-slate-400 mb-8">Create marketing ads for Facebook, Instagram, Google, and TikTok. Use suggestions or fill the form.</p>

        <PreviewGallery
          images={[
            { src: getPreviewImage("ads"), alt: "Ads" },
            { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80", alt: "Campaign" },
            { src: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80", alt: "Marketing" },
            { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80", alt: "Creative" },
            { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80", alt: "Social" },
            { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80", alt: "Strategy" },
          ]}
          columns={3}
          className="mb-8"
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <Suggestions items={getSuggestionsForFactory("ads")} onSelect={(p) => setType(p)} loading={loading} className="mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
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
            <div>
              <Label className="text-slate-400">Target audience</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Families and students"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !name.trim() || !type.trim() || !city.trim() || creditsExhausted}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Ads
          </Button>
        </div>

        {loading && <FactorySkeleton lines={4} className="mb-8" />}

        {!loading && ads.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
          >
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Ad previews
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Copy individual ads or use the toolbar to copy all, download, regenerate, or save to history.
            </p>
            <ResultToolbar
              factoryId="ads"
              factoryName="AI Ads Generator"
              prompt={`${name} | ${type} | ${city}`}
              resultData={ads}
              resultPreview={ads[0]?.headline?.slice(0, 60) ?? ""}
              onRegenerate={handleGenerate}
              className="mb-6"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <motion.div
                  key={ad.platform}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 hover:border-violet-500/30 hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-violet-400 font-medium capitalize">{ad.platform}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAd(ad)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copied === ad.platform ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Headline</h3>
                      <p className="text-lg font-semibold text-white">{ad.headline}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Primary text</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{ad.description}</p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 text-sm font-medium border border-violet-500/20">
                        CTA: {ad.cta}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
