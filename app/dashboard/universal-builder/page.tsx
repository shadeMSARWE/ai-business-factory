"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Box } from "lucide-react";

export default function UniversalBuilderPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setMessage("Factory generation coming soon");
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

        <h1 className="text-3xl font-bold text-white mb-2">Universal Builder Factory</h1>
        <p className="text-slate-400 mb-10 max-w-2xl">
          This factory generates a base project structure for:
        </p>
        <ul className="list-disc list-inside text-slate-400 mb-10 space-y-2">
          <li>SaaS platforms</li>
          <li>Mobile apps</li>
          <li>AI tools</li>
          <li>Startup MVPs</li>
        </ul>

        <Card className="border-white/10 bg-white/5 max-w-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Box className="h-5 w-5" />
              Generate Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
            >
              Generate Project Foundation
            </Button>
            {message && (
              <p className="text-violet-400 text-sm">{message}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
