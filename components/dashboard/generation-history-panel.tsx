"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { History, Trash2, ExternalLink } from "lucide-react";
import { getHistory, clearHistory, removeHistoryEntry, type HistoryEntry } from "@/lib/generation-history";
import { FACTORIES } from "@/lib/factories";

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

export function GenerationHistoryPanel() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  const handleRemove = (id: string) => {
    removeHistoryEntry(id);
    setEntries(getHistory());
  };

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border theme-panel backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <History className="h-5 w-5 text-violet-400" />
          Generation History
        </h3>
        <p className="text-slate-500 text-sm">No generations yet. Use any AI tool and save results to see them here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border theme-panel backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-violet-400" />
          Generation History
        </h3>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
      <ul className="space-y-3 max-h-80 overflow-y-auto">
        {entries.slice(0, 20).map((entry) => {
          const factory = FACTORIES[entry.factoryId];
          const path = factory?.path ?? "/dashboard";
          return (
            <li
              key={entry.id}
              className="group flex items-start gap-3 p-3 rounded-lg theme-toolbar border"
            >
              <div className="flex-1 min-w-0">
                <Link href={path} className="text-sm font-medium text-violet-300 hover:text-violet-200 flex items-center gap-1">
                  {entry.factoryName}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                </Link>
                <p className="theme-card-muted text-xs mt-0.5 truncate">{entry.prompt}</p>
                <p className="theme-card-muted text-xs mt-1 line-clamp-1">{entry.resultPreview}</p>
                <p className="theme-card-muted text-xs mt-0.5">{formatTime(entry.timestamp)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(entry.id)}
                className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
