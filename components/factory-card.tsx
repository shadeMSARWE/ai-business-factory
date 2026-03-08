"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  ExternalLink,
  Eye,
  Send,
  Box,
  Image,
  Share2,
  Smartphone,
  BookOpen,
  FileText,
  Calendar,
  Rocket,
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
  websiteTemplates: Layout,
  storeBuilder: Store,
  appBuilder: Smartphone,
  brandKit: Palette,
  socialContent: Share2,
  landingPageAI: Layout,
  saasBuilder: Box,
  videoFactory: Video,
  automationFactory: Zap,
  marketingStrategy: Megaphone,
  productGenerator: Store,
  courseCreator: BookOpen,
  copywritingFactory: FileText,
  startupValidator: Search,
  contentCalendar: Calendar,
  businessPlan: FileText,
  brandingStudio: Palette,
  funnelBuilder: Layout,
  businessGenerator: Rocket,
};

const STATUS_CONFIG: Record<FactoryStatus, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  generating: { label: "Generating", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  new: { label: "New", className: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
};

interface FactoryCardProps {
  factory: FactoryConfig;
  index: number;
  isConnected?: boolean;
}

export function FactoryCard({ factory, index, isConnected = true }: FactoryCardProps) {
  const Icon = ICONS[factory.id] || Zap;
  const statusConfig = STATUS_CONFIG[factory.status];
  const canOpen = factory.available && factory.path !== "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative group"
      whileHover={{ y: -4 }}
    >
      {/* Connector line (optional glow) */}
      {isConnected && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <div
        className={`
          relative overflow-hidden rounded-2xl border backdrop-blur-xl
          bg-white/[0.03] border-white/10
          transition-all duration-300
          hover:border-violet-500/40 hover:bg-white/[0.06]
          hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
          ${!canOpen ? "opacity-75" : ""}
        `}
      >
        {/* Glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-6 h-6 text-violet-400" />
            </motion.div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">{factory.name}</h3>
          <p className="text-slate-400 text-sm mb-6 line-clamp-2">{factory.description}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {canOpen ? (
              <>
                <Link href={factory.path}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Open Factory
                  </Button>
                </Link>
                <Link href={factory.path}>
                  <Button size="sm" variant="outline" className="border-white/20 text-slate-300 hover:bg-white/10">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Generate
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Examples
                </Button>
              </>
            ) : (
              <span className="text-xs text-slate-500 py-2">Coming soon</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
