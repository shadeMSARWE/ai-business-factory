"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Search, Palette, ExternalLink, Globe, Share2, Video } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  href: string;
  icon: "analytics" | "seo" | "logo" | "publish" | "website" | "social" | "video";
}

const icons = {
  analytics: BarChart3,
  seo: Search,
  logo: Palette,
  publish: ExternalLink,
  website: Globe,
  social: Share2,
  video: Video,
};

export function AISuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions([
      { id: "1", text: "Create a logo before building your website.", href: "/dashboard/logo-generator", icon: "logo" },
      { id: "2", text: "Generate SEO keywords for your new store.", href: "/dashboard/seo-generator", icon: "seo" },
      { id: "3", text: "Create viral content for marketing.", href: "/dashboard/viral-video-ideas", icon: "video" },
      { id: "4", text: "Your website has no analytics yet. Add tracking to see visitor data.", href: "/dashboard/analytics", icon: "analytics" },
      { id: "5", text: "Improve SEO by generating meta descriptions for your pages.", href: "/dashboard/seo-generator", icon: "seo" },
      { id: "6", text: "Add a professional logo using the AI Logo Factory.", href: "/dashboard/logo-generator", icon: "logo" },
      { id: "7", text: "Publish your site to share it with the world.", href: "/dashboard/websites", icon: "publish" },
      { id: "8", text: "Build a landing page with the AI Landing Page Generator.", href: "/dashboard/landing-page-ai", icon: "website" },
      { id: "9", text: "Generate a social content pack for the week.", href: "/dashboard/social-content", icon: "social" },
    ]);
  }, []);

  if (suggestions.length === 0) return null;

  const displaySuggestions = suggestions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-500/20 bg-violet-500/5 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-400" />
        AI Suggestions
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Suggested tools based on your workflow:
      </p>
      <ul className="space-y-3">
        {displaySuggestions.map((s) => {
          const Icon = icons[s.icon];
          return (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex items-start gap-3 p-3 rounded-lg theme-toolbar hover:border-violet-500/20 transition-colors border"
              >
                <Icon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="theme-card-muted text-sm">{s.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
