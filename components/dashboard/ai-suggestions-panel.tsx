"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Search, Palette, ExternalLink } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  href: string;
  icon: "analytics" | "seo" | "logo" | "publish";
}

const icons = { analytics: BarChart3, seo: Search, logo: Palette, publish: ExternalLink };

export function AISuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions([
      { id: "1", text: "Your website has no analytics yet. Add tracking to see visitor data.", href: "/dashboard/analytics", icon: "analytics" },
      { id: "2", text: "Improve SEO by generating meta descriptions for your pages.", href: "/dashboard/seo-generator", icon: "seo" },
      { id: "3", text: "Add a professional logo using the AI Logo Factory.", href: "/dashboard/logo-generator", icon: "logo" },
      { id: "4", text: "Publish your site to share it with the world.", href: "/dashboard/websites", icon: "publish" },
    ]);
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-400" />
        AI Suggestions
      </h3>
      <ul className="space-y-3">
        {suggestions.slice(0, 3).map((s) => {
          const Icon = icons[s.icon];
          return (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Icon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{s.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
