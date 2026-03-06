"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DownloadButton } from "@/components/download-button";
import { PublishButton } from "@/components/publish-button";
import { getWebsites, deleteWebsite, type StoredWebsite } from "@/lib/storage";
import { Logo } from "@/components/logo";
import { Plus, Eye, Pencil, Trash2, ArrowLeft } from "lucide-react";

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<StoredWebsite[]>([]);

  useEffect(() => {
    setWebsites(getWebsites());
  }, []);

  const refresh = () => setWebsites(getWebsites());

  const handleDelete = (id: string) => {
    if (!confirm("Delete this website?")) return;
    deleteWebsite(id);
    refresh();
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
          <Link href="/dashboard/create">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">My Websites</h1>
          <Link href="/dashboard/create">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </Link>
        </div>

        {websites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/20 p-20 text-center"
          >
            <p className="text-slate-400 text-lg mb-6">No websites yet. Create your first one!</p>
            <Link href="/dashboard/create">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                Create Website
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((site, i) => {
              const thumb = (site.data as { galleryImages?: string[] })?.galleryImages?.[0];
              return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 group"
              >
                <Link href={`/preview/${site.id}`} className="block aspect-video overflow-hidden">
                  <div
                    className="h-full w-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 group-hover:scale-105 transition-transform duration-500"
                    style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: "cover" } : {}}
                  />
                </Link>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{site.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{baseUrl}/s/{site.slug}</p>
                    <div className="flex flex-wrap gap-2">
                    <Link href={`/preview/${site.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/editor/${site.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20">
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <PublishButton websiteId={site.id} variant="outline" size="sm" className="border-white/20" />
                    <DownloadButton slug={site.slug} />
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
      </main>
    </div>
  );
}
