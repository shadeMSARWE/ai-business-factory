"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreditCard, Zap, Loader2, Check, Coins, Package } from "lucide-react";
import { PayPalSubscribe } from "@/components/paypal-subscribe";
import { CREDIT_PLANS, CREDIT_PACKS, type CreditPackId } from "@/lib/credits";
import { useCredits } from "@/components/providers/credits-provider";

interface BillingData {
  planId: string;
  planName: string;
  credits: number;
  creditsUsed: number;
  creditsLimit: number;
  canUseCredits: boolean;
  creditsLow: boolean;
  creditsExhausted: boolean;
}

function BillingHistorySection() {
  const [history, setHistory] = useState<{ id: string; type: string; amount: number | null; credits: number | null; description: string; status: string; created_at: string }[]>([]);
  useEffect(() => {
    fetch("/api/billing-history")
      .then((r) => r.json())
      .then((d) => setHistory(d.history || []))
      .catch(() => setHistory([]));
  }, []);
  if (history.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">Billing history</h2>
      <div className="space-y-2">
        {history.slice(0, 10).map((h) => (
          <div key={h.id} className="flex justify-between py-2 border-b border-white/5 text-sm">
            <span className="text-slate-400">{h.description || h.type}</span>
            <span className="text-white">
              {h.amount != null && `$${h.amount}`}
              {h.credits != null && ` ${h.credits} credits`}
            </span>
            <span className="text-slate-500">{new Date(h.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreditPacksSection({ onPurchased }: { onPurchased?: () => void }) {
  const [loading, setLoading] = useState<CreditPackId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (packId: CreditPackId) => {
    setError(null);
    setLoading(packId);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      if (data.orderId) {
        try {
          sessionStorage.setItem("paypal_order_id", data.orderId);
        } catch {
          // ignore
        }
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No redirect URL");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div className="grid sm:grid-cols-3 gap-6 mb-10">
      {(Object.keys(CREDIT_PACKS) as CreditPackId[]).map((packId) => {
        const p = CREDIT_PACKS[packId];
        return (
          <Card key={packId} className="border-white/10 bg-white/5 hover:border-violet-500/30 transition-colors">
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="text-xl font-bold text-white">{p.credits} credits</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">${p.price}</p>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                disabled={!!loading}
                onClick={() => handleBuy(packId)}
              >
                {loading === packId ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Buy with PayPal"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      {error && <p className="text-red-400 text-sm col-span-full">{error}</p>}
    </div>
  );
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  pro: 19,
  business: 39,
  agency: 90,
};

export default function BillingPage() {
  const { t } = useTranslation();
  const { refetch: refetchCredits } = useCredits();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [captureSuccess, setCaptureSuccess] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => setBilling(d))
      .catch(() => setBilling(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    if (!params?.get("success")) return;
    const orderId = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("paypal_order_id") : null;
    if (!orderId) return;
    fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.credits) setCaptureSuccess(d.credits);
        refetchCredits();
        fetch("/api/billing").then((r) => r.json()).then((x) => setBilling(x));
      })
      .finally(() => {
        try {
          sessionStorage.removeItem("paypal_order_id");
        } catch {
          // ignore
        }
        window.history.replaceState({}, "", "/dashboard/billing");
      });
  }, [refetchCredits]);

  const handleUpgrade = async (planId: string) => {
    setUpgradeLoading(planId);
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || data.message || "Failed");
    } catch (e) {
      console.error(e);
      setUpgradeLoading(null);
    }
  };

  const usagePercent = billing
    ? billing.creditsLimit > 0
      ? Math.min(100, (billing.creditsUsed / billing.creditsLimit) * 100)
      : 0
    : 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          {t("billing.title")}
        </h1>
        <p className="text-slate-400 mb-10">{t("billing.subtitle")}</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
          </div>
        ) : billing ? (
          <>
            <Card className="border-white/10 bg-white/5 mb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Coins className="h-5 w-5 text-amber-400" />
                      Plan: {billing.planName}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {billing.planId === "free" ? "Free tier" : "Active subscription"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{billing.credits}</p>
                    <p className="text-slate-400 text-sm">credits remaining</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Credits used</span>
                    <span className="text-white font-medium">{billing.creditsUsed} / {billing.creditsLimit}</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {captureSuccess != null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 mb-6 text-emerald-300"
              >
                Payment successful. {captureSuccess} credits have been added to your account.
              </motion.div>
            )}
            <h2 className="text-xl font-semibold text-white mb-6">Buy Credits (PayPal)</h2>
            <p className="text-slate-400 text-sm mb-4">One-time purchase. Credits are added to your balance.</p>
            <CreditPacksSection onPurchased={refetchCredits} />

            <h2 className="text-xl font-semibold text-white mb-6 mt-12">Available Plans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(["free", "pro", "business", "agency"] as const).map((planId) => {
                const plan = CREDIT_PLANS[planId];
                const planCredits = plan.credits;
                const price = PLAN_PRICES[planId] ?? 0;
                const isCurrent = billing.planId === planId;
                const canUpgrade = planId !== "free" && !isCurrent;
                return (
                  <motion.div
                    key={planId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: planId === "free" ? 0 : 0.1 * ["free", "pro", "business", "agency"].indexOf(planId) }}
                  >
                    <Card
                      className={`border-white/10 bg-white/5 transition-all ${
                        isCurrent ? "ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/10" : "hover:border-violet-500/30"
                      }`}
                    >
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-white">${price}</span>
                          <span className="text-slate-400 text-sm">/month</span>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-violet-400" />
                            {planCredits} credits
                          </li>
                          {planId !== "free" && (
                            <li className="text-slate-500 text-xs">Resets monthly</li>
                          )}
                        </ul>
                      </CardHeader>
                      <CardContent>
                        {isCurrent ? (
                          <div className="flex items-center gap-2 text-violet-400 text-sm">
                            <Check className="h-4 w-4" />
                            {t("billing.currentPlan")}
                          </div>
                        ) : canUpgrade ? (
                          <PayPalSubscribe
                            planId={planId}
                            planName={plan.name}
                            credits={planCredits}
                            price={price}
                            loading={upgradeLoading === planId}
                            onUpgrade={handleUpgrade}
                          />
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <BillingHistorySection />

            <p className="text-slate-500 text-sm mt-8">
              Add PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, and plan IDs (PAYPAL_PRO_PLAN_ID, etc.) to enable subscriptions.
            </p>
          </>
        ) : (
          <p className="text-slate-400">Failed to load billing data.</p>
        )}
      </motion.div>
    </div>
  );
}
