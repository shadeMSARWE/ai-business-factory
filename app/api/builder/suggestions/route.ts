import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENAI_API_KEY } from "@/lib/env";

const DEFAULT_SUGGESTIONS = [
  { id: "1", text: "Add testimonials for trust", action: "Add customer testimonials" },
  { id: "2", text: "Add Google Maps for local business", action: "Add a map section" },
  { id: "3", text: "Add call-to-action button", action: "Add a prominent CTA" },
  { id: "4", text: "Add booking form", action: "Add a reservation or booking form" },
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { siteData } = body;

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ suggestions: DEFAULT_SUGGESTIONS });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Analyze this website data and suggest 3-4 improvements. Return ONLY valid JSON array:
[{"id":"1","text":"suggestion text","action":"what user should ask"}]
Be concise. Focus on: missing testimonials, contact form, CTA, gallery, FAQ, booking, maps.`,
        },
        {
          role: "user",
          content: JSON.stringify(siteData || {}).slice(0, 1500),
        },
      ],
      temperature: 0.6,
      max_tokens: 400,
    });

    const text = completion.choices[0]?.message?.content || "[]";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const suggestions = Array.isArray(parsed)
      ? parsed.slice(0, 4).map((s: { text?: string; action?: string }, i: number) => ({
          id: String(i + 1),
          text: s.text || "Improve your site",
          action: s.action || s.text,
        }))
      : DEFAULT_SUGGESTIONS;
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: DEFAULT_SUGGESTIONS });
  }
}
