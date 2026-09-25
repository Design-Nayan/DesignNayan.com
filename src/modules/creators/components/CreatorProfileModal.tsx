"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Sparkles,
  Check,
  Plus,
  Play,
  Pause,
  Flame,
  Clock,
  Globe,
  Users,
  Award,
  ShieldCheck,
  ChevronRight,
  Eye,
  Briefcase,
  Layers,
  BarChart3,
  DollarSign,
  Tag,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Creator } from "../creators.types";

interface CreatorProfileModalProps {
  creator: Creator | null;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: (creator: Creator) => void;
  onBookDirect: (creator: Creator) => void;
}

type ModalTab = "overview" | "audience" | "packages" | "cases";

export function CreatorProfileModal({
  creator,
  isSelected,
  onClose,
  onToggleSelect,
  onBookDirect,
}: CreatorProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  // Close on Escape key and prevent background scroll while open
  useEffect(() => {
    if (!creator) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [creator, onClose]);

  // Reset tab to overview whenever a new creator is opened
  useEffect(() => {
    if (creator) {
      setActiveTab("overview");
      setIsPlayingDemo(false);
    }
  }, [creator?.id]);

  if (!creator) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${creator.name} Creator Profile`}
      onClick={onClose}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 md:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="relative w-full max-w-4xl lg:max-w-5xl bg-white text-neutral-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 my-auto h-[92vh] max-h-[92vh]"
      >
        {/* Modal Top Header Bar - Always visible, never covered by navbar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-neutral-100 bg-[#fafafa] shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-white" />
              Verified Creator
            </span>

            <span className="text-[11px] font-mono text-neutral-500 font-medium">
              ID: {creator.id.toUpperCase()}
            </span>

            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-200/70 text-neutral-700">
              {creator.category}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close creator preview modal"
            title="Close (Esc)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer border border-neutral-200/80 shadow-2xs"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Scrollable Content Body with smooth native scrolling & Lenis isolation */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6 flex-1 min-h-0"
        >
          {/* Main Top Grid: Left Media & Quick Specs | Right Metrics & Tabbed Admin-Ready Data */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Creator Media & Fast Specs (Admin-Friendly Modular Unit) */}
            <div className="md:col-span-4 space-y-4">
              {/* Media Card with Showreel Toggle */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 group shadow-md border border-neutral-200">
                <Image
                  src={creator.featuredImage}
                  alt={creator.name}
                  fill
                  className="object-cover object-top filter contrast-[1.05] transition-transform duration-500 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Showreel Interactive Play/Pause Button */}
                <div
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <div className="w-13 h-13 rounded-full bg-red-600 hover:scale-110 active:scale-95 text-white flex items-center justify-center shadow-xl transition-all">
                    {isPlayingDemo ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </div>
                  <span className="mt-2.5 text-[11px] font-semibold text-white tracking-wide bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {isPlayingDemo ? "Pause Reel Preview" : "Play Verified Reel"}
                  </span>
                </div>

                {/* Simulated Reel Banner */}
                {isPlayingDemo && (
                  <div className="absolute top-3 left-3 right-3 bg-red-600/95 backdrop-blur-xs text-white text-[10px] font-medium py-1 px-2.5 rounded-lg shadow-sm flex items-center justify-between">
                    <span>4K High-Retention Reel</span>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                )}

                {/* Creator Handle Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="font-mono text-xs text-neutral-300 font-medium">
                    {creator.handle}
                  </span>
                </div>
              </div>

              {/* Fast Snapshot Specs (Matches CMS / Admin Fields) */}
              <div className="bg-[#fafafa] border border-neutral-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                    Starting Rate
                  </span>
                  <span className="font-bold text-neutral-900">{creator.startingRate}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    Base Location
                  </span>
                  <span className="font-semibold text-neutral-800 truncate max-w-[140px] text-right">
                    {creator.location.split("•")[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Turnaround SLA
                  </span>
                  <span className="font-semibold text-neutral-800">{creator.turnaroundDays} Days</span>
                </div>
              </div>
            </div>

            {/* Right Column: Name, KPIs & Admin-Organized Tabbed Views */}
            <div className="md:col-span-8 space-y-5">
              
              {/* Creator Heading & Tier Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                    {creator.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mt-0.5">
                    {creator.role}
                  </p>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] font-mono font-medium">
                  {creator.tier}
                </span>
              </div>

              {/* 4 Core KPIs: Concise, Clean, Zero Walls of Text */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-neutral-500 font-medium">
                    <Users className="w-3 h-3 text-neutral-400" />
                    <span>Reach</span>
                  </div>
                  <span className="block text-lg font-bold text-neutral-900 mt-1">
                    {creator.followersCount}
                  </span>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-neutral-500 font-medium">
                    <Eye className="w-3 h-3 text-neutral-400" />
                    <span>Avg Views</span>
                  </div>
                  <span className="block text-lg font-bold text-neutral-900 mt-1">
                    {creator.avgViews}
                  </span>
                </div>

                <div className="bg-red-50/60 border border-red-200/80 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-red-700 font-medium">
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>Engagement</span>
                  </div>
                  <span className="block text-lg font-bold text-red-600 mt-1">
                    {creator.engagementRate}%
                  </span>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-neutral-500 font-medium">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Speed</span>
                  </div>
                  <span className="block text-lg font-bold text-neutral-900 mt-1">
                    {creator.turnaroundDays}d
                  </span>
                </div>
              </div>

              {/* Modular Navigation Tabs (Maps directly to future Admin Panel tabs) */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeTab === "overview"
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  Overview & Specs
                </button>
                <button
                  onClick={() => setActiveTab("audience")}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeTab === "audience"
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  Audience & Insights
                </button>
                <button
                  onClick={() => setActiveTab("packages")}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeTab === "packages"
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  Packages & Rates
                </button>
                <button
                  onClick={() => setActiveTab("cases")}
                  className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeTab === "cases"
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  Case Studies ({creator.caseStudies.length})
                </button>
              </div>

              {/* Tab Contents: Clean Structured Data Modules */}
              <div className="min-h-[220px]">
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Bio Statement */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                        Creative Bio & Style
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal bg-[#fafafa] p-3 rounded-xl border border-neutral-200/70">
                        {creator.bio}
                      </p>
                    </div>

                    {/* Production Formats */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1.5">
                        Deliverable Formats
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {creator.formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="px-2.5 py-1 rounded-lg bg-neutral-50 text-neutral-800 text-[11px] font-medium border border-neutral-200"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Past Verified Brands */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1.5 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        Verified Brand Collabs
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {creator.pastBrands.map((brand) => (
                          <span
                            key={brand}
                            className="px-2.5 py-1 rounded-lg bg-white text-neutral-800 text-[11px] font-semibold border border-neutral-200 shadow-2xs"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    {creator.tags && creator.tags.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1.5">
                          Style Tags
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Audience & Insights Tab */}
                {activeTab === "audience" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Demographics Overview Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#fafafa] p-3 rounded-xl border border-neutral-200/80">
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                          Primary Age Group
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {creator.demographics.ageGroup}
                        </span>
                      </div>

                      <div className="bg-[#fafafa] p-3 rounded-xl border border-neutral-200/80">
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                          Gender Ratio
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {creator.demographics.genderSplit}
                        </span>
                      </div>
                    </div>

                    {/* Top Locations Progress Bars */}
                    <div className="bg-[#fafafa] p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                        Top Audience Geographies
                      </span>

                      <div className="space-y-2 text-xs">
                        {creator.demographics.topLocations.map((loc) => (
                          <div key={loc.name} className="space-y-1">
                            <div className="flex items-center justify-between text-neutral-700">
                              <span className="font-medium">{loc.name}</span>
                              <span className="font-mono font-bold text-neutral-900">
                                {loc.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-600 rounded-full transition-all duration-500"
                                style={{ width: `${loc.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Packages & Rates Tab */}
                {activeTab === "packages" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                    {creator.packages.map((pkg) => (
                      <div
                        key={pkg.title}
                        className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-red-400 transition-all flex flex-col justify-between space-y-2 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-neutral-900">{pkg.title}</h5>
                            <span className="text-xs font-extrabold text-red-600 shrink-0">
                              {pkg.priceEstimate}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
                            {pkg.deliverables}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            Turnaround:
                          </span>
                          <span className="font-semibold text-neutral-800">{pkg.turnaround}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Case Studies Tab */}
                {activeTab === "cases" && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    {creator.caseStudies.map((cs) => (
                      <div
                        key={cs.brand}
                        className="p-3 bg-[#fafafa] rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900">{cs.brand}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                            <span className="text-xs text-neutral-600 font-medium">
                              {cs.campaign}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 font-mono shrink-0">
                          {cs.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Fixed Actions Bar */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800 shrink-0">
          <div className="text-left w-full sm:w-auto">
            <span className="block text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
              AGENCY DIRECTED • COMMERCIAL IP RIGHTS CLEARANCE
            </span>
            <span className="text-xs text-neutral-300 font-medium">
              Zero escrow risk • 48h turnaround SLA
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Toggle Add to Campaign Button */}
            <button
              onClick={() => onToggleSelect(creator)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Campaign</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Campaign</span>
                </>
              )}
            </button>

            {/* Direct Booking Modal Opener */}
            <button
              onClick={() => {
                onBookDirect(creator);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 active:scale-95 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Book Creator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
