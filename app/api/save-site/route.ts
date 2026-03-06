import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProject, saveGeneratedSite } from "@/lib/supabase/db";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, data } = body;
    if (!slug || !name || !data) {
      return NextResponse.json({ error: "slug, name, and data required" }, { status: 400 });
    }

    const project = await createProject(user.id, name);
    if (!project) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    const site = await saveGeneratedSite(project.id, slug, data, {
      title: typeof data.businessName === "string" ? `${data.businessName} | InstantBizSite` : undefined,
      description: typeof data.tagline === "string" ? data.tagline : undefined,
    });
    if (!site) {
      return NextResponse.json({ error: "Failed to save site" }, { status: 500 });
    }

    return NextResponse.json({ id: site.id, projectId: project.id, slug });
  } catch (e) {
    console.error("Save site error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
