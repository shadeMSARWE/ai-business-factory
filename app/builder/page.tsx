"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { PublishedSite } from "@/components/published-site";
import { ArrowLeft, Send, Loader2, Check, Sparkles } from "lucide-react";

const BUILD_STEPS = [
  "Creating project structure",
  "Generating hero section",
  "Generating services section",
  "Generating gallery",
  "Generating contact section",
  "Generating styles",
  "Building responsive layout",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  siteUpdate?: Record<string, unknown>;
}

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [siteData, setSiteData] = useState<Record<string, unknown> | null>(null);
  const [building, setBuilding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const simulateBuildSteps = () => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= BUILD_STEPS.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 400);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setBuilding(true);
    setCurrentStep(0);
    simulateBuildSteps();

    try {
      const res = await fetch("/api/builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSiteData(data);
      setCurrentStep(BUILD_STEPS.length - 1);
      setChatMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I've built your ${data.businessName || "website"}. You may want to add a reservation form, customer testimonials, or a menu section.`,
        },
      ]);
    } catch (e) {
      setChatMessages((m) => [...m, { role: "assistant", content: (e as Error).message }]);
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

    try {
      const res = await fetch("/api/builder/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, siteData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setChatMessages((m) => [...m, { role: "assistant", content: data.message, siteUpdate: data.siteUpdate }]);
      if (data.siteUpdate && siteData) {
        setSiteData({ ...siteData, ...data.siteUpdate });
      }
    } catch (e) {
      setChatMessages((m) => [...m, { role: "assistant", content: (e as Error).message }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <Logo showSubtitle />
          </Link>
          <Link href="/dashboard/create">
            <Button variant="outline" className="border-white/20">
              Classic Create
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* LEFT: Build area + preview */}
        <div className="flex-1 flex flex-col border-r border-white/10 min-w-0">
          {!siteData && !building ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <Sparkles className="h-16 w-16 text-violet-400 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Website Builder</h2>
              <p className="text-slate-400 mb-8 text-center max-w-md">
                Describe your business and we&apos;ll build your website with live progress.
              </p>
              <div className="flex gap-2 w-full max-w-xl">
                <Input
                  placeholder="Build me a restaurant website in Tel Aviv"
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
          ) : building ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <Loader2 className="h-12 w-12 animate-spin text-violet-400 mb-8" />
              <div className="space-y-3 w-full max-w-md">
                {BUILD_STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 ${
                      i <= currentStep ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {i < currentStep ? (
                      <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    ) : i === currentStep ? (
                      <Loader2 className="h-5 w-5 animate-spin text-violet-400 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-slate-600 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-end gap-2 mb-4 max-w-4xl mx-auto">
                <Link href={`/dashboard/create?business=${encodeURIComponent((siteData?.businessName as string) || "website")}`}>
                  <Button variant="outline" className="border-white/20">
                    Save & Edit in Editor
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-white/10 bg-white overflow-hidden shadow-2xl max-w-4xl mx-auto">
                <PublishedSite data={siteData as Parameters<typeof PublishedSite>[0]["data"]} slug="" />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Chat */}
        <div className="w-96 flex flex-col border-l border-white/10 bg-[#0a0a0f]">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-slate-500">Suggest improvements or ask for changes</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {chatMessages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      m.role === "user"
                        ? "bg-violet-500/30 text-white"
                        : "bg-white/5 text-slate-300 border border-white/10"
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {chatLoading && (
              <div className="flex justify-start">
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
                placeholder="Add reservation form, add testimonials..."
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
      </div>
    </div>
  );
}
