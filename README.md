# InstantBizSite AI

AI-powered website builder that generates complete multi-page websites from a simple text prompt.

**Runs entirely locally** — no authentication or database required. API keys are optional; the platform uses safe fallbacks when keys are missing.

## Features

- **AI Website Generator** — Describe your business, get a full website (mock data when no API key)
- **AI Logo Generator** — Create logo variations with icons and gradients
- **AI Ads Generator** — Generate Facebook, Instagram, Google, TikTok ads
- **AI SEO Generator** — Generate SEO title, meta description, keywords
- **Business Finder** — Find businesses (Google Places or mock data)
- **Visual Editor** — Edit text, images, and business info
- **Preview & Publish** — View at `/s/[slug]`
- **Download ZIP** — Export your website as a ZIP file
- **Simple Contact Form** — Name, Email, Message (client-side)
- **Multi-language** — English, Arabic, Hebrew with RTL support

## Tech Stack

- Next.js 14 (App Router)
- React, TailwindCSS, Shadcn UI, Framer Motion
- localStorage for website storage

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
| `OPENAI_API_KEY` | AI text generation (website content, ads, SEO) | Mock/sample content |
| `UNSPLASH_ACCESS_KEY` | Dynamic image fetching for galleries | Fallback placeholder images |
| `GOOGLE_MAPS_API_KEY` | Business Finder (Google Places API) | Mock business data |

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
  /api/generate-website  — Website generation (mock or OpenAI)
  /dashboard            — My Websites, Create, Editor, Tools
  /preview/[id]         — Website preview
  /s/[slug]            — Published sites (reads from localStorage)
/components
/lib/storage.ts        — localStorage helpers
/lib/download.ts        — ZIP export
```

## License

MIT
