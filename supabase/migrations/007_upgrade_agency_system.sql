-- Upgrade AI Business Factory to Agency Operating System
-- Run after 006_auto_outreach.sql

-- ============================================
-- 1. CRM LEADS (from contact form submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  slug TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  lead_score INT DEFAULT 0,
  notes TEXT,
  follow_up_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_slug ON public.leads(slug);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own leads" ON public.leads FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 2. EXTEND business_leads (enrichment, scoring)
-- ============================================
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2);
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS reviews_count INT;
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0;
ALTER TABLE public.business_leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_business_leads_lead_score ON public.business_leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_business_leads_status ON public.business_leads(status);
CREATE INDEX IF NOT EXISTS idx_business_leads_category ON public.business_leads(category);

-- ============================================
-- 3. OUTREACH TEMPLATES
-- ============================================
CREATE TABLE IF NOT EXISTS public.outreach_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_templates_user ON public.outreach_templates(user_id);

ALTER TABLE public.outreach_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own templates" ON public.outreach_templates FOR ALL USING (auth.uid() = user_id OR is_system = true);

-- Default system templates (user_id null for system)
INSERT INTO public.outreach_templates (user_id, name, style, subject, body, is_system)
SELECT NULL, 'Friendly', 'friendly', 'Quick hello from a local web designer', 'Hi there! I noticed your business doesn''t have a website yet. I''d love to help you get online with a professional site. Would you have 5 minutes for a quick chat?', true
WHERE NOT EXISTS (SELECT 1 FROM public.outreach_templates WHERE style = 'friendly' AND is_system = true);
INSERT INTO public.outreach_templates (user_id, name, style, subject, body, is_system)
SELECT NULL, 'Professional', 'professional', 'Professional website proposal', 'Dear Business Owner, I specialize in creating professional websites for local businesses. I have prepared a demo for your business. Please review and let me know if you would like to discuss further. Best regards.', true
WHERE NOT EXISTS (SELECT 1 FROM public.outreach_templates WHERE style = 'professional' AND is_system = true);

-- ============================================
-- 4. CREDIT TOP-UP PACKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_packs (
  id TEXT PRIMARY KEY,
  credits INT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  paypal_plan_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.credit_packs (id, credits, price_usd) VALUES
  ('pack_50', 50, 9.99),
  ('pack_100', 100, 17.99),
  ('pack_500', 500, 79.99)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. BILLING HISTORY (credit purchases)
-- ============================================
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(10,2),
  credits INT,
  description TEXT,
  paypal_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_history_user ON public.billing_history(user_id);

ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own billing history" ON public.billing_history FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 6. EXTEND auto_outreach_jobs (sequences, reply tracking)
-- ============================================
ALTER TABLE public.auto_outreach_jobs ADD COLUMN IF NOT EXISTS sequence_step INT DEFAULT 1;
ALTER TABLE public.auto_outreach_jobs ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.outreach_templates(id);
ALTER TABLE public.auto_outreach_jobs ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE public.auto_outreach_jobs ADD COLUMN IF NOT EXISTS reply_content TEXT;
ALTER TABLE public.auto_outreach_jobs ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ;
