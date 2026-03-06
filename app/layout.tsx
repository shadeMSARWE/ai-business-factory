import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { LocaleInitScript } from "@/components/locale-init-script";
import { Analytics } from "@vercel/analytics/react";
import { OnboardingWizard } from "@/components/onboarding-wizard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstantBizSite AI - Create Websites in Seconds",
  description: "AI-powered website builder for any business. Generate complete multi-page websites from a simple text prompt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LocaleInitScript />
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <OnboardingWizard />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
