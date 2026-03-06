-- Mobile Apps Factory - mobile_apps, mobile_app_builds
-- Clean new implementation

CREATE TABLE IF NOT EXISTS public.mobile_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL DEFAULT 'both',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_apps_user_id ON public.mobile_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_apps_status ON public.mobile_apps(status);

ALTER TABLE public.mobile_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own mobile_apps" ON public.mobile_apps FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.mobile_app_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.mobile_apps(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  build_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_app_builds_app_id ON public.mobile_app_builds(app_id);

ALTER TABLE public.mobile_app_builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD mobile_app_builds via app" ON public.mobile_app_builds FOR ALL
  USING (EXISTS (SELECT 1 FROM public.mobile_apps WHERE id = app_id AND user_id = auth.uid()));
