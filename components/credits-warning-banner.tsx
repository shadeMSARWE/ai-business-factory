"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function CreditsWarningBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-center gap-2 text-amber-400 text-sm">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>Your credits are running low.</span>
      <Link href="/dashboard/billing" className="underline font-medium hover:text-amber-300">
        Upgrade your plan
      </Link>
    </div>
  );
}
