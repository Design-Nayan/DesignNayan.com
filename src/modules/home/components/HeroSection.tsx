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
      {/* 1. DESKTOP & TABLET VIEW (md+): Exact Previous Version (Full Background)  */}
      {/* ========================================================================= */}
      <section className="hidden md:flex relative w-full bg-white overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[740px] flex-col justify-between select-none">
        {/* Full Background Villa Image on Right */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-end">
          <picture className="w-full h-full">
            <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.webp`} type="image/webp" />
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.png`}
              alt="Design Nayan Modern Architectural Residence Background"
              className="w-full h-full object-cover object-right-bottom lg:object-right"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>

        {/* Content on Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 lg:pt-20 lg:pb-12 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-xl lg:max-w-2xl space-y-6 lg:space-y-7">
            <h1 className="text-5xl lg:text-[68px] font-extrabold tracking-tight text-neutral-950 leading-[1.14] space-y-1 sm:space-y-1.5">
              <span className="block">Design.</span>
              <span className="block">
                Build. <span className="text-rose-600 font-extrabold">Grow.</span>
              </span>
              <span className="block text-rose-600 font-extrabold">Stay.</span>
            </h1>

            <p className="text-neutral-600 text-base max-w-sm leading-relaxed font-normal">
              One ecosystem for all your creative, construction and property needs.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Link
                href="#services"
                className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/portfolio"
                className="px-6 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm hover:bg-white text-neutral-800 font-bold text-xs uppercase tracking-wider border border-neutral-300 transition-all active:scale-95 flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
              >
                <span>OUR PORTFOLIO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-1 space-y-2">
              <div className="text-xs font-semibold text-neutral-700 tracking-wide">
                Trusted by 250+ Clients
              </div>
              <div className="flex items-center -space-x-2">
                {clientAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Client"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Pill Bar (Desktop/Tablet) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-8 lg:pb-10 w-full">
          <div className="w-full md:max-w-2xl md:ml-auto bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-neutral-100/90">
            <div className="grid grid-cols-4 gap-4 divide-x divide-neutral-100">
              {heroStats.map((stat, i) => (
                <div key={stat.label} className={`flex items-center gap-2.5 ${i > 0 ? "pl-3" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    {getIcon(stat.iconName)}
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-neutral-950 leading-tight font-mono">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium leading-snug">
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
      {/* 2. MOBILE VIEW (< md): Content & Buttons at TOP, Full Photo BELOW        */}
      {/* ========================================================================= */}
      <section className="md:hidden w-full bg-white px-4 py-5 space-y-5 select-none">
        
        {/* Top Content & Horizontal Buttons */}
        <div className="space-y-3.5">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 leading-[1.14] space-y-1">
            <span className="block">Design.</span>
            <span className="block">
              Build. <span className="text-rose-600 font-bold">Grow.</span>
            </span>
            <span className="block text-rose-600 font-bold">Stay.</span>
          </h1>

          <p className="text-neutral-600 text-xs leading-relaxed font-normal max-w-xs">
            One ecosystem for all your creative, construction and property needs.
          </p>

          {/* Horizontal Side-by-Side Action Buttons */}
          <div className="flex flex-row items-center gap-2 pt-0.5">
            <Link
              href="#services"
              className="flex-1 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <span>EXPLORE SERVICES</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/portfolio"
              className="flex-1 px-3 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-[10px] uppercase tracking-wider border border-neutral-300 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
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
                  className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center shadow-sm">
                +
              </div>
            </div>
            <span className="text-[10px] font-semibold text-neutral-700">
              Trusted by 250+ Clients
            </span>
          </div>
        </div>

        {/* Full Villa Photo Rendered in Full Landscape Frame */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-neutral-100/90 bg-neutral-50">
          <picture className="w-full h-full">
            <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.webp`} type="image/webp" />
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/home-hero-villa-hd.png`}
              alt="Design Nayan Modern Architectural Villa"
              className="w-full h-full object-cover object-right-bottom"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>

        {/* Floating Stats Card on Mobile */}
        <div className="w-full bg-white rounded-2xl p-3.5 shadow-lg border border-neutral-100">
          <div className="grid grid-cols-2 gap-2.5 divide-y divide-neutral-100">
            {heroStats.map((stat, i) => (
              <div key={stat.label} className={`flex items-center gap-2 ${i % 2 !== 0 ? "pl-2" : ""} ${i >= 2 ? "pt-2" : ""}`}>
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  {getIcon(stat.iconName)}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-neutral-950 leading-tight font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-medium leading-snug">
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
