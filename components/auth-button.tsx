"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";

interface AuthButtonProps {
  dashboardLabel?: string;
}

export function AuthButton({ dashboardLabel = "Dashboard" }: AuthButtonProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const authEnabled = !!supabase;

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (!authEnabled) {
    return (
      <Link href="/dashboard">
        <Button>{dashboardLabel}</Button>
      </Link>
    );
  }

  if (loading) {
    return <Button disabled>{dashboardLabel}</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400 hidden sm:inline">{user.email}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
          Logout
        </Button>
        <Link href="/dashboard">
          <Button>{dashboardLabel}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
}
