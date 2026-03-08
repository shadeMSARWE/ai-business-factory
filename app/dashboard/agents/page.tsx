"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import {
  getAllAgents,
  getAgentsByCategory,
  type AgentConfig,
} from "@/lib/agents/agent-registry";
import { ArrowRight, Bot } from "lucide-react";
import { getAgentIcon } from "@/components/agents/agent-icons";

function AgentCard({ agent, index }: { agent: AgentConfig; index: number }) {
  const Icon = getAgentIcon(agent.icon);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-500/10 transition-all overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Icon className="h-6 w-6" />
          </div>
          <Link
            href={`/dashboard/agents/${agent.id}`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg shadow-violet-500/20"
          >
            Run Agent
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {agent.description}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Uses {agent.tasks.length} factor{agent.tasks.length === 1 ? "y" : "ies"}
        </p>
      </div>
    </motion.article>
  );
}

const CATEGORIES = [
  { id: "core" as const, title: "Core Business", description: "Business models, branding, website and store." },
  { id: "marketing" as const, title: "Marketing", description: "Strategy, SEO, ads and content." },
  { id: "growth" as const, title: "Growth", description: "Growth hacking, analytics and automation." },
  { id: "advanced" as const, title: "Advanced", description: "Competitors, product and sales." },
];

export default function AgentsDashboardPage() {
  const allAgents = getAllAgents();

  return (
    <div className="min-h-screen theme-page-bg">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <Bot className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Agents</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Intelligent assistants that orchestrate factories to help you grow your business. Run an agent with a prompt and get recommendations, insights, and content.
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const agents = getAgentsByCategory(cat.id);
          if (agents.length === 0) return null;
          return (
            <section key={cat.id} className="mb-14">
              <h2 className="text-xl font-semibold text-white mb-1">
                {cat.title}
              </h2>
              <p className="text-slate-500 text-sm mb-6">{cat.description}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-1">All Agents</h2>
          <p className="text-slate-500 text-sm mb-6">
            {allAgents.length} agents available.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAgents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
