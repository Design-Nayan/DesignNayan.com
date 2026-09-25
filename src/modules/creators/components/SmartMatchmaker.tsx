"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, RotateCcw, ArrowUpRight, Sparkles, Check, Plus, ShoppingBag } from "lucide-react";
import { Creator } from "../creators.types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import {
  MATCHMAKER_OBJECTIVES,
  MATCHMAKER_FORMATS,
  MATCHMAKER_BUDGETS,
  findMatchmakerCreators,
} from "../data";

interface SmartMatchmakerProps {
  creators: Creator[];
  selectedCreatorIds?: string[];
  onToggleSelect?: (creator: Creator) => void;
  onSelectCreator: (creator: Creator) => void;
  onAddRoster: (creators: Creator[]) => void;
}

const OBJECTIVES = MATCHMAKER_OBJECTIVES.map((o) => o.label);
const FORMATS = MATCHMAKER_FORMATS.map((f) => f.label);
const BUDGETS = MATCHMAKER_BUDGETS.map((b) => b.label);

export function SmartMatchmaker({
  creators,
  selectedCreatorIds = [],
  onToggleSelect,
  onSelectCreator,
  onAddRoster,
}: SmartMatchmakerProps) {
  const [goal, setGoal] = useState<string>("Viral Brand Growth");
  const [format, setFormat] = useState<string>("Short-Form Reels");
  const [budget, setBudget] = useState<string>("$3k - $8k Campaign");

  // Derive top 3 creator matches based on selections using the admin-customizable matching logic
  const matchedCreators = React.useMemo(() => {
    return findMatchmakerCreators({ goal, format, budget }, creators);
  }, [creators, goal, format, budget]);

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Heading on the left comes from left on scroll down, reverses on scroll up
      gsap.fromTo(
        ".matchmaker-heading-left",
        { x: -55, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".matchmaker-heading-left",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Reset button on the right comes from right on scroll down, reverses on scroll up
      gsap.fromTo(
        ".matchmaker-btn-right",
        { x: 55, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".matchmaker-btn-right",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Console box glides up smoothly on scroll down, reverses on scroll up
      gsap.fromTo(
        ".matchmaker-console",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".matchmaker-console",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // 3 step selectors reveal with stagger on scroll down, reverse on scroll up
      gsap.fromTo(
        ".selector-step",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".matchmaker-console",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#fcfcfb] text-[#141414] py-16 sm:py-20 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Simple Section Heading: Only the Heading + Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="matchmaker-heading-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              FIND YOUR BRAND&apos;S PERFECT CREATOR
            </h2>
          </div>

          <div className="matchmaker-btn-right">
            <button
              onClick={() => {
                setGoal("Viral Brand Growth");
                setFormat("Short-Form Reels");
                setBudget("$3k - $8k Campaign");
              }}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Criteria</span>
            </button>
          </div>
        </div>

        {/* Unified Matchmaker Console (Selectors + Instant Match Output Together in One Cohesive Unit) */}
        <div className="matchmaker-console bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-neutral-200/90 shadow-sm space-y-6 sm:space-y-10">
          
          {/* Top Half: 3 Step Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
            
            {/* Step 1: Campaign Objective */}
            <div className="selector-step bg-neutral-50/80 rounded-2xl p-3.5 sm:p-5 border border-neutral-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 pb-2 border-b border-neutral-200/60">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                    01. Objective
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                </div>

                <div className="flex flex-wrap md:flex-col gap-1.5">
                  {OBJECTIVES.map((item) => {
                    const isSelected = goal === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setGoal(item)}
                        className={`flex-1 min-w-[135px] md:min-w-0 md:w-full text-left px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-neutral-950 text-white font-semibold shadow-xs ring-1 ring-neutral-800"
                            : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/70"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Primary Format */}
            <div className="selector-step bg-neutral-50/80 rounded-2xl p-3.5 sm:p-5 border border-neutral-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 pb-2 border-b border-neutral-200/60">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                    02. Format
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                </div>

                <div className="flex flex-wrap md:flex-col gap-1.5">
                  {FORMATS.map((item) => {
                    const isSelected = format === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setFormat(item)}
                        className={`flex-1 min-w-[135px] md:min-w-0 md:w-full text-left px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-neutral-950 text-white font-semibold shadow-xs ring-1 ring-neutral-800"
                            : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/70"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Target Campaign Budget */}
            <div className="selector-step bg-neutral-50/80 rounded-2xl p-3.5 sm:p-5 border border-neutral-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 pb-2 border-b border-neutral-200/60">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                    03. Target Budget
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                </div>

                <div className="flex flex-wrap md:flex-col gap-1.5">
                  {BUDGETS.map((item) => {
                    const isSelected = budget === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setBudget(item)}
                        className={`flex-1 min-w-[135px] md:min-w-0 md:w-full text-left px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-neutral-950 text-white font-semibold shadow-xs ring-1 ring-neutral-800"
                            : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/70"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Half: Instant Match Output Integrated Directly into the Console */}
          <div className="pt-6 sm:pt-8 border-t border-neutral-200/80">
            {(() => {
              const allMatchedSelected = matchedCreators.length > 0 && matchedCreators.every((c) => selectedCreatorIds.includes(c.id));
              const selectedInMatchCount = matchedCreators.filter((c) => selectedCreatorIds.includes(c.id)).length;

              const handleBatchToggleAll = () => {
                if (allMatchedSelected) {
                  if (onToggleSelect) {
                    matchedCreators.forEach((c) => {
                      if (selectedCreatorIds.includes(c.id)) {
                        onToggleSelect(c);
                      }
                    });
                  }
                } else {
                  onAddRoster(matchedCreators);
                }
              };

              return (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
                        INSTANT MATCH: 3 RECOMMENDED CREATORS
                      </h4>
                      {selectedInMatchCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 font-mono text-[10px] font-semibold">
                          {selectedInMatchCount} of 3 Selected
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleBatchToggleAll}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer ${
                        allMatchedSelected
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-neutral-950 hover:bg-red-600 text-white"
                      }`}
                    >
                      <span>
                        {allMatchedSelected
                          ? "All 3 Added to Campaign"
                          : selectedInMatchCount > 0
                          ? `Add Remaining (${selectedInMatchCount}/3 Selected)`
                          : "Add All 3 to Campaign Selection"}
                      </span>
                      {allMatchedSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* 3 Matched Square Cards with Individual Selection Freedom (Horizontal swipeable on mobile) */}
                  <div className="matched-cards-row flex sm:grid sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
                    {matchedCreators.map((creator) => {
                      const isSelected = selectedCreatorIds.includes(creator.id);

                      return (
                        <div
                          key={creator.id}
                          onClick={() => onSelectCreator(creator)}
                          className={`matched-creator-card group relative shrink-0 w-[240px] sm:w-auto aspect-square rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 select-none ${
                            isSelected ? "ring-2 ring-red-500 scale-[1.01]" : ""
                          }`}
                        >
                          {/* High-Resolution Portrait Visual */}
                          <Image
                            src={creator.featuredImage}
                            alt={creator.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out filter contrast-[1.06] group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />

                          {/* Vignette Overlay for Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/25 transition-all duration-300" />

                          {/* Top Corner Pill: Category */}
                          <div className="absolute top-3.5 left-3.5 z-10">
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium uppercase tracking-wider text-white">
                              {creator.category.split(" ")[0]}
                            </span>
                          </div>

                          {/* Top Right: Individual Shortlist/Select Toggle Action Button */}
                          {onToggleSelect && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect(creator);
                              }}
                              className={`absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-xs ${
                                isSelected
                                  ? "bg-red-600 text-white shadow-md scale-105"
                                  : "bg-black/50 text-white/80 border border-white/20 hover:bg-white hover:text-neutral-950"
                              }`}
                              title={isSelected ? "Remove from campaign" : "Add creator to campaign"}
                            >
                              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Bottom Card Content: Name, Role, Reach, View CTA */}
                          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10">
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
                                  AUDIENCE REACH
                                </span>
                                <span className="text-xs font-bold text-white tracking-tight">
                                  {creator.followersCount}
                                </span>
                              </div>

                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-neutral-950 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 text-[10.5px] font-semibold cursor-pointer shadow-sm">
                                <span>View</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

      </div>
    </section>
  );
}
