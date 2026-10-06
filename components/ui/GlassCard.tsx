import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  elevated?: boolean;
}

export function GlassCard({
  children,
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  elevated = false,
}: GlassCardProps) {
  const baseClass = elevated ? "glass-panel-elevated" : "glass-panel";

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 ${baseClass} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/60 bg-white/40">
          <div>
            {title && <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">{title}</div>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
