"use client";

import React, { createContext, useContext, useEffect, useCallback, useState } from "react";

export interface BillingData {
  planId: string;
  planName: string;
  credits: number;
  creditsUsed: number;
  creditsLimit: number;
  canUseCredits: boolean;
  creditsLow: boolean;
  creditsExhausted: boolean;
}

interface CreditsContextType {
  billing: BillingData | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType>({
  billing: null,
  loading: true,
  refetch: async () => {},
});

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();
      if (res.ok) setBilling(data);
    } catch {
      setBilling(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <CreditsContext.Provider value={{ billing, loading, refetch }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditsContext);
}
