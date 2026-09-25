"use client";

import React, { useRef } from "react";
import { Creator } from "../creators.types";
import { TopCreatorsPyramid } from "./TopCreatorsPyramid";
import { getTopCreators } from "../data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface StatementEditorialProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
}

export function StatementEditorial({ creators, onSelectCreator }: StatementEditorialProps) {
  const containerRef = useRef<HTMLElement>(null);
  const topSpotlightCreators = React.useMemo(() => getTopCreators(creators), [creators]);

  useGSAP(
    () => {
      // Left editorial big text: slides in from left on scroll down, reverses on scroll up
      gsap.fromTo(
        ".editorial-left-text",
        { x: -70, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".editorial-left-text",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // Right 3 specimen agency cards: slide in from right with stagger, reverses on scroll up
      gsap.fromTo(
        ".editorial-card",
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".editorial-right-cards",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // "TOP CREATORS OF MONTH" center heading: comes from top, reverses on scroll up
      gsap.fromTo(
        ".pyramid-heading",
        { y: -35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".pyramid-heading",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // Interactive pyramid display: reveals smoothly upward, reverses on scroll up
      gsap.fromTo(
        ".pyramid-display",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".pyramid-display",
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
    <section ref={containerRef} className="relative z-10 w-full bg-[#fcfcfb] text-[#141414] pt-6 sm:pt-10 lg:pt-14 pb-20 sm:pb-28 lg:pb-36 border-b border-neutral-200/90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Seamless Creative Text Area with Google Gemini Air-Flow Gradient in Background */}
        <div className="relative py-2 sm:py-4 lg:py-5 mb-2 overflow-visible">
          
          {/* Clean Editorial Background matching reference */}
          <div className="absolute inset-0 bg-[#fbfbfa] pointer-events-none z-0 select-none" />

          {/* Foreground: 2-Column Responsive Grid (Big Text on Left, 3 Design Agency Specimen Cards on Right) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
            
            {/* Left Column: Big Editorial Statement Typography matching Reference Image 2 */}
            <div className="editorial-left-text lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-start">
              <h2 className="flex flex-col gap-1 sm:gap-1.5 select-none overflow-visible w-full uppercase font-bold tracking-tight">
                {/* Line 1: DESIGN NAYAN in warm coral-orange */}
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[38px] leading-[1.12] text-[#ec6d31] whitespace-nowrap">
                  DESIGN NAYAN
                </span>

                {/* Line 2: CREATOR SYSTEM, in Deep Black */}
                <span className="text-neutral-950 block text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[42px] leading-[1.12] font-extrabold whitespace-nowrap">
                  CREATOR SYSTEM,
                </span>
                
                {/* Line 3: CREATORS THAT REDEFINE in warm coral-orange */}
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[38px] leading-[1.12] text-[#ec6d31] whitespace-nowrap">
                  CREATORS THAT REDEFINE
                </span>

                {/* Line 4: MODERN in coral-orange + VISUAL CULTURE in Black + . in coral-orange */}
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[38px] leading-[1.12] whitespace-nowrap">
                  <span className="text-[#ec6d31]">MODERN </span>
                  <span className="text-neutral-950">VISUAL CULTURE</span>
                  <span className="text-[#ec6d31]">.</span>
                </span>
              </h2>
            </div>

            {/* Right Column: 3 Design Agency Specimen Cards (Side-by-Side Horizontal Row, Fits in One Frame) */}
            <div className="editorial-right-cards lg:col-span-5 xl:col-span-5 relative w-full flex items-center justify-center lg:justify-end py-2">
              <div className="flex flex-nowrap overflow-x-auto sm:overflow-visible items-center justify-start sm:justify-center lg:justify-end gap-3 sm:gap-3.5 xl:gap-4 max-w-full pb-2 sm:pb-0 px-1 scrollbar-none">
                
                {/* Agency Card 1: The 3-Second Hook */}
                <div className="editorial-card relative shrink-0 w-[145px] h-[145px] sm:w-[160px] sm:h-[160px] xl:w-[172px] xl:h-[172px] rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 hover:border-red-500/60 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_-6px_rgba(220,38,38,0.14)] -rotate-1.5 transition-shadow duration-300 cursor-pointer group flex flex-col items-center justify-center text-center p-3.5 sm:p-4 select-none">
                  {/* Subtle Top Red Accent Line */}
                  <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent group-hover:via-red-500 transition-colors duration-300" />
                  
                  {/* Architectural Swiss Corner Crosshairs */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>

                  {/* Centered Heading & Short Subtext Only */}
                  <h4 className="font-extrabold text-[13px] sm:text-[14px] xl:text-[15px] text-neutral-900 tracking-tight leading-snug mb-1.5 group-hover:text-red-600 transition-colors">
                    The 3-Second Hook
                  </h4>
                  <p className="text-[10.5px] sm:text-[11.5px] text-neutral-500 font-normal leading-relaxed max-w-[140px]">
                    Open mid-motion with high visual tension that freezes the thumb instantly.
                  </p>
                </div>

                {/* Agency Card 2: Micro-Cut Pacing */}
                <div className="editorial-card relative shrink-0 w-[145px] h-[145px] sm:w-[160px] sm:h-[160px] xl:w-[172px] xl:h-[172px] rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 hover:border-red-500/60 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_-6px_rgba(220,38,38,0.14)] rotate-0 transition-shadow duration-300 cursor-pointer group flex flex-col items-center justify-center text-center p-3.5 sm:p-4 select-none">
                  {/* Subtle Top Red Accent Line */}
                  <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent group-hover:via-red-500 transition-colors duration-300" />

                  {/* Architectural Swiss Corner Crosshairs */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>

                  {/* Centered Heading & Short Subtext Only */}
                  <h4 className="font-extrabold text-[13px] sm:text-[14px] xl:text-[15px] text-neutral-900 tracking-tight leading-snug mb-1.5 group-hover:text-red-600 transition-colors">
                    Micro-Cut Pacing
                  </h4>
                  <p className="text-[10.5px] sm:text-[11.5px] text-neutral-500 font-normal leading-relaxed max-w-[140px]">
                    Shift screen angles every 1.8s and layer sound cues to keep dopamine elevated.
                  </p>
                </div>

                {/* Agency Card 3: Emotional Payoff */}
                <div className="editorial-card relative shrink-0 w-[145px] h-[145px] sm:w-[160px] sm:h-[160px] xl:w-[172px] xl:h-[172px] rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 hover:border-red-500/60 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_-6px_rgba(220,38,38,0.14)] rotate-1.5 transition-shadow duration-300 cursor-pointer group flex flex-col items-center justify-center text-center p-3.5 sm:p-4 select-none">
                  {/* Subtle Top Red Accent Line */}
                  <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent group-hover:via-red-500 transition-colors duration-300" />

                  {/* Architectural Swiss Corner Crosshairs */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono text-neutral-300 pointer-events-none group-hover:text-red-400/60 transition-colors">+</span>

                  {/* Centered Heading & Short Subtext Only */}
                  <h4 className="font-extrabold text-[13px] sm:text-[14px] xl:text-[15px] text-neutral-900 tracking-tight leading-snug mb-1.5 group-hover:text-red-600 transition-colors">
                    Emotional Payoff
                  </h4>
                  <p className="text-[10.5px] sm:text-[11.5px] text-neutral-500 font-normal leading-relaxed max-w-[140px]">
                    Deliver an unexpected twist or truth that compels viewers to share.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Top Creators of Month: Interactive Pyramid / Stacked Showcase (Seamless Flow, No Divider Border) */}
        <div className="mt-12 sm:mt-16 pt-4 sm:pt-6">
          
          {/* Simple, Elegant Heading */}
          <div className="pyramid-heading text-center mb-10 sm:mb-14">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-neutral-900">
              TOP CREATORS OF MONTH
            </h3>
          </div>

          {/* Interactive Pyramid Display for 5 Creators */}
          <div className="pyramid-display">
            <TopCreatorsPyramid
              creators={topSpotlightCreators}
              onSelectCreator={onSelectCreator}
            />
          </div>

        </div>

      </div>
    </section>
  );
}
