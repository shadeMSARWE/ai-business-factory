"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useTranslation } from "@/hooks/use-translation";
import { useCredits } from "@/components/providers/credits-provider";
import { CreditsWarningBanner } from "@/components/credits-warning-banner";
import { Zap, Coins } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { billing, loading } = useCredits();
  const showBanner = billing?.creditsLow && !billing?.creditsExhausted;

  return (
    <div className="min-h-screen theme-page-bg flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {showBanner && <CreditsWarningBanner />}
        <header className="sticky top-0 z-40 border-b border-white/10 theme-header-bg backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Logo showSubtitle />
            <div className="flex items-center gap-3">
              {!loading && billing != null && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Credits: {billing.credits}
                  </span>
                </div>
              )}
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm" className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10">
                  <Coins className="h-4 w-4 mr-1.5" />
                  Buy Credits
                </Button>
              </Link>
              <Link href="/builder">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                  {t("create_website")}
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
