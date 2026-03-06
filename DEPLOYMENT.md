# InstantBizSite AI - Deployment Guide

## Prerequisites

- Node.js 18+
- Vercel account (for deployment)
- Supabase account (for auth + database)
- Optional: OpenAI, Unsplash, Google Maps, PayPal API keys

---

## 1. Environment Variables

Create `.env.local` (development) or configure in Vercel (production):

```env
# AI & Images
OPENAI_API_KEY=
UNSPLASH_ACCESS_KEY=
GOOGLE_MAPS_API_KEY=

# Supabase (required for auth + DB)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# PayPal (subscriptions)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_PRO_PLAN_ID=
PAYPAL_BUSINESS_PLAN_ID=
PAYPAL_AGENCY_PLAN_ID=
PAYPAL_WEBHOOK_SECRET=
PAYPAL_WEBHOOK_ID=
```

---

## 2. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy **Project URL** and **anon key** from Settings → API

### Database Schema

Run migrations in Supabase SQL Editor (in order):

1. `supabase/migrations/001_initial.sql` — projects, generated_sites, users
2. `supabase/migrations/002_sites_table.sql` — **required** for user-generated sites (My Websites, save flow)

```bash
# Or use Supabase CLI: supabase db push
```

### Auth Configuration

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://yourdomain.com` (or `http://localhost:3000` for dev)
- **Redirect URLs**: Add:
  - `https://yourdomain.com/auth/callback`
  - `http://localhost:3000/auth/callback`

### Google OAuth (recommended)

1. Authentication → Providers → Google → Enable
2. Create OAuth credentials in Google Cloud Console
3. Add Client ID and Client Secret to Supabase

### Email (optional)

Enable Email auth in Authentication → Providers. Configure SMTP for production emails.

---

## 3. Vercel Deployment

### Deploy

```bash
npm run build
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables in Vercel

Add all variables from `.env.example` in Vercel Project Settings → Environment Variables.

---

## 4. PayPal (Subscriptions)

1. Create PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create app and get Client ID + Secret
3. Create subscription plans: Starter ($19/mo), Pro ($39/mo), Business ($90/mo)
4. Copy Plan IDs to env: `PAYPAL_PRO_PLAN_ID`, `PAYPAL_BUSINESS_PLAN_ID`, `PAYPAL_AGENCY_PLAN_ID`
5. Set up webhook: `https://yourdomain.com/api/paypal/webhook`
6. Add `PAYPAL_WEBHOOK_SECRET` and `PAYPAL_WEBHOOK_ID` to env

---

## 5. Folder Structure (Production)

```
/app
  /api
    /generate-website
    /generate-business
    /search-businesses
    /save-site
    /site/[slug]
    /sites
    /sites/[id]
    /sites/save
    /paypal/create-subscription
    /paypal/webhook
    /auth/callback
  /dashboard
  /login
  /signup
  /forgot-password
  /s/[slug]          — Published sites
/components
/lib
  /supabase/         — Supabase client, server, middleware, db
  /env.ts
/locales             — en, ar, he
/supabase/migrations
```

---

## 6. Database Schema Summary

| Table | Purpose |
|-------|---------|
| `users` | Synced from auth.users |
| `projects` | User projects (name, industry) |
| `generated_sites` | HTML/CSS/JS, slug, meta |
| `sites` | User-generated websites (prompt, html, slug, user_id) — **required for save flow** |
| `subscriptions` | PayPal subscription state |

---

## 7. Fallback Behavior

| Service | When Missing | Behavior |
|---------|--------------|----------|
| Supabase | Not configured | No auth, localStorage only, dashboard open |
| OpenAI | Not configured | Mock content |
| Unsplash | Not configured | Fallback images |
| Google Maps | Not configured | Mock business data |
| PayPal | Not configured | No subscriptions |

---

## 8. Production Checklist

- [ ] Supabase URL + keys set
- [ ] Database migration run
- [ ] Auth redirect URLs configured
- [ ] Vercel env vars set
- [ ] Build passes: `npm run build`
