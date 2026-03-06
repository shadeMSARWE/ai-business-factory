"use client";

import { useState } from "react";
import type { TemplateItem } from "@/lib/templates-data";
import { getTemplateImageUrl, TEMPLATE_FALLBACK_IMAGE } from "@/lib/templates-data";

export function TemplateImage({ template, className = "" }: { template: TemplateItem; className?: string }) {
  const [src, setSrc] = useState(getTemplateImageUrl(template));
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setSrc(TEMPLATE_FALLBACK_IMAGE);
    }
  };

  return (
    <img
      src={src}
      alt={template.name}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
