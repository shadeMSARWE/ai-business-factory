const LEADS_KEY = "instantbizsite_leads";

export interface Lead {
  id: string;
  name: string;
  email: string;
  message?: string;
  slug: string;
  timestamp?: string;
  status?: string;
  notes?: string;
  follow_up_at?: string;
  last_contacted_at?: string;
  created_at?: string;
}

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addLead(lead: Omit<Lead, "id" | "timestamp">): Promise<Lead> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: lead.slug,
        name: lead.name,
        email: lead.email,
        message: lead.message || "",
      }),
    });
    if (res.ok) {
      const { lead: saved } = await res.json();
      return saved as Lead;
    }
  } catch {
    // fallback to localStorage
  }
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  leads.unshift(newLead);
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  return newLead;
}
