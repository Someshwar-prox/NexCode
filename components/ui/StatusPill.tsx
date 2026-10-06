import React from "react";

interface StatusPillProps {
  label: string;
  status: "live" | "demo" | "active" | "error" | "isolated";
  detail?: string;
  className?: string;
}

export function StatusPill({ label, status, detail, className = "" }: StatusPillProps) {
  const dotColor = {
    live: "bg-[#76b900] shadow-[0_0_8px_rgba(118,185,0,0.8)]",
    active: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse",
    demo: "bg-amber-500",
    error: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    isolated: "bg-emerald-500",
  }[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm text-xs font-mono text-slate-700 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="font-semibold text-slate-900">{label}:</span>
      <span className="text-slate-600">{detail ?? status}</span>
    </div>
  );
}
