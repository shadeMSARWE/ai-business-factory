export interface WebsiteSection {
  id: string;
  type: "hero" | "services" | "gallery" | "testimonials" | "contact";
  content: Record<string, unknown>;
}

export interface GeneratedWebsite {
  id: string;
  userId: string;
  slug: string;
  name: string;
  prompt: string;
  businessType: string;
  pages: {
    home: WebsitePage;
    about: WebsitePage;
    services: WebsitePage;
    contact: WebsitePage;
  };
  businessInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    mapEmbed?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePage {
  sections: WebsiteSection[];
}

export interface Lead {
  id: string;
  websiteId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
