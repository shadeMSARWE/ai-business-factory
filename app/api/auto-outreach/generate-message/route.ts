import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import { OPENAI_API_KEY } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { trackAutoOutreachEvent } from "@/lib/analytics-track";

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

  const hasCredits = await hasEnoughCredits(user.id, "autoOutreachMessage");
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Message generation costs 1 credit." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const businessName = (body?.businessName || "").trim();
  const city = (body?.city || "").trim();
  const demoUrl = (body?.demoUrl || "").trim();

  if (!businessName) {
    return NextResponse.json({ error: "businessName is required" }, { status: 400 });
  }

  const defaultMessage = `Hello,\n\nI created a website prototype for ${businessName}${city ? ` in ${city}` : ""}.\n\nYou can preview it here:\n${demoUrl || "[demo link]"}\n\nIf you like it, I can activate it for your company.\n\nBest regards.`;

  if (!OPENAI_API_KEY) {
    await deductCredits(user.id, "autoOutreachMessage");
    await trackAutoOutreachEvent(user.id, "offer_generated", { businessName: businessName || "unknown" });
    return NextResponse.json({ message: defaultMessage });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Write a short outreach message offering a website demo for this business. Be friendly, professional, and concise. Include the demo link. Keep under 120 words.",
        },
        {
          role: "user",
          content: `Business: ${businessName}. City: ${city || "N/A"}. Demo URL: ${demoUrl || "https://example.com/demo"}. Write a message to send to the business owner.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });
    const message = completion.choices[0]?.message?.content?.trim() || defaultMessage;
    await deductCredits(user.id, "autoOutreachMessage");
    await trackAutoOutreachEvent(user.id, "offer_generated", { businessName: businessName || "unknown" });
    return NextResponse.json({ message });
  } catch (e) {
    console.error("Generate message error:", e);
    await deductCredits(user.id, "autoOutreachMessage");
    await trackAutoOutreachEvent(user.id, "offer_generated", { businessName: businessName || "unknown", error: true });
    return NextResponse.json({ message: defaultMessage });
  }
}
