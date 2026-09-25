"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Home, ThumbsUp, Handshake, Award } from "lucide-react";
import { heroStats, clientAvatars } from "../data/home.data";

export function HeroSection() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Home":
        return <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600" />;
      case "ThumbsUp":
        return <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600" />;
      case "Handshake":
        return <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600" />;
      case "Award":
        return <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600" />;
      default:
        return <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600" />;
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET VIEW (md+): Single Frame Layout with Right Villa       */}
      {/* ========================================================================= */}
      <section className="hidden md:flex relative w-full hero-desktop-section bg-white overflow-hidden md:h-[calc(100svh-5rem)] md:max-h-[560px] md:min-h-[460px] lg:h-[calc(100vh-4.25rem)] lg:min-h-[580px] lg:max-h-[820px] flex-col justify-between select-none">
        
        {/* Full Background Villa Image strictly on Right (Full Bleed Edge-to-Edge) */}
        <div className="absolute inset-0 w-full h-full hero-desktop-image-container z-0 pointer-events-none overflow-hidden">
          <picture className="block w-full h-full">
            <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.webp`} type="image/webp" />
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.png`}
              alt="Design Nayan Modern Architectural Residence Background"
              className="w-full h-full object-cover object-right-bottom md:object-[right_20%] lg:object-right-bottom hero-desktop-image"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>

        {/* Content on Left (Cut top white space on tablet, shifted towards the left) */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:pl-8 md:pr-4 lg:pl-12 lg:pr-6 xl:pl-16 xl:pr-8 pt-0 md:pt-0 lg:pt-10 flex-1 flex flex-col md:justify-start lg:justify-center">
          <div className="max-w-xl lg:max-w-2xl space-y-2 md:space-y-1.5 lg:space-y-5">
            
            {/* Monumental Action Headline (Tuned for Tablet Single Frame) */}
            <h1 className="text-3xl md:text-[27px] md:leading-[1.02] lg:text-6xl xl:text-[68px] font-extrabold tracking-tight text-neutral-950 lg:leading-[1.08] space-y-0.5">
              <span className="block">Design.</span>
              <span className="block">
                Build. <span className="text-rose-600 font-extrabold">Grow.</span>
              </span>
              <span className="block text-rose-600 font-extrabold">Stay.</span>
            </h1>

            <p className="text-neutral-600 text-xs md:text-[12px] md:leading-snug lg:text-base max-w-md font-normal">
              One ecosystem for all your creative, construction and property needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 md:gap-2.5 pt-0.5">
              <Link
                href="#services"
                className="px-3.5 md:px-3.5 py-2 md:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10.5px] md:text-[11px] uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/portfolio"
                className="px-3.5 md:px-3.5 py-2 md:py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-[10.5px] md:text-[11px] uppercase tracking-wider border border-neutral-300 transition-all active:scale-95 flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
              >
                <span>OUR PORTFOLIO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-0 space-y-1">
              <div className="text-[10.5px] md:text-[11px] font-semibold text-neutral-700 tracking-wide">
                Trusted by 250+ Clients
              </div>
              <div className="flex items-center -space-x-1.5">
                {clientAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Client"
                    className="w-7 h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
                <div className="w-7 h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-full border-2 border-white bg-neutral-900 text-white text-[10px] md:text-[10px] font-bold flex items-center justify-center shadow-sm">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar (Tuned for Tablet Single Frame) */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:pl-8 md:pr-4 lg:pl-12 lg:pr-6 xl:pl-16 xl:pr-8 pb-2 md:pb-2 lg:pb-8">
          <div className="w-full max-w-xl lg:max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl p-2.5 md:p-2 lg:p-5 shadow-lg border border-neutral-200/80">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 divide-x divide-neutral-100">
              {heroStats.map((stat, i) => (
                <div key={stat.label} className={`flex items-center gap-1.5 sm:gap-2.5 ${i > 0 ? "pl-2 sm:pl-3" : ""}`}>
                  <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 lg:w-9 lg:h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    {getIcon(stat.iconName)}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm lg:text-lg font-extrabold text-neutral-950 leading-tight font-mono">
                      {stat.value}
                    </div>
                    <div className="text-[8.5px] sm:text-[9.5px] lg:text-[11px] text-neutral-500 font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW (< md): Compact Section with Villa Directly in Background   */}
      {/* ========================================================================= */}
      <section className="md:hidden relative w-full bg-white overflow-hidden px-4 py-4 sm:py-5 flex flex-col justify-between select-none space-y-4">
        
        {/* Full Background Villa Image Directly Behind Text & Components */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <picture className="w-full h-full">
            <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-mobile-bg.webp`} type="image/webp" />
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-mobile-bg.png`}
              alt="Design Nayan Modern Architectural Villa Background"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          {/* Subtle gradient wash ensuring high text contrast while the modern villa shows in the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/80 to-white/45 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40 pointer-events-none" />
        </div>

        {/* Content Layer (Overlaid on Background) */}
        <div className="relative z-10 space-y-2.5 pt-0.5">
          {/* Action Headline */}
          <h1 className="text-[27px] sm:text-[30px] font-extrabold tracking-tight text-neutral-950 leading-[1.08] space-y-0.5">
            <span className="block">Design.</span>
            <span className="block">
              Build. <span className="text-rose-600 font-extrabold">Grow.</span>
            </span>
            <span className="block text-rose-600 font-extrabold">Stay.</span>
          </h1>

          <p className="text-neutral-700 text-[11.5px] sm:text-xs leading-snug font-medium max-w-[280px]">
            One ecosystem for all your creative, construction and property needs.
          </p>

          {/* Side-by-Side Action Buttons */}
          <div className="flex flex-row items-center gap-2 pt-0.5">
            <Link
              href="#services"
              className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>EXPLORE SERVICES</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/portfolio"
              className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl bg-white/95 backdrop-blur-xs hover:bg-white text-neutral-800 font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider border border-neutral-300 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>OUR PORTFOLIO</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-0.5 flex items-center justify-between">
            <div className="flex items-center -space-x-1.5">
              {clientAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Client"
                  className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-xs"
                />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                +
              </div>
            </div>
            <span className="text-[10px] font-semibold text-neutral-800">
              Trusted by 250+ Clients
            </span>
          </div>
        </div>

        {/* Floating Stats Card (Overlaid Over Background) */}
        <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-neutral-200/80">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-1.5 ${i % 2 !== 0 ? "pl-2" : ""} ${
                  i >= 2 ? "pt-1 border-t border-neutral-100" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  {getIcon(stat.iconName)}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-neutral-950 leading-tight font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[8px] sm:text-[8.5px] text-neutral-500 font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
