import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "indigo" | "purple" | "pink" | "slate" | "success" | "outline";
}

export function Badge({ className, variant = "indigo", children, ...props }: BadgeProps) {
  const variantStyles = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    slate: "bg-slate-800/80 text-slate-300 border-slate-700/50",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
