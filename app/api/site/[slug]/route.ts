import { NextRequest, NextResponse } from "next/server";
import { getGeneratedSiteBySlug } from "@/lib/supabase/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }
  const site = await getGeneratedSiteBySlug(slug);
  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: site.data, meta: { title: site.meta_title, description: site.meta_description } });
}
