"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

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
}

export function WebsitePreview({
  data,
  websiteId,
  onEdit,
}: {
  data: WebsiteData;
  websiteId?: string;
  onEdit?: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const heroImage = data.galleryImages?.[0] || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";

  const pageContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,sans-serif;line-height:1.6;color:#333}
    .hero{min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('${heroImage}') center/cover;color:#fff;padding:2rem}
    .hero h1{font-size:2.5rem;margin-bottom:1rem}
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
  <header class="hero">
    <div>
      <h1>${data.heroTitle || "Welcome"}</h1>
      <p style="margin-bottom:1.5rem">${data.heroSubtitle || ""}</p>
      <a href="#contact" class="btn">Get Started</a>
    </div>
  </header>
  <section class="section">
    <h2>${data.aboutTitle || "About Us"}</h2>
    <p style="margin-top:1rem">${data.aboutContent || ""}</p>
  </section>
  <section class="section">
    <h2>Our Services</h2>
    <div class="services">
      ${(data.services || []).map(s => `<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}
    </div>
  </section>
  <section class="section">
    <h2>Gallery</h2>
    <div class="gallery">
      ${(data.galleryImages || []).slice(0,6).map(img => `<img src="${img}" alt="Gallery" />`).join("")}
    </div>
  </section>
  <section class="testimonials">
    <div class="section">
      <h2>Testimonials</h2>
      ${(data.testimonials || []).map(t => `<div class="testimonial"><p>"${t.text}"</p><strong>${t.name}</strong> - ${t.role}</div>`).join("")}
    </div>
  </section>
  <section id="contact" class="section contact">
    <h2>Contact Us</h2>
    <p>${data.contactInfo?.address || ""}</p>
    <p>${data.contactInfo?.phone || ""}</p>
    <p>${data.contactInfo?.email || ""}</p>
    <form id="contact-form">
      <input type="text" placeholder="Name" required />
      <input type="email" placeholder="Email" required />
      <textarea placeholder="Message" rows="4" required></textarea>
      <button type="submit" class="btn">Send Message</button>
    </form>
    <div style="margin-top:2rem;height:200px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666">Google Maps placeholder</div>
  </section>
  <footer style="background:#1a1a1a;color:#fff;padding:2rem;text-align:center"><p style="font-weight:600">${data.businessName || "Business"}</p><p style="font-size:0.875rem;color:#999;margin-top:0.5rem">© ${new Date().getFullYear()} All rights reserved.</p></footer>
  ${data.contactInfo?.whatsapp ? `<a href="https://wa.me/${data.contactInfo.whatsapp}" class="whatsapp" target="_blank">WhatsApp</a>` : ""}
</body>
</html>
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/20 bg-white/5 overflow-hidden backdrop-blur-xl"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <span className="text-sm font-medium">Live Preview</span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Edit
          </button>
        )}
      </div>
      <div className="aspect-video bg-white">
        <iframe
          ref={iframeRef}
          srcDoc={pageContent}
          title="Website Preview"
          className="w-full h-[600px] border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </motion.div>
  );
}
