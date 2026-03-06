"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Loader2, Download, Apple } from "lucide-react";

interface MobileApp {
  id: string;
  name: string;
  description: string | null;
  platform: string;
  status: string;
  created_at: string;
}

interface Build {
  id: string;
  platform: string;
  status: string;
  build_url: string;
  created_at: string;
}

export default function MobileAppDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [app, setApp] = useState<MobileApp | null>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/mobile-apps/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setApp(d.app);
        setBuilds(d.builds || []);
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuild = async (platform: string) => {
    setBuilding(platform);
    try {
      const res = await fetch("/api/mobile-apps/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: id, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Build failed");
      setBuilds((prev) => [
        {
          id: data.build_id,
          platform,
          status: data.status,
          build_url: data.download_url,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setBuilding(null);
    }
  };

  if (loading || !app) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const createdDate = new Date(app.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard/mobile-apps" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mobile Apps
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{app.name}</h1>
            <p className="text-slate-400 capitalize">{app.platform}</p>
            <p className="text-slate-500 mt-2">{app.description || "No description"}</p>
            <p className="text-slate-500 text-sm mt-2">Status: {app.status}</p>
            <p className="text-slate-500 text-sm">Created: {createdDate}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-white/20"
              onClick={() => handleBuild("android")}
              disabled={!!building}
            >
              {building === "android" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Smartphone className="h-4 w-4 mr-2" />
              )}
              Generate Android Build
            </Button>
            <Button
              variant="outline"
              className="border-white/20"
              onClick={() => handleBuild("ios")}
              disabled={!!building}
            >
              {building === "ios" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Apple className="h-4 w-4 mr-2" />
              )}
              Generate iOS Build
            </Button>
          </div>
        </div>

        {builds.length > 0 && (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="py-6">
              <h2 className="text-lg font-semibold text-white mb-4">Build History</h2>
              <div className="space-y-3">
                {builds.map((build) => (
                  <div
                    key={build.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      {build.platform === "android" ? (
                        <Smartphone className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Apple className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-white capitalize">{build.platform}</span>
                      <span className="text-slate-500 text-sm">{build.status}</span>
                    </div>
                    {build.build_url && (
                      <a
                        href={build.build_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
