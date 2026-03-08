"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, RefreshCw, History } from "lucide-react";
import { addToHistory } from "@/lib/generation-history";

interface ResultToolbarProps {
  factoryId: string;
  factoryName: string;
  prompt: string;
  resultData: unknown;
  resultPreview?: string;
  onRegenerate?: () => void;
  className?: string;
}

export function ResultToolbar({
  factoryId,
  factoryName,
  prompt,
  resultData,
  resultPreview,
  onRegenerate,
  className = "",
}: ResultToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const textContent =
    typeof resultData === "string"
      ? resultData
      : JSON.stringify(resultData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([textContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${factoryId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToHistory = () => {
    addToHistory({
      factoryId,
      factoryName,
      prompt,
      resultPreview: resultPreview ?? textContent.slice(0, 120),
      resultData,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="border-white/20 text-slate-300 hover:bg-white/10"
      >
        {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-400" /> : <Copy className="h-4 w-4 mr-1.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="border-white/20 text-slate-300 hover:bg-white/10"
      >
        <Download className="h-4 w-4 mr-1.5" />
        Download
      </Button>
      {onRegenerate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Regenerate
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveToHistory}
        className="border-white/20 text-slate-300 hover:bg-white/10"
      >
        {saved ? <Check className="h-4 w-4 mr-1.5 text-emerald-400" /> : <History className="h-4 w-4 mr-1.5" />}
        {saved ? "Saved" : "Save to history"}
      </Button>
    </div>
  );
}
