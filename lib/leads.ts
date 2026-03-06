const LEADS_KEY = "instantbizsite_leads";

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  slug: string;
  timestamp: string;
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

export function addLead(lead: Omit<Lead, "id" | "timestamp">): Lead {
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
