"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="text-slate-400 text-center max-w-md">{error.message}</p>
      <div className="flex gap-4">
        <Button onClick={reset} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-white/20">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}
