import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "glass" | "nvidia" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  children,
  variant = "glass",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];

  const variantClasses = {
    glass: "bg-white/60 hover:bg-white/90 border border-slate-200/80 text-slate-700 shadow-sm",
    nvidia: "bg-[#76b900] hover:bg-[#5c9400] text-white shadow-[0_2px_8px_rgba(118,185,0,0.3)]",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
