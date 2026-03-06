"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCredits } from "@/components/providers/credits-provider";
import { CreditsExhaustedModal } from "@/components/credits-exhausted-modal";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const APP_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "gym", label: "Gym" },
  { value: "salon", label: "Salon" },
  { value: "education", label: "Education" },
  { value: "content_app", label: "Content App" },
];

export default function NewAppPage() {
  const router = useRouter();
  const { billing, refetch } = useCredits();
  const [name, setName] = useState("");
  const [type, setType] = useState("restaurant");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const creditsExhausted = billing?.creditsExhausted ?? false;

  const handleGenerate = async () => {
    if (!name.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/apps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "credits_exceeded") {
        setShowModal(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      refetch();
      router.push(`/dashboard/apps/${data.app.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        <Link href="/dashboard/apps" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Apps
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Create Mobile App</h1>
        <p className="text-slate-400 mb-10">Generate a React Native + Expo app with AI. Costs 25 credits.</p>

        <Card className="border-white/10 bg-white/5 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              App details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">App name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Restaurant App"
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-slate-400">App type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                {APP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-400">Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A food ordering app for restaurants"
                rows={3}
                className="mt-2 bg-white/5 border-white/20"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !name.trim() || creditsExhausted}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <><Sparkles className="h-4 w-4 mr-2" />Generate App (25 credits)</>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
