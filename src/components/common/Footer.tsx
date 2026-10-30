"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { footerNav } from "@/config/navigation";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Secret Door Knock: Triple click on copyright within 1.5 seconds opens the secret gateway
  const handleSecretDoorKnock = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      router.push("/kla-dorja-khul");
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

  // Keyboard shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/kla-dorja-khul");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600 text-xs py-10 transition-colors duration-200 select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Original Logo */}
        <Logo isWhite={false} />

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

        {/* Secret Doorway Copyright Trigger */}
        <div
          onClick={handleSecretDoorKnock}
          className="font-medium text-[11px] text-neutral-500 cursor-default select-none"
          title=""
        >
          &copy; {new Date().getFullYear()} Design Nayan. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
