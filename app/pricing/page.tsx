"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const PAYPAL_PLACEHOLDER = "https://www.paypal.com/subscribe";

const plans = [
  {
    name: "Starter",
    price: 9,
    features: ["3 websites", "Templates", "Download ZIP"],
    cta: "Subscribe with PayPal",
    popular: false,
    href: PAYPAL_PLACEHOLDER,
  },
  {
    name: "Pro",
    price: 19,
    features: ["10 websites", "AI generator", "Templates", "Editor", "Analytics"],
    cta: "Subscribe with PayPal",
    popular: true,
    href: PAYPAL_PLACEHOLDER,
  },
  {
    name: "Business",
    price: 39,
    features: [
      "Unlimited websites",
      "All AI tools",
      "Templates",
      "Analytics",
      "Priority support",
    ],
    cta: "Subscribe with PayPal",
    popular: false,
    href: PAYPAL_PLACEHOLDER,
  },
];

export default function PricingPage() {
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
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`h-full border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden ${
                  plan.popular ? "border-violet-500/50 ring-2 ring-violet-500/30" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 py-1.5 text-center text-sm font-medium text-white">
                    Most Popular
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
                  <a href={plan.href} target="_blank" rel="noopener noreferrer">
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          PayPal integration is for demonstration. Add your PayPal credentials to enable real subscriptions.
        </p>
      </main>

      <Footer />
    </div>
  );
}
