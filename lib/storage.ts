const STORAGE_KEY = "instantbizsite_websites";

export interface StoredWebsite {
  id: string;
  slug: string;
  name: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export function getWebsites(): StoredWebsite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWebsite(website: Omit<StoredWebsite, "id" | "createdAt">): StoredWebsite {
  const sites = getWebsites();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const newSite: StoredWebsite = { ...website, id, createdAt };
  sites.unshift(newSite);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  return newSite;
}

export function updateWebsite(id: string, updates: Partial<StoredWebsite>): StoredWebsite | null {
  const sites = getWebsites();
  const idx = sites.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sites[idx] = { ...sites[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  return sites[idx];
}

export function deleteWebsite(id: string): boolean {
  const sites = getWebsites().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  return true;
}

export function getWebsiteById(id: string): StoredWebsite | null {
  return getWebsites().find((s) => s.id === id) || null;
}

export function getWebsiteBySlug(slug: string): StoredWebsite | null {
  return getWebsites().find((s) => s.slug === slug) || null;
}
