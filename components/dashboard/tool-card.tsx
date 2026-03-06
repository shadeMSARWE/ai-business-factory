"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

export function ToolCard({ icon: Icon, title, description, href, delay = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={href}>
        <div className="group h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 mb-4 group-hover:scale-110 transition-transform">
            <Icon className="h-7 w-7 text-violet-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{description}</p>
          <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 p-0 h-auto">
            Open Tool
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
