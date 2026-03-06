"use client";

import { useLanguage } from "@/components/providers/language-provider";

/**
 * useTranslation - Load language from localStorage, returns t() for translations.
 * Supports flat keys: t("home"), t("dashboard"), t("login")
 */
export function useTranslation() {
  return useLanguage();
}
