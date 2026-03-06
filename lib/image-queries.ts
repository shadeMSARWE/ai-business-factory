import type { BusinessType } from "./business-types";

export const UNSPLASH_QUERIES: Record<BusinessType, string[]> = {
  restaurant: ["restaurant food", "pizza restaurant", "restaurant interior", "chef cooking", "restaurant dining", "food plating"],
  dentist: ["dental clinic", "dentist tools", "dental office", "teeth cleaning", "dentist", "dental chair"],
  salon: ["hair salon interior", "hair salon", "salon styling", "beauty salon", "hair cut", "salon mirror"],
  car_wash: ["car wash", "car detailing", "car wash service", "car cleaning", "auto detail", "car wash foam"],
  real_estate: ["real estate", "modern house", "house exterior", "home interior", "property", "house for sale"],
  construction: ["construction site", "construction workers", "building construction", "construction equipment", "modern building", "construction"],
  law_firm: ["law office", "legal documents", "lawyer office", "corporate law", "legal", "law books"],
  gym: ["gym", "fitness", "gym equipment", "workout", "gym interior", "weight training"],
};

const FALLBACK_IMAGES: Record<BusinessType, string> = {
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  dentist: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  car_wash: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  real_estate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  law_firm: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
};

export function getFallbackImages(businessType: BusinessType): string[] {
  const base = FALLBACK_IMAGES[businessType];
  return [base, base, base, base, base, base];
}

export async function fetchUnsplashImages(
  businessType: BusinessType,
  apiKey: string | undefined
): Promise<string[]> {
  const queries = UNSPLASH_QUERIES[businessType];
  const fallbacks = getFallbackImages(businessType);

  if (!apiKey) return fallbacks;

  try {
    const results = await Promise.all(
      queries.slice(0, 6).map(async (query) => {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${apiKey}` } }
        );
        const data = await res.json();
        return data.results?.[0]?.urls?.regular || fallbacks[0];
      })
    );
    return results;
  } catch {
    return fallbacks;
  }
}
