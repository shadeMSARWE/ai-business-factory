import { NextRequest, NextResponse } from "next/server";
import type { BusinessType } from "@/lib/business-types";
import { detectBusinessType } from "@/lib/business-types";
import { generateWebsiteContent } from "@/lib/generate-website-content";
import { OPENAI_API_KEY, UNSPLASH_ACCESS_KEY } from "@/lib/env";

const TYPE_MAP: Record<string, BusinessType> = {
  restaurant: "restaurant",
  cafe: "restaurant",
  pizza: "restaurant",
  food: "restaurant",
  dentist: "dentist",
  dental: "dentist",
  salon: "salon",
  hair: "salon",
  beauty: "salon",
  spa: "salon",
  barber: "salon",
  "law firm": "law_firm",
  lawyer: "law_firm",
  legal: "law_firm",
  gym: "gym",
  fitness: "gym",
  "real estate": "real_estate",
  realtor: "real_estate",
  property: "real_estate",
  construction: "construction",
  contractor: "construction",
  "car wash": "car_wash",
  carwash: "car_wash",
};

function mapToBusinessType(input: string): BusinessType {
  const lower = input.toLowerCase().trim();
  return TYPE_MAP[lower] || detectBusinessType(lower);
}

function generateSEO(name: string, type: string, city: string) {
  const typeLabel = type.replace("_", " ");
  return {
    title: `Best ${typeLabel} in ${city} | ${name}`,
    description: `${name} - Your trusted ${typeLabel} in ${city}. Quality service, professional care. Contact us today.`,
    keywords: `${name}, ${typeLabel}, ${city}, best ${typeLabel} ${city}`,
  };
}

function generateAds(name: string, type: string, city: string) {
  const typeLabel = type.replace("_", " ");
  return [
    {
      platform: "Facebook",
      headline: `${name} - ${city}'s Favorite ${typeLabel}`,
      body: `Discover why locals love ${name}. Quality service, great results. Visit us in ${city}!`,
      cta: "Learn More",
    },
    {
      platform: "Google",
      headline: `Best ${typeLabel} in ${city} | ${name}`,
      body: `Top-rated ${typeLabel} in ${city}. Book your appointment at ${name} today.`,
      cta: "Get Started",
    },
    {
      platform: "Instagram",
      caption: `Try the best ${typeLabel} in ${city} 🎯\n\n${name} - where quality meets service.\n\n📍 ${city}\n\n#${city.replace(/\s/g, "")} #${typeLabel.replace(/\s/g, "")} #localbusiness`,
    },
  ];
}

function generateSocialPosts(name: string, type: string, city: string) {
  const typeLabel = type.replace("_", " ");
  const hashtags = `#${name.replace(/\s/g, "")} #${city.replace(/\s/g, "")} #${typeLabel.replace(/\s/g, "")} #localbusiness #supportlocal`;
  return [
    { caption: `Welcome to ${name}! We're excited to serve ${city} with the best ${typeLabel} experience. ${hashtags}` },
    { caption: `Quality matters. At ${name}, we're committed to excellence in every service. Visit us in ${city}! ${hashtags}` },
    { caption: `New in ${city}? Check out ${name} for top-notch ${typeLabel} services. You won't be disappointed! ${hashtags}` },
    { caption: `Thank you to our amazing community in ${city}! ${name} is here for you. ${hashtags}` },
    { caption: `Ready to experience the difference? ${name} - ${city}'s trusted ${typeLabel}. Book today! ${hashtags}` },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessName,
      businessType,
      city,
      targetAudience,
      description,
    } = body;

    if (!businessName || !businessType || !city) {
      return NextResponse.json(
        { error: "Business name, type, and city are required" },
        { status: 400 }
      );
    }

    const mappedType = mapToBusinessType(businessType);
    const prompt = `${businessName}, ${businessType}, ${city}. ${description || ""} Target: ${targetAudience || "general"}`;

    const [websiteContent, seo, ads, social] = await Promise.all([
      generateWebsiteContent(prompt, mappedType, UNSPLASH_ACCESS_KEY, OPENAI_API_KEY),
      Promise.resolve(generateSEO(businessName, mappedType, city)),
      Promise.resolve(generateAds(businessName, mappedType, city)),
      Promise.resolve(generateSocialPosts(businessName, mappedType, city)),
    ]);

    websiteContent.businessName = businessName;
    websiteContent.contactInfo = {
      ...websiteContent.contactInfo,
      address: city,
    };

    return NextResponse.json({
      website: websiteContent,
      seo,
      ads,
      social,
    });
  } catch (error) {
    console.error("Generate business error:", error);
    return NextResponse.json(
      { error: "Failed to generate business" },
      { status: 500 }
    );
  }
}
