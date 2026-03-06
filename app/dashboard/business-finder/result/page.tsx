"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { WebsitePreview } from "@/components/website-preview";
import { downloadWebsiteFromData, type WebsiteDataForDownload } from "@/lib/download";
import { saveWebsite } from "@/lib/storage";
import {
  ArrowLeft,
  Download,
  Globe,
  MessageSquare,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export default function BusinessFinderResultPage() {
  const router = useRouter();
  const [websiteData, setWebsiteData] = useState<Record<string, unknown> | null>(null);
  const [offerMessage, setOfferMessage] = useState("");
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("businessFinderResult");
    if (!raw) {
      router.replace("/dashboard/business-finder");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setWebsiteData(parsed.website || null);
    } catch {
      router.replace("/dashboard/business-finder");
    }
  }, [router]);

  const handleDownload = async () => {
    if (!websiteData) return;
    setDownloadLoading(true);
    try {
      await downloadWebsiteFromData(
        websiteData as unknown as WebsiteDataForDownload,
        (websiteData.businessName as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "website"
      );
    } catch {
      alert("Failed to download");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePublish = () => {
    if (!websiteData) return;
    const name = (websiteData.businessName as string) || "Website";
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const site = saveWebsite({ slug, name, data: websiteData });
    const base = typeof window !== "undefined" ? window.location.origin : "";
    window.open(`${base}/s/${site.slug}`, "_blank");
  };

  const handleGenerateOffer = async () => {
    if (!websiteData) return;
    setLoadingOffer(true);
    try {
      const slug = (websiteData.businessName as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "website";
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const previewUrl = `${base}/s/${slug}`;

      const res = await fetch("/api/business-finder/generate-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: websiteData.businessName,
          previewUrl,
        }),
      });
      const data = await res.json();
      setOfferMessage(data.message || "");
    } catch {
      setOfferMessage(
        `Hello! I've created a professional website prototype for ${websiteData.businessName}. You can view it here. I'd love to discuss how we can help you establish a stronger online presence.`
      );
    } finally {
      setLoadingOffer(false);
    }
  };

  const handleCopyOffer = () => {
    navigator.clipboard.writeText(offerMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!websiteData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const data = websiteData as unknown as Parameters<typeof WebsitePreview>[0]["data"];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard/business-finder" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Business Finder
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
              onClick={handlePublish}
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish website
            </Button>
            <Button
              variant="outline"
              className="border-white/20"
              onClick={handleDownload}
              disabled={downloadLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadLoading ? "..." : "Download website"}
            </Button>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Generated website preview</h2>
            <WebsitePreview data={data} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send offer to business
            </h2>
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="pt-6 space-y-4">
                <Button
                  variant="outline"
                  className="border-violet-500/50 text-violet-300"
                  onClick={handleGenerateOffer}
                  disabled={loadingOffer}
                >
                  {loadingOffer ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Generate Offer Message
                </Button>
                {offerMessage && (
                  <div className="space-y-2">
                    <Textarea
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows={6}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20"
                      onClick={handleCopyOffer}
                    >
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied!" : "Copy to clipboard"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
