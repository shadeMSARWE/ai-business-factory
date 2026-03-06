import { NextRequest, NextResponse } from "next/server";
import { getGeneratedSiteBySlug, getSiteBySlugFromSites } from "@/lib/supabase/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }
  let site = await getGeneratedSiteBySlug(slug);
  if (site) {
    return NextResponse.json({ data: site.data, meta: { title: site.meta_title, description: site.meta_description } });
  }
  const sitesRow = await getSiteBySlugFromSites(slug);
  if (sitesRow) {
    return NextResponse.json({ data: sitesRow.data });
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
