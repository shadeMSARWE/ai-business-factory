import { createClient } from "@/lib/supabase/server";

export async function trackAutoOutreachEvent(
  userId: string,
  eventType: "business_search" | "demo_generated" | "offer_generated" | "outreach_sent" | "outreach_failed" | "outreach_opened" | "outreach_replied",
  eventData?: Record<string, unknown>
) {
  const supabase = await createClient();
  if (!supabase) return;
  try {
    await supabase.from("analytics_events").insert({
      user_id: userId,
      site_id: null,
      slug: null,
      event_type: eventType,
      event_data: eventData || {},
    } as never);
  } catch {
    // ignore
  }
}
