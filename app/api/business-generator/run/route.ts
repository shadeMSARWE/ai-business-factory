import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFactoryEngine } from "@/lib/factories";

/**
 * POST /api/business-generator/run
 * Orchestrates multiple factories via runFactoryEngine to produce a complete AI business kit.
 * Does not add a new engine; only calls existing factories.
 */

export interface BusinessKitResult {
  businessName: string;
  slogan: string;
  logoConcept: unknown;
  brandColors: unknown;
  typography: unknown;
  websiteStructure: unknown;
  storePlan: unknown;
  seoStrategy: unknown;
  adCampaigns: unknown;
  socialContentPlan: unknown;
  videoIdeas: unknown;
}

const ORCHESTRATION_ORDER: { id: string; key: keyof BusinessKitResult }[] = [
  { id: "logo", key: "logoConcept" },
  { id: "brandingStudio", key: "brandColors" },
  { id: "websiteTemplates", key: "websiteStructure" },
  { id: "storeBuilder", key: "storePlan" },
  { id: "seo", key: "seoStrategy" },
  { id: "ads", key: "adCampaigns" },
  { id: "socialContent", key: "socialContentPlan" },
  { id: "videoFactory", key: "videoIdeas" },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const businessName = prompt;
    const slogan = "";

    const result: BusinessKitResult = {
      businessName,
      slogan,
      logoConcept: null,
      brandColors: null,
      typography: null,
      websiteStructure: null,
      storePlan: null,
      seoStrategy: null,
      adCampaigns: null,
      socialContentPlan: null,
      videoIdeas: null,
    };

    for (const { id, key } of ORCHESTRATION_ORDER) {
      const run = await runFactoryEngine(id, {
        prompt,
        options: {},
      });

      if (run.success && run.data != null) {
        (result as unknown as Record<string, unknown>)[key] = run.data;
        if (key === "brandColors" && run.data && typeof run.data === "object") {
          result.typography = (run.data as Record<string, unknown>).typography ?? run.data;
        }
      }
    }

    if (result.brandColors != null && result.typography === null) {
      result.typography = result.brandColors;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("[business-generator/run]", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
