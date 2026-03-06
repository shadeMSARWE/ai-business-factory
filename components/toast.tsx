"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function Toast({
  message,
  visible,
  onClose,
}: {
  message: string;
  visible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/20 backdrop-blur-xl px-5 py-4 shadow-lg"
        >
          <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0" />
          <span className="text-white font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
