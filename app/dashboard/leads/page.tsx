"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Search,
  Calendar,
  MessageSquare,
  Loader2,
  ChevronDown,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "interested", label: "Interested" },
  { value: "converted", label: "Converted" },
];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  slug?: string;
  status: string;
  notes?: string;
  follow_up_at?: string;
  last_contacted_at?: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editFollowUp, setEditFollowUp] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterStatus !== "all") params.set("status", filterStatus);
        if (filterSlug !== "all") params.set("slug", filterSlug);
        const res = await fetch(`/api/leads?${params}`);
        const data = await res.json();
        setLeads(data.leads || []);
      } catch {
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [filterStatus, filterSlug]);

  const slugs = useMemo(() => {
    const s = new Set(leads.map((l) => l.slug).filter(Boolean));
    return Array.from(s).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.message || "").toLowerCase().includes(q)
    );
  }, [leads, search]);

  const handleUpdate = async (lead: Lead) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus || lead.status,
          notes: editNotes !== undefined ? editNotes : lead.notes,
          follow_up_at: editFollowUp || lead.follow_up_at || null,
          last_contacted_at: editStatus === "contacted" ? new Date().toISOString() : lead.last_contacted_at,
        }),
      });
      if (res.ok) {
        const { lead: updated } = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
        setEditingId(null);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditNotes(lead.notes || "");
    setEditStatus(lead.status);
    setEditFollowUp(lead.follow_up_at ? lead.follow_up_at.slice(0, 16) : "");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo showSubtitle />
          <DashboardNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Lead CRM</h1>
        <p className="text-slate-400 mb-10">
          Manage leads from contact form submissions. Update status, add notes, schedule follow-ups.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-[180px] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
            className="w-[180px] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="all">All websites</option>
            {slugs.map((s) => (
              <option key={s} value={s || ""}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/20 p-20 text-center"
          >
            <Mail className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No leads yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Leads will appear when visitors submit your contact form.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Business / Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Website</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Follow-up</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        {lead.message && (
                          <p className="text-slate-500 text-sm line-clamp-2 mt-0.5">{lead.message}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-violet-400 text-sm">{lead.email}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      <span className="bg-white/5 px-2 py-0.5 rounded">{lead.slug || "—"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          lead.status === "converted"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : lead.status === "interested"
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label || lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {lead.follow_up_at
                        ? new Date(lead.follow_up_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20"
                        onClick={() => openEdit(lead)}
                      >
                        Update
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingId && (
          <EditLeadModal
            lead={filtered.find((l) => l.id === editingId)!}
            notes={editNotes}
            status={editStatus}
            followUp={editFollowUp}
            onNotesChange={setEditNotes}
            onStatusChange={setEditStatus}
            onFollowUpChange={setEditFollowUp}
            onSave={() => handleUpdate(filtered.find((l) => l.id === editingId)!)}
            onClose={() => setEditingId(null)}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}

function EditLeadModal({
  lead,
  notes,
  status,
  followUp,
  onNotesChange,
  onStatusChange,
  onFollowUpChange,
  onSave,
  onClose,
  saving,
}: {
  lead: Lead;
  notes: string;
  status: string;
  followUp: string;
  onNotesChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFollowUpChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0f14] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">Update lead: {lead.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Schedule follow-up</label>
            <Input
              type="datetime-local"
              value={followUp}
              onChange={(e) => onFollowUpChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="border-white/20" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
