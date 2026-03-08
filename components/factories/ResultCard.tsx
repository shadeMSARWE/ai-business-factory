"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ResultCardProps {
  title: string;
  value: string;
  index?: number;
  className?: string;
}

export function ResultCard({ title, value, index = 0, className = "" }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border theme-card backdrop-blur-xl p-5 hover:border-violet-500/20 transition-colors ${className}`}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <span className="text-sm font-medium theme-card-muted">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-400 hover:text-white shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="theme-card font-medium break-words">{value}</p>
    </motion.div>
  );
}

interface ResultCardListProps {
  items: { title: string; value: string }[];
  className?: string;
}

export function ResultCardList({ items, className = "" }: ResultCardListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <ResultCard key={i} title={item.title} value={item.value} index={i} />
      ))}
    </div>
  );
}
