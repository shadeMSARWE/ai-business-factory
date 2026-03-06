"use client";

import { useState } from "react";
import { addLead } from "@/lib/leads";

interface WebsiteData {
  businessName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutContent?: string;
  services?: { title: string; description: string }[];
  testimonials?: { name: string; text: string; role: string }[];
  galleryImages?: string[];
  contactInfo?: { address: string; phone: string; email: string; whatsapp: string };
  primaryColor?: string;
}

export function PublishedSite({ data, slug = "" }: { data: WebsiteData; slug?: string }) {
  const d = data || {};
  const primary = d.primaryColor || "#8b5cf6";
  const heroImage = d.galleryImages?.[0] || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* Hero - Large, modern */}
      <header
        className="min-h-[85vh] flex items-center justify-center text-center text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${heroImage}) center/cover`,
        }}
      >
        <div className="relative z-10 px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            {d.heroTitle || "Welcome"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {d.heroSubtitle || ""}
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* About */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          {d.aboutTitle || "About Us"}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          {d.aboutContent || ""}
        </p>
      </section>

      {/* Services - Feature cards */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(d.services || []).map((s, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{s.title}</h3>
                <p className="text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
          Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {(d.galleryImages || []).slice(0, 6).map((img, i) => (
            <div key={i} className="aspect-[4/3] relative rounded-2xl overflow-hidden group">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
            Testimonials
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(d.testimonials || []).map((t, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <p className="text-gray-600 text-lg italic">&quot;{t.text}&quot;</p>
                <div className="mt-4">
                  <strong className="text-gray-900">{t.name}</strong>
                  <span className="text-gray-500"> — {t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" style={{ background: `linear-gradient(135deg, ${primary}22, ${primary}11)` }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8">Contact us today and let&apos;s work together.</p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{ background: primary }}
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 mb-2">{d.contactInfo?.address || ""}</p>
            <p className="text-gray-600 mb-2">{d.contactInfo?.phone || ""}</p>
            <p className="text-gray-600">{d.contactInfo?.email || ""}</p>
          </div>
          <div>
            <ContactForm slug={slug} />
          </div>
        </div>
        <div className="mt-12 rounded-2xl overflow-hidden border border-gray-200 h-72 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Google Maps — Add your embed URL</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-lg">{d.businessName || "Business"}</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>

      {d.contactInfo?.whatsapp && (
        <a
          href={`https://wa.me/${d.contactInfo.whatsapp}`}
          className="fixed bottom-6 right-6 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-[#20bd5a] transition hover:scale-105 z-50"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      )}

    </div>
  );
}

function ContactForm({ slug }: { slug: string }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";
    await addLead({ name, email, message, slug });
    setStatus("sent");
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
      />
      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        required
        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
      />
      <button
        type="submit"
        disabled={status === "sent"}
        className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium disabled:opacity-70 hover:opacity-90 transition"
      >
        {status === "sent" ? "Message sent!" : "Send Message"}
      </button>
    </form>
  );
}
