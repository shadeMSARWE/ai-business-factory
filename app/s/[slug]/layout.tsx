import { getGeneratedSiteBySlug } from "@/lib/supabase/db";
import type { Metadata } from "next";

type Props = { params: { slug: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  if (!slug) return { title: "Site" };

  const dbSite = await getGeneratedSiteBySlug(slug);
  const title = dbSite?.meta_title || (dbSite?.data as { businessName?: string })?.businessName || slug;
  const description = dbSite?.meta_description || (dbSite?.data as { tagline?: string })?.tagline || "";

  return {
    title: `${title} | InstantBizSite`,
    description: description || `Visit ${title}`,
    openGraph: {
      title: `${title} | InstantBizSite`,
      description: description || `Visit ${title}`,
      type: "website",
    },
  };
}

export default function SlugLayout({ children }: Props) {
  return <>{children}</>;
}
