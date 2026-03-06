"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getWebsiteBySlug } from "@/lib/storage";
import { trackPageView } from "@/lib/analytics";
import { PublishedSite } from "@/components/published-site";

export default function PublishedSitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const site = getWebsiteBySlug(slug);
    if (site) {
      setData(site.data as Record<string, unknown>);
      trackPageView(slug, "/");
    }
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <p className="text-slate-400">{slug ? "Website not found" : "Loading..."}</p>
      </div>
    );
  }

  return <PublishedSite data={data} slug={slug} />;
}
