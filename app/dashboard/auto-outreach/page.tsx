"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCredits } from "@/components/providers/credits-provider";
import { CreditsExhaustedModal } from "@/components/credits-exhausted-modal";
import { Logo } from "@/components/logo";
import {
  ArrowLeft,
  Search,
  Loader2,
  Globe,
  MessageSquare,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Zap,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface BusinessResult {
  name: string;
  address: string;
  phone: string;
  email: string | null;
  rating: number | null;
  website: string | null;
  place_id: string;
  city: string;
}

const SUGGESTIONS = [
  { id: "demo", label: "Generate demo website", icon: Globe },
  { id: "message", label: "Send outreach message", icon: MessageSquare },
  { id: "booking", label: "Add booking form", icon: Calendar },
  { id: "whatsapp", label: "Add WhatsApp button", icon: MessageCircle },
];

export default function AutoOutreachPage() {
  const { billing, refetch } = useCredits();
  const [businessType, setBusinessType] = useState("restaurant");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState("");
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [demos, setDemos] = useState<Record<string, { demoUrl: string; slug: string }>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [messageLoading, setMessageLoading] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState<Record<string, string>>({});
  const [sendMessage, setSendMessage] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const creditsExhausted = billing?.creditsExhausted ?? false;

  const handleSearch = async () => {
    if (!businessType.trim() || !city.trim() || !country.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    setResults([]);
    setDemos({});
    setMessages({});
    try {
      const res = await fetch("/api/auto-outreach/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: businessType.trim(),
          city: city.trim(),
          country: country.trim(),
          radius: radius.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "credits_exceeded") {
        setShowModal(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data.results || []);
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDemo = async (business: BusinessResult) => {
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setGeneratingId(business.place_id);
    try {
      const res = await fetch("/api/auto-outreach/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          businessType,
          city: business.city || city,
          address: business.address,
          phone: business.phone,
          placeId: business.place_id,
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "credits_exceeded") {
        setShowModal(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDemos((prev) => ({
        ...prev,
        [business.place_id]: { demoUrl: data.demo_url, slug: data.slug },
      }));
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateMessage = async (business: BusinessResult) => {
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    const demo = demos[business.place_id];
    setMessageLoading(business.place_id);
    try {
      const res = await fetch("/api/auto-outreach/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          city: business.city || city,
          demoUrl: demo?.demoUrl || "",
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "credits_exceeded") {
        setShowModal(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages((prev) => ({ ...prev, [business.place_id]: data.message || "" }));
      setSendMessage((prev) => ({ ...prev, [business.place_id]: data.message || "" }));
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setMessageLoading(null);
    }
  };

  const handleSend = async (business: BusinessResult) => {
    const email = (sendEmail[business.place_id] || business.email || "").trim();
    const message = sendMessage[business.place_id] || messages[business.place_id] || "";
    if (!email) {
      alert("Please enter an email address");
      return;
    }
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setSendingId(business.place_id);
    try {
      const res = await fetch("/api/auto-outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message,
          demoUrl: demos[business.place_id]?.demoUrl || "",
          businessName: business.name,
          city: business.city || city,
          country,
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "credits_exceeded") {
        setShowModal(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Send failed");
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to send. Check SMTP configuration.");
    } finally {
      setSendingId(null);
    }
  };

  const handleCopyLink = (slug: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${base}/s/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Auto Outreach AI</h1>
            <p className="text-slate-400">
              Find businesses, generate websites and send offers automatically.
            </p>
          </div>

          {/* Search Panel */}
          <Card className="border-white/10 bg-white/5 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search businesses
              </CardTitle>
              <p className="text-slate-400 text-sm">Search costs 5 credits.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Business type</Label>
                  <Input
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. restaurant, salon, dentist"
                    className="mt-2 bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Tel Aviv"
                    className="mt-2 bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">Country</Label>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Israel"
                    className="mt-2 bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">Radius (optional)</Label>
                  <Input
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    placeholder="e.g. 5km"
                    className="mt-2 bg-white/5 border-white/20"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !businessType.trim() || !city.trim() || !country.trim() || creditsExhausted}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search businesses (5 credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Table */}
          {results.length > 0 && (
            <Card className="border-white/10 bg-white/5 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Results</CardTitle>
                <p className="text-slate-400 text-sm">Businesses without websites</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Business</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">City</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Has website</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => (
                        <tr key={r.place_id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-medium">{r.name}</td>
                          <td className="py-3 px-4 text-slate-400">{r.city || city}</td>
                          <td className="py-3 px-4 text-slate-400">{r.website ? "Yes" : "No"}</td>
                          <td className="py-3 px-4">
                            <Input
                              placeholder="Enter email"
                              value={sendEmail[r.place_id] ?? r.email ?? ""}
                              onChange={(e) =>
                                setSendEmail((prev) => ({ ...prev, [r.place_id]: e.target.value }))
                              }
                              className="w-48 bg-white/5 border-white/20 text-white text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20"
                                onClick={() => handleGenerateDemo(r)}
                                disabled={!!generatingId || !!demos[r.place_id] || creditsExhausted}
                              >
                                {generatingId === r.place_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : demos[r.place_id] ? (
                                  "Demo ready"
                                ) : (
                                  <>
                                    <Globe className="h-4 w-4 mr-1" />
                                    Generate Demo (20)
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-violet-500/50"
                                onClick={() => handleGenerateMessage(r)}
                                disabled={!!messageLoading || creditsExhausted}
                              >
                                {messageLoading === r.place_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Generate Offer (1)
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                onClick={() => handleSend(r)}
                                disabled={!!sendingId || creditsExhausted}
                              >
                                {sendingId === r.place_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-1" />
                                    Send (1)
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo preview */}
          {Object.keys(demos).length > 0 && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Demo preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(demos).map(([placeId, { demoUrl, slug }]) => {
                  const biz = results.find((r) => r.place_id === placeId);
                  return (
                    <div
                      key={placeId}
                      className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <span className="text-white font-medium">{biz?.name || "Demo"}</span>
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:underline flex items-center gap-1"
                      >
                        {demoUrl}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20"
                        onClick={() => window.open(demoUrl, "_blank")}
                      >
                        Open demo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20"
                        onClick={() => handleCopyLink(slug)}
                      >
                        {copiedSlug === slug ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        Copy link
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Message preview */}
          {Object.keys(messages).length > 0 && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Offer messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(messages).map(([placeId, msg]) => {
                  const biz = results.find((r) => r.place_id === placeId);
                  return (
                    <div key={placeId} className="space-y-2">
                      <Label className="text-slate-400">{biz?.name}</Label>
                      <Textarea
                        value={sendMessage[placeId] ?? msg}
                        onChange={(e) =>
                          setSendMessage((prev) => ({ ...prev, [placeId]: e.target.value }))
                        }
                        rows={5}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.id}
                    className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors text-left"
                  >
                    <s.icon className="h-5 w-5 text-violet-400" />
                    <span className="text-white text-sm">{s.label}</span>
                    <Sparkles className="h-4 w-4 text-amber-400 ml-auto" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
