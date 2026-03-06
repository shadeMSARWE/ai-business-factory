"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { Globe, FileText, User, Link2, MapPin } from "lucide-react";
import { AISuggestionsPanel } from "@/components/dashboard/ai-suggestions-panel";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-16 pb-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t("welcome")} {user?.email || "Guest"}
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <Link href="/builder">
            <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              {t("create_website")}
            </Button>
          </Link>
            <Link href="/dashboard/websites">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-500/10">
                {t("my_websites")}
              </Button>
            </Link>
            <Link href="/dashboard/generate-business">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-500/10">
                {t("generateBusiness")}
              </Button>
            </Link>
          </div>
        </motion.section>

        <section className="py-16 border-t border-white/5">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1">
              <AISuggestionsPanel />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/builder">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/30 transition-colors">
                <Globe className="h-12 w-12 text-violet-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t("create_website")}</h3>
                <p className="text-slate-400">{t("features.aiWebsiteBuilderDesc")}</p>
              </motion.div>
            </Link>
            <Link href="/dashboard/websites">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/30 transition-colors">
                <FileText className="h-12 w-12 text-violet-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t("my_websites")}</h3>
                <p className="text-slate-400">{t("sites.manageDesc")}</p>
              </motion.div>
            </Link>
            <Link href="/dashboard/generate-business">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/30 transition-colors">
                <User className="h-12 w-12 text-violet-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t("account")}</h3>
                <p className="text-slate-400">{t("dashboardSection.accountDesc")}</p>
              </motion.div>
            </Link>
            <Link href="/dashboard/business-finder">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/30 transition-colors">
                <MapPin className="h-12 w-12 text-violet-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI Business Finder</h3>
                <p className="text-slate-400">Find businesses without websites and generate websites for them automatically.</p>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-white/10 border-dashed bg-white/5 p-8 opacity-80"
            >
              <Link2 className="h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t("domain.title")}</h3>
              <p className="text-slate-400 mb-2">{t("domain.desc")}</p>
              <span className="text-xs text-violet-400">{t("domain.comingSoon")}</span>
            </motion.div>
          </div>
        </section>
    </div>
  );
}
