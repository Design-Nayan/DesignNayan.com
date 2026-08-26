import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

export function Logo({ className, isWhite = false }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex flex-col group select-none", className)}>
      <div className="flex items-baseline tracking-tight">
        <span className={cn("text-2xl font-bold font-sans", isWhite ? "text-white" : "text-neutral-900")}>
          design
        </span>
        <span className="text-2xl font-bold text-rose-600 ml-0.5 font-sans">
          নয়ন
        </span>
      </div>
      <span className={cn(
        "text-[8px] font-semibold tracking-[0.2em] uppercase mt-[-2px]",
        isWhite ? "text-neutral-400" : "text-neutral-500"
      )}>
        {siteConfig.tagline}
      </span>
    </Link>
  );
}
