import { createClient } from "@/lib/supabase/server";

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  created_at: string;
}

export interface DbGeneratedSite {
  id: string;
  project_id: string;
  slug: string;
  html_code: string | null;
  css_code: string | null;
  js_code: string | null;
  data: Record<string, unknown>;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export async function getProjectsForUser(userId: string): Promise<DbProject[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function createProject(userId: string, name: string, industry?: string): Promise<DbProject | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, industry })
    .select()
    .single();
  if (error) return null;
  return data;
}

export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);
  return !error;
}

export async function getGeneratedSitesForProject(projectId: string): Promise<DbGeneratedSite[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function saveGeneratedSite(
  projectId: string,
  slug: string,
  data: Record<string, unknown>,
  meta?: { title?: string; description?: string }
): Promise<DbGeneratedSite | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const payload = {
    project_id: projectId,
    slug,
    data,
    meta_title: meta?.title || null,
    meta_description: meta?.description || null,
    updated_at: new Date().toISOString(),
  };
  const { data: existing } = await supabase
    .from("generated_sites")
    .select("id")
    .eq("project_id", projectId)
    .eq("slug", slug)
    .single();
  if (existing) {
    const { data: updated, error } = await supabase
      .from("generated_sites")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();
    return error ? null : updated;
  }
  const { data: inserted, error } = await supabase
    .from("generated_sites")
    .insert(payload)
    .select()
    .single();
  return error ? null : inserted;
}

export async function getGeneratedSiteBySlug(slug: string): Promise<DbGeneratedSite | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}
