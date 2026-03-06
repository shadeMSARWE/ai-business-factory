"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { getWebsites } from "@/lib/storage";
import { getLeads } from "@/lib/leads";
import {
  getPageViewsBySlug,
  getDailyTraffic,
  getTopPages,
} from "@/lib/analytics";
import { ArrowLeft, Users, Mail, MousePointer, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [websites, setWebsites] = useState(getWebsites());
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  useEffect(() => {
    const w = getWebsites();
    setWebsites(w);
    if (w[0] && !selectedSite) setSelectedSite(w[0].slug);
  }, [selectedSite]);

  const site = websites.find((w) => w.slug === selectedSite) || websites[0];
  const slug = site?.slug || "";

  const pageViews = slug ? getPageViewsBySlug(slug) : [];
  const leads = getLeads().filter((l) => l.slug === slug);
  const visitors = pageViews.length;
  const conversionRate = visitors > 0 ? ((leads.length / visitors) * 100).toFixed(1) : "0";

  const dailyTraffic = slug ? getDailyTraffic(slug) : [];
  const topPages = slug ? getTopPages(slug) : [];
  const maxDaily = Math.max(...dailyTraffic.map((d) => d.value), 1);

  const stats = [
    { label: "Visitors", value: String(visitors), icon: Users, color: "from-violet-500 to-fuchsia-500" },
    { label: "Leads", value: String(leads.length), icon: Mail, color: "from-fuchsia-500 to-pink-500" },
    { label: "Form Submissions", value: String(leads.length), icon: MousePointer, color: "from-blue-500 to-cyan-500" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ];

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

        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400 mb-10">Track traffic, visitors, and leads</p>

        {websites.length > 0 && (
          <div className="mb-10">
            <label className="text-sm text-slate-400 mb-2 block">Select Website</label>
            <select
              value={selectedSite || ""}
              onChange={(e) => setSelectedSite(e.target.value || null)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-violet-500/50"
            >
              {websites.map((w) => (
                <option key={w.id} value={w.slug}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/30 transition-colors"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Daily Traffic</h2>
            <div className="flex items-end justify-between h-40 gap-2">
              {dailyTraffic.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-violet-500/60 to-fuchsia-500/60 min-h-[4px] transition-all duration-500"
                    style={{ height: `${Math.max(8, (d.value / maxDaily) * 100)}%` }}
                  />
                  <span className="text-xs text-slate-500 mt-2">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Top Pages</h2>
            <div className="space-y-4">
              {topPages.length > 0 ? (
                topPages.map((p) => (
                  <div key={p.page} className="flex justify-between items-center">
                    <span className="text-slate-300">{p.page}</span>
                    <span className="text-violet-400 font-medium">{p.views} views</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No page views yet</p>
              )}
            </div>
          </motion.div>
        </div>

        <p className="text-slate-500 text-sm mt-8">
          Analytics are tracked when visitors load your published site. Data is stored locally.
        </p>
      </main>
    </div>
  );
}
