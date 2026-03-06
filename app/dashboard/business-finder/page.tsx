"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Search, ExternalLink, Sparkles } from "lucide-react";

interface BusinessResult {
  name: string;
  city: string;
  location: string;
  phone: string;
  mapsUrl: string;
}

export default function BusinessFinderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"mock" | "google" | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSource(null);
    try {
      const res = await fetch(`/api/search-businesses?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setSource(data.source || "mock");
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
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Business Finder</h1>
        <p className="text-slate-400 mb-10">
          Find businesses without websites. Generate a website for them and offer your services.
        </p>

        <Card className="border-white/10 bg-white/5 max-w-2xl mb-10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Restaurants in Haifa without website"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
            <p className="text-slate-500 text-sm">
              Example: &quot;Restaurants in Haifa without website&quot;, &quot;Dentists in Tel Aviv&quot;
            </p>
          </CardContent>
        </Card>

        {source && (
          <p className="text-slate-500 text-sm mb-6">
            {source === "google" ? "Results from Google Places API." : "Using mock data. Add GOOGLE_MAPS_API_KEY to .env.local for real results."}
          </p>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white">Results</h2>
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{r.name}</h3>
                        <p className="text-violet-400 text-sm">{r.city}</p>
                        <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {r.location}
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{r.phone}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={r.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button variant="outline" size="sm" className="border-white/20">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Google Maps
                          </Button>
                        </a>
                        <Link href={`/dashboard/create?business=${encodeURIComponent(r.name)}`}>
                          <Button size="sm" className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                            <Sparkles className="h-4 w-4 mr-1" />
                            Generate Website for them
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
