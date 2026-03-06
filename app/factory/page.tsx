"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import {
  MessageSquare,
  Sparkles,
  Palette,
  Rocket,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Describe your business",
    description: "Tell us what kind of business you have. A pizza restaurant in Tel Aviv? A dental clinic? We'll detect the type and customize everything.",
    icon: MessageSquare,
  },
  {
    step: 2,
    title: "AI generates your website",
    description: "Our AI creates a complete website in seconds: hero, services, gallery, testimonials, and contact form. All tailored to your business.",
    icon: Sparkles,
  },
  {
    step: 3,
    title: "Customize using the editor",
    description: "Edit text, change images, update colors, add or remove sections. Full visual control over your site.",
    icon: Palette,
  },
  {
    step: 4,
    title: "Publish instantly",
    description: "One click to publish. Your site goes live at your custom URL. No hosting setup required.",
    icon: Rocket,
  },
  {
    step: 5,
    title: "Track visitors and leads",
    description: "Monitor traffic, form submissions, and conversions. Understand your audience.",
    icon: BarChart3,
  },
];

export default function FactoryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
          <Link href="/dashboard/create">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Create Website
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-24">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-16 pb-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            How the AI Factory Works
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Five simple steps to go from idea to live website
          </p>
          <Link href="/dashboard/create">
            <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Get Started
            </Button>
          </Link>
        </motion.section>

        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 items-start rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30">
                <item.icon className="h-8 w-8 text-violet-300" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-violet-400 mb-2 block">
                  Step {item.step}
                </span>
                <h2 className="text-2xl font-bold text-white mb-3">{item.title}</h2>
                <p className="text-slate-400">{item.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block h-6 w-6 text-slate-600 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-slate-400 mb-6">Ready to build your business?</p>
          <Link href="/dashboard/create">
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Create Your Website
            </Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
