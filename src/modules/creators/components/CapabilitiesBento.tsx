"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import { CAPABILITIES_STEPS as STEPS } from "../data";

interface CapabilitiesBentoProps {
  onSelectCategory?: (category: string) => void;
}

export function CapabilitiesBento({ onSelectCategory }: CapabilitiesBentoProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header comes from top on scroll down, reverses on scroll up
      gsap.fromTo(
        ".bento-heading",
        { y: -30, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".bento-heading",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // Step pills reveal smoothly on scroll down, reverse on scroll up
      gsap.fromTo(
        ".bento-pill",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".bento-pills-container",
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#0a0a0a] text-white py-8 sm:py-10 border-y border-neutral-800/80 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Narrow Strip Header: Pure White Bold Heading */}
        <div className="bento-heading text-center mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
            EVERYTHING YOUR BRAND NEEDS TO GROW
          </h2>
        </div>

        {/* 3 Connected Soft Pastel Step Pills */}
        <div className="bento-pills-container relative max-w-3xl mx-auto">
          <div className="flex items-center justify-start md:justify-center gap-2.5 sm:gap-4 overflow-x-auto py-2 px-1 scrollbar-none">
            {STEPS.map((item, index) => {
              const isLast = index === STEPS.length - 1;

              return (
                <React.Fragment key={item.id}>
                  {/* Pastel Step Pill on Dark Background */}
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(item.title)}
                    className={`bento-pill group shrink-0 inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-full border shadow-sm hover:shadow-lg transition-colors duration-200 cursor-pointer ${item.bgClass} ${item.borderClass}`}
                  >
                    {/* Step Number Badge */}
                    <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.badgeClass}`}>
                      {item.step}
                    </span>

                    {/* Step Title */}
                    <span className={`text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap ${item.textClass}`}>
                      {item.title}
                    </span>
                  </button>

                  {/* Connecting Arrow between Pills */}
                  {!isLast && (
                    <div className="shrink-0 flex items-center justify-center text-neutral-600">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
