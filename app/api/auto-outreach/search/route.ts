import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import { rateLimit } from "@/lib/rate-limit";
import { trackAutoOutreachEvent } from "@/lib/analytics-track";

export interface AutoOutreachBusiness {
  name: string;
  address: string;
  phone: string;
  email: string | null;
  rating: number | null;
  website: string | null;
  place_id: string;
  city: string;
}

function extractCityFromAddress(addr: string): string {
  const parts = addr.split(",").map((p) => p.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "";
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function extractEmailFromText(text: string): string | null {
  const match = text.match(EMAIL_REGEX);
  return match ? match[0] : null;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const { ok } = rateLimit(`auto-outreach:${ip}`);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hasCredits = await hasEnoughCredits(user.id, "autoOutreachSearch");
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Search costs 5 credits." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const businessType = (body?.businessType || "").trim();
  const city = (body?.city || "").trim();
  const country = (body?.country || "").trim();
  const radius = (body?.radius || "").trim();

  if (!businessType || !city || !country) {
    return NextResponse.json({ error: "businessType, city, and country are required" }, { status: 400 });
  }

  const query = `${businessType} in ${city} ${country}`;

  if (!GOOGLE_MAPS_API_KEY) {
    await deductCredits(user.id, "autoOutreachSearch");
    const mockResults = getMockResults(city);
    await saveToBusinessLeads(supabase, user.id, mockResults, country);
    await trackAutoOutreachEvent(user.id, "business_search", { count: mockResults.length, source: "mock" });
    return NextResponse.json({ results: mockResults, source: "mock" });
  }

  try {
    const textRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const textData = await textRes.json();

    if (textData.status !== "OK" && textData.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: textData.error_message || "Places API error" }, { status: 500 });
    }

    const places = (textData.results || []).slice(0, 20);
    const results: AutoOutreachBusiness[] = [];

    for (const place of places) {
      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,international_phone_number,rating,url&key=${GOOGLE_MAPS_API_KEY}`
      );
      const detailsData = await detailsRes.json();
      const d = detailsData.result;

      if (!d) continue;

      const website = d.website || null;
      if (website && website.trim() !== "") continue;

      const addr = d.formatted_address || place.formatted_address || "";
      const extractedEmail = extractEmailFromText(addr + " " + (d.url || ""));

      results.push({
        name: d.name || place.name,
        address: addr,
        phone: d.international_phone_number || "",
        email: extractedEmail,
        rating: d.rating ?? null,
        website: null,
        place_id: place.place_id,
        city: extractCityFromAddress(addr) || city,
      });
    }

    await deductCredits(user.id, "autoOutreachSearch");
    await saveToBusinessLeads(supabase, user.id, results, country);
    await trackAutoOutreachEvent(user.id, "business_search", { count: results.length, source: "google" });

    return NextResponse.json({ results, source: "google" });
  } catch (e) {
    console.error("Auto outreach search error:", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

async function saveToBusinessLeads(
  supabase: NonNullable<Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>>,
  userId: string,
  results: AutoOutreachBusiness[],
  country: string
) {
  for (const r of results) {
    await supabase.from("business_leads").insert({
      user_id: userId,
      business_name: r.name,
      address: r.address,
      phone: r.phone || null,
      city: r.city || null,
      country: country || null,
      place_id: r.place_id,
      website_generated: false,
      rating: r.rating ?? null,
      category: "business",
      lead_score: 70,
    } as Record<string, unknown>);
  }
}

function getMockResults(city: string): AutoOutreachBusiness[] {
  return [
    { name: "Pizza Place", address: `123 Main St, ${city}`, phone: "+1-555-0100", email: null, rating: 4.2, website: null, place_id: "mock1", city },
    { name: "Cafe Nof", address: `45 Oak Ave, ${city}`, phone: "+1-555-0101", email: null, rating: 4.5, website: null, place_id: "mock2", city },
    { name: "Salon Beauty", address: `78 Elm St, ${city}`, phone: "+1-555-0102", email: null, rating: 4.0, website: null, place_id: "mock3", city },
  ];
}
