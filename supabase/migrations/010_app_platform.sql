-- Add platform column for Android / iOS / Both
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'both';
