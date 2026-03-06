import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireCredits } from "@/lib/api-credits";
import { deductCredits } from "@/lib/credits-service";
import { OPENAI_API_KEY } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const APP_TYPES = ["restaurant", "ecommerce", "gym", "salon", "education", "content_app"] as const;

const SCREEN_NAMES = ["HomeScreen", "LoginScreen", "RegisterScreen", "ProfileScreen", "SettingsScreen"];

const AI_PROMPT = `You are a React Native + Expo expert. Generate ONLY valid JavaScript/JSX code for a mobile app screen.
Return a single code block with the complete screen component. Use:
- React Native components: View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet
- Expo: useRouter if needed
- Functional component with export default
No explanations, no markdown wrappers. Just the code.`;

function generatePlaceholderScreen(name: string, appType: string, appName: string): string {
  const title = name.replace("Screen", "");
  return `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ${name}() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${title}</Text>
      <Text style={styles.subtitle}>${appName} - ${appType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
});
`;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const { ok } = rateLimit(`apps:${ip}`);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creditsError = await requireCredits(user.id, "appGenerate");
  if (creditsError) return creditsError;

  const body = await request.json();
  const name = (body?.name || "").trim();
  const type = (body?.type || "restaurant").trim().toLowerCase();
  const description = (body?.description || "").trim();

  if (!name) {
    return NextResponse.json({ error: "App name is required" }, { status: 400 });
  }
  if (!APP_TYPES.includes(type as (typeof APP_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid app type" }, { status: 400 });
  }

  const { data: app, error: appError } = await supabase
    .from("apps")
    .insert({
      user_id: user.id,
      name,
      type,
      description: description || null,
      status: "generating",
    })
    .select()
    .single();

  if (appError || !app) {
    console.error("App insert error:", appError);
    return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
  }

  const screens: { name: string; component_code: string }[] = [];

  if (OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      for (const screenName of SCREEN_NAMES) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: AI_PROMPT },
            {
              role: "user",
              content: `Create ${screenName} for a ${type} app named "${name}". ${description ? `Description: ${description}` : ""} Use React Native and Expo.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        });
        let code = completion.choices[0]?.message?.content?.trim() || "";
        code = code.replace(/^```(?:jsx?|javascript)?\n?|\n?```$/g, "").trim();
        if (!code.includes("export default")) {
          code = generatePlaceholderScreen(screenName, type, name);
        }
        screens.push({ name: screenName, component_code: code });
      }
    } catch (e) {
      console.error("OpenAI app generation error:", e);
      for (const screenName of SCREEN_NAMES) {
        screens.push({
          name: screenName,
          component_code: generatePlaceholderScreen(screenName, type, name),
        });
      }
    }
  } else {
    for (const screenName of SCREEN_NAMES) {
      screens.push({
        name: screenName,
        component_code: generatePlaceholderScreen(screenName, type, name),
      });
    }
  }

  for (const s of screens) {
    await supabase.from("app_screens").insert({
      app_id: app.id,
      name: s.name,
      component_code: s.component_code,
    });
  }

  await supabase.from("apps").update({ status: "draft" }).eq("id", app.id);
  await deductCredits(user.id, "appGenerate");

  return NextResponse.json({
    app: { ...app, status: "draft" },
    screens: screens.length,
  });
}
