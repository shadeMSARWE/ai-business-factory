"use client";

import { motion } from "framer-motion";
import { FactoryCore } from "@/components/factory-core";
import { FactoryCard } from "@/components/factory-card";
import { FactoryPerformancePanel } from "@/components/factory-performance-panel";
import { getDashboardFactories } from "@/lib/factories";

export default function FactoriesPage() {
  const allFactories = getDashboardFactories();
  const popularFactories = allFactories.filter((f) => f.popular === true);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          AI Business Factory
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Build, grow and automate businesses using AI factories.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Center: Factory Core + surrounding cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mb-16"
          >
            {/* Core section with radial glow */}
            <div className="relative flex justify-center py-12 md:py-16">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[200px] md:w-[800px] md:h-[300px] bg-gradient-radial from-violet-500/10 via-transparent to-transparent rounded-full" />
              </div>
              <FactoryCore />
            </div>

            {/* Factory modules grid - arranged around core */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allFactories.map((factory, i) => (
                <FactoryCard
                  key={factory.id}
                  factory={factory}
                  index={i}
                  isConnected={true}
                />
              ))}
            </div>
          </motion.div>

          {/* Popular factories section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              Popular Factories
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {popularFactories.map((factory, i) => (
                <FactoryCard
                  key={factory.id}
                  factory={factory}
                  index={i}
                  isConnected={false}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Performance panel */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <FactoryPerformancePanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
