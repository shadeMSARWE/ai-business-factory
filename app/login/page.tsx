"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const authEnabled = !!supabase;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Authentication is not configured. Contact support.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!authEnabled) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <Logo showSubtitle />
        <p className="text-slate-400 mt-8 text-center max-w-md">
          Authentication is not configured. Add Supabase credentials to .env.local to enable login.
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button>Continue to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Link>
        <Logo showSubtitle />
        <h1 className="text-2xl font-bold text-white mt-8 mb-2">{t("auth.loginTitle")}</h1>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div>
            <Label className="text-slate-400">{t("auth.email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 bg-white/5 border-white/20"
            />
          </div>
          <div>
            <Label className="text-slate-400">{t("auth.password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 bg-white/5 border-white/20"
            />
          </div>
          <Link href="/forgot-password" className="block text-sm text-violet-400 hover:underline">
            {t("auth.forgotPassword")}
          </Link>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
            {loading ? t("common.loading") : t("common.login")}
          </Button>
        </form>
        <p className="text-slate-400 text-sm mt-6 text-center">
          {t("auth.noAccount")}{" "}
          <Link href="/signup" className="text-violet-400 hover:underline">
            {t("common.signup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
