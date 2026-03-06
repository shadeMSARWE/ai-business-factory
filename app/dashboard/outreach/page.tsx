"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, MessageSquare, Clock, XCircle, Loader2, Mail } from "lucide-react";

interface OutreachJob {
  id: string;
  business_name: string;
  city: string | null;
  email: string | null;
  status: string;
  generated_demo_url: string | null;
  sent_at: string | null;
  replied_at: string | null;
  created_at: string;
}

export default function OutreachPage() {
  const [jobs, setJobs] = useState<OutreachJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/auto-outreach/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const stats = {
    sent: jobs.filter((j) => j.status === "sent").length,
    replied: jobs.filter((j) => j.replied_at).length,
    pending: jobs.filter((j) => j.status === "pending" || j.status === "queued").length,
    failed: jobs.filter((j) => j.status === "failed").length,
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

        <h1 className="text-3xl font-bold text-white mb-2">Outreach Campaigns</h1>
        <p className="text-slate-400 mb-10">View outreach status and replies.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">{stats.sent}</span>
              </div>
              <p className="text-slate-400 text-sm">Sent</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">{stats.replied}</span>
              </div>
              <p className="text-slate-400 text-sm">Replies</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                <span className="text-2xl font-bold text-white">{stats.pending}</span>
              </div>
              <p className="text-slate-400 text-sm">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-2xl font-bold text-white">{stats.failed}</span>
              </div>
              <p className="text-slate-400 text-sm">Failed</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "sent", "pending", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${filter === f ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-slate-400 hover:text-white"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="py-20 text-center">
              <Mail className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No outreach yet.</p>
              <Link href="/dashboard/auto-outreach" className="text-violet-400 hover:underline mt-2 inline-block">
                Start sending outreach
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <Card key={job.id} className="border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{job.business_name}</h3>
                      <p className="text-slate-400 text-sm">{job.email || job.city || "—"}</p>
                      {job.generated_demo_url && (
                        <a href={job.generated_demo_url} target="_blank" rel="noopener noreferrer" className="text-violet-400 text-sm hover:underline">
                          View demo
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${job.status === "sent" ? "bg-emerald-500/20 text-emerald-400" : job.status === "failed" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                        {job.status}
                      </span>
                      {job.replied_at && <span className="text-xs text-emerald-400">Replied</span>}
                      <span className="text-slate-500 text-sm">
                        {job.sent_at ? new Date(job.sent_at).toLocaleDateString() : new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
