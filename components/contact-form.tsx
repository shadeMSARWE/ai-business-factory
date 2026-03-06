"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-slate-400">Name</Label>
        <Input
          name="name"
          placeholder="Your name"
          required
          className="mt-1 bg-white/5 border-white/20"
        />
      </div>
      <div>
        <Label className="text-slate-400">Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="mt-1 bg-white/5 border-white/20"
        />
      </div>
      <div>
        <Label className="text-slate-400">Message</Label>
        <Textarea
          name="message"
          placeholder="Your message"
          rows={4}
          required
          className="mt-1 bg-white/5 border-white/20"
        />
      </div>
      <Button
        type="submit"
        disabled={status === "sent"}
        className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
      >
        {status === "sent" ? "Message sent!" : "Send Message"}
      </Button>
    </form>
  );
}
