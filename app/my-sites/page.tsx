"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ArrowLeft, Eye, FileText, Loader2, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Site {
  id: string;
  prompt: string | null;
  html: string;
  slug: string | null;
  created_at: string;
}

export default function MySitesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/sites");
        const data = await res.json();
        setSites(data.sites || []);
      } catch {
        setSites([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const getSiteName = (html: string) => {
    try {
      const data = JSON.parse(html);
      return data.businessName || data.heroTitle || "Untitled";
    } catch {
      return "Untitled";
    }
  };

  const getSlug = (site: Site) => {
    if (site.slug) return site.slug;
    try {
      const data = JSON.parse(site.html);
      const name = data.businessName || data.heroTitle || "website";
      return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    } catch {
      return "website";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <Logo showSubtitle />
        <p className="text-slate-400 mt-8">{t("sites.pleaseLogin")}</p>
        <Link href="/login" className="mt-6">
          <Button>{t("common.login")}</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async (siteId: string) => {
    if (!confirm(t("sites.deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (res.ok) setSites((prev) => prev.filter((s) => s.id !== siteId));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
          <Link href="/dashboard/create">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">{t("create_website")}</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")} to {t("common.dashboard")}
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">{t("my_websites")}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
          </div>
        ) : sites.length === 0 ? (
          <Card className="border-white/10 bg-white/5 max-w-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-6">{t("sites.noSites")}</p>
              <Link href="/dashboard/create">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">{t("create_website")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site, i) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white text-lg mb-2 truncate">{getSiteName(site.html)}</h3>
                    {site.prompt && (
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{site.prompt}</p>
                    )}
                    <p className="text-slate-500 text-xs mb-4">
                      {new Date(site.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/s/${getSlug(site)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="border-white/20">
                          <Eye className="h-4 w-4 mr-1" />
                          {t("sites.view")}
                        </Button>
                      </a>
                      <Link href={`/editor/${site.id}`}>
                        <Button size="sm" variant="ghost" className="text-violet-400">
                          <Pencil className="h-4 w-4 mr-1" />
                          {t("sites.edit")}
                        </Button>
                      </Link>
                      <a
                        href={`/s/${getSlug(site)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="ghost" className="text-emerald-400">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t("sites.publish")}
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(site.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("sites.delete")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
