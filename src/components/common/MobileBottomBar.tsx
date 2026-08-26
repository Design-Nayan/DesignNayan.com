"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, HardHat, Hotel, MessageSquare } from "lucide-react";
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
      label: "Contact",
      href: "/contact",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200/90 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-3">
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
                "flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 active:scale-95",
                isActive
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
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
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
