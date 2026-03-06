"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PayPalSubscribeProps {
  planId: "pro" | "business" | "agency";
  planName: string;
  credits: number;
  price: number;
  loading?: boolean;
  disabled?: boolean;
  onUpgrade?: (planId: string) => void;
}

export function PayPalSubscribe({
  planId,
  planName,
  credits,
  price,
  loading = false,
  disabled = false,
  onUpgrade,
}: PayPalSubscribeProps) {
  const handleClick = () => {
    if (onUpgrade) {
      onUpgrade(planId);
    } else {
      window.location.href = "/dashboard/billing";
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        `Upgrade to ${planName}`
      )}
    </Button>
  );
}
