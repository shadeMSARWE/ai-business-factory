"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { PublishButton } from "@/components/publish-button";
import { DownloadButton } from "@/components/download-button";
import { Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react";

interface Site {
  id: string;
  prompt: string | null;
  html: string;
  slug: string | null;
  created_at: string;
}

export default function WebsitesPage() {
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

  const handleDelete = async (siteId: string) => {
    if (!confirm(t("sites.deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (res.ok) setSites((prev) => prev.filter((s) => s.id !== siteId));
    } catch {
      // ignore
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">{t("my_websites")}</h1>
        <Link href="/builder">
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Plus className="h-4 w-4 mr-2" />
            {t("create_website")}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
        </div>
      ) : sites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-white/20 p-20 text-center"
        >
          <p className="text-slate-400 text-lg mb-6">{t("sites.noSites")}</p>
          <Link href="/builder">
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              {t("create_website")}
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, i) => {
            const thumb = (() => {
              try {
                const d = JSON.parse(site.html);
                return (d as { galleryImages?: string[] })?.galleryImages?.[0];
              } catch {
                return null;
              }
            })();
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 group"
              >
                <Link href={`/preview/${site.id}`} className="block aspect-video overflow-hidden">
                  <div
                    className="h-full w-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 group-hover:scale-105 transition-transform duration-500"
                    style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: "cover" } : {}}
                  />
                </Link>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{getSiteName(site.html)}</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    {new Date(site.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 mb-4">{baseUrl}/s/{getSlug(site)}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/preview/${site.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-1" />
                        {t("common.preview")}
                      </Button>
                    </Link>
                    <Link href={`/editor/${site.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20">
                        <Pencil className="h-4 w-4 mr-1" />
                        {t("common.edit")}
                      </Button>
                    </Link>
                    <PublishButton slug={getSlug(site)} variant="outline" size="sm" className="border-white/20" />
                    <DownloadButton slug={getSlug(site)} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
