"use client";

import {
  Briefcase,
  Palette,
  Globe,
  Store,
  Megaphone,
  Search,
  Target,
  FileText,
  Video,
  TrendingUp,
  BarChart3,
  Zap,
  Users,
  Package,
  ShoppingCart,
  Bot,
} from "lucide-react";

export const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Palette,
  Globe,
  Store,
  Megaphone,
  Search,
  Target,
  FileText,
  Video,
  TrendingUp,
  BarChart3,
  Zap,
  Users,
  Package,
  ShoppingCart,
};

export function getAgentIcon(iconName: string): React.ComponentType<{ className?: string }> {
  return AGENT_ICONS[iconName] ?? Bot;
}
