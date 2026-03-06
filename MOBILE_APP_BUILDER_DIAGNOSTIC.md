# Mobile App Builder — Full Diagnostic Report

**Date:** 2026-03-06  
**Status:** FIXES APPLIED

---

## ROUTES

| Route | Status | File |
|-------|--------|------|
| `/dashboard/store` | OK | `app/dashboard/store/page.tsx` |
| `/dashboard/apps` | OK | `app/dashboard/apps/page.tsx` |
| `/dashboard/apps/new` | OK | `app/dashboard/apps/new/page.tsx` |
| `/dashboard/apps/[id]` | OK | `app/dashboard/apps/[id]/page.tsx` |

All routes exist and are functional.

---

## COMPONENTS

### Dashboard Cards (`app/dashboard/page.tsx`)

**FIX APPLIED:** Replaced `Link` components with `motion.div` + `router.push()` for Mobile App Builder and Store Builder cards.

- **Mobile App Builder** → `router.push("/dashboard/apps")` via `handleToolClick("mobile-app-builder", "/dashboard/apps")`
- **Store Builder** → `router.push("/dashboard/store")` via `handleToolClick("store-builder", "/dashboard/store")`

**Why:** Using `router.push()` in `onClick` guarantees navigation to the correct URL, avoiding any Link/href issues.

### Centralized Config (`lib/dashboard-tools.ts`)

- Single source of truth for hrefs
- `mobileAppBuilder.href` = `/dashboard/apps`
- `storeBuilder.href` = `/dashboard/store`

### Navigation

| Component | Apps Link | Store Link |
|-----------|-----------|------------|
| `dashboard-sidebar.tsx` | `/dashboard/apps` | `/dashboard/store` |
| `dashboard-nav.tsx` | `/dashboard/apps` | `/dashboard/store` |
| `lib/factories/index.ts` | `app.path` = `/dashboard/apps` | `store.path` = `/dashboard/store` |

---

## API

| Endpoint | Status | File |
|----------|--------|------|
| `GET /api/apps` | OK | `app/api/apps/route.ts` |
| `POST /api/apps/generate` | OK | `app/api/apps/generate/route.ts` |
| `POST /api/apps/build` | OK | `app/api/apps/build/route.ts` |
| `GET /api/apps/[id]` | OK | `app/api/apps/[id]/route.ts` |

---

## DATABASE

| Table | Status | Migration |
|-------|--------|-----------|
| `apps` | OK | `009_mobile_app_factory.sql` |
| `app_screens` | OK | `009_mobile_app_factory.sql` |
| `app_builds` | OK | `009_mobile_app_factory.sql` |
| `apps.platform` column | Migration provided | `010_app_platform.sql` |

**Run in Supabase SQL Editor:**
```sql
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'both';
```

---

## DEPLOYMENT

**Vercel:** Ensure the latest commit is deployed:

1. Push changes: `git add . && git commit -m "Fix Mobile App Builder routing" && git push`
2. In Vercel Dashboard → Deployments, confirm the new deployment is live
3. Clear browser cache or use incognito to test

---

## FIXES APPLIED

1. **Dashboard cards** — Switched from `Link` to `router.push()` for Mobile App Builder and Store Builder so navigation is controlled in code.
2. **Console debug** — `handleToolClick` logs: `[Dashboard] Tool "mobile-app-builder" clicked -> navigating to /dashboard/apps`
3. **Centralized config** — Added `lib/dashboard-tools.ts` for hrefs.
4. **Data attributes** — Cards use `data-card` and `data-href` for debugging.

---

## VERIFICATION

1. Open DevTools Console (F12)
2. Go to `/dashboard`
3. Click "Open Tool" on **Mobile App Builder**
4. Console should show: `[Dashboard] Tool "mobile-app-builder" clicked -> navigating to /dashboard/apps`
5. Page should load `/dashboard/apps` (Mobile App Builder list)
