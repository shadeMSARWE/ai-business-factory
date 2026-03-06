import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireCredits } from "@/lib/api-credits";
import { deductCredits } from "@/lib/credits-service";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import nodemailer from "nodemailer";
import { trackAutoOutreachEvent } from "@/lib/analytics-track";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_RETRIES = 3;

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

  const creditsError = await requireCredits(user.id, "autoOutreachSend");
  if (creditsError) return creditsError;

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

  const subject = `Website prototype for ${businessName || "your business"}`;
  const htmlBody = message.replace(/\n/g, "<br>") + (demoUrl ? `<br><br><a href="${demoUrl}">View your demo website</a>` : "");

  const { data: job } = await supabase
    .from("auto_outreach_jobs")
    .insert({
      user_id: user.id,
      business_name: businessName || "Unknown",
      city: city || null,
      country: country || null,
      email,
      generated_demo_url: demoUrl || null,
      outreach_message: message,
      status: "pending",
      sequence_step: 1,
    } as Record<string, unknown>)
    .select("id")
    .single();

  const { data: queueItem } = await supabase
    .from("outreach_queue")
    .insert({
      job_id: job?.id,
      user_id: user.id,
      email,
      subject,
      body: message,
      status: "sending",
      retry_count: 0,
      max_retries: MAX_RETRIES,
    } as Record<string, unknown>)
    .select()
    .single();

  const sent = await sendEmail(email, subject, htmlBody, message);

  if (sent) {
    await supabase
      .from("outreach_queue")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", queueItem.id);

    await supabase
      .from("auto_outreach_jobs")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", job?.id);

    await deductCredits(user.id, "autoOutreachSend");
    await trackAutoOutreachEvent(user.id, "outreach_sent", { businessName: businessName || "Unknown", email });

    return NextResponse.json({ success: true, message: "Outreach sent successfully" });
  }

  const retryCount = (queueItem?.retry_count ?? 0) + 1;
  const willRetry = retryCount < MAX_RETRIES;

  await supabase
    .from("outreach_queue")
    .update({
      status: willRetry ? "pending" : "failed",
      retry_count: retryCount,
      error_message: "Send failed",
      scheduled_at: willRetry ? new Date(Date.now() + 60 * 1000).toISOString() : null,
    })
    .eq("id", queueItem.id);

  await trackAutoOutreachEvent(user.id, "outreach_failed", { email, retryCount });

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json(
      { error: "Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: willRetry ? "Send failed. Will retry automatically." : "Send failed after retries." },
    { status: 500 }
  );
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({ from: SMTP_FROM, to, subject, text, html });
    return true;
  } catch {
    return false;
  }
}
