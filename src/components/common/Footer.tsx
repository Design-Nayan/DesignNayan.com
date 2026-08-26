import React from "react";
import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600 text-xs py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo */}
        <Logo />

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-semibold tracking-wider uppercase text-[12px] text-neutral-600">
          {footerNav.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="hover:text-neutral-950 transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div className="text-neutral-500 font-medium text-[11px]">
          &copy; {new Date().getFullYear()} Design Nayan. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
