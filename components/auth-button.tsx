"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  dashboardLabel?: string;
}

export function AuthButton({ dashboardLabel = "Dashboard" }: AuthButtonProps) {
  return (
    <Link href="/dashboard">
      <Button>{dashboardLabel}</Button>
    </Link>
  );
}
