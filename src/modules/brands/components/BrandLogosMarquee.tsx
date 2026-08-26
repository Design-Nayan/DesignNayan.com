"use client";

import React from "react";
import { partnerBrandsData } from "../data/brands.data";

export function BrandLogosMarquee() {
  const marqueeItems = [...partnerBrandsData, ...partnerBrandsData, ...partnerBrandsData];

  return (
    <section className="py-8 sm:py-10 bg-white border-y border-neutral-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 text-center">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase font-mono">
          TRUSTED BY TOP MATERIAL & LUXURY BRANDS
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex whitespace-nowrap mask-radial-edges">
        <div className="flex animate-marquee items-center gap-8 sm:gap-12 lg:gap-16 shrink-0 py-2">
          {marqueeItems.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm sm:text-base font-black tracking-widest text-neutral-800 font-mono group-hover:text-rose-600 transition-colors">
                {brand.name}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono">
                {brand.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
