"use client";

import { useMemo } from "react";
import type { BusinessType } from "@/lib/business-types";

const LOGO_COLORS: Record<BusinessType, { primary: string; secondary: string; bg: string }> = {
  restaurant: { primary: "#f97316", secondary: "#fbbf24", bg: "#fff7ed" },
  dentist: { primary: "#0ea5e9", secondary: "#06b6d4", bg: "#ecfeff" },
  salon: { primary: "#ec4899", secondary: "#8b5cf6", bg: "#fdf2f8" },
  car_wash: { primary: "#3b82f6", secondary: "#06b6d4", bg: "#eff6ff" },
  real_estate: { primary: "#1e293b", secondary: "#64748b", bg: "#f8fafc" },
  construction: { primary: "#0f766e", secondary: "#14b8a6", bg: "#f0fdfa" },
  law_firm: { primary: "#1e3a5f", secondary: "#0f172a", bg: "#f1f5f9" },
  gym: { primary: "#dc2626", secondary: "#f97316", bg: "#fff1f2" },
};

const ICONS: Record<BusinessType, string> = {
  restaurant: "🍕",
  dentist: "🦷",
  salon: "✂️",
  car_wash: "🚗",
  real_estate: "🏠",
  construction: "🏗️",
  law_firm: "⚖️",
  gym: "💪",
};

export interface LogoVariation {
  id: string;
  icon: string;
  text: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  style: "rounded" | "square" | "minimal" | "bold";
}

const FALLBACK_COLOR = { primary: "#8b5cf6", secondary: "#d946ef", bg: "#faf5ff" };

export function generateLogoVariations(
  businessName: string,
  businessType: BusinessType
): LogoVariation[] {
  const baseColor = LOGO_COLORS[businessType] || FALLBACK_COLOR;
  const icon = ICONS[businessType] || "✨";
  const shortName = businessName.split(" ")[0] || businessName.slice(0, 12);

  const styles: LogoVariation["style"][] = ["rounded", "square", "minimal", "bold"];
  const colorVariants = [
    baseColor,
    { ...baseColor, primary: baseColor.secondary, secondary: baseColor.primary },
    { ...baseColor, primary: "#1e293b", secondary: baseColor.primary },
    { ...baseColor, primary: baseColor.primary, secondary: "#64748b" },
  ];

  return styles.map((style, i) => ({
    id: `logo-${i}`,
    icon,
    text: shortName,
    primaryColor: colorVariants[i].primary,
    secondaryColor: colorVariants[i].secondary,
    bgColor: colorVariants[i].bg,
    style,
  }));
}

export function LogoGenerator({
  variations,
  selectedId,
  onSelect,
}: {
  variations: LogoVariation[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {variations.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onSelect?.(v.id)}
          className={`rounded-2xl border-2 transition-all overflow-hidden text-left ${
            selectedId === v.id
              ? "border-violet-500 ring-2 ring-violet-500/30"
              : "border-white/10 hover:border-violet-500/50"
          }`}
        >
          <div
            className="aspect-square flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: v.bgColor }}
          >
            <span
              className={`mb-2 ${
                v.style === "bold" ? "text-5xl" : v.style === "minimal" ? "text-3xl" : "text-4xl"
              }`}
            >
              {v.icon}
            </span>
            <span
              className={`font-bold truncate max-w-full ${
                v.style === "bold" ? "text-xl" : "text-lg"
              }`}
              style={{ color: v.primaryColor }}
            >
              {v.text}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
