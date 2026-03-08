"use client";

import { motion } from "framer-motion";

interface PreviewGalleryProps {
  images?: { src: string; alt?: string }[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const DEFAULT_PREVIEWS = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "https://images.unsplash.com/photo-1558030006-4505e387e479?w=400&q=80",
];

export function PreviewGallery({
  images = DEFAULT_PREVIEWS.map((src, i) => ({ src, alt: `Preview ${i + 1}` })),
  columns = 3,
  className = "",
}: PreviewGalleryProps) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={className}>
      <p className="text-sm font-medium text-slate-400 mb-3">Preview examples</p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`grid ${gridClass} gap-3`}
      >
        {images.slice(0, 6).map((img, i) => (
          <motion.div
            key={img.src + i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-violet-500/20 transition-colors"
          >
            <img
              src={img.src}
              alt={img.alt ?? ""}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
