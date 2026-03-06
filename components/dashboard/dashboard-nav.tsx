"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Factory,
  Globe,
  BarChart3,
  Layout,
  MapPin,
  Mail,
  Palette,
  Megaphone,
  Search,
  CreditCard,
  Send,
  Coins,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/factories", label: "Factories", icon: Factory },
  { href: "/dashboard/logo-generator", label: "Logo", icon: Palette },
  { href: "/dashboard/ad-generator", label: "Ads", icon: Megaphone },
  { href: "/dashboard/seo-generator", label: "SEO", icon: Search },
  { href: "/dashboard/business-finder", label: "Business Finder", icon: MapPin },
  { href: "/dashboard/leads", label: "Leads", icon: Mail },
  { href: "/dashboard/outreach", label: "Outreach", icon: Send },
  { href: "/dashboard/credits", label: "Credits", icon: Coins },
  { href: "/factory", label: "How It Works", icon: Factory },
  { href: "/dashboard/websites", label: "My Websites", icon: Globe },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/templates", label: "Templates", icon: Layout },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
