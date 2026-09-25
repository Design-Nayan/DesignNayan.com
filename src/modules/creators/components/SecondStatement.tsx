"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, ArrowUpRight, CheckCircle2, Film } from "lucide-react";
import { Creator } from "../creators.types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import { SHOWCASE_VIDEOS } from "../data";

interface SecondStatementProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onExploreRoster: () => void;
  onBookRoster: () => void;
}

export function SecondStatement({
  creators,
  onSelectCreator,
  onExploreRoster,
  onBookRoster,
}: SecondStatementProps) {
  // Duplicate the list so the infinite marquee loops seamlessly from right to left
  const marqueeList = [...SHOWCASE_VIDEOS, ...SHOWCASE_VIDEOS];

  const handleCardClick = (creatorId: string) => {
    const found = creators.find((c) => c.id === creatorId);
    if (found) {
      onSelectCreator(found);
    } else if (creators.length > 0) {
      onSelectCreator(creators[0]);
    }
  };

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Large headline on the left comes from left on scroll down, reverses on scroll up
      gsap.fromTo(
        ".second-statement-headline",
        { x: -65, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".second-statement-headline",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // Moving track carousel rises up smoothly on scroll down, reverses on scroll up
      gsap.fromTo(
        ".second-statement-carousel",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".second-statement-carousel",
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
    <section ref={containerRef} className="relative w-full bg-[#fbfbfa] text-[#141414] py-16 sm:py-24 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Large Editorial Headline: Clean simple font matching reference image 1 */}
        <div className="second-statement-headline max-w-6xl mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[40px] font-extrabold uppercase tracking-tight leading-[1.25] text-neutral-900 flex flex-col gap-1.5 sm:gap-2">
            <span className="block">
              WE TURN IDEAS
            </span>
            <span className="block">
              INTO VISUAL <span className="text-[#dd5132]">STATEMENTS —</span>
            </span>
            <span className="block whitespace-normal lg:whitespace-nowrap">
              <span className="text-[#888888] font-bold">FROM VISION TO DELIVERY — </span>
              <span className="text-neutral-900 font-extrabold">IMPACT THAT LASTS<span className="text-[#dd5132]">.</span></span>
            </span>
          </h2>
        </div>

      </div>

      {/* Infinite Moving Video Carousel (Flows smoothly from Right to Left, Pause on Hover) */}
      <div className="second-statement-carousel relative w-full overflow-hidden select-none py-4">
        {/* Left & Right Edge Gradients for Smooth Seamless Fade */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#fbfbfa] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#fbfbfa] to-transparent z-20 pointer-events-none" />

        {/* Moving Track */}
        <div className="animate-marquee flex gap-4 sm:gap-6 items-stretch">
          {marqueeList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => handleCardClick(item.creatorId)}
              className="group relative shrink-0 w-[250px] xs:w-[280px] sm:w-[320px] aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
            >
              {/* High-Resolution Video Thumbnail Preview */}
              <Image
                src={item.thumbnail}
                alt={`${item.brand} Campaign by ${item.creatorName}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-[1.08]"
                sizes="320px"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 group-hover:via-black/25 transition-all duration-300" />

              {/* Top Bar: Brand Badge & Animated Play Button */}
              <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[9.5px] font-mono font-semibold uppercase tracking-wider text-white">
                  {item.brand}
                </span>

                {/* Video Play Pill */}
                <div className="w-8 h-8 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md shadow-md group-hover:scale-110 transition-all duration-300">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Center Micro Video Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 shadow-lg">
                  <Film className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>PLAY CASE STUDY</span>
                </div>
              </div>

              {/* Bottom Card Content: Campaign Info & Results */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10">
                <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-red-400 font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-red-400" />
                  <span>VERIFIED CAMPAIGN REEL</span>
                </div>

                <h4 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {item.campaign}
                </h4>

                <p className="text-xs text-neutral-300 font-light mt-0.5 line-clamp-1">
                  by {item.creatorName} • {item.format}
                </p>

                {/* Metric Footer */}
                <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white tracking-tight">{item.views}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-red-400 font-semibold">{item.roas}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-300 group-hover:text-white transition-colors">
                    <span>Watch</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
