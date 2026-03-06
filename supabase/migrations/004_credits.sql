-- Credit-based billing system
-- Run after 003_billing_and_usage.sql

-- Add credits columns to usage table
ALTER TABLE public.usage ADD COLUMN IF NOT EXISTS credits INT NOT NULL DEFAULT 50;
ALTER TABLE public.usage ADD COLUMN IF NOT EXISTS credits_used INT NOT NULL DEFAULT 0;

-- Policy: allow user to update own usage (for credit deduction via RPC)
DROP POLICY IF EXISTS "Users can read own usage" ON public.usage;
CREATE POLICY "Users can read own usage" ON public.usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON public.usage FOR UPDATE USING (auth.uid() = user_id);

-- Allow insert for new users (first-time usage row)
CREATE POLICY "Users can insert own usage" ON public.usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function: deduct credits (returns true if successful)
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id UUID, p_amount INT)
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

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
