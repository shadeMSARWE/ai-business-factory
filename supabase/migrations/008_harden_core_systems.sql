-- Harden core systems: Auto Outreach, Lead CRM, Credits, Billing
-- Run after 007_upgrade_agency_system.sql

-- ============================================
-- 1. OUTREACH QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS public.outreach_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.auto_outreach_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_queue_status ON public.outreach_queue(status);
CREATE INDEX IF NOT EXISTS idx_outreach_queue_scheduled ON public.outreach_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_outreach_queue_user ON public.outreach_queue(user_id);

ALTER TABLE public.outreach_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own outreach queue" ON public.outreach_queue FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 2. LEAD EVENTS (timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead ON public.lead_events(lead_id);

ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read lead events via lead" ON public.lead_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.leads WHERE id = lead_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert lead events via lead" ON public.lead_events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads WHERE id = lead_id AND user_id = auth.uid()));

-- ============================================
-- 3. CREDIT TRANSACTIONS (audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  credits INT NOT NULL,
  description TEXT,
  action TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON public.credit_transactions(created_at);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own credit transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert credit transactions" ON public.credit_transactions FOR INSERT WITH CHECK (true);

-- ============================================
-- 4. EXTEND billing_history
-- ============================================
ALTER TABLE public.billing_history ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- ============================================
-- 5. EXTEND leads (city, category for filters)
-- ============================================
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS category TEXT;

-- ============================================
-- 6. UPDATE deduct_credits to log transactions
-- ============================================
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id UUID, p_amount INT, p_action TEXT DEFAULT NULL, p_description TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_period DATE := date_trunc('month', NOW())::date;
  v_current INT;
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT credits INTO v_current FROM public.usage WHERE user_id = p_user_id AND period_start = v_period;

  IF v_current IS NULL THEN
    INSERT INTO public.usage (user_id, period_start, sites_count, generations_count, credits, credits_used)
    VALUES (p_user_id, v_period, 0, 0, 50, 0)
    ON CONFLICT (user_id, period_start) DO UPDATE SET updated_at = NOW();
    SELECT credits INTO v_current FROM public.usage WHERE user_id = p_user_id AND period_start = v_period;
  END IF;

  IF v_current IS NULL OR v_current < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE public.usage
  SET credits = credits - p_amount,
      credits_used = credits_used + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id AND period_start = v_period;

  INSERT INTO public.credit_transactions (user_id, type, credits, description, action)
  VALUES (p_user_id, 'usage', -p_amount, COALESCE(p_description, 'Credit usage'), COALESCE(p_action, 'unknown'));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Note: Keep 4-param as primary. Add 2-param wrapper for backward compat.
DROP FUNCTION IF EXISTS public.deduct_credits(UUID, INT);
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id UUID, p_amount INT)
RETURNS BOOLEAN AS $$
  SELECT public.deduct_credits(p_user_id, p_amount, NULL::TEXT, NULL::TEXT);
$$ LANGUAGE sql SECURITY DEFINER;

-- Add credits (purchases, refunds)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INT, p_type TEXT DEFAULT 'purchase', p_description TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_period DATE := date_trunc('month', NOW())::date;
BEGIN
  IF p_amount <= 0 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.usage (user_id, period_start, sites_count, generations_count, credits, credits_used)
  VALUES (p_user_id, v_period, 0, 0, p_amount, 0)
  ON CONFLICT (user_id, period_start) DO UPDATE SET
    credits = public.usage.credits + p_amount,
    updated_at = NOW();

  INSERT INTO public.credit_transactions (user_id, type, credits, description, action)
  VALUES (p_user_id, p_type, p_amount, COALESCE(p_description, 'Credits added'), 'add');

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
