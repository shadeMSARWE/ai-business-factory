-- Sites table for generated websites (user-requested schema)
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT,
  html TEXT NOT NULL,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_slug ON public.sites(slug);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own sites" ON public.sites
  FOR ALL USING (auth.uid() = user_id);

-- Allow public read for published sites (view at /s/[slug])
CREATE POLICY "Public can read sites by slug" ON public.sites
  FOR SELECT USING (slug IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_sites_user_id ON public.sites(user_id);
