"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TEMPLATES,
  getCategories,
  getTemplatesByCategory,
} from "@/lib/templates-data";
import { TemplateImage } from "@/components/template-image";
import { Eye, Check, Search } from "lucide-react";

export default function TemplatesPage() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const categories = ["all", ...getCategories()];

  const filtered = useMemo(() => {
    let list = category === "all" ? TEMPLATES : getTemplatesByCategory(category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  const handleApply = (id: string) => {
    window.location.href = `/dashboard/create?template=${id}`;
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-white mb-2">Templates Marketplace</h1>
        <p className="text-slate-400 mb-10">
          {TEMPLATES.length} professional templates across 9 categories
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? "bg-violet-500/30 text-violet-300 border border-violet-500/50"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 group"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-800/50">
                <TemplateImage
                  template={t}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">{t.category}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{t.name}</h3>
                </div>
              </div>
              <div className="p-5 flex gap-3">
                <Link href={`/dashboard/create?template=${t.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-white/20 hover:bg-white/10">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                  onClick={() => handleApply(t.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-16">No templates match your search.</p>
        )}
    </div>
  );
}
