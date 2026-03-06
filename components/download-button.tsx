"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadWebsiteAsZip } from "@/lib/download";

export function DownloadButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await downloadWebsiteAsZip(slug);
    } catch {
      alert("Failed to download");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-white/20"
      onClick={handleClick}
      disabled={loading}
    >
      <Download className="h-4 w-4 mr-1" />
      {loading ? "..." : "Download ZIP"}
    </Button>
  );
}
