import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import he from "@/locales/he.json";

export const locales = ["en", "ar", "he"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar", "he"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

const translations = { en, ar, he };

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}

export function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}
