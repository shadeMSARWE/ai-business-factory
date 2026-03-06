"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { getWebsiteById } from "@/lib/storage";
import { ExternalLink } from "lucide-react";

export function PublishButton({
  websiteId,
  variant = "outline",
  size = "sm",
  className = "",
}: {
  websiteId: string;
  variant?: "outline" | "default" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const showToast = useToast();
  const site = getWebsiteById(websiteId);
  if (!site) return null;

  const base = typeof window !== "undefined" ? window.location.origin : "";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`${base}/s/${site.slug}`, "_blank");
    showToast("Website published successfully.");
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      <ExternalLink className="h-4 w-4 mr-1" />
      Publish
    </Button>
  );
}
