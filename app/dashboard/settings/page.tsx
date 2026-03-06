"use client";

import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">{t("settings")}</h1>
      <p className="text-slate-400 mb-10">Manage your account settings</p>

      <Card className="border-white/10 bg-white/5 max-w-xl">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Account</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <p className="text-white font-medium">{user?.email || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Language</label>
            <p className="text-white">Change language using the switcher in the header</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
