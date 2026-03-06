/**
 * Environment configuration for AI Business Factory.
 * Keys are read from process.env (Next.js loads .env.local automatically).
 *
 * Safe fallback behavior:
 * - OPENAI_API_KEY missing → mock/sample content is used
 * - UNSPLASH_ACCESS_KEY missing → fallback images are used
 * - GOOGLE_MAPS_API_KEY missing → mock business data is used
 * - Supabase/Stripe missing → auth/payments disabled, localStorage fallback
 */

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
