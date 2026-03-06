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
import { ArrowLeft, Sparkles, Download, Check, Loader2 } from "lucide-react";

const BUSINESS_TYPES = [
  "Restaurant",
  "Salon",
  "Dentist",
  "Gym",
  "Law Firm",
  "Real Estate",
  "Cafe",
  "Construction",
  "Car Wash",
  "Beauty",
  "Spa",
  "Other",
];

const COLOR_THEMES: Record<string, { primary: string; secondary: string; bg: string }> = {
  Restaurant: { primary: "#ef4444", secondary: "#f97316", bg: "linear-gradient(135deg, #fef2f2, #fff7ed)" },
  Salon: { primary: "#ec4899", secondary: "#8b5cf6", bg: "linear-gradient(135deg, #fdf2f8, #faf5ff)" },
  Dentist: { primary: "#0ea5e9", secondary: "#ffffff", bg: "linear-gradient(135deg, #ecfeff, #f0f9ff)" },
  Gym: { primary: "#1f2937", secondary: "#22c55e", bg: "linear-gradient(135deg, #f3f4f6, #dcfce7)" },
  "Law Firm": { primary: "#1e3a5f", secondary: "#0f172a", bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)" },
  "Real Estate": { primary: "#1e293b", secondary: "#64748b", bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)" },
  Cafe: { primary: "#78350f", secondary: "#a16207", bg: "linear-gradient(135deg, #fefce8, #fef3c7)" },
  Construction: { primary: "#0f766e", secondary: "#14b8a6", bg: "linear-gradient(135deg, #f0fdfa, #ccfbf1)" },
  "Car Wash": { primary: "#3b82f6", secondary: "#06b6d4", bg: "linear-gradient(135deg, #eff6ff, #ecfeff)" },
  Beauty: { primary: "#ec4899", secondary: "#f472b6", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)" },
  Spa: { primary: "#059669", secondary: "#10b981", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)" },
  Other: { primary: "#8b5cf6", secondary: "#d946ef", bg: "linear-gradient(135deg, #faf5ff, #fdf4ff)" },
};

const ICONS: Record<string, string> = {
  Restaurant: "🍕",
  Salon: "✂️",
  Dentist: "🦷",
  Gym: "💪",
  "Law Firm": "⚖️",
  "Real Estate": "🏠",
  Cafe: "☕",
  Construction: "🏗️",
  "Car Wash": "🚗",
  Beauty: "💄",
  Spa: "🧖",
  Other: "✨",
};

function generateLogos(
  name: string,
  type: string,
  colorPref?: string
): { id: string; icon: string; text: string; primary: string; secondary: string; bg: string }[] {
  const theme = COLOR_THEMES[type] || COLOR_THEMES.Other;
  const icon = ICONS[type] || ICONS.Other;
  const shortName = name.split(" ")[0] || name.slice(0, 12) || "Logo";

  const variants = [
    { ...theme },
    { ...theme, primary: theme.secondary, secondary: theme.primary },
    { ...theme, primary: "#1e293b", secondary: theme.primary },
    { ...theme, primary: theme.primary, secondary: "#64748b" },
  ];

  return variants.map((v, i) => ({
    id: `logo-${i}`,
    icon,
    text: shortName,
    primary: v.primary,
    secondary: v.secondary,
    bg: v.bg,
  }));
}

function LogoPreview({ logo }: { logo: { icon: string; text: string; primary: string; secondary: string; bg: string } }) {
  return (
    <div
      className="aspect-square flex flex-col items-center justify-center p-8 rounded-2xl"
      style={{
        background: logo.bg,
        minWidth: 200,
        minHeight: 200,
      }}
    >
      <span className="text-5xl mb-3">{logo.icon}</span>
      <span
        className="font-bold text-2xl truncate max-w-full text-center"
        style={{ color: logo.primary }}
      >
        {logo.text}
      </span>
    </div>
  );
}

export default function LogoGeneratorPage() {
  const { billing, refetch } = useCredits();
  const { deductAndRun, showModal, setShowModal } = useCreditsAction("logo");
  const [name, setName] = useState("");
  const [type, setType] = useState("Restaurant");
  const [colorPref, setColorPref] = useState("");
  const [logos, setLogos] = useState<ReturnType<typeof generateLogos>>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const creditsExhausted = billing?.creditsExhausted ?? false;

  const handleGenerate = () => {
    if (!name.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    deductAndRun(async () => {
      setLoading(true);
      setTimeout(() => {
        setLogos(generateLogos(name.trim(), type, colorPref));
        setSelectedId("logo-0");
        setLoading(false);
        refetch();
      }, 600);
    });
  };

  const handleDownload = (index: number) => {
    const logo = logos[index];
    if (!logo) return;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="bg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${logo.primary};stop-opacity:0.2"/>
          <stop offset="100%" style="stop-color:${logo.secondary};stop-opacity:0.2"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg${index})"/>
      <text x="200" y="160" font-size="80" text-anchor="middle" font-family="system-ui">${logo.icon}</text>
      <text x="200" y="280" font-size="36" font-weight="bold" fill="${logo.primary}" text-anchor="middle" font-family="system-ui">${logo.text}</text>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${logo.text}-logo-${index + 1}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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

        <h1 className="text-3xl font-bold text-white mb-2">AI Logo Generator</h1>
        <p className="text-slate-400 mb-10">Create professional logos for your business</p>

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
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-slate-400">Color preference (optional)</Label>
              <Input
                value={colorPref}
                onChange={(e) => setColorPref(e.target.value)}
                placeholder="e.g. blue and gold"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !name.trim() || creditsExhausted}
            className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Logos
          </Button>
        </div>

        {logos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-xl font-bold text-white">Logo Variations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {logos.map((logo, i) => (
                <div key={logo.id} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedId(logo.id)}
                    className={`w-full rounded-2xl border-2 overflow-hidden transition-all ${
                      selectedId === logo.id
                        ? "border-violet-500 ring-2 ring-violet-500/30"
                        : "border-white/10 hover:border-violet-500/50"
                    }`}
                  >
                    <LogoPreview logo={logo} />
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/20"
                    onClick={() => handleDownload(i)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/dashboard/create?business=${encodeURIComponent(name)}`}>
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Check className="h-4 w-4 mr-2" />
                  Use logo for website
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
