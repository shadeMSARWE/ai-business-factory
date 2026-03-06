"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function Header() {
  const { t, locale, setLocale, isRtl } = useLanguage();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo showSubtitle />

        <nav className={`hidden md:flex items-center gap-6 ${isRtl ? "flex-row-reverse" : ""}`}>
          <Link href="/dashboard/templates" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("nav.templates")}
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("nav.pricing")}
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("common.dashboard")}
          </Link>
          <Link href="/factory" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("nav.howItWorks")}
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition">
            {t("nav.contact")}
          </Link>

          <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="bg-transparent border-none text-sm cursor-pointer focus:ring-0"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="he">עברית</option>
            </select>
          </div>

          <AuthButton dashboardLabel={t("common.dashboard")} />
        </nav>
      </div>
    </motion.header>
  );
}
