/**
 * Environment configuration for AI Business Factory.
 * Keys are read from process.env (Next.js loads .env.local automatically).
 *
 * Safe fallback behavior:
 * - OPENAI_API_KEY missing → mock/sample content is used
 * - UNSPLASH_ACCESS_KEY missing → fallback images are used
 * - GOOGLE_MAPS_API_KEY missing → mock business data is used
 * - Supabase missing → auth disabled, localStorage fallback
 * - PayPal → subscriptions via /api/paypal/*
 */

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Email (SMTP for Auto Outreach)
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const SMTP_FROM = process.env.SMTP_FROM || "noreply@instantbizsite.ai";
