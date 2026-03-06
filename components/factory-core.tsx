"use client";

import { motion } from "framer-motion";

export function FactoryCore() {
  return (
    <motion.div
      className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-violet-500/30"
        animate={{
          boxShadow: [
            "0 0 40px rgba(139, 92, 246, 0.2)",
            "0 0 60px rgba(139, 92, 246, 0.4)",
            "0 0 40px rgba(139, 92, 246, 0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 md:inset-6 rounded-full border border-violet-400/40 bg-violet-500/5"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Inner core */}
      <motion.div
        className="absolute inset-8 md:inset-12 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-violet-600/20 backdrop-blur-sm border border-white/10"
        animate={{
          boxShadow: [
            "inset 0 0 30px rgba(139, 92, 246, 0.2)",
            "inset 0 0 50px rgba(217, 70, 239, 0.3)",
            "inset 0 0 30px rgba(139, 92, 246, 0.2)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Center icon / text */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span className="mt-2 text-xs font-medium text-violet-300/80 uppercase tracking-widest">
          AI Core
        </span>
      </motion.div>
    </motion.div>
  );
}
