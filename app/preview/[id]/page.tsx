"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DevicePreview } from "@/components/device-preview";
import { useTranslation } from "@/hooks/use-translation";
import { getWebsiteById } from "@/lib/storage";

export default function PreviewPage() {
  const params = useParams();
  const { t } = useTranslation();
  const id = params.id as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const site = getWebsiteById(id);
    if (site?.data) {
      setData(site.data as Record<string, unknown>);
      setLoading(false);
      return;
    }
    fetch(`/api/sites/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setData(json.data as Record<string, unknown>);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950 flex items-center justify-center">
        <p className="text-slate-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">{t("published.notFound")}</p>
        <Link href="/dashboard/websites">
          <Button variant="outline" className="border-white/20">{t("preview.backToWebsites")}</Button>
        </Link>
      </div>
    );
  }

  const d = data as {
    heroTitle?: string;
    heroSubtitle?: string;
    aboutTitle?: string;
    aboutContent?: string;
    services?: { title: string; description: string }[];
    testimonials?: { name: string; text: string; role: string }[];
    galleryImages?: string[];
    contactInfo?: { address: string; phone: string; email: string; whatsapp: string };
  };

  const heroImage = d.galleryImages?.[0] || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <Link href="/dashboard">
          <Button variant="outline" className="border-white/20 bg-black/50">
            ← {t("preview.backToDashboard")}
          </Button>
        </Link>
      </div>

      <div className="flex-1 min-h-0">
        <DevicePreview>
          <iframe
          srcDoc={`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;line-height:1.6;color:#333}
.hero{min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('${heroImage}') center/cover;color:#fff;padding:2rem}
.hero h1{font-size:3rem;margin-bottom:1rem}
.section{max-width:1200px;margin:0 auto;padding:4rem 2rem}
.services{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem}
.service-card{padding:1.5rem;border-radius:12px;background:#f8f9fa}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.gallery img{width:100%;height:200px;object-fit:cover;border-radius:8px}
.testimonials{background:#f8f9fa;padding:4rem 2rem}
.testimonial{padding:1.5rem;background:#fff;border-radius:12px;margin-bottom:1rem}
.contact form{display:flex;flex-direction:column;gap:1rem;max-width:400px}
.contact input,.contact textarea{padding:0.75rem;border:1px solid #ddd;border-radius:8px}
.btn{display:inline-block;padding:0.75rem 1.5rem;background:linear-gradient(135deg,#8b5cf6,#d946ef);color:#fff;border:none;border-radius:8px;cursor:pointer;text-decoration:none}
.whatsapp{position:fixed;bottom:20px;right:20px;background:#25D366;color:#fff;padding:1rem 1.5rem;border-radius:50px;text-decoration:none;font-weight:600}
</style>
</head>
<body>
  <header class="hero"><div><h1>${d.heroTitle || "Welcome"}</h1><p style="margin-bottom:1.5rem">${d.heroSubtitle || ""}</p><a href="#contact" class="btn">Get Started</a></div></header>
  <section class="section"><h2>${d.aboutTitle || "About Us"}</h2><p style="margin-top:1rem">${d.aboutContent || ""}</p></section>
  <section class="section"><h2>Our Services</h2><div class="services">
    ${(d.services || []).map(s=>`<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}
  </div></section>
  <section class="section"><h2>Gallery</h2><div class="gallery">
    ${(d.galleryImages || []).slice(0,6).map(img=>`<img src="${img}" alt="Gallery"/>`).join("")}
  </div></section>
  <section class="testimonials"><div class="section"><h2>Testimonials</h2>
    ${(d.testimonials || []).map(t=>`<div class="testimonial"><p>"${t.text}"</p><strong>${t.name}</strong> - ${t.role}</div>`).join("")}
  </div></section>
  <section id="contact" class="section contact"><h2>Contact Us</h2>
    <p>${d.contactInfo?.address || ""}</p><p>${d.contactInfo?.phone || ""}</p><p>${d.contactInfo?.email || ""}</p>
    <div style="margin-top:2rem;height:200px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666">Google Maps placeholder</div>
  </section>
  <footer style="background:#1a1a1a;color:#fff;padding:2rem;text-align:center"><p style="font-weight:600">${(d as { businessName?: string }).businessName || "Business"}</p><p style="font-size:0.875rem;color:#999;margin-top:0.5rem">© ${new Date().getFullYear()} All rights reserved.</p></footer>
  ${d.contactInfo?.whatsapp ? `<a href="https://wa.me/${d.contactInfo.whatsapp}" class="whatsapp" target="_blank">WhatsApp</a>` : ""}
</body>
</html>
          `}
          title="Preview"
          className="w-full min-h-[600px] border-0 rounded-lg"
          sandbox="allow-same-origin"
        />
        </DevicePreview>
      </div>
    </div>
  );
}
