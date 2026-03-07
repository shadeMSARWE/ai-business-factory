import { NextRequest, NextResponse } from "next/server";

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

export async function POST(request: NextRequest) {
  console.log("[generate-image] API request start");

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey?.trim()) {
    console.log("[generate-image] API error: STABILITY_API_KEY not configured");
    return NextResponse.json(
      { error: "Image generation is not configured. Missing STABILITY_API_KEY." },
      { status: 503 }
    );
  }

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    console.log("[generate-image] API error: Invalid JSON body");
    return NextResponse.json(
      { error: "Invalid request body. Expected { prompt: string }." },
      { status: 400 }
    );
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required." },
      { status: 400 }
    );
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
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
      console.log("[generate-image] API response error:", response.status, text);
      return NextResponse.json(
        {
          error: "Failed to generate image. Please try again.",
          details: response.status === 401 ? "Invalid API key." : text.slice(0, 200),
        },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log("[generate-image] API response success");
    return NextResponse.json({ image: dataUrl });
  } catch (err) {
    console.log("[generate-image] API error:", err);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}
