-- User credits (usage-based balance) + AI Chat tables
-- New users receive 100 credits. Credits consumed by factories, agents, and chat.

-- ============================================
-- 1. user_credits
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own user_credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_credits" ON public.user_credits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_credits" ON public.user_credits FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- Ensure new user has 100 credits (call from app on first use)
CREATE OR REPLACE FUNCTION public.ensure_user_credits(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_credits INT;
BEGIN
  INSERT INTO public.user_credits (user_id, credits, created_at, updated_at)
  VALUES (p_user_id, 100, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  SELECT credits INTO v_credits FROM public.user_credits WHERE user_id = p_user_id;
  RETURN COALESCE(v_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Deduct from user_credits (returns new balance or -1 if insufficient)
CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_user_id UUID, p_amount INT)
RETURNS INT AS $$
DECLARE
  v_current INT;
  v_new INT;
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF p_amount <= 0 THEN
    RETURN (SELECT credits FROM public.user_credits WHERE user_id = p_user_id);
  END IF;

  INSERT INTO public.user_credits (user_id, credits, created_at, updated_at)
  VALUES (p_user_id, 100, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT credits INTO v_current FROM public.user_credits WHERE user_id = p_user_id;
  IF v_current IS NULL OR v_current < p_amount THEN
    RETURN -1;
  END IF;

  v_new := v_current - p_amount;
  UPDATE public.user_credits SET credits = v_new, updated_at = NOW() WHERE user_id = p_user_id;
  RETURN v_new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add credits to user_credits (e.g. after purchase). Caller must be the user or service.
CREATE OR REPLACE FUNCTION public.add_user_credits(p_user_id UUID, p_amount INT)
RETURNS INT AS $$
DECLARE
  v_new INT;
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF p_amount <= 0 THEN
    SELECT credits INTO v_new FROM public.user_credits WHERE user_id = p_user_id;
    RETURN COALESCE(v_new, 0);
  END IF;

  INSERT INTO public.user_credits (user_id, credits, created_at, updated_at)
  VALUES (p_user_id, p_amount, NOW(), NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    credits = public.user_credits.credits + p_amount,
    updated_at = NOW();
  SELECT credits INTO v_new FROM public.user_credits WHERE user_id = p_user_id;
  RETURN COALESCE(v_new, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- 2. chat_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own chat_sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. chat_messages
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own chat_messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 4. ai_request_rate (limit 100/hour per user)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_request_rate (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hour_bucket TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', NOW()),
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, hour_bucket)
);

CREATE OR REPLACE FUNCTION public.check_and_increment_ai_rate(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_bucket TIMESTAMPTZ := date_trunc('hour', NOW());
  v_count INT;
  v_max INT := 100;
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT request_count INTO v_count FROM public.ai_request_rate WHERE user_id = p_user_id AND hour_bucket = v_bucket;
  IF v_count IS NOT NULL AND v_count >= v_max THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.ai_request_rate (user_id, hour_bucket, request_count)
  VALUES (p_user_id, v_bucket, 1)
  ON CONFLICT (user_id, hour_bucket) DO UPDATE SET
    request_count = public.ai_request_rate.request_count + 1;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
