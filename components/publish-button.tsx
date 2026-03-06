"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { getWebsiteById } from "@/lib/storage";
import { ExternalLink } from "lucide-react";

export function PublishButton({
  websiteId,
  slug: slugProp,
  variant = "outline",
  size = "sm",
  className = "",
}: {
  websiteId?: string;
  slug?: string;
  variant?: "outline" | "default" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const showToast = useToast();
  const site = websiteId ? getWebsiteById(websiteId) : null;
  const slug = slugProp ?? site?.slug;
  if (!slug) return null;

  const base = typeof window !== "undefined" ? window.location.origin : "";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`${base}/s/${slug}`, "_blank");
    showToast("Website published successfully.");
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      <ExternalLink className="h-4 w-4 mr-1" />
      Publish
    </Button>
  );
}
