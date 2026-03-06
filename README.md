# InstantBizSite AI

AI-powered website builder that generates complete multi-page websites from a simple text prompt.

**Production-ready** — Optional auth (Supabase), database storage, and API keys. Safe fallbacks when services are not configured.

## Features

- **AI Website Generator** — Describe your business, get a full website (mock data when no API key)
- **AI Logo Generator** — Create logo variations with icons and gradients
- **AI Ads Generator** — Generate Facebook, Instagram, Google, TikTok ads
- **AI SEO Generator** — Generate SEO title, meta description, keywords
- **Business Finder** — Find businesses (Google Places or mock data)
- **Authentication** — Sign up, login, logout, password reset (Supabase Auth)
- **Database** — Projects and generated sites stored in Supabase PostgreSQL
- **Visual Editor** — Edit text, images, and business info
- **Preview & Publish** — View at `/s/[slug]` (DB or localStorage)
- **Download ZIP** — Export your website as a ZIP file
- **Multi-language** — English, Arabic, Hebrew with RTL support
- **Vercel Analytics** — Built-in visitor tracking

## Tech Stack

- Next.js 14 (App Router)
- React, TailwindCSS, Shadcn UI, Framer Motion
- Supabase (Auth + PostgreSQL)
- PayPal (subscriptions)
- Vercel Analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Keys Configuration

Create a `.env.local` file in the project root (copy from `.env.example`). Add your API keys for full functionality:

| Key | Purpose | Fallback when missing |
|-----|---------|------------------------|
| `OPENAI_API_KEY` | AI text generation | Mock/sample content |
| `UNSPLASH_ACCESS_KEY` | Dynamic image fetching | Fallback images |
| `GOOGLE_MAPS_API_KEY` | Business Finder (Places API) | Mock business data |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No auth, localStorage only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | No auth |
| `PAYPAL_*` | Subscription payments | No subscriptions |

### How to add API keys

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your keys:
   ```
   OPENAI_API_KEY=sk-...
   UNSPLASH_ACCESS_KEY=...
   GOOGLE_MAPS_API_KEY=...
   ```

3. Restart the dev server (`npm run dev`).

### Where to get API keys

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Unsplash**: [unsplash.com/developers](https://unsplash.com/developers) — create an app for Access Key
- **Google Maps**: [console.cloud.google.com](https://console.cloud.google.com) — enable Places API (Legacy) for Business Finder

## Project Structure

```
/app
  /api/generate-website, generate-business, search-businesses
  /api/save-site, site/[slug], auth/callback
  /dashboard, /login, /signup, /forgot-password
  /s/[slug]            — Published sites (DB or localStorage)
/components
  /providers           — Language, Auth, Toast
/lib
  /supabase            — client, server, middleware, db
  /storage.ts, env.ts
/locales               — en.json, ar.json, he.json
/supabase/migrations   — Database schema
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Vercel + Supabase setup.

## License

MIT
