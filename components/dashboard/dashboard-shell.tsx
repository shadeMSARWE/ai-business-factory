"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useTranslation } from "@/hooks/use-translation";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo showSubtitle />
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                {t("create_website")}
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
