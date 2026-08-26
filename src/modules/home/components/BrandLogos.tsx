import React from "react";
import { partnerBrands } from "../data/home.data";

export function BrandLogos() {
  // Duplicate array 3 times for a completely seamless infinite loop with zero jumps or blank gaps
  const marqueeBrands = [...partnerBrands, ...partnerBrands, ...partnerBrands];

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-t border-neutral-100 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Subtle Edge Fade Gradients for Luxury Polish */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        {/* Marquee Wrapper: Single Horizontal Line on All Devices (Mobile, Tablet, Desktop) */}
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee flex items-center gap-8 sm:gap-12 md:gap-16 opacity-80 hover:opacity-100 transition-opacity">
            {marqueeBrands.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all select-none py-1.5 px-3 shrink-0"
              >
                <span className={brand.style}>{brand.logoText}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
