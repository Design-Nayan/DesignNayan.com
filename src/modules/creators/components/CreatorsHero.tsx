"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, ShieldCheck, Flame } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface CreatorsHeroProps {
  onExploreClick: () => void;
  onBookClick: () => void;
}

export function CreatorsHero({ onExploreClick, onBookClick }: CreatorsHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Left glass card glides in smoothly from the left
      tl.from(
        ".hero-left-card",
        {
          x: -80,
          opacity: 0,
          duration: 1.15,
        },
        0.1
      );

      // Right text headline & buttons glide in smoothly from the right
      tl.from(
        ".hero-right-content",
        {
          x: 80,
          opacity: 0,
          duration: 1.15,
        },
        0.1
      );

      // Hero bottom meta strip gently fades in from bottom
      tl.from(
        ".hero-bottom-strip",
        {
          y: 25,
          opacity: 0,
          duration: 0.9,
        },
        0.5
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#060204] text-white overflow-hidden min-h-[calc(100svh-64px)] md:min-h-[96vh] flex flex-col justify-between">
      {/* Background Ambient Glow & Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep Crimson Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#b91c1c]/40 via-[#7f1d1d]/20 to-transparent blur-[140px] rounded-full animate-pulse-subtle" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#dc2626]/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#991b1b]/20 blur-[120px] rounded-full" />
        {/* Subtle film grain overlay effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Main Hero Visual: High-Fashion Editorial Model (Clear, Crisp & Cinematic) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/creators/hero-editorial-bg.jpg`}
          alt="Design Nayan Creative Talent Editorial"
          fill
          priority
          className="object-cover object-center filter brightness-[0.92] contrast-[1.06] select-none"
          sizes="100vw"
        />
        {/* Soft, calibrated edge vignettes: keeps the model crystal clear in the center while providing crisp text contrast on the sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060204]/85 via-transparent to-[#060204]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060204] via-transparent to-[#060204]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#060204_95%)]" />
      </div>

      {/* Spacer to balance top navigation */}
      <div className="h-3 sm:h-12 w-full shrink-0" />

      {/* Hero Core Content: Synchronized Center Alignment Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 my-auto flex-1 flex flex-col justify-center py-2 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[330px_1fr] items-center gap-x-8 lg:gap-x-14 gap-y-4 sm:gap-y-6 w-full">
          
          {/* Row 1, Col 1 on desktop: Left Glass Card (Vertically centered with Headline Group) */}
          <div className="hero-left-card order-2 md:order-1 flex justify-center md:justify-start w-full self-center">
            {/* Glass Card - Perfectly Centered Design */}
            <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 hover:border-red-500/50 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-red-950/40 hover:-translate-y-1 w-full max-w-[270px] sm:max-w-xs flex flex-col items-center justify-center text-center">
              {/* Soft ambient red flare inside card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
              
              {/* Top Tag */}
              <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-950/60 border border-red-700/50 text-[9.5px] sm:text-[10px] font-mono tracking-widest uppercase text-red-300 font-semibold mb-2 sm:mb-3">
                <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-500 animate-pulse" />
                TOP CREATORS
              </span>

              {/* Big Stat */}
              <div className="relative z-10">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white block">
                  88%
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-red-400 font-bold block mt-0.5 sm:mt-1">
                  ENGAGEMENT OUTPERFORMANCE
                </span>
              </div>
              
              {/* Description */}
              <p className="relative z-10 text-[11px] sm:text-xs text-neutral-300 mt-2 sm:mt-3.5 font-normal leading-relaxed max-w-[220px]">
                Representing the top 1% vetted creators. Guaranteed organic resonance that cuts through digital noise.
              </p>
            </div>
          </div>

          {/* Col 2 on desktop: Main Headline Group + Action Buttons directly underneath */}
          <div className="hero-right-content order-1 md:order-2 text-center md:text-right max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full md:ml-auto self-center pr-0 sm:pr-8 md:pr-12 overflow-visible flex flex-col items-center md:items-end">
            
            {/* Subtle Design Agency Micro-Kicker (Positioned at TOP) */}
            <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase text-red-400 font-semibold">
                DESIGN NAYAN // TALENTED CREATORS
              </span>
            </div>

            <h1 className="overflow-visible select-none py-1 flex flex-col items-center md:items-end uppercase font-black tracking-tight leading-[0.92] space-y-1 sm:space-y-2 pr-0 md:pr-4">
              {/* Simple Bold Sans "CREATIVE" with Fast Animated Gradient */}
              <span className="block text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[88px] xl:text-[98px] text-transparent bg-clip-text bg-[linear-gradient(90deg,#dc2626_0%,#ea580c_30%,#f97316_60%,#dc2626_100%)] animate-gradient-fast drop-shadow-[0_0_25px_rgba(234,88,12,0.35)]">
                CREATIVE
              </span>
              
              {/* Simple Bold Sans "BRANDING" in Crisp White */}
              <span className="block text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[88px] xl:text-[98px] text-white">
                BRANDING
              </span>

              {/* Simple Bold Sans "AGENCY" with Fast Animated Gradient */}
              <span className="block text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[88px] xl:text-[98px] text-transparent bg-clip-text bg-[linear-gradient(90deg,#dc2626_0%,#ea580c_30%,#f97316_60%,#dc2626_100%)] animate-gradient-fast drop-shadow-[0_0_25px_rgba(234,88,12,0.35)]">
                AGENCY
              </span>
            </h1>

            {/* Action Buttons Row */}
            <div className="mt-3 sm:mt-6 flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-4 pr-0 md:pr-1">
              
              {/* Button 1: Hire Creators Now (White -> Changes on Hover to Logo Brand Red with Animated Moving Gradient) */}
              <button
                onClick={onBookClick}
                className="relative overflow-hidden px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-xl active:scale-95 group hover:scale-[1.03] border border-white/30 bg-white hover:bg-[#dc2626] hover:border-[#dc2626] cursor-pointer"
              >
                {/* Active animated moving gradient that takes over the button on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#dc2626] via-rose-500 via-amber-500 to-[#b91c1c] animate-gradient-move transition-opacity duration-300 pointer-events-none" />

                {/* Text: switches from dark to crisp white on hover */}
                <span className="relative z-10 text-neutral-950 group-hover:text-white transition-colors duration-300">
                  HIRE CREATORS NOW
                </span>
              </button>

              {/* Button 2: Explore Creators (Scrolls to Creators Directory Section) */}
              <button
                onClick={onExploreClick}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-red-400/80 backdrop-blur-md font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>EXPLORE CREATORS</span>
                <ArrowDown className="w-3.5 h-3.5 text-red-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Spacer before footer */}
      <div className="h-3 sm:h-12 w-full shrink-0" />

      {/* Hero Bottom Meta Strip */}
      <div className="hero-bottom-strip relative z-10 border-t border-white/10 bg-[#060204] py-2.5 sm:py-3.5 px-4 sm:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-neutral-400 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <span className="text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              12 CREATORS ACTIVE
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline">48H PRODUCTION TURNAROUND</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-5 text-neutral-300 shrink-0">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">DIGITAL CAMPAIGNS</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 hidden xs:inline">INFLUENCE</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">VIRAL GROWTH</span>
            <span className="px-2 py-0.5 rounded bg-red-950/50 border border-red-700/50 text-red-300">RETAINER</span>
          </div>
        </div>
      </div>
    </section>
  );
}
