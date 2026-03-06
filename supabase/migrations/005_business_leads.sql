-- AI Business Finder - business leads table
-- Run after 004_credits.sql

CREATE TABLE IF NOT EXISTS public.business_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  place_id TEXT,
  website_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_leads_user_id ON public.business_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_business_leads_place_id ON public.business_leads(place_id);

ALTER TABLE public.business_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own business leads" ON public.business_leads FOR ALL USING (auth.uid() = user_id);
