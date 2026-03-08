"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Coins } from "lucide-react";

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  showBuyCredits?: boolean;
}

export function ErrorFallback({
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
  showBuyCredits,
}: ErrorFallbackProps) {
  const isCreditsError = showBuyCredits ?? /credit|no credits remaining/i.test(message);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-red-300 font-medium">Generation failed</p>
          <p className="text-slate-400 text-sm mt-1">{message}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {isCreditsError && (
              <Link href="/dashboard/billing">
                <Button size="sm" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
                  <Coins className="h-4 w-4 mr-1.5" />
                  Buy Credits
                </Button>
              </Link>
            )}
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-500/30 text-red-300 hover:bg-red-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
