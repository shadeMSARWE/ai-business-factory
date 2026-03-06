/**
 * Section-based website structure for Live AI Builder.
 * Each section is generated independently and rendered in real time.
 */
export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "testimonials"
  | "pricing"
  | "faq"
  | "contact"
  | "footer";

export interface HeroSection {
  type: "hero";
  data: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage?: string;
  };
}

export interface AboutSection {
  type: "about";
  data: {
    aboutTitle: string;
    aboutContent: string;
  };
}

export interface ServicesSection {
  type: "services";
  data: {
    services: { title: string; description: string }[];
  };
}

export interface GallerySection {
  type: "gallery";
  data: {
    galleryImages: string[];
  };
}

export interface TestimonialsSection {
  type: "testimonials";
  data: {
    testimonials: { name: string; text: string; role: string }[];
  };
}

export interface ContactSection {
  type: "contact";
  data: {
    contactInfo: { address: string; phone: string; email: string; whatsapp: string };
    contactText?: string;
  };
}

export interface FooterSection {
  type: "footer";
  data: {
    businessName: string;
  };
}

export interface ThemeSection {
  type: "theme";
  data: {
    primaryColor: string;
  };
}

export type WebsiteSection =
  | HeroSection
  | AboutSection
  | ServicesSection
  | GallerySection
  | TestimonialsSection
  | ContactSection
  | FooterSection
  | ThemeSection;

export interface SiteSections {
  businessName: string;
  businessType: string;
  sections: WebsiteSection[];
}

/** Convert sections to flat data for PublishedSite compatibility */
export function sectionsToFlatData(sections: WebsiteSection[], businessName: string): Record<string, unknown> {
  const flat: Record<string, unknown> = {
    businessName,
    heroTitle: "Welcome",
    heroSubtitle: "",
    aboutTitle: "About Us",
    aboutContent: "",
    services: [],
    testimonials: [],
    galleryImages: [],
    contactInfo: { address: "", phone: "", email: "", whatsapp: "" },
    primaryColor: "#8b5cf6",
  };

  for (const s of sections) {
    if (s.type === "hero") {
      flat.heroTitle = s.data.heroTitle;
      flat.heroSubtitle = s.data.heroSubtitle;
      if (s.data.heroImage) (flat as Record<string, unknown>).galleryImages = [s.data.heroImage, ...((flat.galleryImages as string[]) || [])];
    } else if (s.type === "about") {
      flat.aboutTitle = s.data.aboutTitle;
      flat.aboutContent = s.data.aboutContent;
    } else if (s.type === "services") {
      flat.services = s.data.services;
    } else if (s.type === "gallery") {
      const existing = (flat.galleryImages as string[]) || [];
      flat.galleryImages = [...existing, ...s.data.galleryImages];
    } else if (s.type === "testimonials") {
      flat.testimonials = s.data.testimonials;
    } else if (s.type === "contact") {
      flat.contactInfo = s.data.contactInfo;
      if (s.data.contactText) (flat as Record<string, unknown>).contactText = s.data.contactText;
    } else if (s.type === "footer") {
      flat.businessName = s.data.businessName;
    } else if (s.type === "theme") {
      flat.primaryColor = s.data.primaryColor;
    }
  }

  if (!Array.isArray(flat.galleryImages) || flat.galleryImages.length === 0) {
    flat.galleryImages = ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"];
  }
  return flat;
}
