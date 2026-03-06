import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENAI_API_KEY } from "@/lib/env";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const businessName = (body?.businessName || "").trim();
  const previewUrl = (body?.previewUrl || "").trim();

  if (!businessName) {
    return NextResponse.json({ error: "businessName is required" }, { status: 400 });
  }

  const defaultMessage = `Hello! I've created a professional website prototype for ${businessName}. You can view it here: ${previewUrl || "[preview link]"}\n\nI'd love to discuss how we can help you establish a stronger online presence. Would you be interested in a quick call?`;

  if (!OPENAI_API_KEY) {
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
          content: "Generate a short, professional sales message to offer a website to a business owner. Be friendly, concise, and include the preview link. Keep it under 150 words.",
        },
        {
          role: "user",
          content: `Business: ${businessName}. Preview URL: ${previewUrl || "https://example.com/preview"}. Write a message to send to the business owner offering the website.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });
    const message = completion.choices[0]?.message?.content?.trim() || defaultMessage;
    return NextResponse.json({ message });
  } catch (e) {
    console.error("Generate offer error:", e);
    return NextResponse.json({ message: defaultMessage });
  }
}
