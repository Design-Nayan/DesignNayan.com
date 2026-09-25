"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Creator } from "../creators.types";

gsap.registerPlugin(useGSAP);

interface TopCreatorsPyramidProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
}

export function TopCreatorsPyramid({ creators, onSelectCreator }: TopCreatorsPyramidProps) {
  const list = creators.slice(0, 5);
  // activeIdx is the card currently in the center spotlight (0 .. 4)
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef<boolean>(false);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // Responsive slot offsets based on current viewport
  const getSlotOffsets = useCallback(() => {
    if (typeof window === "undefined") {
      return { step1: 180, step2: 345, scale0: 1.05, scale1: 0.92, scale2: 0.82 };
    }
    const w = window.innerWidth;
    if (w < 440) {
      // Mobile (360px - 440px)
      return { step1: 75, step2: 138, scale0: 1.02, scale1: 0.88, scale2: 0.75 };
    }
    if (w < 640) {
      // Large Mobile (440px - 640px)
      return { step1: 95, step2: 175, scale0: 1.03, scale1: 0.89, scale2: 0.77 };
    }
    if (w < 1024) {
      // Tablet (640px - 1024px)
      return { step1: 140, step2: 265, scale0: 1.04, scale1: 0.90, scale2: 0.80 };
    }
    // Desktop (1024px+)
    return { step1: 180, step2: 345, scale0: 1.05, scale1: 0.92, scale2: 0.82 };
  }, []);

  const getSlotStyle = useCallback((relativePos: number, offsets = getSlotOffsets()) => {
    const { step1, step2, scale0, scale1, scale2 } = offsets;
    switch (relativePos) {
      case 0: // Center front spotlight
        return {
          x: 0,
          scale: scale0,
          opacity: 1,
          zIndex: 50,
          boxShadow: "0 28px 60px -15px rgba(220,38,38,0.38), 0 20px 35px -20px rgba(0,0,0,0.6)",
        };
      case -1: // Immediate left
        return {
          x: -step1,
          scale: scale1,
          opacity: 0.88,
          zIndex: 30,
          boxShadow: "0 14px 35px -12px rgba(0,0,0,0.35)",
        };
      case 1: // Immediate right
        return {
          x: step1,
          scale: scale1,
          opacity: 0.88,
          zIndex: 30,
          boxShadow: "0 14px 35px -12px rgba(0,0,0,0.35)",
        };
      case -2: // Far left
        return {
          x: -step2,
          scale: scale2,
          opacity: 0.65,
          zIndex: 15,
          boxShadow: "0 8px 24px -10px rgba(0,0,0,0.3)",
        };
      case 2: // Far right
        return {
          x: step2,
          scale: scale2,
          opacity: 0.65,
          zIndex: 15,
          boxShadow: "0 8px 24px -10px rgba(0,0,0,0.3)",
        };
      default:
        return {
          x: relativePos < 0 ? -(step2 + 80) : (step2 + 80),
          scale: 0.7,
          opacity: 0,
          zIndex: 5,
          boxShadow: "none",
        };
    }
  }, [getSlotOffsets]);

  // Helper to calculate circular relative offset (-2, -1, 0, 1, 2)
  const getRelativeOffset = (itemIdx: number, currentCenterIdx: number) => {
    let diff = itemIdx - currentCenterIdx;
    if (diff > 2) diff -= 5;
    if (diff < -2) diff += 5;
    return diff;
  };

  // Initialize card positions using GSAP
  useGSAP(
    () => {
      const offsets = getSlotOffsets();
      list.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const rel = getRelativeOffset(i, activeIdx);
        const style = getSlotStyle(rel, offsets);

        gsap.set(el, {
          x: style.x,
          y: 0,
          rotation: 0,
          scale: style.scale,
          opacity: style.opacity,
          zIndex: style.zIndex,
          boxShadow: style.boxShadow,
        });
      });
    },
    { dependencies: [], scope: containerRef }
  );

  // Resize handler to adjust positions smoothly on window resizing or rotation
  useEffect(() => {
    const handleResize = () => {
      if (isAnimatingRef.current) return;
      const offsets = getSlotOffsets();
      list.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const rel = getRelativeOffset(i, activeIdx);
        const style = getSlotStyle(rel, offsets);

        gsap.to(el, {
          x: style.x,
          scale: style.scale,
          opacity: style.opacity,
          zIndex: style.zIndex,
          boxShadow: style.boxShadow,
          duration: 0.25,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIdx, getSlotOffsets, getSlotStyle, list]);

  // Genuine Physical Deck Shuffle Motion
  const handleCardClick = (targetIdx: number) => {
    if (targetIdx === activeIdx || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const offsets = getSlotOffsets();
    const oldCenter = activeIdx;
    const newCenter = targetIdx;

    // Calculate outgoing and incoming relative offsets
    list.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const targetRel = getRelativeOffset(i, newCenter);
      const targetStyle = getSlotStyle(targetRel, offsets);
      const isBecomingActive = i === newCenter;
      const isLeavingActive = i === oldCenter;

      if (isBecomingActive) {
        // Bring card to top z-index early in the flight
        gsap.set(el, { zIndex: 45 });
        gsap.to(el, {
          x: targetStyle.x,
          y: -14, // physical lift
          scale: targetStyle.scale,
          opacity: targetStyle.opacity,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(el, { zIndex: 50 });
            gsap.to(el, {
              y: 0,
              boxShadow: targetStyle.boxShadow,
              duration: 0.25,
              ease: "back.out(1.2)",
            });
          },
        });
      } else if (isLeavingActive) {
        // Front card smoothly drops down and steps back into the fan
        gsap.to(el, {
          x: targetStyle.x,
          y: 7,
          scale: targetStyle.scale,
          opacity: targetStyle.opacity,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(el, { zIndex: targetStyle.zIndex });
            gsap.to(el, {
              y: 0,
              boxShadow: targetStyle.boxShadow,
              duration: 0.25,
              ease: "power2.out",
            });
          },
        });
      } else {
        // Other neighbor cards slide smoothly to their new slots
        gsap.to(el, {
          x: targetStyle.x,
          y: 0,
          scale: targetStyle.scale,
          opacity: targetStyle.opacity,
          zIndex: targetStyle.zIndex,
          boxShadow: targetStyle.boxShadow,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
    });

    // Complete transition and unlock interaction
    setTimeout(() => {
      setActiveIdx(newCenter);
      isAnimatingRef.current = false;
    }, 550);
  };

  const handleNext = () => {
    handleCardClick((activeIdx + 1) % list.length);
  };

  const handlePrev = () => {
    handleCardClick((activeIdx - 1 + list.length) % list.length);
  };

  // Touch swipe handling for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const duration = Date.now() - touchStartTime.current;

    // Check if swipe is predominantly horizontal and exceeds 35px threshold within 600ms
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35 && duration < 600) {
      if (deltaX > 0) {
        // Swiped left -> next card
        handleNext();
      } else {
        // Swiped right -> prev card
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="w-full select-none" ref={containerRef}>
      {/* Centered Deck Control: Prev Arrow, Centered #1..#5 Rank Tabs, Next Arrow */}
      <div className="flex items-center justify-center gap-2 sm:gap-3.5 max-w-xl mx-auto mb-6 sm:mb-10 px-3 sm:px-4">
        {/* Previous Navigation Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous creator"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-neutral-200/90 shadow-2xs hover:border-red-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer text-neutral-700 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Quick Rank Tabs (#1, #2, #3, #4, #5) Centered */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
          {list.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleCardClick(i)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 ${
                activeIdx === i
                  ? "bg-neutral-950 text-white shadow-md scale-105 ring-1 ring-neutral-800"
                  : "bg-white/90 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/90"
              }`}
            >
              <span className={activeIdx === i ? "text-red-500 font-bold" : "text-neutral-400"}>
                #{i + 1}
              </span>
              <span className="hidden sm:inline">{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Next Navigation Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next creator"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-neutral-200/90 shadow-2xs hover:border-red-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer text-neutral-700 shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Unified Responsive Physical Pyramid Card Fan with Touch Swipe Gestures */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[400px] xs:h-[430px] sm:h-[470px] lg:h-[520px] max-w-5xl mx-auto overflow-hidden touch-pan-y"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {list.map((creator, idx) => {
            const isActive = activeIdx === idx;

            return (
              <div
                key={creator.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => handleCardClick(idx)}
                className={`absolute w-[210px] xs:w-[230px] sm:w-[260px] lg:w-[280px] xl:w-[290px] aspect-[3/4.25] cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden will-change-transform ${
                  isActive ? "ring-2 ring-red-500 brightness-105" : "hover:brightness-105"
                }`}
              >
                {/* High-Resolution Portrait Visual */}
                <Image
                  src={creator.featuredImage}
                  alt={creator.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out filter contrast-[1.08]"
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 270px, 300px"
                  priority={idx === 0}
                />

                {/* Cinematic Vignette Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-400 ${
                    isActive
                      ? "bg-gradient-to-t from-black/95 via-black/35 to-black/10"
                      : "bg-gradient-to-t from-black/92 via-black/45 to-black/25"
                  }`}
                />

                {/* Top Corner Pills */}
                <div className="absolute top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-3.5 z-10 flex items-center justify-between">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[8.5px] sm:text-[9.5px] font-mono font-medium uppercase tracking-wider text-white shadow-xs">
                    {creator.category.split(" ")[0]}
                  </span>

                  <span
                    className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-mono font-bold tracking-widest uppercase transition-colors shadow-xs ${
                      isActive ? "bg-red-600 text-white" : "bg-white/20 text-white/90 backdrop-blur-md"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                </div>

                {/* Card Bottom: Simple Name, Category, Reach, View CTA */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 text-white z-10">
                  {/* Verified Line */}
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 text-[8px] sm:text-[9px] font-mono text-red-400 font-semibold uppercase tracking-wider">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
                    <span>VERIFIED CREATOR</span>
                  </div>

                  {/* Name */}
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white flex items-center justify-between">
                    <span className="truncate">{creator.name}</span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-normal text-white/60 shrink-0 ml-1">
                      {creator.location.split("•")[0]}
                    </span>
                  </h4>

                  {/* Category / Discipline */}
                  <p className="text-[10.5px] sm:text-xs text-neutral-300 font-light mt-0.5 truncate">
                    {creator.category}
                  </p>

                  {/* Reach Metric + Clean View CTA */}
                  <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-white/60 block">
                        AUDIENCE REACH
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        {creator.followersCount}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCreator(creator);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white text-neutral-950 hover:bg-red-600 hover:text-white transition-all duration-300 text-[10.5px] sm:text-xs font-semibold cursor-pointer shadow-sm group/btn"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
