"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Globe, Palette, Search, Megaphone, Store, Sparkles } from "lucide-react";
import { FACTORIES } from "@/lib/factories";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Globe,
  logo: Palette,
  seo: Search,
  ads: Megaphone,
  store: Store,
  app: Sparkles,
  video: Sparkles,
};

export default function FactoriesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
          <Link href="/builder">
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">Create Website</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">AI Factory Modules</h1>
        <p className="text-slate-400 mb-10">Modular AI tools for your business</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(FACTORIES).map(([id, factory], i) => {
            const Icon = icons[id] || Sparkles;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={factory.available ? factory.path : "#"}>
                  <Card
                    className={`h-full border-white/10 bg-white/5 transition-colors ${
                      factory.available ? "hover:border-violet-500/30 cursor-pointer" : "opacity-70 cursor-not-allowed"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <Icon className="h-12 w-12 text-violet-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{factory.name}</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        {factory.available ? "Available" : "Coming soon"}
                      </p>
                      {factory.available ? (
                        <Button size="sm" className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30">
                          Open
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500">Coming soon</span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
