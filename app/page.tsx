"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Palette,
  Search,
  Layout,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { getFeaturedTemplates } from "@/lib/templates-data";
import { TemplateImage } from "@/components/template-image";

export default function HomePage() {
  const featured = getFeaturedTemplates(6);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto text-center max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build a website in 5 seconds with AI
            </h1>
            <p className="text-xl text-slate-400 mb-10">
              Create websites, brands, and businesses instantly using AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard/create">
                <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Generate Website
                </Button>
              </Link>
              <Link href="/dashboard/templates">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20">
                  View Templates
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="ghost" className="h-12 px-8 text-lg text-slate-400 hover:text-white hover:bg-white/5">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-white mb-16"
            >
              Everything you need
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { icon: Sparkles, title: "AI Website Builder", desc: "Generate full sites with AI" },
                { icon: Palette, title: "AI Logo Generator", desc: "Create brand logos instantly" },
                { icon: Search, title: "AI SEO Generator", desc: "Optimize for search engines" },
                { icon: Layout, title: "Templates", desc: "100+ industry templates" },
                { icon: BarChart3, title: "Analytics", desc: "Track visitors and leads" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl h-full hover:bg-white/10 transition">
                    <CardContent className="pt-6">
                      <item.icon className="h-10 w-10 text-violet-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Preview */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Templates</h2>
                <p className="text-slate-400">Professional designs for any business</p>
              </div>
              <Link href="/dashboard/templates">
                <Button variant="ghost" className="text-violet-400">
                  View all templates
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/dashboard/create?template=${t.id}`}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/30 transition group">
                      <div className="aspect-video relative overflow-hidden">
                        <TemplateImage
                          template={t}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="text-xs text-violet-400">{t.category}</span>
                          <h3 className="text-lg font-semibold text-white">{t.subcategory}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="container mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-4"
            >
              Simple pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 mb-12 max-w-xl mx-auto"
            >
              Start free. Upgrade when you need more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/pricing">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto max-w-3xl rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-12 md:p-16 text-center backdrop-blur-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Start building your business today.
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of businesses using InstantBizSite AI
            </p>
            <Link href="/dashboard/create">
              <Button size="lg" className="h-12 px-8 text-lg bg-white text-violet-600 hover:bg-slate-100">
                Generate Website
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
