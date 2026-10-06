import React from "react";

type BadgeVariant = "nvidia" | "success" | "warning" | "danger" | "neutral" | "info" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({ children, variant = "neutral", className = "", size = "md" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  const variantClasses: Record<BadgeVariant, string> = {
    nvidia: "bg-[#e3f3c4] text-[#3f6300] border border-[#76b900]/30 font-semibold",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 font-medium",
    danger: "bg-rose-50 text-rose-700 border border-rose-200 font-medium",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    info: "bg-sky-50 text-sky-700 border border-sky-200 font-medium",
    outline: "bg-transparent text-slate-600 border border-slate-300 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono tracking-tight leading-none ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
