"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const { t, isRtl } = useTranslation();
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f]">
      <div className={`container mx-auto px-6 py-16 ${isRtl ? "text-right" : ""}`}>
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <Logo showSubtitle />
            <p className="text-slate-500 text-sm mt-4">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition">{t("dashboard")}</Link></li>
              <li><Link href="/dashboard/templates" className="text-slate-400 hover:text-white transition">{t("templates")}</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white transition">{t("pricing")}</Link></li>
              <li><Link href="/factory" className="text-slate-400 hover:text-white transition">{t("footer.howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="mailto:shademsarwe2@gmail.com" className="hover:text-white transition">
                  shademsarwe2@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/972528644412" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  WhatsApp: +972 52 864 4412
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} InstantBizSite AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
