"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import {
  User,
  Globe,
  Sun,
  Moon,
  Bell,
  Key,
  LogOut,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t("settings")}</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-violet-400" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">Email</Label>
              <p className="text-white font-medium mt-1">{user?.email ?? "—"}</p>
            </div>
            <div>
              <Label className="text-slate-400">Account ID</Label>
              <p className="text-slate-400 text-sm font-mono mt-1 truncate">
                {user?.id ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-400" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-3">
              Change language using the switcher in the header (EN / AR / HE).
            </p>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-white/20 text-slate-300">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Dark / Light mode */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-violet-400" />
              ) : (
                <Sun className="h-5 w-5 text-violet-400" />
              )}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <Label className="text-slate-400">Theme</Label>
              <div className="flex rounded-lg border border-white/10 p-1 bg-white/5">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-violet-500/30 text-violet-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === "light"
                      ? "bg-violet-500/30 text-violet-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Preference is saved and applied across the platform. Default: Dark.
            </p>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-violet-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <Label className="text-slate-400">Email notifications</Label>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={() => setNotifications((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  notifications ? "bg-violet-500/50" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                    notifications ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Receive updates about your account and product news.
            </p>
          </CardContent>
        </Card>

        {/* API settings placeholder */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-violet-400" />
              API & Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-3">
              API keys and third-party integrations will be available here in a future update.
            </p>
            <Button variant="outline" size="sm" disabled className="border-white/10 text-slate-500">
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Account management */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white">Account management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/billing" className="block text-violet-400 hover:underline text-sm">
              Billing & plans
            </Link>
            <Link href="/contact" className="block text-violet-400 hover:underline text-sm">
              Contact support
            </Link>
            <Link href="/privacy" className="block text-violet-400 hover:underline text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-violet-400 hover:underline text-sm">
              Terms of Service
            </Link>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-6">
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
