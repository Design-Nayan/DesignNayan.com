"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Creator, CreatorCategory } from "../creators.types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import { getBrowseCategoriesWithCreators } from "../data";

interface CreatorDiscoveryProps {
  creators: Creator[];
  selectedCreatorIds: string[];
  onToggleSelect: (creator: Creator) => void;
  onQuickView: (creator: Creator) => void;
  onOpenCampaign?: () => void;
}

export function CreatorDiscovery({
  creators,
  selectedCreatorIds,
  onToggleSelect,
  onQuickView,
  onOpenCampaign,
}: CreatorDiscoveryProps) {
  // Track scroll containers for each category row
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollRow = (category: string, direction: "left" | "right") => {
    const el = rowRefs.current[category];
    if (el) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollTo({
        left: direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Group creators by category according to admin browse categories configuration
  const categorizedCreators = useMemo(() => {
    return getBrowseCategoriesWithCreators(creators);
  }, [creators]);

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header left title: slides from left on scroll down, reverses on scroll up
      gsap.fromTo(
        ".discovery-header-left",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".discovery-header-left",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Header right action pills: slides from right on scroll down, reverses on scroll up
      gsap.fromTo(
        ".discovery-header-right",
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".discovery-header-right",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Each category row animates smoothly when it scrolls into view, reverses on scroll up
      const rows = gsap.utils.toArray<HTMLElement>(".category-row");
      rows.forEach((row) => {
        const title = row.querySelector(".category-title-left");
        const arrows = row.querySelector(".category-arrows-right");
        const cards = row.querySelectorAll(".creator-card-item");

        if (title) {
          gsap.fromTo(
            title,
            { x: -45, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "bottom top",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        if (arrows) {
          gsap.fromTo(
            arrows,
            { x: 45, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "bottom top",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "bottom top",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="creator-directory" className="relative w-full bg-[#fcfcfb] text-[#141414] py-16 sm:py-20 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Simple Section Heading & Pill Actions (Search Icon Pill + Cart Pill) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-12 sm:mb-16">
          <div className="discovery-header-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              BROWSE & SELECT CREATORS
            </h2>
          </div>

          {/* Action Pills: Search Pill & Cart / Campaign Pill */}
          <div className="discovery-header-right flex items-center gap-2.5 shrink-0">
            {/* Search Pill: Links to Dedicated Search Page */}
            <Link
              href="/creators/search"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 bg-white hover:border-neutral-900 hover:text-neutral-950 text-neutral-700 shadow-2xs transition-all duration-300 cursor-pointer"
              title="Search Creators Network"
            >
              <Search className="w-4 h-4 shrink-0 text-neutral-600" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">Search</span>
            </Link>

            {/* Campaign Selection Cart Pill */}
            <button
              onClick={() => onOpenCampaign && onOpenCampaign()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xs transition-all duration-300 cursor-pointer ${
                selectedCreatorIds.length > 0
                  ? "bg-red-600 text-white border-red-600 shadow-md hover:bg-red-700"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:text-neutral-950"
              }`}
              title="View Selected Creators / Launch Campaign"
            >
              <ShoppingBag className={`w-4 h-4 shrink-0 ${selectedCreatorIds.length > 0 ? "text-white" : "text-neutral-600"}`} />
              <span className="text-xs font-semibold font-mono tracking-wider uppercase">
                Campaign
              </span>
              {selectedCreatorIds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-red-600 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
                  {selectedCreatorIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3 Categories / Vertical Rows */}
        <div className="space-y-12 sm:space-y-16">
          {categorizedCreators.map(({ category, creators: catList, totalCount }) => (
            <div key={category} className="category-row space-y-5">
              
              {/* Row Header: Category Name & Scroll Navigation Buttons */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                <div className="category-title-left flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-neutral-900">
                    {category}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-mono font-medium">
                    {catList.length} Creators
                  </span>
                </div>

                {/* Left / Right Scroll Arrows (Desktop) */}
                <div className="category-arrows-right flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRow(category, "left")}
                    aria-label={`Scroll ${category} left`}
                    className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRow(category, "right")}
                    aria-label={`Scroll ${category} right`}
                    className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontally Scrollable Row with Square Cards (Max 10 per row) */}
              <div
                ref={(el) => {
                  rowRefs.current[category] = el;
                }}
                className="flex items-center gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden no-scrollbar py-2 -mx-5 px-5 sm:-mx-8 sm:px-8"
              >
                {catList.length === 0 ? (
                  <div className="py-8 text-neutral-400 text-xs font-mono">
                    No creators currently in this category.
                  </div>
                ) : (
                  catList.map((creator) => {
                    const isSelected = selectedCreatorIds.includes(creator.id);

                    return (
                      <div
                        key={creator.id}
                        onClick={() => onQuickView(creator)}
                        className={`creator-card-item group relative shrink-0 w-[240px] sm:w-[270px] aspect-square rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 select-none ${
                          isSelected ? "ring-2 ring-red-500" : ""
                        }`}
                      >
                        {/* High-Resolution Portrait Visual */}
                        <Image
                          src={creator.featuredImage}
                          alt={creator.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out filter contrast-[1.06] group-hover:scale-105"
                          sizes="280px"
                        />

                        {/* Vignette Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/25 transition-all duration-300" />

                        {/* Top Corner Pill: Category */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium uppercase tracking-wider text-white">
                            {creator.category.split(" ")[0]}
                          </span>
                        </div>

                        {/* Top Right: Shortlist Select / View Action */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect(creator);
                          }}
                          className={`absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-600 text-white shadow-md ring-2 ring-white/30"
                              : "bg-white/20 hover:bg-white/30 text-white border border-white/20"
                          }`}
                          title={isSelected ? "Remove from campaign selection" : "Add to campaign selection"}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-white/80"}`} />
                        </div>

                        {/* Bottom Card Content: Name, Role, Reach, View CTA */}
                        <div className="absolute bottom-0 inset-x-0 p-4 text-white z-10">
                          {/* Verified Line */}
                          <div className="flex items-center gap-1.5 mb-1 text-[8.5px] font-mono text-red-400 font-semibold uppercase tracking-wider">
                            <CheckCircle2 className="w-2.5 h-2.5 text-red-400" />
                            <span>VERIFIED CREATOR</span>
                          </div>

                          {/* Name & Location */}
                          <h4 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-between">
                            <span className="truncate">{creator.name}</span>
                            <span className="text-[9.5px] font-mono font-normal text-white/60 shrink-0 ml-1">
                              {creator.location.split("•")[0]}
                            </span>
                          </h4>

                          {/* Role */}
                          <p className="text-[11px] text-neutral-300 font-light mt-0.5 truncate">
                            {creator.role}
                          </p>

                          {/* Reach Metric + Clean View CTA */}
                          <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between">
                            <div>
                              <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block">
                                REACH
                              </span>
                              <span className="text-xs font-bold text-white tracking-tight">
                                {creator.followersCount}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickView(creator);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-neutral-950 hover:bg-red-600 hover:text-white transition-all duration-300 text-[10.5px] font-semibold cursor-pointer shadow-sm group/btn"
                            >
                              <span>View</span>
                              <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* End of Row: View All Button (links to search page with category pre-filtered) */}
                {catList.length > 0 && (
                  <Link
                    href={`/creators/search?category=${encodeURIComponent(category)}`}
                    className="shrink-0 w-[180px] sm:w-[200px] aspect-square rounded-2xl border-2 border-dashed border-neutral-300 hover:border-red-500 bg-white hover:bg-neutral-50 flex flex-col items-center justify-center p-5 text-center transition-all duration-300 cursor-pointer group snap-start shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-red-600 text-neutral-700 group-hover:text-white flex items-center justify-center transition-colors mb-2 shadow-2xs">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-red-600 transition-colors">
                      VIEW ALL {category.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1">
                      {totalCount} Total Talent
                    </span>
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Global View All Button Below 3rd Row */}
        <div className="mt-14 sm:mt-18 text-center pt-8 border-t border-neutral-200">
          <Link
            href="/creators/search"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>VIEW ALL CREATORS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
