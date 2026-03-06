-- Auto Outreach AI - jobs table
-- Run after 005_business_leads.sql

CREATE TABLE IF NOT EXISTS public.auto_outreach_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  generated_demo_url TEXT,
  outreach_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auto_outreach_jobs_user_id ON public.auto_outreach_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_outreach_jobs_status ON public.auto_outreach_jobs(status);
CREATE INDEX IF NOT EXISTS idx_auto_outreach_jobs_created_at ON public.auto_outreach_jobs(created_at);

ALTER TABLE public.auto_outreach_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own auto outreach jobs" ON public.auto_outreach_jobs FOR ALL USING (auth.uid() = user_id);
