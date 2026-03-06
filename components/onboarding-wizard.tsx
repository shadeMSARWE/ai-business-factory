"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const STORAGE_KEY = "instantbizsite_onboarding_done";

const STEPS = [
  { id: "welcome", title: "Welcome", desc: "Choose your business type and we'll generate your first website.", cta: "Get Started" },
  { id: "generate", title: "Generate", desc: "Describe your business in one sentence and we'll create your site.", cta: "Generate Website" },
  { id: "customize", title: "Customize", desc: "Edit your site in the editor. Add sections, change colors, and more.", cta: "Open Editor" },
  { id: "publish", title: "Publish", desc: "Publish your site and share it with the world.", cta: "Publish" },
];

export function OnboardingWizard() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setShow(true);
    } catch {}
  }, [user]);

  const handleComplete = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setShow(false);
  };

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!show || !user) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-white">{current.title}</h2>
            <button className="text-slate-400 hover:text-white" onClick={handleComplete}>
              Skip
            </button>
          </div>
          <p className="text-slate-400 mb-6">{current.desc}</p>
          <div className="flex gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-violet-500" : "bg-white/10"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              href={step === 0 ? "/builder" : step === 1 ? "/builder" : step === 2 ? "/dashboard" : "/my-sites"}
              onClick={() => {
                handleNext();
                handleComplete();
              }}
            >
              <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                {current.cta}
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleComplete}>
              Skip
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
