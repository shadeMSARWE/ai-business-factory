"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/hooks/use-translation";
import { LogOut, LayoutDashboard, User } from "lucide-react";

export function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const supabase = createClient();

  const handleLoginWithGoogle = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (!supabase) {
    return (
      <Link href="/dashboard">
        <Button>{t("dashboard")}</Button>
      </Link>
    );
  }

  if (loading) {
    return <Button disabled>{t("dashboard")}</Button>;
  }

  if (user) {
    const initial = user.email?.charAt(0)?.toUpperCase() || "U";
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400 hidden lg:inline max-w-[140px] truncate">{user.email}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <Avatar className="h-9 w-9 border-2 border-white/10">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                <AvatarFallback className="bg-violet-500/30 text-violet-300 text-sm">{initial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10">
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <LayoutDashboard className="h-4 w-4" />
                {t("dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-sites" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                {t("my_websites")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-400">
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button onClick={handleLoginWithGoogle} className="bg-white text-slate-900 hover:bg-slate-100">
      {t("login")}
    </Button>
  );
}
