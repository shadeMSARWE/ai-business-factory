"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const PLANS = [
  {
    id: "pro" as const,
    name: "Starter",
    price: 19,
    features: ["3 websites", "Templates", "Download ZIP"],
    cta: "Subscribe with PayPal",
    popular: false,
  },
  {
    id: "business" as const,
    name: "Pro",
    price: 39,
    features: ["10 websites", "AI generator", "Templates", "Editor", "Analytics"],
    cta: "Subscribe with PayPal",
    popular: true,
  },
  {
    id: "agency" as const,
    name: "Business",
    price: 90,
    features: [
      "Unlimited websites",
      "All AI tools",
      "Templates",
      "Analytics",
      "Priority support",
    ],
    cta: "Subscribe with PayPal",
    popular: false,
  },
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      router.replace("/dashboard/billing");
      return;
    }
    if (canceled === "true") {
      router.replace("/pricing");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!user) {
      setBillingLoading(false);
      return;
    }
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => {
        setCurrentPlanId(d.planId || null);
      })
      .catch(() => {})
      .finally(() => setBillingLoading(false));
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error || "Failed to create subscription");
    } catch (e) {
      console.error(e);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple pricing
          </h1>
          <p className="text-xl text-slate-400">
            Start free. Upgrade when you need more.
          </p>
        </motion.div>

        <div className="container mx-auto grid md:grid-cols-3 gap-8 max-w-5xl">
          {PLANS.map((plan, i) => {
            const isCurrent = currentPlanId === plan.id;
            const isLoading = loadingPlan === plan.id;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`h-full border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all ${
                    plan.popular ? "border-violet-500/50 ring-2 ring-violet-500/30" : ""
                  } ${isCurrent ? "ring-2 ring-emerald-500/50 border-emerald-500/30" : ""}`}
                >
                  {plan.popular && !isCurrent && (
                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 py-1.5 text-center text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="bg-emerald-500/20 py-1.5 text-center text-sm font-medium text-emerald-400 border-b border-emerald-500/30">
                      Current Plan
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-slate-300">
                          <Check className="h-5 w-5 text-violet-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <Link href="/dashboard/billing">
                        <Button
                          variant="outline"
                          className="w-full mt-6 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          Manage subscription
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading || billingLoading}
                        className={`w-full mt-6 ${
                          plan.popular
                            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user ? (
                          plan.cta
                        ) : (
                          "Sign in to subscribe"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Secure payment via PayPal. Cancel anytime.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f]">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </main>
        <Footer />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
