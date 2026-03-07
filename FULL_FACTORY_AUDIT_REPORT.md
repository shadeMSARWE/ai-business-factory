# AI Business Factory / InstantBizSite AI — Full Internal Audit Report

**Date:** March 7, 2026  
**Scope:** Complete technical and product audit  
**Project:** AI Business Factory (InstantBizSite AI)

---

# 1. Executive Summary

AI Business Factory is a Next.js 14 SaaS platform that provides AI-powered tools for local businesses: website generation, logo creation, SEO, ads, business discovery, and automated outreach. The platform uses Supabase for auth and database, PayPal for subscriptions, OpenAI for AI generation, and deploys on Vercel.

**Current state:** The product has a solid foundation with multiple working factories (Website, Logo, SEO, Ads, Business Finder, Auto Outreach, Mobile Apps, Landing Page). However, significant technical debt exists: dual website storage systems (projects/generated_sites vs sites), unused database tables (apps, app_screens, app_builds), duplicate routes (/my-sites vs /dashboard/websites), inconsistent nav structures, and several placeholder factories (Store, Universal Builder). Billing uses PayPal but retains Stripe-named columns. The dashboard factory grid is now dynamic; nav and sidebar remain hardcoded.

**Highest-priority next step:** Consolidate website storage to a single source of truth (sites table) and remove or deprecate the projects/generated_sites path before adding new features.

---

# 2. Full Technical Audit

---

## SECTION 1 — PROJECT OVERVIEW

### 1.1 What This Platform Is

AI Business Factory (branded InstantBizSite AI) is a multi-tool SaaS platform for agencies and freelancers who serve local businesses. Users can generate websites, logos, SEO content, ad copy, find businesses without websites, and send automated outreach emails with demo site offers.

### 1.2 What the Product Is Supposed to Do

- **Website Factory:** Generate full business websites with AI (hero, about, services, testimonials, contact).
- **Store Factory:** Generate ecommerce stores (currently placeholder).
- **Mobile App Factory:** Create Android/iOS app projects (AI-assisted).
- **Business Finder:** Search Google Maps for local businesses, detect missing websites, generate demo sites.
- **Auto Outreach:** Find businesses, generate demo sites, send automated email offers.
- **Logo, SEO, Ads Factories:** Generate brand assets and marketing copy.
- **Landing Page Factory:** Generate high-converting landing pages.
- **Universal Builder:** Generate base project structures for SaaS/mobile/AI tools (currently placeholder).
- **Billing:** PayPal subscriptions (Starter/Pro/Business plans) and credit-based usage.

### 1.3 Core Architecture

- **Frontend:** Next.js 14 App Router, React 18, Framer Motion, Tailwind CSS, Radix UI.
- **Auth:** Supabase Auth (email/password).
- **Database:** Supabase (PostgreSQL) with RLS.
- **AI:** OpenAI API (GPT) for text generation.
- **Payments:** PayPal Subscriptions API.
- **Deployment:** Vercel with cron for outreach queue processing.

### 1.4 Technologies Used

| Technology | Purpose |
|------------|---------|
| Next.js 14.1 | Framework, App Router |
| Supabase | Auth, PostgreSQL, RLS |
| OpenAI | Website content, SEO, ads, logos |
| PayPal | Subscriptions (pro, business, agency) |
| Vercel | Hosting, cron |
| Framer Motion | Animations |
| Tailwind CSS | Styling |
| Nodemailer | SMTP for outreach emails |

### 1.5 User Journey

1. **Sign up / Login** → `/login`, `/signup`
2. **Dashboard** → `/dashboard` (welcome, factory cards, quick actions)
3. **Create Website** → `/builder` (streaming AI generation) or `/dashboard/create` (landing page)
4. **My Websites** → `/dashboard/websites` (list, edit, publish, delete)
5. **Factory Tools** → Logo, SEO, Ads, Business Finder, Auto Outreach, Mobile Apps, Store
6. **Billing** → `/dashboard/billing` (credits, plans, PayPal subscribe)
7. **Published Sites** → `/s/[slug]` (public view)

### 1.6 Next.js Structure

```
app/
├── page.tsx                 # Home
├── layout.tsx, globals.css, error.tsx
├── login, signup, forgot-password
├── pricing, contact
├── builder/                 # AI Website Builder (main)
├── factory/                 # How it works
├── my-sites/                # Duplicate of dashboard/websites
├── preview/[id], editor/[id]
├── s/[slug]/                # Published sites
├── auth/callback/           # Supabase auth redirect
└── dashboard/               # Auth-protected dashboard
    ├── page, create, universal-builder
    ├── mobile-apps, billing, credits, leads
    ├── business-finder, business-result, auto-outreach
    ├── ad-generator, seo-generator, logo-generator
    ├── factories, tools, templates, websites, settings
    ├── analytics, store, outreach, generate-business
    └── api/                 # 39 API routes
```

### 1.7 Supabase Usage

- **Auth:** `auth.users` (Supabase managed)
- **Sync:** `public.users` (id, email) via trigger
- **Tables:** projects, generated_sites, sites, subscriptions, usage, analytics_events, business_leads, auto_outreach_jobs, outreach_queue, leads, lead_events, outreach_templates, credit_packs, billing_history, credit_transactions, apps, app_screens, app_builds, mobile_apps, mobile_app_builds

### 1.8 PayPal Usage

- **Plans:** pro, business, agency (env: PAYPAL_PRO_PLAN_ID, etc.)
- **Webhook:** `/api/paypal/webhook` (BILLING.SUBSCRIPTION.ACTIVATED, CANCELLED, EXPIRED, PAYMENT.SALE.COMPLETED)
- **Create subscription:** `/api/paypal/create-subscription` (redirects to PayPal approval)
- **Note:** `subscriptions` table uses column `stripe_subscription_id` for PayPal subscription ID (legacy naming).

### 1.9 OpenAI Usage

- Builder: `/api/builder/generate-stream` (streaming)
- Website generator: `/api/generate-website`
- Business Finder: `/api/business-finder/search`, generate-website, generate-offer
- Auto Outreach: generate-site, generate-message
- SEO, Ads, Logo: used in respective factory pages

### 1.10 Vercel Deployment

- **Cron:** `/api/auto-outreach/process-queue` every 5 minutes
- **Env:** NEXT_PUBLIC_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, PAYPAL_*, SMTP_*, GOOGLE_MAPS_API_KEY, CRON_SECRET

### 1.11 Dashboard / Builder / Factories Structure

- **Dashboard:** `app/dashboard/page.tsx` — dynamic factory grid from `lib/factories`, grouped by category (core, growth, tools).
- **Builder:** `app/builder/page.tsx` — main AI website builder with streaming generation.
- **Factories:** Each factory has config in `lib/factories/index.ts` (id, name, path, category, showOnDashboard).

---

## SECTION 2 — FULL ROUTES AUDIT

### A) Public Pages

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| / | app/page.tsx | Home/landing | working |
| /login | app/login/page.tsx | Login | working |
| /signup | app/signup/page.tsx | Signup | working |
| /forgot-password | app/forgot-password/page.tsx | Password reset | working |
| /pricing | app/pricing/page.tsx | Pricing plans | working |
| /contact | app/contact/page.tsx | Contact form | working |
| /factory | app/factory/page.tsx | How it works | working |
| /s/[slug] | app/s/[slug]/page.tsx | Published sites (public) | working |

### B) Dashboard Pages

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| /dashboard | app/dashboard/page.tsx | Main dashboard, factory grid | working |
| /dashboard/websites | app/dashboard/websites/page.tsx | My websites list | working |
| /dashboard/create | app/dashboard/create/page.tsx | Landing page creator | working |
| /dashboard/billing | app/dashboard/billing/page.tsx | Billing, credits, PayPal | working |
| /dashboard/credits | app/dashboard/credits/page.tsx | Credits management | working |
| /dashboard/leads | app/dashboard/leads/page.tsx | Lead CRM | working |
| /dashboard/outreach | app/dashboard/outreach/page.tsx | Outreach management | partial |
| /dashboard/analytics | app/dashboard/analytics/page.tsx | Analytics | partial |
| /dashboard/settings | app/dashboard/settings/page.tsx | Settings | working |
| /dashboard/templates | app/dashboard/templates/page.tsx | Templates | partial |
| /dashboard/factories | app/dashboard/factories/page.tsx | All factories overview | working |
| /dashboard/tools | app/dashboard/tools/page.tsx | AI Tools (logo, ad, seo mock) | placeholder |
| /dashboard/generate-business | app/dashboard/generate-business/page.tsx | Generate business assets | working |
| /dashboard/business-result | app/dashboard/business-result/page.tsx | Result of generate-business | working |

### C) Factory Pages

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| /builder | app/builder/page.tsx | AI Website Builder | working |
| /dashboard/business-finder | app/dashboard/business-finder/page.tsx | Business Finder | working |
| /dashboard/business-finder/result | app/dashboard/business-finder/result/page.tsx | Finder results | working |
| /dashboard/auto-outreach | app/dashboard/auto-outreach/page.tsx | Auto Outreach | working |
| /dashboard/ad-generator | app/dashboard/ad-generator/page.tsx | AI Ads Factory | working |
| /dashboard/seo-generator | app/dashboard/seo-generator/page.tsx | AI SEO Factory | working |
| /dashboard/logo-generator | app/dashboard/logo-generator/page.tsx | AI Logo Factory | working |
| /dashboard/mobile-apps | app/dashboard/mobile-apps/page.tsx | Mobile App Factory | working |
| /dashboard/mobile-apps/new | app/dashboard/mobile-apps/new/page.tsx | New mobile app | working |
| /dashboard/mobile-apps/[id] | app/dashboard/mobile-apps/[id]/page.tsx | Edit mobile app | working |
| /dashboard/store | app/dashboard/store/page.tsx | Store Builder | placeholder |
| /dashboard/universal-builder | app/dashboard/universal-builder/page.tsx | Universal Builder | placeholder |
| /dashboard/social-media | — | Social Media Factory | missing (available: false) |
| /dashboard/video-ads | — | Video Ads Factory | missing (available: false) |

### D) Other Pages

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| /my-sites | app/my-sites/page.tsx | My websites (duplicate) | duplicate |
| /preview/[id] | app/preview/[id]/page.tsx | Preview site | partial |
| /editor/[id] | app/editor/[id]/page.tsx | Edit site | partial |

### E) API Routes

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/auth/callback | GET | Supabase auth redirect | working |
| /api/sites | GET | List user sites | working |
| /api/sites/save | POST | Save site | working |
| /api/sites/[id] | GET/PATCH/DELETE | Site CRUD | working |
| /api/site/[slug] | GET | Get site by slug (published) | working |
| /api/save-site | POST | Legacy save (used by create) | working |
| /api/builder/generate | POST | Builder generation | working |
| /api/builder/generate-stream | POST | Builder streaming | working |
| /api/builder/suggestions | POST | Builder suggestions | working |
| /api/builder/chat | POST | Builder chat | working |
| /api/generate-website | POST | Website generator (WebsiteGenerator) | working |
| /api/generate-business | POST | Generate business assets | working |
| /api/search-businesses | — | Legacy search (not used) | obsolete |
| /api/business-finder/search | POST | Business Finder search | working |
| /api/business-finder/generate-website | POST | Generate demo site | working |
| /api/business-finder/generate-offer | POST | Generate offer | working |
| /api/auto-outreach/jobs | GET/POST | Outreach jobs | working |
| /api/auto-outreach/process-queue | POST | Cron: process queue | working |
| /api/auto-outreach/send | POST | Send outreach | working |
| /api/auto-outreach/generate-site | POST | Generate demo site | working |
| /api/auto-outreach/generate-message | POST | Generate message | working |
| /api/auto-outreach/search | POST | Search businesses | working |
| /api/leads | GET/POST | Leads CRUD | working |
| /api/leads/[id] | GET/PATCH/DELETE | Lead CRUD | working |
| /api/leads/events | POST | Lead events | working |
| /api/mobile-apps | GET/POST | Mobile apps CRUD | working |
| /api/mobile-apps/[id] | GET/PATCH/DELETE | Mobile app CRUD | working |
| /api/mobile-apps/build | POST | Build app | partial |
| /api/mobile-apps/generate | POST | Generate app | working |
| /api/credits/deduct | POST | Deduct credits | working |
| /api/billing | GET | Billing/credits status | working |
| /api/billing-history | GET | Billing history | working |
| /api/credit-transactions | — | Credit transactions | partial |
| /api/credit-packs | GET | Credit packs | working |
| /api/paypal/create-subscription | POST | Create PayPal subscription | working |
| /api/paypal/webhook | POST | PayPal webhook | working |
| /api/outreach-templates | — | Outreach templates | partial |
| /api/dashboard/stats | — | Dashboard stats | partial |
| /api/analytics/events | — | Analytics events | partial |
| /api/analytics/track | POST | Track event | working |

---

## SECTION 3 — FACTORIES AUDIT

| id | name | path | available | status | category | Page exists | Dashboard shows | Nav shows | Duplicate | Wrong route |
|----|------|------|-----------|--------|----------|-------------|-----------------|-----------|-----------|-------------|
| businessFinder | AI Business Finder Factory | /dashboard/business-finder | true | ready | core | Yes | Yes | Yes (nav) | No | No |
| autoOutreach | Auto Outreach AI | /dashboard/auto-outreach | true | new | core | Yes | Yes | Yes (nav) | No | No |
| website | AI Website Factory | /builder | true | ready | core | Yes | Yes | No (sidebar: Create Website) | No | No |
| logo | AI Logo Factory | /dashboard/logo-generator | true | ready | growth | Yes | Yes | Yes (nav) | No | No |
| seo | AI SEO Factory | /dashboard/seo-generator | true | ready | growth | Yes | Yes | Yes (nav) | No | No |
| ads | AI Ads Factory | /dashboard/ad-generator | true | ready | growth | Yes | Yes | Yes (nav) | No | No |
| socialMedia | AI Social Media Factory | /dashboard/social-media | false | new | — | No | No | No | No | N/A |
| landingPage | AI Landing Page Factory | /dashboard/create | true | ready | tools | Yes | Yes | No (sidebar: templates) | No | No |
| mobileApps | Mobile App Factory | /dashboard/mobile-apps | true | ready | core | Yes | Yes | Yes (sidebar) | No | No |
| store | AI Store Factory | /dashboard/store | true | ready | core | Yes (placeholder) | Yes | Yes (sidebar) | No | No |
| universalBuilder | Universal Builder Factory | /dashboard/universal-builder | true | new | core | Yes (placeholder) | Yes | No | No | No |
| videoAds | AI Video Ads Factory | /dashboard/video-ads | false | new | — | No | No | No | No | N/A |

### Factory Classification

1. **Fully working:** businessFinder, autoOutreach, website, logo, seo, ads, landingPage, mobileApps
2. **Partially working:** — (none)
3. **Missing page:** socialMedia, videoAds (intentionally disabled)
4. **Duplicate/conflicting:** None
5. **Coming soon only:** store, universalBuilder (pages exist but are placeholders)

### Nav vs Sidebar vs Dashboard

- **Dashboard factory grid:** Dynamic from FACTORIES (showOnDashboard + available).
- **Dashboard sidebar:** Hardcoded (websites, templates, factories, mobile-apps, store, analytics, billing, settings). Missing: logo, seo, ads, business-finder, outreach, credits, universal-builder.
- **Dashboard nav (DashboardNav):** Used on some standalone pages (tools, store, universal-builder, business-result, generate-business). Has: dashboard, billing, factories, Logo, Ads, SEO, Business Finder, Leads, Outreach, Credits, Mobile Apps, Store, How it works, My Websites, Analytics. More complete than sidebar but not used in main dashboard layout.

---

## SECTION 4 — DASHBOARD AUDIT

### Is the dashboard dynamic or hardcoded?

- **Factory grid:** Dynamic. Uses `getDashboardFactories()` and `groupByCategory()` from `lib/factories`. Renders `DashboardFactoryCard` for each factory with `showOnDashboard: true` and `available: true`.
- **Hero quick actions:** Hardcoded (Create Website, My Websites, Generate Business).
- **Domain "Coming soon" card:** Hardcoded placeholder.
- **AI Suggestions panel:** Separate component (AISuggestionsPanel).

### Which parts are rendered from FACTORIES config?

- Core Factories, Growth Tools, Additional Tools sections — all from FACTORIES.
- Each factory card (name, description, path, status) comes from config.

### Which parts are manually hardcoded?

- Hero section (welcome, buttons).
- Domain coming-soon card.
- Sidebar nav items.
- DashboardNav items (when used).

### Which cards are duplicated?

- None in the factory grid. But `/my-sites` and `/dashboard/websites` are duplicate pages (same data, same API).

### Which cards have wrong links?

- None. All factory paths match config.

### Which links point to the same page?

- landingPage → /dashboard/create (Landing Page Factory)
- website → /builder (Website Factory)
- "Create Website" button → /builder

### Recommended architecture

- Keep dashboard factory grid dynamic.
- Make sidebar nav derive from FACTORIES or a shared nav config to avoid drift.
- Remove or redirect `/my-sites` to `/dashboard/websites`.
- Consider merging DashboardNav and DashboardSidebar into a single config-driven nav.

---

## SECTION 5 — DATABASE AUDIT

### Tables

| Table | Purpose | Used in code | Migration | Required | Duplicate/obsolete |
|-------|---------|--------------|-----------|----------|---------------------|
| users | Extends auth.users | Trigger sync | 001 | Yes | No |
| projects | User projects (legacy) | lib/supabase/db.ts | 001 | Unclear | See sites |
| generated_sites | HTML/CSS/JS per project | lib/supabase/db.ts, api/site/[slug] | 001 | Unclear | See sites |
| subscriptions | Plan, status, PayPal sub ID | billing, webhook, credits-service | 001, 003 | Yes | No (column stripe_subscription_id stores PayPal ID) |
| sites | User websites (prompt, html, slug) | api/sites, api/sites/save, api/site/[slug], billing, auto-outreach, leads | 002 | Yes | Primary website storage |
| usage | Monthly usage, credits | credits-service, billing, webhook | 003, 004 | Yes | No |
| analytics_events | Event tracking | analytics API | 003 | Yes | No |
| business_leads | Business Finder leads | business-finder, leads | 005, 007 | Yes | No |
| auto_outreach_jobs | Outreach jobs | auto-outreach APIs | 006, 007 | Yes | No |
| outreach_queue | Email queue | process-queue | 008 | Yes | No |
| leads | CRM leads (contact form) | leads API | 007 | Yes | No |
| lead_events | Lead timeline | 008 | Yes | No |
| outreach_templates | Email templates | 007 | Yes | No |
| credit_packs | Credit pack definitions | credit-packs API | 007 | Yes | No |
| billing_history | Billing records | webhook, billing-history API | 007, 008 | Yes | No |
| credit_transactions | Credit audit trail | deduct_credits RPC | 008 | Yes | No |
| apps | Old app builder (legacy) | None | 009 | No | Obsolete — replaced by mobile_apps |
| app_screens | Old app screens | None | 009 | No | Obsolete |
| app_builds | Old app builds | None | 009 | No | Obsolete |
| mobile_apps | New mobile app factory | api/mobile-apps | 011 | Yes | No |
| mobile_app_builds | Mobile app builds | api/mobile-apps | 011 | No | No |

### Duplicated table concepts

- **projects + generated_sites** vs **sites**: Two website storage systems. `lib/supabase/db.ts` uses projects/generated_sites. Most APIs use sites. `api/site/[slug]` checks both. Consolidation needed.

### Outdated tables

- **apps, app_screens, app_builds**: From migration 009. No code references them. Replaced by mobile_apps, mobile_app_builds (011).

### Tables created but not used

- apps, app_screens, app_builds

### Code referencing non-existent tables

- None identified.

### Migrations likely missing or inconsistent

- usage table: 004 adds credits columns; 008 extends deduct_credits. Coherent.
- subscriptions: 001 has stripe_subscription_id; used for PayPal. Naming is legacy only.

---

## SECTION 6 — API AUDIT

### Websites

| Endpoint | Method | Purpose | Tables | Auth | Credits | Status |
|----------|--------|---------|--------|------|---------|--------|
| /api/sites | GET | List sites | sites | Yes | No | working |
| /api/sites/save | POST | Save site | sites | Yes | No | working |
| /api/sites/[id] | GET/PATCH/DELETE | Site CRUD | sites | Yes | No | working |
| /api/site/[slug] | GET | Get by slug | generated_sites, sites | No | No | working |
| /api/save-site | POST | Save (create page) | sites | Yes | No | working |
| /api/builder/generate | POST | Builder generate | — | Yes | Yes | working |
| /api/builder/generate-stream | POST | Builder stream | — | Yes | Yes | working |
| /api/generate-website | POST | WebsiteGenerator | — | Yes | Yes | working |

### Apps / Mobile Apps

| Endpoint | Method | Purpose | Tables | Auth | Credits | Status |
|----------|--------|---------|--------|------|---------|--------|
| /api/mobile-apps | GET/POST | List/create | mobile_apps | Yes | No | working |
| /api/mobile-apps/[id] | GET/PATCH/DELETE | CRUD | mobile_apps | Yes | No | working |
| /api/mobile-apps/build | POST | Build app | mobile_app_builds | Yes | Yes | partial |
| /api/mobile-apps/generate | POST | Generate | mobile_apps | Yes | Yes | working |

### Billing

| Endpoint | Method | Purpose | Tables | Auth | Status |
|----------|--------|---------|--------|------|--------|
| /api/billing | GET | Credits/plan | usage, subscriptions | Yes | working |
| /api/billing-history | GET | History | billing_history | Yes | working |
| /api/paypal/create-subscription | POST | Create sub | — | Yes | working |
| /api/paypal/webhook | POST | Webhook | subscriptions, usage, billing_history | No (verify) | working |
| /api/credit-packs | GET | Packs | credit_packs | Yes | working |
| /api/credits/deduct | POST | Deduct | usage, credit_transactions | Yes | working |

### Outreach

| Endpoint | Method | Purpose | Tables | Auth | Status |
|----------|--------|---------|--------|------|--------|
| /api/auto-outreach/jobs | GET/POST | Jobs | auto_outreach_jobs | Yes | working |
| /api/auto-outreach/process-queue | POST | Cron | outreach_queue, auto_outreach_jobs | CRON_SECRET | working |
| /api/auto-outreach/send | POST | Send | outreach_queue | Yes | working |
| /api/auto-outreach/generate-site | POST | Generate | sites | Yes | working |
| /api/auto-outreach/generate-message | POST | Message | — | Yes | working |
| /api/auto-outreach/search | POST | Search | — | Yes | working |

### Finder / Leads

| Endpoint | Method | Purpose | Tables | Auth | Status |
|----------|--------|---------|--------|------|--------|
| /api/business-finder/search | POST | Search | — | Yes | working |
| /api/business-finder/generate-website | POST | Demo site | sites | Yes | working |
| /api/business-finder/generate-offer | POST | Offer | — | Yes | working |
| /api/leads | GET/POST | Leads | leads | Yes | working |
| /api/leads/[id] | GET/PATCH/DELETE | Lead | leads | Yes | working |
| /api/leads/events | POST | Events | lead_events | Yes | working |

### Credits / Analytics

| Endpoint | Method | Purpose | Tables | Auth | Status |
|----------|--------|---------|--------|------|--------|
| /api/credit-transactions | — | Transactions | credit_transactions | Yes | partial |
| /api/analytics/events | — | Events | analytics_events | Yes | partial |
| /api/analytics/track | POST | Track | analytics_events | Yes | working |
| /api/dashboard/stats | — | Stats | — | Yes | partial |

### Duplicate / Obsolete APIs

- `/api/search-businesses`: Not referenced. Likely replaced by `/api/business-finder/search`.
- `/api/generate-website` vs `/api/builder/generate-stream`: Different consumers (WebsiteGenerator vs Builder). Not duplicate.
- `/api/save-site` vs `/api/sites/save`: Both used; create page uses save-site. Consider consolidating.

---

## SECTION 7 — BILLING / CREDITS AUDIT

### PayPal wiring

- **Config:** `lib/paypal-config.ts` — PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_PRO_PLAN_ID, PAYPAL_BUSINESS_PLAN_ID, PAYPAL_AGENCY_PLAN_ID, PAYPAL_WEBHOOK_SECRET.
- **Create subscription:** `/api/paypal/create-subscription` — creates PayPal subscription, returns approval URL.
- **Webhook:** `/api/paypal/webhook` — handles BILLING.SUBSCRIPTION.ACTIVATED, CANCELLED, EXPIRED, PAYMENT.SALE.COMPLETED, PAYMENT.CAPTURE.DENIED, REFUNDED.
- **Webhook verification:** Uses PAYPAL_WEBHOOK_ID if set.

### Plans

| Plan ID | Credits | Name (credits.ts) | PayPal plan |
|---------|---------|-------------------|-------------|
| free | 50 | Free | — |
| pro | 100 | Starter | PAYPAL_PRO_PLAN_ID |
| business | 500 | Pro | PAYPAL_BUSINESS_PLAN_ID |
| agency | 2000 | Business | PAYPAL_AGENCY_PLAN_ID |

### Credits model

- Stored in `usage.credits` per user per month.
- Deducted via `deduct_credits` RPC.
- Added via `add_credits` RPC (webhook, purchases).
- Credit costs in `lib/credits.ts` (CREDIT_COSTS).

### Where credits are deducted

- `/api/credits/deduct` (explicit deduct).
- Builder, generate-website, business-finder, auto-outreach, mobile-apps generate — each API calls deduct when applicable.

### Where credits are added

- PayPal webhook on BILLING.SUBSCRIPTION.ACTIVATED (sets usage.credits from plan).
- `add_credits` RPC for purchases/refunds.

### Billing history

- `billing_history` table. Webhook inserts on subscription and payment events.

### Credit packs

- `credit_packs` table (pack_50, pack_100, pack_500). API `/api/credit-packs` returns them. Billing page shows "Coming soon" for pack purchase.

### Webhook logic

- Present. Verifies signature when PAYPAL_WEBHOOK_ID set. Updates subscriptions, usage, billing_history.

### Plan mapping

- paypalConfig.plans maps plan IDs to PayPal plan IDs. Webhook maps PayPal plan_id back to pro/business/agency.

### Evaluation

- **Works:** Subscription creation, webhook, credits display, deduct API.
- **Partial:** Credit packs UI disabled; billing.ts references stripe_subscription_id (legacy name only).
- **Broken:** None identified.
- **Hardening:** Add PAYPAL_WEBHOOK_ID in production; ensure webhook URL is correct.

---

## SECTION 8 — MOBILE APP FACTORY AUDIT

### Old app builder (009)

- **Tables:** apps, app_screens, app_builds.
- **Purpose:** Original app builder design.
- **Routes:** No `/dashboard/apps` route exists. No code references these tables.
- **Status:** Obsolete. Replaced by mobile_apps (011).

### New mobile app factory (011)

- **Tables:** mobile_apps, mobile_app_builds.
- **Purpose:** Current mobile app builder.
- **Routes:** /dashboard/mobile-apps, /dashboard/mobile-apps/new, /dashboard/mobile-apps/[id].
- **APIs:** /api/mobile-apps, /api/mobile-apps/[id], /api/mobile-apps/build, /api/mobile-apps/generate.
- **Status:** In use. All mobile-app APIs use mobile_apps table.

### Route ownership

| Route | Belongs to |
|-------|------------|
| /dashboard/mobile-apps | New (011) |
| /dashboard/apps | Does not exist |

### Duplicates

- No duplicate routes. Old apps system has no UI.

### Old code to delete

- Migration 009 created apps, app_screens, app_builds. Tables exist but are unused. Safe to drop in a future migration after confirming no external dependencies.

### Dashboard links

- Sidebar: "Mobile Apps" → /dashboard/mobile-apps (correct).
- Nav: "Mobile Apps" → /dashboard/mobile-apps (correct).
- Factory config: mobileApps → /dashboard/mobile-apps (correct).

### Feature usability

- Mobile app factory is usable: create app, generate with AI, view/edit. Build step may be partial (build_url, status).

---

## SECTION 9 — DEPLOYMENT AUDIT

### Vercel deployment

- Standard Next.js deployment. `vercel.json` defines cron for `/api/auto-outreach/process-queue` every 5 minutes.
- No custom build or output config that would cause stale routes.

### Stale routes

- No evidence of caching that would serve old routes. Standard Vercel/Next.js behavior.

### Multiple deployment URLs

- Single production URL assumed. No code references multiple deployment origins for routing.

### Environment variables

- `.env.example` lists: OPENAI_API_KEY, GOOGLE_MAPS_API_KEY, Supabase, PayPal, SMTP, CRON_SECRET.
- All required for full functionality. Missing keys will cause 503 or feature failure (e.g., PayPal, SMTP).

### Production-only issues

- PayPal webhook must use production URL. CRON_SECRET must be set for process-queue.
- No route/path logic that would behave differently in production vs development.

---

## SECTION 10 — DUPLICATES / CONFLICTS / CLEANUP MAP

### A) Code that should probably stay

- `lib/factories` — single source of truth for factories.
- `app/dashboard/page.tsx` — dynamic factory grid.
- `app/api/mobile-apps/*` — mobile app factory.
- `app/api/business-finder/*`, `app/api/auto-outreach/*` — core features.
- `app/api/paypal/*`, `lib/paypal-config.ts`, `lib/credits.ts`, `lib/credits-service.ts` — billing.
- `app/api/sites/*`, `app/api/site/[slug]` — website CRUD and publishing.
- `app/builder/page.tsx` — main website builder.
- `sites` table and all migrations for it.

### B) Code that is obsolete

- `apps`, `app_screens`, `app_builds` tables (migration 009).
- `/api/search-businesses` — not referenced.
- `lib/supabase/db.ts` — projects, generated_sites, getGeneratedSiteBySlug — if consolidation to sites is done.
- `lib/storage.ts` — localStorage fallback for sites; may be legacy.

### C) Code that is duplicated

- `/my-sites` and `/dashboard/websites` — same data, same API.
- `DashboardNav` vs `DashboardSidebar` — different nav items, used in different contexts.
- `api/site/[slug]` checks both generated_sites and sites — dual storage.

### D) Code that conflicts with new architecture

- `lib/supabase/db.ts` (projects, generated_sites) vs `api/sites` (sites) — two storage systems.
- `billing.ts` uses `stripe_subscription_id` for PayPal — naming only, no functional conflict.

### E) Code to archive or remove later

- Migration 009 tables (apps, app_screens, app_builds) — after migration to drop.
- `projects`, `generated_sites` — after consolidating to sites.
- `/my-sites` — redirect to `/dashboard/websites` or remove.
- `/api/search-businesses` — remove if confirmed unused.
- `/dashboard/tools` — mock tools; consider replacing with real factory links or removing.

---

## SECTION 11 — FEATURE SCORECARD

| System | Score | Explanation |
|--------|-------|-------------|
| Website Factory | 8/10 | Builder and generate-website work. Dual storage (sites vs projects/generated_sites) adds complexity. |
| Store Factory | 2/10 | Placeholder only. No real generation or persistence. |
| Mobile App Factory | 6/10 | CRUD and generate work. Build step is partial. Old apps tables unused. |
| Business Finder | 8/10 | Search, generate demo site, generate offer work. Depends on Google Maps API. |
| Auto Outreach | 7/10 | Jobs, queue, cron, send work. SMTP required. Template system exists. |
| Lead CRM | 7/10 | Leads CRUD, events. Integrated with sites. |
| SEO Factory | 7/10 | Page exists, generates SEO content. |
| Ads Factory | 7/10 | Page exists, generates ad copy. |
| Billing | 7/10 | PayPal subscriptions, webhook, credits. Credit packs UI disabled. Legacy column names. |
| Credits | 8/10 | Deduct, add, plans, transactions. Coherent. |
| Dashboard architecture | 7/10 | Factory grid dynamic. Nav/sidebar hardcoded. Some duplicate pages. |
| Factory architecture | 8/10 | FACTORIES config is clean. Some factories placeholder or disabled. |
| Database architecture | 5/10 | Dual website storage. Unused apps tables. Otherwise structured. |
| Deployment readiness | 7/10 | Vercel, cron, env vars. Works if configured. |

---

## SECTION 12 — WHAT IS ACTUALLY BUILT RIGHT NOW

### Really built

- **Website Builder:** Streaming AI generation, save to sites, publish at /s/[slug].
- **Business Finder:** Google Maps search, demo site generation, result page.
- **Auto Outreach:** Job creation, queue, cron processing, SMTP send, template system.
- **Logo, SEO, Ads:** Functional generation pages.
- **Mobile App Factory:** Create, generate, edit apps. Uses mobile_apps table.
- **Landing Page:** Uses /dashboard/create (sites/save).
- **Billing:** PayPal subscriptions, credits, billing history, webhook.
- **Lead CRM:** Leads and events.
- **Auth:** Supabase auth, dashboard protection.

### Demo-level only

- **Store Factory:** UI only, no real generation.
- **Universal Builder:** "Coming soon" message.
- **Dashboard tools:** Mock logo/ad/seo with fake results.
- **Credit packs:** API exists, UI shows "Coming soon."

### Production-capable

- Website generation and publishing.
- Business Finder (with Google Maps key).
- Auto Outreach (with SMTP).
- Billing and credits (with PayPal config).
- Logo, SEO, Ads generation.

### Messy

- Two website storage systems (projects/generated_sites vs sites).
- Unused apps tables.
- Duplicate /my-sites and /dashboard/websites.
- Two nav components with different items.
- Stripe-named columns for PayPal data.

### Duplicated

- /my-sites and /dashboard/websites.
- generated_sites and sites for website storage.
- DashboardNav and DashboardSidebar (different structure).

### Worth keeping

- FACTORIES config and dynamic dashboard grid.
- sites table and api/sites/*.
- PayPal and credits system.
- All working factory pages and APIs.
- Supabase auth and RLS.

### Should be cleaned before new features

- Consolidate website storage to sites.
- Remove or redirect /my-sites.
- Drop or deprecate apps, app_screens, app_builds.
- Unify or clearly separate nav vs sidebar.
- Remove /api/search-businesses if unused.

---

## SECTION 13 — RECOMMENDED NEXT STEP

**Single next step:** Consolidate website storage to the `sites` table and remove or deprecate the `projects` / `generated_sites` path.

**Why:** Two storage systems (projects/generated_sites vs sites) create confusion, extra code paths, and risk of inconsistent behavior. The `sites` table is already the main one for builder, create, auto-outreach, business-finder, and billing. `lib/supabase/db.ts` and `api/site/[slug]` still use projects/generated_sites. Migrating fully to `sites` and removing the old path will simplify the codebase and make future changes safer.

**Actions:**
1. Audit all usages of `projects` and `generated_sites` (db.ts, api/site/[slug]).
2. Migrate any remaining data from generated_sites to sites if needed.
3. Update `api/site/[slug]` to use only `sites`.
4. Remove or deprecate `getGeneratedSiteBySlug`, `getGeneratedSitesForProject`, `saveGeneratedSite`, and related project helpers from db.ts.
5. Add a migration to drop `generated_sites` and `projects` (or mark deprecated) after migration is verified.

---

# 3. Full Product Audit

The product delivers a working AI-powered toolkit for local business services. Core flows (website, business finder, outreach, logo, SEO, ads, mobile apps) are functional. Store and Universal Builder are placeholders. Billing and credits are wired. The main technical risks are database duplication and unused tables, not missing product features.

---

# 4. Duplication / Conflict Report

| Item | Type | Location | Recommendation |
|------|------|----------|----------------|
| /my-sites vs /dashboard/websites | Duplicate page | app/my-sites, app/dashboard/websites | Redirect or remove my-sites |
| projects/generated_sites vs sites | Duplicate storage | lib/db.ts, api/site/[slug], 001 vs 002 | Consolidate to sites |
| apps vs mobile_apps tables | Obsolete vs current | 009 vs 011 | Drop apps, app_screens, app_builds |
| DashboardNav vs DashboardSidebar | Different nav | components/dashboard | Unify or derive from config |
| /api/search-businesses | Unused | app/api | Remove if no references |
| stripe_subscription_id column | Legacy naming | subscriptions | Rename to paypal_subscription_id (optional) |

---

# 5. Cleanup Recommendation

**Phase 1 (immediate):**
- Consolidate website storage to sites.
- Redirect /my-sites to /dashboard/websites.

**Phase 2 (short-term):**
- Remove /api/search-businesses.
- Drop apps, app_screens, app_builds tables (migration).
- Unify nav config.

**Phase 3 (later):**
- Implement Store and Universal Builder or mark as coming soon.
- Enable credit packs purchase flow.
- Rename stripe_subscription_id if desired.

---

# 6. Single Next Step

**Consolidate website storage to the `sites` table and deprecate `projects` / `generated_sites`.**

This single change will remove the largest source of technical debt and make all future website-related work simpler and safer.
