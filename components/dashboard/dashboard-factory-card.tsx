"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import {
  Globe,
  Palette,
  Search,
  Megaphone,
  MapPin,
  Layout,
  Store,
  Sparkles,
  Video,
  Zap,
  Send,
  Box,
  Image as ImageIcon,
  ArrowRight,
  Share2,
  Smartphone,
  Clock,
  Star,
} from "lucide-react";

import type { FactoryConfig, FactoryStatus } from "@/lib/factories";
import { getDifficulty, getEstimatedTime, type DifficultyLevel } from "@/lib/dashboard-marketplace";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  businessFinder: MapPin,
  autoOutreach: Send,
  website: Globe,
  logo: Palette,
  seo: Search,
  ads: Megaphone,
  landingPage: Layout,
  mobileApps: Sparkles,
  store: Store,
  universalBuilder: Box,
  imageGenerator: ImageIcon,
  viralVideoIdeas: Video,
  websiteTemplates: Layout,
  storeBuilder: Store,
  appBuilder: Smartphone,
  brandKit: Palette,
  socialContent: Share2,
  landingPageAI: Layout,
};

const STATUS_CONFIG: Record<FactoryStatus, { label: string; className: string }> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  generating: {
    label: "Generating",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  new: {
    label: "New",
    className: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
};

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { label: "Advanced", className: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

interface DashboardFactoryCardProps {
  factory: FactoryConfig;
  index?: number;
  /** Optional preview image URL (e.g. from dashboard-marketplace). */
  previewImage?: string;
}

export function DashboardFactoryCard({
  factory,
  index = 0,
  previewImage,
}: DashboardFactoryCardProps) {
  const { t } = useTranslation();

  const Icon = ICONS[factory.id] || Zap;
  const statusConfig = STATUS_CONFIG[factory.status];
  const difficulty = getDifficulty(factory.id);
  const estimatedSec = getEstimatedTime(factory.id);
  const difficultyConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  return (
    <Link href={factory.path}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="group relative h-full flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-500/10"
        style={{
          boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.05)",
        }}
      >
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Preview image */}
        {previewImage && (
          <div className="relative h-36 w-full overflow-hidden bg-white/5">
            <Image
              src={previewImage}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
              {factory.popular && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm bg-violet-500/20 text-violet-300 border-violet-500/30 flex items-center gap-1">
                  <Star className="h-3 w-3" /> Popular
                </span>
              )}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {!previewImage && (
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-violet-400" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>
          )}

          {previewImage && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white truncate">
                {factory.name}
              </h3>
            </div>
          )}

          {!previewImage && (
            <h3 className="text-xl font-semibold text-white mb-2">
              {factory.name}
            </h3>
          )}

          <p className="text-slate-400 text-sm flex-1 line-clamp-2 mb-3">
            {factory.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!previewImage && factory.popular && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-violet-500/20 text-violet-300 border-violet-500/30 flex items-center gap-1">
                <Star className="h-3 w-3" /> Popular
              </span>
            )}
            {difficultyConfig && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyConfig.className}`}>
                {difficultyConfig.label}
              </span>
            )}
            {estimatedSec != null && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~{estimatedSec}s
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
            {t("tools.openTool")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
