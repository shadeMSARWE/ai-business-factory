-- Billing, usage limits, and analytics
-- Run after 001_initial.sql and 002_sites_table.sql

-- Usage tracking per user (resets monthly for limits)
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL DEFAULT date_trunc('month', NOW())::date,
  sites_count INT NOT NULL DEFAULT 0,
  generations_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Subscriptions: add unique on user_id for upsert
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_key') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Subscriptions: allow insert/update for webhook (service role) and user
ALTER TABLE public.subscriptions DROP POLICY IF EXISTS "Users can read own subscription";
CREATE POLICY "Users can read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Usage: users can read own, service updates
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own usage" ON public.usage FOR SELECT USING (auth.uid() = user_id);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  site_id UUID,
  slug TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_slug ON public.analytics_events(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_user_period ON public.usage(user_id, period_start);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Function to increment usage (called by API with user's auth)
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_sites_delta INT DEFAULT 0,
  p_generations_delta INT DEFAULT 0
)
RETURNS void AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO public.usage (user_id, period_start, sites_count, generations_count)
  VALUES (p_user_id, date_trunc('month', NOW())::date, COALESCE(p_sites_delta, 0), COALESCE(p_generations_delta, 0))
  ON CONFLICT (user_id, period_start) DO UPDATE SET
    sites_count = public.usage.sites_count + COALESCE(p_sites_delta, 0),
    generations_count = public.usage.generations_count + COALESCE(p_generations_delta, 0),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
