"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/providers/toast-provider";
import { WebsitePreview } from "@/components/website-preview";
import { LogoGenerator, generateLogoVariations } from "@/components/logo-generator";
import { downloadWebsiteFromData, type WebsiteDataForDownload } from "@/lib/download";
import { saveWebsite } from "@/lib/storage";
import type { BusinessType } from "@/lib/business-types";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Download,
  Globe,
  FileText,
  Megaphone,
  Share2,
} from "lucide-react";

interface BusinessResultData {
  website: Record<string, unknown>;
  seo: { title: string; description: string; keywords: string };
  ads: { platform: string; headline?: string; body?: string; caption?: string; cta?: string }[];
  social: { caption: string }[];
}

export default function BusinessResultPage() {
  const router = useRouter();
  const [data, setData] = useState<BusinessResultData | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const raw = sessionStorage.getItem("businessResult");
    if (!raw) {
      router.replace("/dashboard/generate-business");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace("/dashboard/generate-business");
    }
  }, [router]);

  const handlePublish = () => {
    if (!data?.website) return;
    const slug = (data.website.businessName as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "website";
    const site = saveWebsite({
      slug,
      name: (data.website.businessName as string) || "Website",
      data: data.website,
    });
    const base = typeof window !== "undefined" ? window.location.origin : "";
    window.open(`${base}/s/${site.slug}`, "_blank");
    showToast("Website published successfully.");
  };

  const handleEdit = () => {
    if (!data?.website) return;
    const slug = (data.website.businessName as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "website";
    const site = saveWebsite({
      slug,
      name: (data.website.businessName as string) || "Website",
      data: data.website,
    });
    router.push(`/editor/${site.id}`);
  };

  const handleDownload = async () => {
    if (!data?.website) return;
    setDownloadLoading(true);
    try {
      await downloadWebsiteFromData(
        data.website as unknown as WebsiteDataForDownload,
        (data.website.businessName as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "website"
      );
    } catch {
      alert("Failed to download");
    } finally {
      setDownloadLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const websiteData = data.website as unknown as Parameters<typeof WebsitePreview>[0]["data"];
  const logoVariations = generateLogoVariations(
    (data.website.businessName as string) || "Business",
    (data.website.businessType as BusinessType) || "restaurant"
  );

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500" onClick={handlePublish}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Publish website
            </Button>
            <Button variant="outline" className="border-white/20" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit website
            </Button>
            <Button variant="outline" className="border-white/20" onClick={handleDownload} disabled={downloadLoading}>
              <Download className="h-4 w-4 mr-2" />
              {downloadLoading ? "..." : "Download ZIP"}
            </Button>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Generated Website
            </h2>
            <WebsitePreview data={websiteData} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              Logo Options
            </h2>
            <LogoGenerator
              variations={logoVariations}
              selectedId={selectedLogo}
              onSelect={setSelectedLogo}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SEO Content
            </h2>
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <span className="text-slate-500 text-sm">Title</span>
                  <p className="text-white font-medium">{data.seo.title}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Meta Description</span>
                  <p className="text-slate-300">{data.seo.description}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Keywords</span>
                  <p className="text-slate-300">{data.seo.keywords}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Marketing Ads
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {data.ads.map((ad, i) => (
                <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="pb-2">
                    <span className="text-violet-400 font-medium">{ad.platform}</span>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {ad.headline && <p className="text-white font-medium">{ad.headline}</p>}
                    {ad.body && <p className="text-slate-400 text-sm">{ad.body}</p>}
                    {ad.caption && <p className="text-slate-300 text-sm whitespace-pre-wrap">{ad.caption}</p>}
                    {ad.cta && <span className="inline-block text-violet-400 text-sm">{ad.cta}</span>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media Posts
            </h2>
            <div className="space-y-3">
              {data.social.map((post, i) => (
                <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{post.caption}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
