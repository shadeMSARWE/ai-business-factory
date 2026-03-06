"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getWebsiteBySlug } from "@/lib/storage";
import { trackPageView } from "@/lib/analytics";
import { PublishedSite } from "@/components/published-site";
import { useLanguage } from "@/components/providers/language-provider";

export default function PublishedSitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/site/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          trackPageView(slug, "/");
          setLoading(false);
          return;
        }
      } catch {}
      const local = getWebsiteBySlug(slug);
      if (local) {
        setData(local.data as Record<string, unknown>);
        trackPageView(slug, "/");
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <p className="text-slate-400">{t("published.loading")}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <p className="text-slate-400">{slug ? t("published.notFound") : t("published.loading")}</p>
      </div>
    );
  }

  return <PublishedSite data={data} slug={slug} />;
}
