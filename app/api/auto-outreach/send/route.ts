import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasEnoughCredits, deductCredits } from "@/lib/credits-service";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import nodemailer from "nodemailer";
import { trackAutoOutreachEvent } from "@/lib/analytics-track";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

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

  const hasCredits = await hasEnoughCredits(user.id, "autoOutreachSend");
  if (!hasCredits) {
    return NextResponse.json(
      { error: "credits_exceeded", message: "Insufficient credits. Sending costs 1 credit." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const email = (body?.email || "").trim();
  const message = (body?.message || "").trim();
  const demoUrl = (body?.demoUrl || "").trim();
  const businessName = (body?.businessName || "").trim();
  const city = (body?.city || "").trim();
  const country = (body?.country || "").trim();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json(
      { error: "Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment." },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `Website prototype for ${businessName || "your business"}`;
    const htmlBody = message.replace(/\n/g, "<br>") + (demoUrl ? `<br><br><a href="${demoUrl}">View your demo website</a>` : "");

    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject,
      text: message,
      html: htmlBody,
    });

    await deductCredits(user.id, "autoOutreachSend");

    await supabase.from("auto_outreach_jobs").insert({
      user_id: user.id,
      business_name: businessName || "Unknown",
      city: city || null,
      country: country || null,
      email,
      phone: null,
      website: null,
      generated_demo_url: demoUrl || null,
      outreach_message: message,
      status: "sent",
      sent_at: new Date().toISOString(),
    } as Record<string, unknown>);

    await trackAutoOutreachEvent(user.id, "outreach_sent", { businessName: businessName || "Unknown", email });

    return NextResponse.json({ success: true, message: "Outreach sent successfully" });
  } catch (e) {
    console.error("Send outreach error:", e);
    return NextResponse.json(
      { error: "Failed to send email. Check SMTP configuration." },
      { status: 500 }
    );
  }
}
