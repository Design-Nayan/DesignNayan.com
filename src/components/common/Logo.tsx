"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

export function Logo({ className, isWhite = false }: LogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const logoSrc = `${basePath}/images/${isWhite ? "logo-white.png" : "logo.png"}`;

  return (
    <Link 
      href="/" 
      className={cn("inline-flex items-center gap-2 group select-none py-1", className)}
      aria-label="Design Nayan Home"
    >
      <img
        src={logoSrc}
        alt="Design Nayan"
        className="h-7 sm:h-8.5 md:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
        loading="eager"
      />
    </Link>
  );
}
