/**
 * Dashboard tool cards configuration.
 * Single source of truth for hrefs to prevent routing bugs.
 */
export const DASHBOARD_TOOLS = {
  mobileAppBuilder: {
    id: "mobile-app-builder",
    href: "/dashboard/apps",
    titleKey: "tools.mobileAppBuilder",
    description: "Generate Android & iOS apps with AI.",
  },
  storeBuilder: {
    id: "store-builder",
    href: "/dashboard/store",
    titleKey: "tools.storeBuilder",
    description: "Generate e-commerce stores with products and checkout.",
  },
} as const;
