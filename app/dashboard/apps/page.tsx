"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Plus, Loader2 } from "lucide-react";

interface App {
  id: string;
  name: string;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then((d) => setApps(d.apps || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mobile App Builder</h1>
            <p className="text-slate-400">Generate Android & iOS apps with AI.</p>
          </div>
          <Link href="/dashboard/apps/new">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <Plus className="h-4 w-4 mr-2" />
              Create App
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : apps.length === 0 ? (
          <Card className="border-white/10 bg-white/5 border-dashed">
            <CardContent className="py-20 text-center">
              <Smartphone className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No apps yet.</p>
              <p className="text-slate-500 text-sm mt-2">Create your first mobile app with AI.</p>
              <Link href="/dashboard/apps/new">
                <Button className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Create App
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <Link key={app.id} href={`/dashboard/apps/${app.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{app.name}</h3>
                      <p className="text-slate-400 text-sm capitalize">{app.type.replace("_", " ")}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2">{app.description || "No description"}</p>
                  <span className="inline-block mt-3 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                    {app.status}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
