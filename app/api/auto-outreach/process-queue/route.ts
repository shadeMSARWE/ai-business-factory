import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { hasEnoughCreditsWithClient, deductCreditsWithClient } from "@/lib/credits-service";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "@/lib/env";
import nodemailer from "nodemailer";

const CRON_SECRET = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET;

export async function GET(request: NextRequest) {
  if (CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getAdminClient() || await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: pending } = await supabase
    .from("outreach_queue")
    .select("*")
    .eq("status", "pending")
    .lt("retry_count", 3)
    .lte("scheduled_at", new Date().toISOString())
    .limit(10);

  if (!pending?.length) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  for (const item of pending) {
    try {
      const html = item.body.replace(/\n/g, "<br>");
      await transporter.sendMail({
        from: SMTP_FROM,
        to: item.email,
        subject: item.subject || "Website prototype",
        text: item.body,
        html,
      });

      const hasCredits = await hasEnoughCreditsWithClient(supabase, item.user_id, "autoOutreachSend");
      if (hasCredits && supabase) {
        await deductCreditsWithClient(supabase, item.user_id, "autoOutreachSend");
      }

      await supabase
        .from("outreach_queue")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", item.id);

      if (item.job_id) {
        await supabase
          .from("auto_outreach_jobs")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", item.job_id);
      }
      processed++;
    } catch (e) {
      const retryCount = (item.retry_count || 0) + 1;
      await supabase
        .from("outreach_queue")
        .update({
          status: retryCount >= 3 ? "failed" : "pending",
          retry_count: retryCount,
          error_message: String(e),
          scheduled_at: retryCount < 3 ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : null,
        })
        .eq("id", item.id);
    }
  }

  return NextResponse.json({ processed });
}
