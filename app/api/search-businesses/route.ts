import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";

interface BusinessResult {
  name: string;
  city: string;
  location: string;
  phone: string;
  mapsUrl: string;
}

function getMockResults(query: string): BusinessResult[] {
  const q = query.toLowerCase();
  const city = q.includes("haifa") ? "Haifa" : q.includes("tel aviv") ? "Tel Aviv" : "Haifa";
  return [
    { name: "Pizza Haifa", city, location: `Herzl St 45, ${city}`, phone: "+972-4-1234567", mapsUrl: `https://maps.google.com/?q=Herzl+45+${city.replace(" ", "+")}` },
    { name: "Cafe Nof", city, location: `Ben Gurion Ave 12, ${city}`, phone: "+972-4-2345678", mapsUrl: `https://maps.google.com/?q=Ben+Gurion+12+${city.replace(" ", "+")}` },
    { name: "Sushi Bar Haifa", city, location: `Hanevi'im St 8, ${city}`, phone: "+972-4-3456789", mapsUrl: `https://maps.google.com/?q=Haneviim+8+${city.replace(" ", "+")}` },
    { name: "Burger House", city, location: `Nordau St 22, ${city}`, phone: "+972-4-4567890", mapsUrl: `https://maps.google.com/?q=Nordau+22+${city.replace(" ", "+")}` },
    { name: "Steak & Grill", city, location: `Moriah Ave 15, ${city}`, phone: "+972-4-5678901", mapsUrl: `https://maps.google.com/?q=Moriah+15+${city.replace(" ", "+")}` },
  ];
}

function extractCityFromAddress(formattedAddress: string): string {
  const parts = formattedAddress.split(",").map((p) => p.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "—";
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ results: getMockResults(query), source: "mock" });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json({ results: getMockResults(query), source: "mock" });
    }

    const results: BusinessResult[] = (data.results || []).slice(0, 10).map((p: { name: string; formatted_address: string; place_id: string }) => ({
      name: p.name,
      city: extractCityFromAddress(p.formatted_address || ""),
      location: p.formatted_address || "",
      phone: "—",
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    }));

    return NextResponse.json({ results, source: "google" });
  } catch {
    return NextResponse.json({ results: getMockResults(query), source: "mock" });
  }
}
