"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { Users, Mail, MousePointer, TrendingUp, Loader2 } from "lucide-react";

interface Site {
  id: string;
  slug: string | null;
  html: string;
}

interface AnalyticsEvent {
  event_type: string;
  slug: string | null;
  created_at: string;
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [sites, setSites] = useState<Site[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sitesRes, eventsRes] = await Promise.all([
          fetch("/api/sites"),
          fetch("/api/analytics/events"),
        ]);
        const sitesData = await sitesRes.json();
        const eventsData = await eventsRes.json();
        setSites(sitesData.sites || []);
        setEvents(eventsData.events || []);
        setSummary(eventsData.summary || {});
      } catch {
        setSites([]);
        setEvents([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visitors = summary.page_view || summary.visit || 0;
  const leads = summary.lead || summary.form_submit || 0;
  const conversionRate = visitors > 0 ? ((leads / visitors) * 100).toFixed(1) : "0";

  const stats = [
    { labelKey: "analyticsLabels.visitors", value: String(visitors), icon: Users, color: "from-violet-500 to-fuchsia-500" },
    { labelKey: "analyticsLabels.leads", value: String(leads), icon: Mail, color: "from-fuchsia-500 to-pink-500" },
    { labelKey: "analyticsLabels.formSubmissions", value: String(leads), icon: MousePointer, color: "from-blue-500 to-cyan-500" },
    { labelKey: "analyticsLabels.conversionRate", value: `${conversionRate}%`, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ];

  const getSiteName = (html: string) => {
    try {
      const d = JSON.parse(html);
      return d.businessName || d.heroTitle || "Untitled";
    } catch {
      return "Untitled";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">{t("analytics")}</h1>
      <p className="text-slate-400 mb-10">Track traffic, visitors, and leads</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
        {sites.length > 0 && (
          <div className="mb-10">
            <label className="text-sm text-slate-400 mb-2 block">Sites: {sites.length}</label>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/30 transition-colors"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mt-8"
        >
            <h2 className="text-lg font-semibold text-white mb-6">{t("analyticsLabels.recentEvents")}</h2>
          <div className="space-y-3">
            {events.length > 0 ? (
              events.slice(0, 20).map((e, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-300">{e.event_type}</span>
                  <span className="text-slate-500 text-sm">{e.slug || "—"}</span>
                  <span className="text-violet-400 text-xs">{new Date(e.created_at).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No events yet. Track events by calling /api/analytics/track when visitors view your site.</p>
            )}
          </div>
        </motion.div>

        <p className="text-slate-500 text-sm mt-8">
          Analytics are tracked when visitors load your published site. Data is stored in the database.
        </p>
        </>
      )}
    </div>
  );
}
