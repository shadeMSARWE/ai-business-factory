"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Factory,
  Bot,
  Rocket,
  LayoutGrid,
  Palette,
  Box,
  Play,
  ArrowRight,
  Zap,
  Megaphone,
  Code2,
} from "lucide-react";

const FEATURES = [
  { icon: Factory, title: "30 AI Factories", desc: "Dedicated AI tools for logos, SEO, ads, websites, stores, and more." },
  { icon: Bot, title: "15 AI Agents", desc: "Intelligent assistants that orchestrate factories to grow your business." },
  { icon: Rocket, title: "AI Business Generator", desc: "Generate a complete business kit from a single idea in one click." },
  { icon: LayoutGrid, title: "AI Marketplace", desc: "Browse and run tools by category with search and quick actions." },
  { icon: Palette, title: "Premium UI", desc: "Dark theme, glass panels, violet gradients, and smooth animations." },
  { icon: Box, title: "Modular Architecture", desc: "Factory engine and agent system built for scale and extensibility." },
  { icon: Zap, title: "Ready to Deploy", desc: "Production-ready stack with TypeScript, Next.js, and modern APIs." },
];

const PLATFORM_PREVIEWS = [
  {
    title: "Dashboard",
    desc: "Central hub for all AI tools and quick actions.",
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    href: "/dashboard",
  },
  {
    title: "Factories Marketplace",
    desc: "30+ AI factories organized by category.",
    src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    href: "/dashboard",
  },
  {
    title: "Agents",
    desc: "15 AI agents that orchestrate multiple factories.",
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    href: "/dashboard/agents",
  },
  {
    title: "Business Generator",
    desc: "One-click full business kit generation.",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    href: "/dashboard/business-generator",
  },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Enter a business idea", desc: "Describe your concept in a few words—e.g. “coffee shop in Haifa” or “SaaS for project management”." },
  { step: 2, title: "AI generates branding, website, marketing and content", desc: "Factories and agents produce logos, websites, SEO, ads, social content, and video ideas." },
  { step: 3, title: "Launch your AI-powered business", desc: "Export, copy, and deploy. Use the dashboard to iterate and grow." },
];

const PRODUCT_MODULES = [
  { icon: Factory, title: "AI Factories", desc: "30 specialized tools for every aspect of your business.", href: "/dashboard" },
  { icon: Bot, title: "AI Agents", desc: "15 intelligent assistants that run multiple factories.", href: "/dashboard/agents" },
  { icon: Rocket, title: "Business Generator", desc: "Full business kit from one prompt.", href: "/dashboard/business-generator" },
  { icon: Megaphone, title: "Marketing Tools", desc: "SEO, ads, copywriting, content calendar, funnels.", href: "/dashboard" },
  { icon: Zap, title: "Automation Tools", desc: "Workflows and automation ideas for your business.", href: "/dashboard" },
];

const TECH = [
  { name: "Next.js", desc: "App Router, server & client components" },
  { name: "TypeScript", desc: "Type-safe, production-ready codebase" },
  { name: "AI APIs", desc: "OpenAI, Stability AI, modular generators" },
  { name: "Modular factory engine", desc: "Centralized prompts, registry, runFactoryEngine" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto text-center max-w-4xl relative"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              AI Business Factory OS
            </h1>
            <p className="text-xl md:text-2xl text-violet-300/90 font-medium mb-4">
              Build an entire AI business from a single idea using artificial intelligence.
            </p>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Users can generate complete businesses, marketing strategies, content and automation systems from a single dashboard.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-lg shadow-violet-500/25"
                >
                  <Play className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
                >
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            >
              Why AI Business Factory
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-center max-w-xl mx-auto mb-16"
            >
              Everything you need to build, launch, and grow an AI-powered business.
            </motion.p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {FEATURES.map((f, i) => (
                <motion.div key={f.title} variants={item}>
                  <div className="group h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/[0.07] hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 mb-4 group-hover:scale-105 transition-transform">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Platform Preview */}
        <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            >
              Platform Preview
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-center max-w-xl mx-auto mb-16"
            >
              One dashboard for factories, agents, and the full business generator.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-8">
              {PLATFORM_PREVIEWS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={p.href} className="block group">
                    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={p.src}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                          <p className="text-slate-300 text-sm mt-1">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-center mb-16"
            >
              Three steps from idea to launch.
            </motion.p>
            <div className="space-y-8">
              {HOW_IT_WORKS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-violet-500/20 transition-colors"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-white font-bold text-xl border border-violet-500/30">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product modules */}
        <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            >
              Product Modules
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-center max-w-xl mx-auto mb-16"
            >
              Factories, agents, and generators in one place.
            </motion.p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {PRODUCT_MODULES.map((m) => (
                <motion.div key={m.title} variants={item}>
                  <Link href={m.href}>
                    <div className="group h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/[0.07] hover:border-violet-500/20 transition-all duration-300">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 mb-4 group-hover:scale-105 transition-transform">
                        <m.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{m.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                      <span className="inline-flex items-center text-violet-400 text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            >
              Built for Modern Stack
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-center mb-16"
            >
              Next.js, TypeScript, and a modular AI engine.
            </motion.p>
            <div className="grid sm:grid-cols-2 gap-6">
              {TECH.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex items-start gap-4 hover:border-violet-500/20 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto max-w-3xl rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-12 md:p-16 text-center backdrop-blur-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start building your AI business today
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Open the dashboard to explore 30 factories and 15 agents, or request a demo to see the platform in action.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-lg shadow-violet-500/25"
                >
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-500/10"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
