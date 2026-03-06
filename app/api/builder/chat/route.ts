import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENAI_API_KEY } from "@/lib/env";
import { getUserPlanAndUsage } from "@/lib/billing";

const SYSTEM_PROMPT = `You are an AI website builder assistant. The user is building a business website. You can:
1. Suggest improvements (e.g. "Add a reservation form", "Add customer testimonials")
2. Suggest missing sections (e.g. "Your site could benefit from a menu section")
3. When the user asks to add something, return JSON with the update. Format: {"type":"suggestion","message":"text"} or {"type":"update","message":"text","siteUpdate":{...}} for actual site changes.

For site updates, only include the fields that changed. Common updates:
- Add reservation: {"contactInfo":{"contactText":"...","hasReservation":true}}
- Add testimonials: {"testimonials":[{...}]}
- Add services: {"services":[{...}]}
- Add FAQ: {"faq":[{...}]}

Be concise. If the user just wants suggestions, respond with type "suggestion". If they want to add/change something, respond with type "update" and include the siteUpdate object.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (user) {
    const billing = await getUserPlanAndUsage(user.id);
    if (!billing?.canGenerate) {
      return NextResponse.json({ error: "AI generation limit reached for this month. Upgrade your plan." }, { status: 403 });
    }
  }

  const body = await request.json();
  const { message, siteData, chatHistory = [] } = body;
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({
      type: "suggestion",
      message: "Add a reservation form. Add customer testimonials. Add a menu section. Configure OpenAI to enable AI suggestions.",
    });
  }

  const historyMessages = Array.isArray(chatHistory)
    ? chatHistory.slice(-6).flatMap((h: { role: string; content: string }) => [
        { role: h.role as "user" | "assistant", content: h.content },
      ])
    : [];

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...historyMessages,
        {
          role: "user",
          content: `Current site: ${JSON.stringify(siteData || {}).slice(0, 2000)}\n\nUser: ${message}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ type: "suggestion", message: text });
    }
  } catch (e) {
    console.error("Builder chat error:", e);
    return NextResponse.json({ type: "suggestion", message: "I couldn't process that. Try rephrasing." });
  }
}
