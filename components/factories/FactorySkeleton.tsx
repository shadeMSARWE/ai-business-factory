"use client";

import { motion } from "framer-motion";

interface FactorySkeletonProps {
  lines?: number;
  className?: string;
}

export function FactorySkeleton({ lines = 3, className = "" }: FactorySkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`rounded-2xl border theme-panel backdrop-blur-xl p-8 ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-400"
        />
        <p className="text-slate-400 text-sm">Generating...</p>
        <div className="w-full max-w-xs space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-white/10 animate-pulse"
              style={{ width: `${80 - i * 15}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
