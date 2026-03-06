import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";

export interface BusinessPlace {
  name: string;
  address: string;
  phone: string;
  rating: number | null;
  website: string | null;
  place_id: string;
  reviews_count?: number;
  category?: string;
  lead_score?: number;
}

function extractCityFromAddress(addr: string): string {
  const parts = addr.split(",").map((p) => p.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "";
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const businessType = (body?.businessType || "").trim();
  const city = (body?.city || "").trim();
  const country = (body?.country || "").trim();
  const limitRaw = body?.limit ?? 20;
  const limit = Math.min(Math.max(parseInt(String(limitRaw), 10) || 20, 1), 500);

  if (!businessType || !city || !country) {
    return NextResponse.json({ error: "businessType, city, and country are required" }, { status: 400 });
  }

  const creditAction = limit <= 20 ? "businessFinderSearch" : limit <= 50 ? "businessFinderBulk50" : limit <= 100 ? "businessFinderBulk100" : "businessFinderBulk500";
  const hasCredits = await hasEnoughCredits(user.id, creditAction);
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: `Insufficient credits. Search costs ${limit <= 20 ? 5 : limit <= 50 ? 10 : limit <= 100 ? 15 : 25} credits.` },
      { status: 403 }
    );
  }

  const query = `${businessType} in ${city} ${country}`;

  if (!GOOGLE_MAPS_API_KEY) {
    await deductCredits(user.id, creditAction);
    return NextResponse.json({
      results: getMockResults(city),
      source: "mock",
    });
  }

  try {
    const textRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const textData = await textRes.json();

    if (textData.status !== "OK" && textData.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: textData.error_message || "Places API error" }, { status: 500 });
    }

    const places = (textData.results || []).slice(0, limit);
    const results: BusinessPlace[] = [];
    const seen = new Set<string>();

    for (const place of places) {
      if (seen.has(place.place_id)) continue;
      seen.add(place.place_id);

      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,international_phone_number,rating,user_ratings_total,types&key=${GOOGLE_MAPS_API_KEY}`
      );
      const detailsData = await detailsRes.json();
      const d = detailsData.result;

      if (!d) continue;

      const website = d.website || null;
      if (website && website.trim() !== "") continue;

      const rating = d.rating ?? null;
      const reviewsCount = d.user_ratings_total ?? 0;
      const category = (d.types || [])[0] || businessType;

      let leadScore = 50;
      if (!website || website.trim() === "") leadScore += 30;
      if (rating != null && rating < 4) leadScore += 10;
      if (reviewsCount < 10) leadScore += 10;

      results.push({
        name: d.name || place.name,
        address: d.formatted_address || place.formatted_address || "",
        phone: d.international_phone_number || "",
        rating,
        website: null,
        place_id: place.place_id,
        reviews_count: reviewsCount,
        category,
        lead_score: Math.min(leadScore, 100),
      });
    }

    await deductCredits(user.id, creditAction);

    return NextResponse.json({ results, source: "google" });
  } catch (e) {
    console.error("Business finder search error:", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

function getMockResults(city: string): BusinessPlace[] {
  return [
    { name: "Pizza Place", address: `123 Main St, ${city}`, phone: "+1-555-0100", rating: 4.2, website: null, place_id: "mock1" },
    { name: "Cafe Nof", address: `45 Oak Ave, ${city}`, phone: "+1-555-0101", rating: 4.5, website: null, place_id: "mock2" },
    { name: "Salon Beauty", address: `78 Elm St, ${city}`, phone: "+1-555-0102", rating: 4.0, website: null, place_id: "mock3" },
  ];
}
