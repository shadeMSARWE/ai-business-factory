"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { getLeads } from "@/lib/leads";
import { ArrowLeft, Mail, Search } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState(getLeads());
  const [search, setSearch] = useState("");
  const [filterSlug, setFilterSlug] = useState<string>("all");

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  const slugs = useMemo(() => {
    const s = new Set(leads.map((l) => l.slug));
    return Array.from(s).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    let list = leads;
    if (filterSlug !== "all") list = list.filter((l) => l.slug === filterSlug);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [leads, filterSlug, search]);

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

        <h1 className="text-3xl font-bold text-white mb-2">Collected Leads</h1>
        <p className="text-slate-400 mb-10">
          Leads from contact form submissions on your published websites
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <select
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="all">All websites</option>
            {slugs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/20 p-20 text-center"
          >
            <Mail className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No leads yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Leads will appear when visitors submit your contact form.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                    <p className="text-violet-400 text-sm">{lead.email}</p>
                    <p className="text-slate-400 mt-2">{lead.message}</p>
                    <span className="inline-block mt-2 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                      {lead.slug || "—"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm whitespace-nowrap">
                    {new Date(lead.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
