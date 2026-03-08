"use client";

import { motion } from "framer-motion";
import type { SuggestionItem } from "@/lib/factories/suggestions-config";
import { Sparkles } from "lucide-react";

interface SuggestionsProps {
  items: SuggestionItem[];
  onSelect: (prompt: string) => void;
  loading?: boolean;
  className?: string;
}

export function Suggestions({ items, onSelect, loading = false, className = "" }: SuggestionsProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-400" />
        Quick suggestions
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !loading && onSelect(item.prompt)}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white transition-all backdrop-blur-sm disabled:opacity-50"
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
