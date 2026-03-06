"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CreditAction } from "@/lib/credits";

export function useCreditsAction(action: CreditAction) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const deductAndRun = useCallback(
    async (fn: () => void | Promise<void>) => {
      const res = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "credits_exceeded") {
          setShowModal(true);
        }
        return;
      }
      await fn();
    },
    [action]
  );

  const handleUpgrade = useCallback(() => {
    setShowModal(false);
    router.push("/dashboard/billing");
  }, [router]);

  return { deductAndRun, showModal, setShowModal, handleUpgrade };
}
