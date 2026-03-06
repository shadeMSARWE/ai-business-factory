"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Layout,
  BarChart3,
  CreditCard,
  Settings,
  Factory,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/websites", labelKey: "my_websites", icon: Globe },
  { href: "/dashboard/templates", labelKey: "templates", icon: Layout },
  { href: "/dashboard/factories", labelKey: "nav.factories", icon: Factory },
  { href: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/dashboard/billing", labelKey: "nav.billing", icon: CreditCard },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/10 bg-[#0a0a0f]/50 p-4">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {t(item.labelKey)}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
