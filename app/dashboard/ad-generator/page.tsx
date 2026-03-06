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
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from "lucide-react";

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

        <h1 className="text-3xl font-bold text-white mb-2">AI Ads Generator</h1>
        <p className="text-slate-400 mb-10">Create marketing ads for Facebook, Instagram, Google, and TikTok</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-10">
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
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Ads
          </Button>
        </div>

        {ads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {ads.map((ad) => (
              <div
                key={ad.platform}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-violet-400 font-medium">{ad.platform}</span>
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
                <h3 className="text-lg font-semibold text-white mb-2">{ad.headline}</h3>
                <p className="text-slate-400 text-sm mb-4">{ad.description}</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-sm">
                  {ad.cta}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
