"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreditCard, Zap, Loader2, Check } from "lucide-react";
import { PLANS } from "@/lib/stripe";

interface BillingData {
  planId: string;
  planName: string;
  sitesCount: number;
  sitesLimit: number;
  generationsCount: number;
  generationsLimit: number;
  canCreateSite: boolean;
  canGenerate: boolean;
  status: string;
  hasSubscription: boolean;
}

export default function BillingPage() {
  const { t } = useTranslation();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => setBilling(d))
      .catch(() => setBilling(null))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Failed");
    } catch (e) {
      console.error(e);
      setCheckoutLoading(null);
    }
  };

  const formatLimit = (n: number) => (n === -1 ? t("billing.unlimited") : n.toString());

  return (
    <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
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
              <Card className="border-white/10 bg-white/5 mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">Current Plan: {billing.planName}</h2>
                  <p className="text-slate-400 text-sm">
                    {billing.hasSubscription ? t("billing.activeSubscription") : t("billing.freeTier")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Websites</p>
                      <p className="text-2xl font-bold text-white">
                        {billing.sitesCount} / {formatLimit(billing.sitesLimit)}
                      </p>
                      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{
                            width: `${billing.sitesLimit === -1 ? 100 : Math.min(100, (billing.sitesCount / billing.sitesLimit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">AI Generations (this month)</p>
                      <p className="text-2xl font-bold text-white">
                        {billing.generationsCount} / {formatLimit(billing.generationsLimit)}
                      </p>
                      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-fuchsia-500 rounded-full transition-all"
                          style={{
                            width: `${billing.generationsLimit === -1 ? 100 : Math.min(100, (billing.generationsCount / billing.generationsLimit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {!billing.canCreateSite && (
                    <p className="text-amber-400 text-sm">You&apos;ve reached your website limit. Upgrade to create more.</p>
                  )}
                  {!billing.canGenerate && (
                    <p className="text-amber-400 text-sm">You&apos;ve reached your AI generation limit for this month.</p>
                  )}
                </CardContent>
              </Card>

              <h2 className="text-xl font-semibold text-white mb-6">Available Plans</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(["free", "pro", "business", "agency"] as const).map((planId) => {
                  const plan = PLANS[planId];
                  const isCurrent = billing.planId === planId;
                  const canUpgrade = planId !== "free" && plan.priceId && !isCurrent;
                  return (
                    <Card
                      key={planId}
                      className={`border-white/10 bg-white/5 ${
                        isCurrent ? "ring-2 ring-violet-500/50" : ""
                      }`}
                    >
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-white">${plan.priceMonthly}</span>
                          <span className="text-slate-400 text-sm">/month</span>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-300">
                          <li>{formatLimit(plan.sitesLimit)} websites</li>
                          <li>{formatLimit(plan.generationsLimit)} AI generations</li>
                        </ul>
                      </CardHeader>
                      <CardContent>
                        {isCurrent ? (
                          <div className="flex items-center gap-2 text-violet-400 text-sm">
                            <Check className="h-4 w-4" />
                            {t("billing.currentPlan")}
                          </div>
                        ) : canUpgrade ? (
                          <Button
                            onClick={() => handleUpgrade(planId)}
                            disabled={!!checkoutLoading}
                            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          >
                            {checkoutLoading === planId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t("billing.upgrade")
                            )}
                          </Button>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p className="text-slate-500 text-sm mt-8">
                Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and plan price IDs (STRIPE_PRO_PRICE_ID, etc.) to enable subscriptions.
              </p>
            </>
          ) : (
            <p className="text-slate-400">Failed to load billing data.</p>
          )}
        </motion.div>
    </div>
  );
}
