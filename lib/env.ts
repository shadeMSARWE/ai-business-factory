/**
 * Environment configuration for AI Business Factory.
 * Keys are read from process.env (Next.js loads .env.local automatically).
 *
 * Safe fallback behavior:
 * - OPENAI_API_KEY missing → mock/sample content is used
 * - UNSPLASH_ACCESS_KEY missing → fallback images are used
 * - GOOGLE_MAPS_API_KEY missing → mock business data is used
 */

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
