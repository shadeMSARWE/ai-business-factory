-- Mobile App Factory - apps, app_screens, app_builds
-- Run after 008_harden_core_systems.sql

CREATE TABLE IF NOT EXISTS public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apps_user_id ON public.apps(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.apps(status);

ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own apps" ON public.apps FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.app_screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  component_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_screens_app_id ON public.app_screens(app_id);

ALTER TABLE public.app_screens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD app_screens via app" ON public.app_screens FOR ALL
  USING (EXISTS (SELECT 1 FROM public.apps WHERE id = app_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.app_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  build_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_builds_app_id ON public.app_builds(app_id);

ALTER TABLE public.app_builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD app_builds via app" ON public.app_builds FOR ALL
  USING (EXISTS (SELECT 1 FROM public.apps WHERE id = app_id AND user_id = auth.uid()));
