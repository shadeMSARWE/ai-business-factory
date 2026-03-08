import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/env";
import { getUserCreditsBalance, deductUserCredits, checkAiRateLimit } from "@/lib/user-credits-service";
import { getChatCreditCost } from "@/lib/credit-costs";

const CHAT_COST = getChatCreditCost();
const SYSTEM_PROMPT = "You are a helpful AI assistant for the AI Business Factory platform. Help users with business ideas, marketing, content, and strategy. Be concise and professional.";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("chat_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const balance = await getUserCreditsBalance(user.id);
  if (balance < CHAT_COST) {
    return NextResponse.json(
      { error: "No credits remaining", code: "NO_CREDITS" },
      { status: 402 }
    );
  }
  const withinRateLimit = await checkAiRateLimit(user.id);
  if (!withinRateLimit) {
    return NextResponse.json(
      { error: "Too many requests. Maximum 100 AI requests per hour." },
      { status: 429 }
    );
  }
  const deduct = await deductUserCredits(user.id, CHAT_COST);
  if (!deduct.ok) {
    return NextResponse.json(
      { error: "No credits remaining", code: "NO_CREDITS" },
      { status: 402 }
    );
  }

  const { data: existing } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("chat_id", id)
    .order("created_at", { ascending: true });

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(existing ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content },
  ];

  await supabase.from("chat_messages").insert({
    user_id: user.id,
    chat_id: id,
    role: "user",
    content,
  });

  if (!OPENAI_API_KEY?.trim()) {
    const fallback = "OpenAI API is not configured. Configure OPENAI_API_KEY to use the chat.";
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      chat_id: id,
      role: "assistant",
      content: fallback,
    });
    return NextResponse.json({ message: fallback });
  }

  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });
    const assistantContent = completion.choices[0]?.message?.content ?? "I couldn't generate a response.";

    const { data: inserted } = await supabase
      .from("chat_messages")
      .insert({
        user_id: user.id,
        chat_id: id,
        role: "assistant",
        content: assistantContent,
      })
      .select("id, role, content, created_at")
      .single();

    return NextResponse.json({ message: assistantContent, row: inserted });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "API request failed";
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      chat_id: id,
      role: "assistant",
      content: `Error: ${errMsg}`,
    });
    return NextResponse.json(
      { error: errMsg, code: "API_FAILURE" },
      { status: 502 }
    );
  }
}
