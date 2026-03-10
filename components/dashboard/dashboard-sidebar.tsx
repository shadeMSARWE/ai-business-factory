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
  Coins,
  Smartphone,
  Store,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useCredits } from "@/components/providers/credits-provider";

type NavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/websites", labelKey: "my_websites", icon: Globe },
  { href: "/dashboard/templates", labelKey: "templates", icon: Layout },
  { href: "/dashboard/factories", labelKey: "nav.factories", icon: Factory },
  { href: "/dashboard/mobile-apps", labelKey: "nav.mobileApps", icon: Smartphone },
  { href: "/dashboard/store", labelKey: "tools.storeBuilder", icon: Store },
  { href: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/dashboard/billing", labelKey: "nav.billing", icon: CreditCard },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { billing } = useCredits();

  return (
    <aside className="w-56 flex-shrink-0 border-r theme-sidebar-bg p-4 flex flex-col">
      <nav className="space-y-1 flex-1">
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
                {item.label ?? t(item.labelKey)}
              </div>
            </Link>
          );
        })}
      </nav>
      {billing && (
        <Link href="/dashboard/billing" className="mt-4 p-3 rounded-lg theme-toolbar border transition-colors hover:opacity-90">
          <div className="flex items-center gap-2 theme-card-muted text-sm">
            <Coins className="h-4 w-4 text-amber-400" />
            <span>{billing.credits} credits</span>
          </div>
        </Link>
      )}
    </aside>
  );
}
