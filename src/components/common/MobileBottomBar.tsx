"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, HardHat, Hotel, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Studio",
      href: "/studio",
      icon: Layers,
    },
    {
      label: "Build",
      href: "/build",
      icon: HardHat,
    },
    {
      label: "Stay",
      href: "/stay",
      icon: Hotel,
    },
    {
      label: "Creators",
      href: "/creators",
      icon: Sparkles,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: MessageSquare,
    },
  ];

  const isCreators = pathname?.startsWith("/creators");

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-3 transition-colors duration-200",
        isCreators
          ? "bg-[#08090d]/95 border-t border-[#1f2333] shadow-[0_-5px_25px_rgba(0,0,0,0.5)]"
          : "bg-white/95 border-t border-neutral-200/90 shadow-[0_-5px_25px_rgba(0,0,0,0.08)]"
      )}
    >
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-1 sm:px-2 rounded-xl transition-all duration-200 active:scale-95",
                isCreators
                  ? isActive
                    ? "text-orange-500 font-bold"
                    : "text-stone-400 hover:text-white font-medium"
                  : isActive
                    ? "text-rose-600 font-bold"
                    : "text-neutral-500 hover:text-neutral-900 font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.75]"
                  )}
                />
                {isActive && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full animate-pulse",
                      isCreators ? "bg-orange-500" : "bg-rose-600"
                    )}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
