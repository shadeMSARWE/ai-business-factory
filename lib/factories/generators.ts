/**
 * AI Factory Engine — reusable AI generators.
 * Each generator corresponds to an engine type and is used by factories via the registry.
 */

import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/lib/env";
import type { EngineContext, EngineResult } from "./engine";
import { getPrompt } from "./prompts";

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

async function openaiJson<T>(system: string, user: string): Promise<EngineResult<T>> {
  if (!OPENAI_API_KEY?.trim()) {
    return { success: false, error: "OPENAI_API_KEY not configured" };
  }
  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
    const text = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleaned) as T;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "OpenAI request failed" };
  }
}

async function openaiText(system: string, user: string): Promise<EngineResult<string>> {
  if (!OPENAI_API_KEY?.trim()) {
    return { success: false, error: "OPENAI_API_KEY not configured" };
  }
  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    const text = completion.choices[0]?.message?.content ?? "";
    return { success: true, data: text };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "OpenAI request failed" };
  }
}

/** Text generator — SEO, generic copy. */
export async function textGenerator(
  context: EngineContext & { promptKey?: "seo" | "text" }
): Promise<EngineResult<Record<string, unknown> | string>> {
  const key = context.promptKey ?? "text";
  const { system, user } = getPrompt(key, context.prompt);
  if (key === "seo") return openaiJson<Record<string, unknown>>(system, user);
  return openaiText(system, user).then((r) =>
    r.success ? { success: true, data: r.data } : { success: false, error: r.error }
  );
}

/** Image generator — logo, image generator factory. Uses Stability AI. */
export async function imageGenerator(
  context: EngineContext
): Promise<EngineResult<string>> {
  const apiKey = process.env.STABILITY_API_KEY?.trim();
  if (!apiKey) {
    return { success: false, error: "STABILITY_API_KEY not configured" };
  }
  try {
    const formData = new FormData();
    formData.append("prompt", context.prompt);
    formData.append("output_format", "png");
    formData.append("aspect_ratio", "1:1");

    const response = await fetch(STABILITY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "image/*",
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text.slice(0, 200) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    return { success: true, data: dataUrl };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Image generation failed" };
  }
}

/** Website generator — structured JSON for website content. */
export async function websiteGenerator(
  context: EngineContext
): Promise<EngineResult<Record<string, unknown>>> {
  const { system, user } = getPrompt("website", context.prompt);
  return openaiJson<Record<string, unknown>>(system, user);
}

/** Marketing generator — ads, headlines, CTAs. */
export async function marketingGenerator(
  context: EngineContext & { platform?: string }
): Promise<EngineResult<Record<string, unknown>>> {
  const { system, user } = getPrompt("marketing", context.prompt, context.platform ?? "");
  return openaiJson<Record<string, unknown>>(system, user);
}

/** Video idea generator — viral video ideas list. */
export async function videoIdeaGenerator(
  context: EngineContext
): Promise<EngineResult<string[]>> {
  const { system, user } = getPrompt("video_ideas", context.prompt);
  const result = await openaiJson<string[]>(system, user);
  if (!result.success || !result.data) return result;
  const list = Array.isArray(result.data) ? result.data : [String(result.data)];
  return { success: true, data: list };
}

export const generators = {
  text: textGenerator,
  image: imageGenerator,
  website: websiteGenerator,
  marketing: marketingGenerator,
  video_ideas: videoIdeaGenerator,
} as const;
