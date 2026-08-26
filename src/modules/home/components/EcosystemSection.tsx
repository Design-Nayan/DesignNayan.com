import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ecosystemCards } from "../data/home.data";

export function EcosystemSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block mb-1.5 sm:mb-2">
            OUR ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Three Worlds. One Vision.
          </h2>
        </div>

        {/* Horizontal Scroll on Mobile & Tablet, 3-Column Grid on Large Desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 pb-4 lg:pb-0">
          {ecosystemCards.map((card) => (
            <div
              key={card.tag}
              className="shrink-0 w-[320px] sm:w-[390px] lg:w-auto snap-start rounded-xl sm:rounded-2xl bg-white text-neutral-900 overflow-hidden shadow-2xl border border-neutral-200/90 relative group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 active:scale-[0.99] min-h-[180px] sm:min-h-[210px] flex items-center"
            >
              {/* 1. Full-Card Background Image */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* 2. Continuous Multi-Stop Gradient Layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-white from-25% via-white/95 via-36% via-white/70 via-48% via-white/20 via-60% to-transparent pointer-events-none z-10" />

              {/* 3. Vertically Centered Left Content */}
              <div className="relative z-20 w-[58%] sm:w-[54%] p-4 sm:p-5 lg:p-6 flex flex-col justify-center h-full space-y-2 sm:space-y-2.5 my-auto">
                <div>
                  <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.15em] text-rose-600 uppercase block mb-1 font-mono">
                    {card.tag}
                  </span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-neutral-950 mb-1 sm:mb-1.5 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-neutral-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="pt-0.5">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
