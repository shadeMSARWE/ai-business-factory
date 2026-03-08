"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { getDashboardFactories } from "@/lib/factories";
import type { FactoryConfig } from "@/lib/factories";
import { DashboardFactoryCard } from "@/components/dashboard/dashboard-factory-card";
import { AISuggestionsPanel } from "@/components/dashboard/ai-suggestions-panel";
import { GenerationHistoryPanel } from "@/components/dashboard/generation-history-panel";
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_CATEGORY_ORDER,
  getMarketplaceCategory,
  getPreviewImage,
  type MarketplaceCategoryId,
} from "@/lib/dashboard-marketplace";
import { Link2, Search, Sparkles, Globe, Palette, MapPin } from "lucide-react";

/* Group factories by marketplace category for display. */
function groupByMarketplace(
  factories: FactoryConfig[]
): Record<MarketplaceCategoryId, FactoryConfig[]> {
  const groups = MARKETPLACE_CATEGORY_ORDER.reduce(
    (acc, id) => ({ ...acc, [id]: [] as FactoryConfig[] }),
    {} as Record<MarketplaceCategoryId, FactoryConfig[]>
  );
  factories.forEach((factory) => {
    const cat = getMarketplaceCategory(factory.id);
    groups[cat].push(factory);
  });
  return groups;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const factories = getDashboardFactories();
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return factories;
    return factories.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [factories, searchQuery]);

  const grouped = useMemo(() => groupByMarketplace(filtered), [filtered]);

  return (
    <div className="min-h-screen">
      {/* Search bar */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 -mx-4 px-4 py-4 md:mx-0 md:px-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5"
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <Input
            type="search"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
          />
        </div>
      </motion.section>

      {/* Hero + Quick actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-10 pb-12 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
          {t("welcome")} {user?.email ? user.email.split("@")[0] : "Guest"}
        </h1>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <Link href="/dashboard/generate-business">
            <Button
              size="lg"
              className="h-11 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Business
            </Button>
          </Link>
          <Link href="/builder">
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
            >
              <Globe className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </Link>
          <Link href="/dashboard/logo-generator">
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
            >
              <Palette className="h-4 w-4 mr-2" />
              Generate Logo
            </Button>
          </Link>
          <Link href="/dashboard/business-finder">
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Leads
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* AI Suggestions + Generation History */}
      <section className="mb-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <AISuggestionsPanel />
          <GenerationHistoryPanel />
        </div>
      </section>

      {/* Featured tools */}
      {filtered.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
            Featured tools
          </h2>
          <p className="text-slate-400 text-sm md:text-base mb-6 max-w-2xl">
            Start with these powerful AI tools to build your business.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {filtered.slice(0, 6).map((factory, index) => (
              <DashboardFactoryCard
                key={factory.id}
                factory={factory}
                index={index}
                previewImage={getPreviewImage(factory.id)}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Popular factories */}
      {filtered.some((f) => f.popular) && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
            Popular
          </h2>
          <p className="text-slate-400 text-sm md:text-base mb-6 max-w-2xl">
            Most used tools by our community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.filter((f) => f.popular).map((factory, index) => (
              <DashboardFactoryCard
                key={factory.id}
                factory={factory}
                index={index}
                previewImage={getPreviewImage(factory.id)}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Tool categories */}
      <section className="py-8 border-t border-white/5">
        {MARKETPLACE_CATEGORY_ORDER.map((categoryId) => {
          const categoryFactories = grouped[categoryId];
          if (!categoryFactories || categoryFactories.length === 0) return null;

          const { title, description } = MARKETPLACE_CATEGORIES[categoryId];

          return (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-14"
            >
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                  {title}
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {categoryFactories.map((factory, index) => (
                  <DashboardFactoryCard
                    key={factory.id}
                    factory={factory}
                    index={index}
                    previewImage={getPreviewImage(factory.id)}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-400">No tools match your search.</p>
          </div>
        )}

        {/* Coming soon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/10 border-dashed bg-white/5 backdrop-blur-xl p-8 opacity-80"
          >
            <Link2 className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("domain.title")}
            </h3>
            <p className="text-slate-400 mb-2">{t("domain.desc")}</p>
            <span className="text-xs text-violet-400">
              {t("domain.comingSoon")}
            </span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
