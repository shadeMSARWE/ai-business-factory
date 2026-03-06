"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/dashboard/tool-card";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DownloadButton } from "@/components/download-button";
import { PublishButton } from "@/components/publish-button";
import { getWebsites, deleteWebsite, type StoredWebsite } from "@/lib/storage";
import { Logo } from "@/components/logo";
import {
  Globe,
  Store,
  Smartphone,
  Palette,
  Megaphone,
  Search,
  MapPin,
  Users,
  Target,
  FileEdit,
  BarChart3,
  Layout,
  Sparkles,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function DashboardPage() {
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
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              Create Website
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-24">
        {/* SECTION 1 — HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-16 pb-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            InstantBizSite AI
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            AI Business Factory — Build websites, brands, and businesses using AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/create">
              <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                Create Website
              </Button>
            </Link>
            <Link href="/dashboard/generate-business">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-500/10">
                Generate Business
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* SECTION 2 — AI TOOLS */}
        <section className="py-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Tools</h2>
              <p className="text-slate-400 text-sm">Generate websites, logos, ads, and SEO with AI</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={Globe}
              title="Website Builder"
              description="Generate full business websites using AI."
              href="/dashboard/create"
              delay={0}
            />
            <ToolCard
              icon={Palette}
              title="Logo Generator"
              description="Create 4 logo variations with icons and gradients."
              href="/dashboard/logo-generator"
              delay={0.03}
            />
            <ToolCard
              icon={Megaphone}
              title="Ads Generator"
              description="Generate Facebook, Instagram, Google, and TikTok ads."
              href="/dashboard/ad-generator"
              delay={0.06}
            />
            <ToolCard
              icon={Search}
              title="SEO Generator"
              description="Generate SEO title, meta description, and keywords."
              href="/dashboard/seo-generator"
              delay={0.09}
            />
            <ToolCard
              icon={Layout}
              title="Templates"
              description="Browse 150+ professional website templates."
              href="/dashboard/templates"
              delay={0.12}
            />
            <ToolCard
              icon={MapPin}
              title="Business Finder"
              description="Find businesses without websites. Generate sites for them."
              href="/dashboard/business-finder"
              delay={0.15}
            />
          </div>
        </section>

        {/* SECTION 3 — FACTORY TOOLS (legacy) */}
        <section className="py-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Factory Tools</h2>
              <p className="text-slate-400 text-sm">Additional tools to build your business</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={Store}
              title="Store Builder"
              description="Create full e-commerce stores with products."
              href="/dashboard/store"
              delay={0}
            />
            <ToolCard
              icon={Smartphone}
              title="App Builder"
              description="Generate mobile apps."
              href="/dashboard/store"
              delay={0.05}
            />
          </div>
        </section>

        {/* SECTION 3 — BUSINESS GROWTH */}
        <section className="py-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Business Growth</h2>
              <p className="text-slate-400 text-sm">Tools focused on finding clients</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ToolCard
              icon={MapPin}
              title="Business Finder"
              description="Find businesses without websites using Google Maps."
              href="/dashboard/business-finder"
              delay={0}
            />
            <ToolCard
              icon={Users}
              title="Leads"
              description="View leads collected from contact forms."
              href="/dashboard/leads"
              delay={0.05}
            />
            <ToolCard
              icon={Target}
              title="Ad Campaign Builder"
              description="Create full marketing campaigns."
              href="/dashboard/ad-generator"
              delay={0.1}
            />
          </div>
        </section>

        {/* SECTION 4 — WEBSITE MANAGEMENT */}
        <section className="py-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Website Management</h2>
              <p className="text-slate-400 text-sm">Manage and optimize your websites</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard
              icon={Globe}
              title="My Websites"
              description="List all generated websites."
              href="/dashboard/websites"
              delay={0}
            />
            <ToolCard
              icon={FileEdit}
              title="Editor"
              description="Visual website editor."
              href={websites[0] ? `/editor/${websites[0].id}` : "/dashboard/create"}
              delay={0.05}
            />
            <ToolCard
              icon={BarChart3}
              title="Analytics"
              description="Track traffic, visitors, and leads."
              href="/dashboard/analytics"
              delay={0.1}
            />
            <ToolCard
              icon={Layout}
              title="Templates"
              description="Browse website templates."
              href="/dashboard/templates"
              delay={0.15}
            />
          </div>
        </section>

        {/* SECTION 5 — AI BUSINESS GENERATOR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 border-t border-white/5"
        >
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-blue-500/20 p-10 md:p-16 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Generate Business</h2>
                <p className="text-slate-300 mb-6 max-w-xl">
                  AI will create: website, logo, ads, SEO, social media posts, landing page
                </p>
                <Link href="/dashboard/generate-business">
                  <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                    <Sparkles className="h-6 w-6 mr-2" />
                    Generate Business
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4 text-slate-400">
                <span className="px-4 py-2 rounded-lg bg-white/5">Website</span>
                <span className="px-4 py-2 rounded-lg bg-white/5">Logo</span>
                <span className="px-4 py-2 rounded-lg bg-white/5">Ads</span>
                <span className="px-4 py-2 rounded-lg bg-white/5">SEO</span>
                <span className="px-4 py-2 rounded-lg bg-white/5">Social</span>
                <span className="px-4 py-2 rounded-lg bg-white/5">Landing</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* MY WEBSITES PREVIEW */}
        {websites.length > 0 && (
          <section className="py-16">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-white">Recent Websites</h2>
              <Link href="/dashboard/websites">
                <Button variant="ghost" className="text-violet-400">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.slice(0, 6).map((site, i) => {
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
                    <p className="text-sm text-slate-400 mb-4">/s/{site.slug}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/preview/${site.id}`}>
                        <Button variant="outline" size="sm" className="border-white/20">
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
          </section>
        )}
      </main>
    </div>
  );
}
