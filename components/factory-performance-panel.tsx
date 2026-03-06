"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Users, Send, Zap } from "lucide-react";
import { useCredits } from "@/components/providers/credits-provider";

export function FactoryPerformancePanel() {
  const { billing } = useCredits();
  const [analytics, setAnalytics] = useState<{ summary?: Record<string, number> } | null>(null);
  const [stats, setStats] = useState<{
    leadsDiscovered?: number;
    crmLeads?: number;
    outreachSent?: number;
    conversions?: number;
    recommendations?: string[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics/events")
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .catch(() => setAnalytics(null));
  }, []);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats(null));
  }, []);

  const summary = analytics?.summary || {};
  const eventToFactory: Record<string, string> = {
    page_view: "Website",
    website: "Website",
    logo: "Logo",
    seo: "SEO",
    ads: "Ads",
    store: "Store",
    business_finder: "Business Finder",
    business_search: "Business Finder",
    demo_generated: "Auto Outreach",
    outreach_sent: "Auto Outreach",
  };
  const mostUsedKey = Object.entries(summary).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostUsedFactory = mostUsedKey ? (eventToFactory[mostUsedKey] || mostUsedKey.replace(/_/g, " ")) : "Website";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="w-64 flex-shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-violet-400" />
        Factory Performance
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Credits Used</span>
          <span className="text-amber-400 font-semibold">{billing?.creditsUsed ?? 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Credits Left</span>
          <span className="text-emerald-400 font-semibold">{billing?.credits ?? 0}</span>
        </div>

        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Leads</span>
            <span className="text-white font-medium">{stats?.leadsDiscovered ?? 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Outreach</span>
            <span className="text-white font-medium">{stats?.outreachSent ?? 0}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10">
          <span className="text-slate-400 text-sm block mb-1">Most Used</span>
          <span className="text-violet-400 font-medium">{mostUsedFactory}</span>
        </div>

        {stats?.recommendations && stats.recommendations.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <span className="text-slate-400 text-sm block mb-2 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Recommendations</span>
            <ul className="space-y-1">
              {stats.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-violet-300/90">{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
        <Link href="/dashboard/billing" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
          <Coins className="w-3.5 h-3.5" />
          Manage credits
        </Link>
        <Link href="/dashboard/leads" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          View leads
        </Link>
      </div>
    </motion.div>
  );
}
