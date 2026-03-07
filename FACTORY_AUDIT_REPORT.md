# AI Business Factory — Full Audit Report

**Date:** 2026-03-06  
**Scope:** Factories, tools, routes, dashboard UI

---

## SECTION A: All Factories (lib/factories/index.ts)

| id | path | status | available | Page Exists |
|----|------|--------|-----------|-------------|
| businessFinder | /dashboard/business-finder | ready | true | **YES** |
| autoOutreach | /dashboard/auto-outreach | new | true | **YES** |
| website | /builder | ready | true | **YES** |
| logo | /dashboard/logo-generator | ready | true | **YES** |
| seo | /dashboard/seo-generator | ready | true | **YES** |
| ads | /dashboard/ad-generator | ready | true | **YES** |
| socialMedia | /dashboard/social-media | new | false | **NO** |
| landingPage | /dashboard/create | ready | true | **YES** |
| mobileApps | /dashboard/mobile-apps | ready | true | **YES** |
| store | /dashboard/store | ready | true | **YES** |
| videoAds | /dashboard/video-ads | new | false | **NO** |

---

## SECTION 1: Factories Working Correctly

These factories have config + page + correct routing:

- **businessFinder** → /dashboard/business-finder ✓
- **autoOutreach** → /dashboard/auto-outreach ✓
- **website** → /builder ✓
- **logo** → /dashboard/logo-generator ✓
- **seo** → /dashboard/seo-generator ✓
- **ads** → /dashboard/ad-generator ✓
- **landingPage** → /dashboard/create ✓
- **mobileApps** → /dashboard/mobile-apps ✓
- **store** → /dashboard/store ✓

---

## SECTION 2: Factories That Point to Missing Pages

| Factory | Path | Issue |
|---------|------|-------|
| socialMedia | /dashboard/social-media | No page exists. `available: false` so shows "Coming soon" in FactoryCard. |
| videoAds | /dashboard/video-ads | No page exists. `available: false` so shows "Coming soon" in FactoryCard. |

**Note:** Both are intentionally disabled (`available: false`). Clicking them shows "Coming soon" — no 404. This is acceptable for planned features.

---

## SECTION 3: Factories Duplicated or Conflicting

**No duplicates found.**

- Mobile App Factory → /dashboard/mobile-apps (unique)
- Store Builder → /dashboard/store (unique)
- No two factories share the same path.

---

## SECTION 4: Dashboard Cards Incorrectly Wired

**File:** `app/dashboard/page.tsx`

### Problem: Dashboard uses HARDCODED cards, NOT FACTORIES config

| Dashboard Card | Route | In FACTORIES? | Issue |
|----------------|-------|---------------|-------|
| Create Website | /builder | Yes (website) | Hardcoded, not from config |
| My Websites | /dashboard/websites | No | Management page, not a factory |
| Account | /dashboard/generate-business | No | Generate Business, not a factory |
| AI Business Finder | /dashboard/business-finder | Yes (businessFinder) | Hardcoded |
| Mobile App Factory | /dashboard/mobile-apps | Yes (mobileApps) | Hardcoded, uses `router.push()` |
| Store Builder | /dashboard/store | Yes (store) | Hardcoded |
| Domain (coming soon) | — | No | Placeholder, not clickable |

### Specific issues

1. **No single source of truth** — Dashboard cards are manually maintained; adding a factory requires editing both `lib/factories` and `app/dashboard/page.tsx`.
2. **Inconsistent coverage** — Logo, SEO, Ads, Landing Page, Auto Outreach factories exist in config but have NO cards on the main dashboard.
3. **Non-factory cards** — "My Websites" and "Account" (Generate Business) are utility pages, not factories. They may belong in a different section.
4. **Manual routing** — Mobile App Factory and Store Builder use `router.push()` instead of `<Link href={...}>`, unlike other cards.

---

## SECTION 5: Proposed Clean Architecture

### Principle: Dashboard renders factories from `lib/factories/index.ts`

```
lib/factories/index.ts (single source of truth)
        ↓
app/dashboard/page.tsx (dynamic render)
        ↓
FactoryCard or DashboardFactoryCard component
```

### Recommended structure

1. **Primary actions** (above the grid): Create Website, My Websites, Generate Business — keep as quick actions, not factory cards.
2. **Factory grid**: Render from `FACTORIES` config, filtered by `available: true` and optionally by a `showOnDashboard: true` flag.
3. **Coming soon**: Optional section for `available: false` factories.
4. **Utility section**: My Websites, Templates, etc. — separate from factory tools.

### New factory config shape (optional)

```ts
export interface FactoryConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  available: boolean;
  status: FactoryStatus;
  popular?: boolean;
  showOnDashboard?: boolean;  // NEW: control dashboard visibility
  icon?: string;              // NEW: icon key for mapping
}
```

---

## SECTION 6: Step-by-Step Cleanup Plan

### Phase 1: Add `showOnDashboard` (non-breaking)

1. Add `showOnDashboard?: boolean` to `FactoryConfig` in `lib/factories/index.ts`.
2. Set `showOnDashboard: true` for: website, businessFinder, autoOutreach, logo, seo, ads, landingPage, mobileApps, store.
3. Set `showOnDashboard: false` or omit for: socialMedia, videoAds.

### Phase 2: Create `DashboardFactoryCard` component

1. Create `components/dashboard/dashboard-factory-card.tsx`.
2. Accept `factory: FactoryConfig` and render card using `factory.name`, `factory.description`, `factory.path`.
3. Use `<Link href={factory.path}>` for navigation (no `router.push`).
4. Map `factory.id` to icon (reuse or extend `factory-card.tsx` icon map).

### Phase 3: Refactor dashboard page

1. Import `FACTORIES` and `FACTORY_ORDER` from `lib/factories`.
2. Filter: `dashboardFactories = FACTORY_ORDER.map(id => FACTORIES[id]).filter(f => f.available && f.showOnDashboard !== false)`.
3. Replace hardcoded factory cards with:
   ```tsx
   {dashboardFactories.map((factory) => (
     <DashboardFactoryCard key={factory.id} factory={factory} />
   ))}
   ```
4. Keep "Create Website", "My Websites", "Generate Business" as separate primary action buttons.
5. Keep "Domain (coming soon)" as a static placeholder if desired.

### Phase 4: Unify navigation

1. Replace `router.push()` with `<Link href={factory.path}>` in dashboard cards.
2. Remove `handleMobileAppFactoryClick` and `handleStoreBuilderClick` from dashboard page.

### Phase 5: Optional — create placeholder pages for socialMedia and videoAds

1. Create `app/dashboard/social-media/page.tsx` with "Coming soon" content.
2. Create `app/dashboard/video-ads/page.tsx` with "Coming soon" content.
3. Set `available: true` when ready to launch.

---

## Summary

| Metric | Count |
|--------|-------|
| Total factories in config | 11 |
| Factories with working pages | 9 |
| Factories with missing pages (intentionally disabled) | 2 |
| Duplicate/conflicting routes | 0 |
| Dashboard cards hardcoded | 6 factory-related |
| Dashboard cards from FACTORIES | 0 |

**Main finding:** The dashboard does not use the FACTORIES config. Refactoring to render from config will reduce duplication and keep factories in sync.
