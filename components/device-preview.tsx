"use client";

import { useState } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

type Device = "mobile" | "tablet" | "desktop";

const widths: Record<Device, string> = {
  mobile: "max-w-[375px]",
  tablet: "max-w-[768px]",
  desktop: "max-w-full",
};

export function DevicePreview({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<Device>("desktop");

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 border-b border-white/10 bg-[#0a0a0f]/80">
        <button
          onClick={() => setDevice("mobile")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            device === "mobile" ? "bg-violet-500/30 text-violet-300" : "text-slate-400 hover:text-white"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </button>
        <button
          onClick={() => setDevice("tablet")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            device === "tablet" ? "bg-violet-500/30 text-violet-300" : "text-slate-400 hover:text-white"
          }`}
        >
          <Tablet className="h-4 w-4" />
          Tablet
        </button>
        <button
          onClick={() => setDevice("desktop")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            device === "desktop" ? "bg-violet-500/30 text-violet-300" : "text-slate-400 hover:text-white"
          }`}
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </button>
      </div>
      <div className="flex-1 flex items-start justify-center p-4 overflow-auto bg-slate-900/50">
        <div className={`${widths[device]} w-full mx-auto transition-all duration-300`}>
          {children}
        </div>
      </div>
    </div>
  );
}
