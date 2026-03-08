"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
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
  Smartphone,
  Store,
  Bot,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/agents", labelKey: "Agents", label: "Agents", icon: Bot },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
  { href: "/dashboard/billing", labelKey: "nav.billing", icon: CreditCard },
  { href: "/dashboard/factories", labelKey: "nav.factories", icon: Factory },
  { href: "/dashboard/logo-generator", labelKey: "Logo", icon: Palette },
  { href: "/dashboard/ad-generator", labelKey: "Ads", icon: Megaphone },
  { href: "/dashboard/seo-generator", labelKey: "SEO", icon: Search },
  { href: "/dashboard/business-finder", labelKey: "Business Finder", icon: MapPin },
  { href: "/dashboard/leads", labelKey: "Leads", icon: Mail },
  { href: "/dashboard/outreach", labelKey: "Outreach", icon: Send },
  { href: "/dashboard/credits", labelKey: "Credits", icon: Coins },
  { href: "/dashboard/mobile-apps", labelKey: "nav.mobileApps", icon: Smartphone },
  { href: "/dashboard/store", labelKey: "tools.storeBuilder", icon: Store },
  { href: "/factory", labelKey: "nav.howItWorks", icon: Factory },
  { href: "/dashboard/websites", labelKey: "my_websites", icon: Globe },
  { href: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/dashboard/templates", labelKey: "templates", icon: Layout },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

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
              {"label" in item && item.label ? item.label : t(item.labelKey)}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
