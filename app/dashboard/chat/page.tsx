"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Plus,
  Send,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { useCredits } from "@/components/providers/credits-provider";

interface Session {
  id: string;
  title: string;
  created_at: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { billing, refetch: refetchCredits } = useCredits();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      if (res.ok) setSessions(data.sessions ?? []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`);
      const data = await res.json();
      if (res.ok) setMessages(data.messages ?? []);
      else setMessages([]);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (currentSession) fetchMessages(currentSession.id);
    else setMessages([]);
  }, [currentSession, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSession = async () => {
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New chat" }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        await fetchSessions();
        setCurrentSession({ id: data.id, title: data.title, created_at: data.created_at });
        setMessages([]);
        setError(null);
      }
    } catch {
      setError("Failed to create chat");
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await fetch(`/api/chat/sessions/${id}`, { method: "DELETE" });
      await fetchSessions();
      if (currentSession?.id === id) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch {
      // ignore
    }
  };

  const renameSession = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        await fetchSessions();
        if (currentSession?.id === id) setCurrentSession((s) => (s ? { ...s, title } : null));
      }
      setEditingTitle(null);
    } catch {
      setEditingTitle(null);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !currentSession || sending) return;
    if (billing?.creditsExhausted) {
      setError("No credits remaining. Buy credits to continue.");
      return;
    }
    setError(null);
    setSending(true);
    setInput("");
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMessage]);
    try {
      const res = await fetch(`/api/chat/sessions/${currentSession.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setError("No credits remaining. Please buy credits.");
        setMessages((m) => m.filter((x) => x.id !== userMessage.id));
        refetchCredits();
        return;
      }
      if (res.status === 429) {
        setError("Too many requests. Please try again later.");
        setMessages((m) => m.filter((x) => x.id !== userMessage.id));
        return;
      }
      if (!res.ok) {
        setError(data.error || "Failed to send");
        setMessages((m) => m.filter((x) => x.id !== userMessage.id));
        return;
      }
      setMessages((m) => [
        ...m.filter((x) => x.id !== userMessage.id),
        userMessage,
        {
          id: data.row?.id ?? `ast-${Date.now()}`,
          role: "assistant",
          content: data.message ?? "",
          created_at: data.row?.created_at ?? new Date().toISOString(),
        },
      ]);
      refetchCredits();
    } catch {
      setError("Request failed. Please try again.");
      setMessages((m) => m.filter((x) => x.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const noCredits = billing?.creditsExhausted ?? false;

  return (
    <div className="h-full flex flex-col -m-6">
      <div className="flex flex-1 min-h-0">
        <aside className="w-64 border-r border-white/10 bg-white/[0.02] flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5">
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <Button
              onClick={createSession}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    currentSession?.id === s.id ? "bg-violet-500/20 text-white" : "hover:bg-white/5 text-slate-300"
                  }`}
                  onClick={() => setCurrentSession(s)}
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {editingTitle === s.id ? (
                    <Input
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onBlur={() => renameSession(s.id, titleDraft || s.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameSession(s.id, titleDraft || s.title);
                      }}
                      className="h-8 text-sm bg-white/10 border-white/20 flex-1"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate flex-1 text-sm">{s.title}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingTitle !== s.id && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTitleDraft(s.title);
                            setEditingTitle(s.id);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-slate-400"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(s.id);
                          }}
                          className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            {!currentSession ? (
              <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
                <MessageCircle className="h-16 w-16 text-violet-400/60 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">AI Chat</h2>
                <p className="text-slate-400 mb-6">Start a new chat or select one from the sidebar. 1 credit per message.</p>
                <Button onClick={createSession} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Plus className="h-4 w-4 mr-2" />
                  New chat
                </Button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-violet-500/20 border-violet-500/30 text-white"
                            : "bg-white/5 border-white/10 text-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => copyMessage(msg.content, msg.id)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                              {copiedId === msg.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                            {msg.role === "assistant" && (
                              <button
                                type="button"
                                onClick={() => {}}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                title="Regenerate"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {sending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {error && (
            <div className="px-6 pb-2">
              <p className="text-red-400 text-sm text-center">{error}</p>
              {error.includes("credits") && (
                <Link href="/dashboard/billing" className="block text-center text-violet-400 hover:underline text-sm mt-1">
                  Buy Credits
                </Link>
              )}
            </div>
          )}

          {currentSession && (
            <div className="p-4 border-t border-white/10 bg-[#0a0a0f]/80">
              <div className="max-w-3xl mx-auto flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={noCredits ? "No credits remaining. Buy credits to chat." : "Type a message..."}
                  disabled={sending || noCredits}
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={sendMessage}
                  disabled={sending || !input.trim() || noCredits}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shrink-0"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-slate-500 text-xs text-center mt-2">1 credit per message</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
