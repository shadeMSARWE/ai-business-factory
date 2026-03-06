"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Smartphone,
  Download,
  Loader2,
  FileCode,
  Apple,
} from "lucide-react";

interface App {
  id: string;
  name: string;
  type: string;
  platform?: string;
  description: string | null;
  status: string;
}

interface Screen {
  id: string;
  name: string;
  component_code: string;
}

interface Build {
  id: string;
  platform: string;
  build_url: string;
  status: string;
  created_at: string;
}

export default function AppDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [app, setApp] = useState<App | null>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<string | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/apps/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setApp(d.app);
        setScreens(d.screens || []);
        setBuilds(d.builds || []);
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuild = async (platform: string) => {
    setBuilding(platform);
    try {
      const res = await fetch("/api/apps/build", {
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
          build_url: data.download_url,
          status: data.status,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
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

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard/apps" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Apps
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{app.name}</h1>
            <p className="text-slate-400 capitalize">{(app.platform || app.type || "mobile").replace("_", " ")}</p>
            {app.description && (
              <p className="text-slate-500 mt-2">{app.description}</p>
            )}
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
              Build Android
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
              Build iOS
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Generated screens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {screens.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScreen(s)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedScreen?.id === s.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-white font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedScreen ? selectedScreen.name : "Select a screen"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedScreen ? (
                <pre className="p-4 rounded-lg bg-black/30 text-white text-xs overflow-auto max-h-96">
                  {selectedScreen.component_code}
                </pre>
              ) : (
                <p className="text-slate-500">Click a screen to view its code.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Build history</CardTitle>
          </CardHeader>
          <CardContent>
            {builds.length === 0 ? (
              <p className="text-slate-500">No builds yet. Click Build Android or Build iOS to create one.</p>
            ) : (
              <div className="space-y-2">
                {builds.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      {b.platform === "android" ? (
                        <Smartphone className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Apple className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-white capitalize">{b.platform}</span>
                      <span className="text-slate-500 text-sm">
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    </div>
                    <a
                      href={b.build_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download APK
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
