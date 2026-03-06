"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { PublishedSite } from "@/components/published-site";
import { DevicePreview } from "@/components/device-preview";
import { ArrowLeft, Send, Loader2, Check, Sparkles, RefreshCw, CheckCircle2, User, Bot } from "lucide-react";

const BUILD_STEP_LABELS: Record<string, string> = {
  layout: "Creating project structure",
  hero: "Generating hero section",
  about: "Creating about section",
  services: "Generating services section",
  gallery: "Adding gallery",
  testimonials: "Creating testimonials",
  contact: "Building contact form",
  theme: "Applying theme and colors",
  footer: "Finalizing layout",
};

interface BuildStep {
  step: string;
  status: "running" | "done";
  message: string;
}

interface TimelineEntry {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  siteUpdate?: Record<string, unknown>;
}

interface Suggestion {
  id: string;
  text: string;
  action?: string;
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: "1", text: "Add testimonials for trust", action: "Add customer testimonials" },
  { id: "2", text: "Add Google Maps for local business", action: "Add a map section" },
  { id: "3", text: "Add call-to-action button", action: "Add a prominent CTA" },
  { id: "4", text: "Add booking form", action: "Add a reservation or booking form" },
];

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [siteData, setSiteData] = useState<Record<string, unknown> | null>(null);
  const [building, setBuilding] = useState(false);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [previewKey, setPreviewKey] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const addTimeline = useCallback((type: "user" | "ai", content: string) => {
    setTimeline((t) => [...t, { id: crypto.randomUUID(), type, content, timestamp: new Date() }]);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setBuilding(true);
    setSiteData(null);
    setBuildSteps([]);
    setChatHistory([]);
    addTimeline("user", prompt.trim());

    try {
      const res = await fetch("/api/builder/generate-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const colonIdx = line.indexOf(":");
            const event = line.slice(0, colonIdx);
            const payload = line.slice(colonIdx + 1);
            try {
              const data = JSON.parse(payload);
              if (event === "step") {
                setBuildSteps((prev) => {
                  const existing = prev.findIndex((s) => s.step === data.step);
                  const next = { step: data.step, status: data.status, message: data.message };
                  if (existing >= 0) {
                    const copy = [...prev];
                    copy[existing] = next;
                    return copy;
                  }
                  return [...prev, next];
                });
                if (data.status === "done") {
                  addTimeline("ai", data.message);
                }
              } else if (event === "section") {
                setSiteData((prev) => {
                  const base = (prev || {}) as Record<string, unknown>;
                  if (data.type === "hero") {
                    const imgs = data.data.heroImage ? [data.data.heroImage, ...((base.galleryImages as string[]) || [])] : base.galleryImages;
                    return { ...base, heroTitle: data.data.heroTitle, heroSubtitle: data.data.heroSubtitle, galleryImages: imgs };
                  }
                  if (data.type === "about") return { ...base, aboutTitle: data.data.aboutTitle, aboutContent: data.data.aboutContent };
                  if (data.type === "services") return { ...base, services: data.data.services };
                  if (data.type === "gallery") return { ...base, galleryImages: data.data.galleryImages || base.galleryImages };
                  if (data.type === "testimonials") return { ...base, testimonials: data.data.testimonials };
                  if (data.type === "contact") return { ...base, contactInfo: data.data.contactInfo, contactText: data.data.contactText };
                  if (data.type === "footer") return { ...base, businessName: data.data.businessName };
                  if (data.type === "theme") return { ...base, primaryColor: data.data.primaryColor };
                  return base;
                });
              } else if (event === "complete") {
                setSiteData(data.data);
                setChatMessages((m) => [
                  ...m,
                  {
                    role: "assistant",
                    content: `I've built your ${data.data.businessName || "website"}. You can ask for changes like "Add a reservation form", "Change to dark theme", or "Add a pricing table".`,
                  },
                ]);
                setChatHistory((h) => [...h, { role: "assistant", content: `Built ${data.data.businessName} website.` }]);
                fetch("/api/builder/suggestions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ siteData: data.data }),
                })
                  .then((r) => r.json())
                  .then((d) => d.suggestions && setSuggestions(d.suggestions))
                  .catch(() => setSuggestions(DEFAULT_SUGGESTIONS));
              } else if (event === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      }
    } catch (e) {
      setChatMessages((m) => [...m, { role: "assistant", content: (e as Error).message }]);
      addTimeline("ai", `Error: ${(e as Error).message}`);
    } finally {
      setBuilding(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", content: msg }]);
    setChatLoading(true);
    addTimeline("user", msg);

    try {
      const res = await fetch("/api/builder/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          siteData,
          chatHistory: chatHistory.slice(-10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      const aiMsg = data.message || data.content || "Done.";
      setChatMessages((m) => [...m, { role: "assistant", content: aiMsg, siteUpdate: data.siteUpdate }]);
      setChatHistory((h) => [...h, { role: "user", content: msg }, { role: "assistant", content: aiMsg }]);

      if (data.siteUpdate && siteData) {
        setSiteData({ ...siteData, ...data.siteUpdate });
        addTimeline("ai", `Updated: ${Object.keys(data.siteUpdate).join(", ")}`);
      }
    } catch (e) {
      setChatMessages((m) => [...m, { role: "assistant", content: (e as Error).message }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (suggestion.action) {
      setChatInput(suggestion.action);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <header className="border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
            <Logo showSubtitle />
          </Link>
          <Link href="/dashboard/create">
            <Button variant="outline" className="border-white/20">Classic Create</Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* LEFT 60% - Preview + Progress */}
        <div className="flex-[6] flex flex-col border-r border-white/10 min-w-0">
          {/* Build Progress Panel */}
          {(building || buildSteps.length > 0) && (
            <div className="flex-shrink-0 border-b border-white/10 bg-[#0a0a0f]/80 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Build Progress</h3>
                <span className="text-xs text-violet-400">
                  {buildSteps.filter((s) => s.status === "done").length} / {Object.keys(BUILD_STEP_LABELS).length}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(buildSteps.filter((s) => s.status === "done").length / Object.keys(BUILD_STEP_LABELS).length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(BUILD_STEP_LABELS).map(([key, label]) => {
                  const step = buildSteps.find((s) => s.step === key);
                  const isDone = step?.status === "done";
                  const isRunning = step?.status === "running";
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                        isDone ? "bg-emerald-500/20 text-emerald-400" : isRunning ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      ) : isRunning ? (
                        <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      <span>{label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preview Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {!siteData && !building ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Sparkles className="h-16 w-16 text-violet-400 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Live AI Website Builder</h2>
                <p className="text-slate-400 mb-8 text-center max-w-md">
                  Describe your business and watch your website come to life in real time.
                </p>
                <div className="flex gap-2 w-full max-w-xl">
                  <Input
                    placeholder="Build a restaurant website in Tel Aviv"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="bg-white/5 border-white/20 h-12"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="h-12 px-8 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  >
                    Build
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0a0a0f]/50">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                      onClick={() => setPreviewKey((k) => k + 1)}
                      title="Refresh preview"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-slate-500">Live Preview</span>
                  </div>
                  <Link
                    href={`/dashboard/create?business=${encodeURIComponent((siteData?.businessName as string) || "website")}`}
                  >
                    <Button variant="outline" size="sm" className="border-white/20">
                      Save & Edit in Editor
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <DevicePreview>
                    <div className="rounded-xl border border-white/10 bg-white overflow-hidden shadow-2xl">
                      {siteData ? (
                        <PublishedSite key={previewKey} data={siteData as Parameters<typeof PublishedSite>[0]["data"]} slug="" />
                      ) : (
                        <div className="min-h-[400px] flex items-center justify-center bg-slate-100">
                          <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
                        </div>
                      )}
                    </div>
                  </DevicePreview>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 40% - Chat + Suggestions + Timeline */}
        <div className="flex-[4] flex flex-col min-w-0 max-w-[480px]">
          {/* AI Suggestions */}
          {suggestions.length > 0 && siteData && (
            <div className="flex-shrink-0 p-4 border-b border-white/10">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleApplySuggestion(s)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-violet-500/20 text-slate-300 hover:text-white text-sm transition-colors border border-white/5"
                  >
                    <span className="mr-2">+</span>
                    {s.text}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-slate-500">Ask for changes or improvements</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {chatMessages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-violet-500/30" : "bg-white/10"}`}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 ${
                        m.role === "user" ? "bg-violet-500/30 text-white" : "bg-white/5 text-slate-300 border border-white/10"
                      }`}
                    >
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  placeholder="Change colors, add gallery, add pricing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                  className="bg-white/5 border-white/20"
                />
                <Button
                  onClick={handleChatSend}
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-violet-500 hover:bg-violet-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Build Timeline */}
          {timeline.length > 0 && (
            <div className="flex-shrink-0 p-4 border-t border-white/10 max-h-32 overflow-y-auto">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timeline</h3>
              <div className="space-y-1.5">
                {timeline.slice(-8).reverse().map((t) => (
                  <div key={t.id} className={`flex items-center gap-2 text-xs ${t.type === "user" ? "text-violet-400" : "text-slate-400"}`}>
                    {t.type === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    <span className="truncate">{t.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
