"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const authEnabled = !!supabase;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      if (err) {
        setError(err.message);
        return;
      }
      setSent(true);
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
        <p className="text-slate-400 mt-8 text-center max-w-md">Authentication is not configured.</p>
        <Link href="/login" className="mt-6">
          <Button>{t("common.back")}</Button>
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <Logo showSubtitle />
          <h1 className="text-2xl font-bold text-white mt-8 mb-4">{t("auth.resetPassword")}</h1>
          <p className="text-slate-400 mb-8">{t("auth.checkEmail")}</p>
          <Link href="/login">
            <Button variant="outline" className="border-white/20">
              {t("common.back")} to {t("common.login")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Link>
        <Logo showSubtitle />
        <h1 className="text-2xl font-bold text-white mt-8 mb-2">{t("auth.resetPassword")}</h1>
        <form onSubmit={handleReset} className="space-y-4 mt-6">
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
            {loading ? t("common.loading") : t("auth.resetPassword")}
          </Button>
        </form>
      </div>
    </div>
  );
}
