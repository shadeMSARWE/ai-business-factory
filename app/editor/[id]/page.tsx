"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getWebsiteById, updateWebsite, saveWebsiteWithId } from "@/lib/storage";
import { PublishButton } from "@/components/publish-button";
import { ArrowLeft, Save, Eye, Layout, Image, Type } from "lucide-react";

interface WebsiteData {
  businessName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
  services: { title: string; description: string }[];
  testimonials: { name: string; text: string; role: string }[];
  galleryImages: string[];
  contactInfo: { address: string; phone: string; email: string; whatsapp: string };
  visibleSections?: Record<string, boolean>;
  primaryColor?: string;
}

const defaultData: WebsiteData = {
  businessName: "",
  heroTitle: "",
  heroSubtitle: "",
  aboutTitle: "",
  aboutContent: "",
  services: [],
  testimonials: [],
  galleryImages: [],
  contactInfo: { address: "", phone: "", email: "", whatsapp: "" },
  visibleSections: { hero: true, services: true, gallery: true, testimonials: true, contact: true },
  primaryColor: "#8b5cf6",
};

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
] as const;

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<WebsiteData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [sourceDb, setSourceDb] = useState(false);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    async function load() {
      const local = getWebsiteById(id);
      if (local?.data) {
        const d = local.data as unknown as Partial<WebsiteData>;
        setData({
          ...defaultData,
          ...d,
          visibleSections: { ...defaultData.visibleSections, ...d.visibleSections },
        });
        setSlug(local.slug || "");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/sites/${id}`);
        if (res.ok) {
          const json = await res.json();
          const d = json.data as Partial<WebsiteData>;
          setData({
            ...defaultData,
            ...d,
            visibleSections: { ...defaultData.visibleSections, ...d.visibleSections },
          });
          const slugVal = json.slug || "website";
          setSlug(slugVal);
          setSourceDb(true);
          const name = (d.businessName as string) || "website";
          saveWebsiteWithId(id, { slug: slugVal, name, data: d as Record<string, unknown> });
        }
      } catch {
        setData(defaultData);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const update = (path: string, value: unknown) => {
    setData((prev) => {
      const next = { ...prev };
      const parts = path.split(".");
      let cur: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (!(key in cur)) (cur as Record<string, unknown>)[key] = {};
        cur = (cur as Record<string, unknown>)[key] as Record<string, unknown>;
      }
      (cur as Record<string, unknown>)[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const toggleSection = (section: string) => {
    const vis = data.visibleSections || defaultData.visibleSections!;
    update("visibleSections", { ...vis, [section]: !vis[section] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const local = getWebsiteById(id);
      if (local) {
        updateWebsite(id, { data: data as unknown as Record<string, unknown> });
      }
      if (sourceDb) {
        const res = await fetch(`/api/sites/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: JSON.stringify(data), slug }),
        });
        if (!res.ok) throw new Error("Failed to save");
      }
      router.refresh();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const site = getWebsiteById(id) || (sourceDb ? { id: id as string, slug: slug || "website" } : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const vis = data.visibleSections || defaultData.visibleSections!;
  const primary = data.primaryColor || "#8b5cf6";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <Link href="/dashboard" className="text-lg font-semibold text-white flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Editor
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/preview/${id}`}>
              <Button variant="outline" size="sm" className="border-white/20">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </Link>
            {site && <PublishButton websiteId={site.id} variant="outline" size="sm" className="border-white/20" />}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-white/10 p-4 space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase mb-4">Sections</p>
          {SECTIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors ${
                  activeSection === s.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Layout className="h-4 w-4" />
                {s.label}
              </button>
              <button
                onClick={() => toggleSection(s.id)}
                className={`text-xs px-2 py-1 rounded ${vis[s.id] ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-500"}`}
              >
                {vis[s.id] ? "On" : "Off"}
              </button>
            </div>
          ))}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Colors</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primary}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="h-10 w-10 rounded-lg cursor-pointer border border-white/20 bg-transparent"
              />
              <Input
                value={primary}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="flex-1 h-9 bg-white/5 border-white/20 text-sm"
              />
            </div>
          </div>
        </aside>

        <main className="flex-1 flex">
          <div className="w-96 border-r border-white/10 p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            {activeSection === "hero" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Hero Section
                </h3>
                <div>
                  <Label className="text-slate-400">Business Name</Label>
                  <Input value={data.businessName} onChange={(e) => update("businessName", e.target.value)} className="mt-1 bg-white/5 border-white/20" />
                </div>
                <div>
                  <Label className="text-slate-400">Hero Title</Label>
                  <Input value={data.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className="mt-1 bg-white/5 border-white/20" />
                </div>
                <div>
                  <Label className="text-slate-400">Hero Subtitle</Label>
                  <Input value={data.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} className="mt-1 bg-white/5 border-white/20" />
                </div>
              </div>
            )}
            {activeSection === "services" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Services</h3>
                {(data.services || []).map((s, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <Input value={s.title} onChange={(e) => {
                      const next = [...(data.services || [])];
                      next[i] = { ...next[i], title: e.target.value };
                      update("services", next);
                    }} placeholder="Title" className="mb-2 bg-white/5 border-white/20" />
                    <Textarea value={s.description} onChange={(e) => {
                      const next = [...(data.services || [])];
                      next[i] = { ...next[i], description: e.target.value };
                      update("services", next);
                    }} placeholder="Description" className="bg-white/5 border-white/20" rows={2} />
                  </div>
                ))}
              </div>
            )}
            {activeSection === "gallery" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gallery Images
                </h3>
                {(data.galleryImages || []).map((img, i) => (
                  <div key={i}>
                    <Label className="text-slate-400">Image {i + 1}</Label>
                    <Input value={img} onChange={(e) => {
                      const next = [...(data.galleryImages || [])];
                      next[i] = e.target.value;
                      update("galleryImages", next);
                    }} className="mt-1 bg-white/5 border-white/20" placeholder="Image URL" />
                  </div>
                ))}
              </div>
            )}
            {activeSection === "testimonials" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Testimonials</h3>
                {(data.testimonials || []).map((t, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                    <Input value={t.name} onChange={(e) => {
                      const next = [...(data.testimonials || [])];
                      next[i] = { ...next[i], name: e.target.value };
                      update("testimonials", next);
                    }} placeholder="Name" className="bg-white/5 border-white/20" />
                    <Textarea value={t.text} onChange={(e) => {
                      const next = [...(data.testimonials || [])];
                      next[i] = { ...next[i], text: e.target.value };
                      update("testimonials", next);
                    }} placeholder="Quote" className="bg-white/5 border-white/20" rows={2} />
                    <Input value={t.role} onChange={(e) => {
                      const next = [...(data.testimonials || [])];
                      next[i] = { ...next[i], role: e.target.value };
                      update("testimonials", next);
                    }} placeholder="Role" className="bg-white/5 border-white/20" />
                  </div>
                ))}
              </div>
            )}
            {activeSection === "contact" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contact Info</h3>
                {(["address", "phone", "email", "whatsapp"] as const).map((key) => (
                  <div key={key}>
                    <Label className="text-slate-400 capitalize">{key}</Label>
                    <Input
                      value={data.contactInfo[key]}
                      onChange={(e) => update("contactInfo", { ...data.contactInfo, [key]: e.target.value })}
                      className="mt-1 bg-white/5 border-white/20"
                    />
                  </div>
                ))}
                <div>
                  <Label className="text-slate-400">About Title</Label>
                  <Input value={data.aboutTitle} onChange={(e) => update("aboutTitle", e.target.value)} className="mt-1 bg-white/5 border-white/20" />
                </div>
                <div>
                  <Label className="text-slate-400">About Content</Label>
                  <Textarea value={data.aboutContent} onChange={(e) => update("aboutContent", e.target.value)} className="mt-1 bg-white/5 border-white/20" rows={4} />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 bg-slate-900/50">
            <div className="rounded-xl border border-white/10 bg-white overflow-hidden shadow-2xl">
              <iframe
                srcDoc={`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;line-height:1.6;color:#333}
.hero{min-height:40vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('${data.galleryImages?.[0] || ""}') center/cover;color:#fff;padding:2rem}
.section{padding:2rem}
.services{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
.service-card{padding:1rem;border-radius:8px;background:#f8f9fa}
.btn{background:${primary};color:#fff;padding:0.5rem 1rem;border-radius:8px;text-decoration:none;display:inline-block}
</style>
</head>
<body>
  ${vis.hero ? `<header class="hero"><div><h1>${data.heroTitle || "Title"}</h1><p>${data.heroSubtitle || ""}</p><a href="#contact" class="btn" style="margin-top:1rem">Get Started</a></div></header>` : ""}
  ${vis.services ? `<section class="section"><h2>About</h2><p>${data.aboutContent || ""}</p></section><section class="section"><h2>Services</h2><div class="services">${(data.services || []).map(s=>`<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}</div></section>` : ""}
  ${vis.gallery ? `<section class="section"><h2>Gallery</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem">${(data.galleryImages || []).slice(0,6).map(img=>`<img src="${img}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:8px"/>`).join("")}</div></section>` : ""}
  ${vis.testimonials ? `<section class="section" style="background:#f8f9fa"><h2>Testimonials</h2>${(data.testimonials || []).map(t=>`<div style="padding:1rem;background:#fff;border-radius:8px;margin-bottom:0.5rem"><p>"${t.text}"</p><strong>${t.name}</strong> - ${t.role}</div>`).join("")}</section>` : ""}
  ${vis.contact ? `<section id="contact" class="section"><h2>Contact</h2><p>${data.contactInfo?.address || ""}</p><p>${data.contactInfo?.phone || ""}</p><p>${data.contactInfo?.email || ""}</p></section>` : ""}
</body>
</html>
                `}
                title="Preview"
                className="w-full h-[calc(100vh-8rem)] border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
