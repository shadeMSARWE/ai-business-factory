"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { useCredits } from "@/components/providers/credits-provider";
import { ArrowLeft, Coins, TrendingDown, ArrowDown, ArrowUp, Loader2 } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  credits: number;
  description: string;
  action: string;
  created_at: string;
}

export default function CreditsPage() {
  const { billing, refetch } = useCredits();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const res = await fetch("/api/credit-transactions?limit=50");
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Credits</h1>
        <p className="text-slate-400 mb-10">
          Current balance and usage history.
        </p>

        <Card className="border-white/10 bg-white/5 max-w-md mb-10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="h-5 w-5 text-amber-400" />
              <span className="text-3xl font-bold text-white">{billing?.credits ?? 0}</span>
            </div>
            <p className="text-slate-400 text-sm">credits remaining</p>
            <p className="text-slate-500 text-sm mt-1">{billing?.creditsUsed ?? 0} used this period</p>
            <Link href="/dashboard/billing" className="text-violet-400 hover:underline text-sm mt-2 inline-block">
              Manage billing
            </Link>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold text-white mb-4">Usage history</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : transactions.length === 0 ? (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="py-12 text-center text-slate-400">
              No transactions yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  {t.credits < 0 ? (
                    <ArrowDown className="h-4 w-4 text-amber-400" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="text-white">{t.description || t.action || t.type}</span>
                </div>
                <span className={t.credits < 0 ? "text-amber-400" : "text-emerald-400"}>
                  {t.credits > 0 ? "+" : ""}{t.credits}
                </span>
                <span className="text-slate-500 text-sm">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
