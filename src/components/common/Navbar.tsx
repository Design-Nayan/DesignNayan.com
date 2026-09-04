"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, PhoneCall } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all pt-[max(env(safe-area-inset-top),0px)] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop & Tablet Navigation Links (Includes CREATORS; CONTACT removed on desktop/tablet as START A PROJECT handles it) */}
        <nav className="hidden md:flex items-center gap-3.5 md:gap-4 lg:gap-6 xl:gap-8 text-[11.5px] md:text-[12px] lg:text-[13px] font-semibold tracking-wider">
          {mainNav
            .filter((item) => item.href !== "/contact")
            .map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1.5 transition-colors duration-200 uppercase font-medium tracking-wide",
                    isActive
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Right Actions: Desktop CTA + Mobile Quick Call */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Quick WhatsApp / Call Trigger */}
          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 active:scale-95 transition-transform"
            aria-label="Direct WhatsApp Contact"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          {/* Desktop & Tablet Direct CTA Button */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/contact"
              className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] lg:text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 lg:gap-2 whitespace-nowrap"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Hamburger Menu (for mobile viewports) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800 hover:text-black active:scale-95 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full Navigation Slide Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-5 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-1.5">
            {mainNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-between",
                    isActive
                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  <span>{item.title}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-rose-600" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Call {siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
