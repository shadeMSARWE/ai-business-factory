"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-xl"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-slate-400 mb-12">
            Have a question? Send us a message and we&apos;ll get back to you.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center"
            >
              <p className="text-green-400 font-medium mb-2">Message sent!</p>
              <p className="text-slate-400 text-sm">
                Thanks for reaching out. We&apos;ll respond as soon as possible.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-white/20"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-slate-400">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="mt-2 bg-white/5 border-white/20"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-400">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="mt-2 bg-white/5 border-white/20"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-slate-400">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  required
                  rows={5}
                  className="mt-2 bg-white/5 border-white/20 resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              >
                Submit
              </Button>
            </form>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
