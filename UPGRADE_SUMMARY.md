# AI Website Factory — Upgrade Summary

## What Was Added

### Part 1 — Complete Billing System (Stripe)
- **lib/stripe.ts** — Stripe client, plan limits (Free/Pro/Business/Agency), `canCreateSite`, `canGenerate`
- **lib/billing.ts** — `getUserPlanAndUsage()` for plan + usage
- **lib/supabase/admin.ts** — Service role client for webhooks
- **app/api/stripe/create-checkout-session/route.ts** — Creates Stripe Checkout session
- **app/api/stripe/webhook/route.ts** — Handles `checkout.session.completed`, `customer.subscription.updated/deleted`
- **app/api/billing/route.ts** — GET current plan and usage
- **app/dashboard/billing/page.tsx** — Billing page with plan, usage, upgrade buttons
- **Plan limits**: Free (1 site, 10 gen), Pro (10, 200), Business (50, 1000), Agency (unlimited)
- **Enforcement**: sites/save and generate-website check limits; usage incremented on generation

### Part 2 — AI Interactive Website Builder
- **app/builder/page.tsx** — Split-panel builder: left = build steps + preview, right = AI chat
- **app/api/builder/generate/route.ts** — AI generation for builder
- **app/api/builder/chat/route.ts** — AI chat with suggestions and site updates
- **Build steps**: Creating project structure → hero → services → gallery → contact → styles → layout
- **Chat**: User prompts, AI suggests improvements, can return `siteUpdate` to modify site
- **Dashboard** "Create Website" now links to `/builder`

### Part 3 — Smart AI Suggestions
- Integrated into builder chat (suggestions for reservation, testimonials, menu, etc.)

### Part 4 — Advanced Website Preview
- **components/device-preview.tsx** — Mobile / Tablet / Desktop toggle
- **app/preview/[id]/page.tsx** — Wrapped with DevicePreview

### Part 5 — Factory Module System
- **app/dashboard/factories/page.tsx** — Factory cards (Website, Logo, SEO, Ads, Store, App, Video)
- **lib/factories/index.ts** — Updated paths (Website → /builder, Logo → /dashboard/logo-generator, etc.)
- **Dashboard nav** — Added "Factories" link

### Part 6 — AI Roadmap / Suggestions Panel
- **components/dashboard/ai-suggestions-panel.tsx** — Suggestions for analytics, SEO, logo, publish
- **app/dashboard/page.tsx** — Renders AISuggestionsPanel

### Part 7 — Server-Side Analytics
- **app/api/analytics/track/route.ts** — POST to track events
- **app/api/analytics/events/route.ts** — GET user events
- **analytics_events** table in migration 003

### Part 8 — Security Hardening
- **lib/rate-limit.ts** — In-memory rate limiter (30 req/min per IP)
- **app/api/generate-website/route.ts** — Rate limiting
- **app/api/sites/save/route.ts** — Input validation, HTML sanitization (length), slug sanitization

### Part 9 — Database Improvements
- **supabase/migrations/003_billing_and_usage.sql**:
  - `usage` table (user_id, period_start, sites_count, generations_count)
  - `analytics_events` table
  - `increment_usage()` function
  - Subscriptions unique on user_id, policies

### Part 10 — Onboarding Wizard
- **components/onboarding-wizard.tsx** — 4-step wizard (Welcome → Generate → Customize → Publish)
- **app/layout.tsx** — Renders OnboardingWizard

---

## Files Created

| File | Purpose |
|------|---------|
| lib/stripe.ts | Stripe client, plans, limits |
| lib/billing.ts | Plan/usage helpers |
| lib/supabase/admin.ts | Service role client |
| lib/rate-limit.ts | Rate limiting |
| app/api/stripe/create-checkout-session/route.ts | Checkout |
| app/api/stripe/webhook/route.ts | Webhooks |
| app/api/billing/route.ts | Billing data |
| app/api/builder/generate/route.ts | Builder generation |
| app/api/builder/chat/route.ts | Builder chat |
| app/api/analytics/track/route.ts | Track events |
| app/api/analytics/events/route.ts | Get events |
| app/dashboard/billing/page.tsx | Billing UI |
| app/dashboard/factories/page.tsx | Factories UI |
| app/builder/page.tsx | AI builder |
| components/device-preview.tsx | Device toggles |
| components/onboarding-wizard.tsx | Onboarding |
| components/dashboard/ai-suggestions-panel.tsx | AI suggestions |
| supabase/migrations/003_billing_and_usage.sql | DB migration |

---

## APIs Added

| Route | Method | Purpose |
|-------|--------|---------|
| /api/stripe/create-checkout-session | POST | Create Stripe Checkout |
| /api/stripe/webhook | POST | Stripe webhooks |
| /api/billing | GET | Plan + usage |
| /api/builder/generate | POST | Builder generation |
| /api/builder/chat | POST | Builder chat |
| /api/analytics/track | POST | Track event |
| /api/analytics/events | GET | List events |

---

## Database Changes

- **usage** — user_id, period_start, sites_count, generations_count
- **analytics_events** — user_id, site_id, slug, event_type, event_data
- **subscriptions** — UNIQUE(user_id)
- **increment_usage()** — RPC to increment usage

---

## Env Vars to Add

```
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=
```

Create products/prices in Stripe Dashboard and add IDs. Webhook URL: `https://yourdomain.com/api/stripe/webhook`

---

## Production-Ready Features

- Stripe billing (with env keys)
- Plan limits enforced
- AI builder with chat
- Device preview
- Factory modules
- AI suggestions panel
- Server-side analytics
- Rate limiting
- Input validation
- Onboarding wizard
