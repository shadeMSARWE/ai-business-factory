"use client";

import Link from "next/link";
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
  Image,
} from "lucide-react";

import type { FactoryConfig, FactoryStatus } from "@/lib/factories";

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
  imageGenerator: Image,
  viralVideoIdeas: Video,
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

interface DashboardFactoryCardProps {
  factory: FactoryConfig;
  index?: number;
}

export function DashboardFactoryCard({
  factory,
  index = 0,
}: DashboardFactoryCardProps) {
  const { t } = useTranslation();

  const Icon = ICONS[factory.id] || Zap;
  const statusConfig = STATUS_CONFIG[factory.status];

  return (
    <Link href={factory.path}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.02 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/30 transition-colors h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <Icon className="h-6 w-6 text-violet-400" />
          </div>

          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          {factory.name}
        </h3>

        <p className="text-slate-400 flex-1">{factory.description}</p>

        <span className="mt-4 inline-flex items-center text-sm text-violet-400 hover:text-violet-300">
          {t("tools.openTool")}
        </span>
      </motion.div>
    </Link>
  );
}