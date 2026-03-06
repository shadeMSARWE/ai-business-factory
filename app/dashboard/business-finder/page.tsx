"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCredits } from "@/components/providers/credits-provider";
import { CreditsExhaustedModal } from "@/components/credits-exhausted-modal";
import {
  ArrowLeft,
  MapPin,
  Search,
  ExternalLink,
  Sparkles,
  Star,
  Loader2,
} from "lucide-react";

interface BusinessPlace {
  name: string;
  address: string;
  phone: string;
  rating: number | null;
  website: string | null;
  place_id: string;
}

export default function BusinessFinderPage() {
  const router = useRouter();
  const { billing, refetch } = useCredits();
  const [businessType, setBusinessType] = useState("restaurant");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState("");
  const [results, setResults] = useState<BusinessPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const creditsExhausted = billing?.creditsExhausted ?? false;

  const handleSearch = async () => {
    if (!businessType.trim() || !city.trim() || !country.trim()) return;
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/business-finder/search", {
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
      setShowModal(false);
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWebsite = async (business: BusinessPlace) => {
    if (creditsExhausted) {
      setShowModal(true);
      return;
    }
    setGeneratingId(business.place_id);
    try {
      const res = await fetch("/api/business-finder/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          businessType,
          city,
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
      sessionStorage.setItem("businessFinderResult", JSON.stringify({ website: data }));
      router.push("/dashboard/business-finder/result");
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
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

        <h1 className="text-3xl font-bold text-white mb-2">AI Business Finder</h1>
        <p className="text-slate-400 mb-10">
          Find businesses without websites on Google Maps and generate websites for them automatically.
        </p>

        <Card className="border-white/10 bg-white/5 max-w-2xl mb-10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
            <p className="text-slate-400 text-sm">Search costs 5 credits.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">Business Type</Label>
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
                <Label className="text-slate-400">Search Radius (optional)</Label>
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
                  Search (5 credits)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white">Businesses without websites</h2>
            {results.map((r, i) => (
              <motion.div
                key={r.place_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{r.name}</h3>
                        {r.rating != null && (
                          <p className="text-amber-400 text-sm flex items-center gap-1 mt-0.5">
                            <Star className="h-4 w-4 fill-current" />
                            {r.rating}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {r.address}
                        </div>
                        {r.phone && (
                          <p className="text-slate-400 text-sm mt-1">{r.phone}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${r.place_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="border-white/20">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Google Maps
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          onClick={() => handleGenerateWebsite(r)}
                          disabled={!!generatingId || creditsExhausted}
                        >
                          {generatingId === r.place_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-1" />
                              Generate Website (20 credits)
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {results.length === 0 && !loading && (
          <p className="text-slate-500 text-sm">
            {billing && (
              <>You have {billing.credits} credits. Search costs 5, website generation costs 20.</>
            )}
          </p>
        )}
      </main>
      <CreditsExhaustedModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
