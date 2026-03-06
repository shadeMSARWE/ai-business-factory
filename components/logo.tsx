"use client";

import Link from "next/link";

export function Logo({ showSubtitle = false }: { showSubtitle?: boolean }) {
  return (
    <Link href="/" className="flex flex-col">
      <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
        InstantBizSite AI
      </span>
      {showSubtitle && (
        <span className="text-xs text-slate-500 -mt-0.5">AI Business Factory</span>
      )}
    </Link>
  );
}
