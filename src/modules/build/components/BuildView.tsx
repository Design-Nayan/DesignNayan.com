"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  HardHat, 
  Truck, 
  Calculator, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  SlidersHorizontal, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Sparkles,
  Award,
  Compass
} from "lucide-react";
import dynamic from "next/dynamic";
import { buildServicesData, materialCategoriesData, buildWorkflowSteps } from "../data/build.data";

const BuildHeroCanvas = dynamic(
  () => import("./BuildHeroCanvas").then((mod) => mod.BuildHeroCanvas),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
  }
);

export function BuildView() {
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // 1. ROTATING TYPING ANIMATION FOR BUILD HERO
  // ==========================================
  const typingWords = useMemo(
    () => [
      "Civil RCC Execution",
      "Wholesale Materials",
      "Precision Estimation",
      "Site Project Management"
    ],
    []
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typingWords[wordIndex];
    const typingSpeed = isDeleting ? 30 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.slice(0, displayedText.length + 1);
        setDisplayedText(nextText);
        if (nextText.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        const nextText = currentWord.slice(0, displayedText.length - 1);
        setDisplayedText(nextText);
        if (nextText.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % typingWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex, typingWords]);

  // ==========================================
  // 2. ROTATING SEARCH PLACEHOLDER TEXT
  // ==========================================
  const rotatingServices = useMemo(
    () => [
      "RCC Civil Construction",
      "TMT Steel & Tata Tiscon",
      "UltraTech Cement",
      "BOQ Cost Estimation",
      "Site Engineer Audits",
      "Foundation Soil Test"
    ],
    []
  );
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingServices.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [rotatingServices]);

  // Dynamic search filtering
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return buildServicesData;

    return buildServicesData.filter((service) => {
      return (
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.badge.toLowerCase().includes(q) ||
        service.deliverables.some((d) => d.toLowerCase().includes(q)) ||
        service.specs.some((s) => s.value.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Horizontal scroll ref
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getServiceIcon = (iconName: string, className = "w-5 h-5 text-amber-500 stroke-[1.75]") => {
    const iconProps = { className };
    switch (iconName) {
      case "HardHat":
        return <HardHat {...iconProps} />;
      case "Truck":
        return <Truck {...iconProps} />;
      case "Calculator":
        return <Calculator {...iconProps} />;
      case "Briefcase":
        return <Briefcase {...iconProps} />;
      default:
        return <HardHat {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* ========================================================================= */}
      {/* 1. BUILD HERO: High-Tech Civil & Engineering Single Frame                 */}
      {/* ========================================================================= */}
      <section className="relative bg-neutral-950 text-white h-[calc(100svh-64px-64px)] md:h-[calc(100svh-80px)] lg:h-auto lg:min-h-0 lg:pt-24 lg:pb-28 px-4 sm:px-6 overflow-hidden flex flex-col justify-between items-center select-none">
        {/* Live Interactive 3D Parametric Structural Engineering Canvas */}
        <BuildHeroCanvas />

        {/* Cinematic Atmospheric Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950/95 pointer-events-none z-[1]" />
        <div className="absolute top-0 right-1/4 w-[280px] sm:w-[450px] lg:w-[500px] h-[280px] sm:h-[450px] lg:h-[500px] bg-amber-500/10 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none z-[1]" />
        <div className="absolute bottom-0 left-1/4 w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none z-[1]" />

        {/* Main Hero Frame Content: Vertically Centered Dynamically */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-2 sm:space-y-4 lg:space-y-6 my-auto py-2 sm:py-6 lg:py-0 w-full flex flex-col justify-center items-center">
          
          {/* Construction Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[8.5px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-amber-300">
              Civil Engineering & Material Supply
            </span>
          </div>

          {/* BUILD Heading (Clean, Bold, Clipped-edge safe) */}
          <div className="px-2 sm:px-8 overflow-visible flex justify-center items-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-none select-none px-1 py-0.5">
              <span className="inline-block pr-1 sm:pr-2 bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-sm">
                BUILD
              </span>
            </h1>
          </div>

          {/* Typewriter Dynamic Cycling Subtitle */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight min-h-[30px] sm:min-h-[44px] lg:min-h-[56px] px-2">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 bg-clip-text text-transparent">
              {displayedText}
            </span>
            <span className="inline-block w-1 sm:w-1.5 h-5 sm:h-8 lg:h-11 bg-amber-500 animate-pulse rounded-full" />
          </div>

          <p className="text-neutral-400 text-[11px] sm:text-sm md:text-base max-w-[280px] sm:max-w-md lg:max-w-lg mx-auto leading-snug sm:leading-relaxed font-normal">
            Nayan Constructions RCC civil execution, factory-direct wholesale materials, and seismic-resistant construction across Assam.
          </p>

          {/* Dynamic Search Box with Rotating Placeholder */}
          <div className="pt-1 sm:pt-3 max-w-[280px] sm:max-w-sm md:max-w-md mx-auto w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 sm:left-4 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search civil services (e.g. ${rotatingServices[placeholderIndex]})...`}
                className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl bg-neutral-900/90 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-[11px] sm:text-sm text-white placeholder:text-neutral-500 transition-all outline-none shadow-xl backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 sm:right-3 p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet App Visual Hint: Scroll Down Prompt to Enter Catalog */}
        <div className="relative z-10 pb-2 sm:pb-4 lg:hidden flex flex-col items-center gap-1 text-neutral-400 shrink-0">
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-neutral-400 font-mono">
            Swipe up to explore
          </span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-neutral-700/80 bg-neutral-900/60 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-3 h-3 text-amber-500" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BUILD SERVICES: Horizontally Scrollable Sleek Cards                     */}
      {/* ========================================================================= */}
      <div id="build-services" className="py-8 sm:py-14 lg:py-20 space-y-12 sm:space-y-20 lg:space-y-24 max-w-7xl mx-auto px-3.5 sm:px-6">

        {/* Global Search Results Alert if user entered a search query */}
        {searchQuery && (
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="text-xs sm:text-sm font-semibold text-neutral-700">
              Found <span className="font-bold text-neutral-950 font-mono">{filteredServices.length}</span> services matching &quot;{searchQuery}&quot;
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline uppercase tracking-wider cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {filteredServices.length === 0 && searchQuery ? (
          <div className="text-center py-16 sm:py-20 bg-neutral-50 rounded-2xl sm:rounded-3xl border border-neutral-200 space-y-4">
            <SlidersHorizontal className="w-9 h-9 sm:w-10 sm:h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">No matching build services found</h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              Try searching with terms like &quot;Construction&quot;, &quot;Steel&quot;, &quot;Materials&quot;, &quot;BOQ&quot;, or &quot;Site&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <section className="relative space-y-4 sm:space-y-7 lg:space-y-8">
            {/* Section Header: Pure, clean heading with count and scroll controls */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 tracking-tight">
                  Build & Construction
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 font-mono">
                  {filteredServices.length}
                </span>
              </div>

              {/* Desktop / Tablet Scroll Navigation Controls */}
              <div className="hidden sm:flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => scroll("left")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all active:scale-95 shadow-xs cursor-pointer"
                  aria-label="Scroll left"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-800" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all active:scale-95 shadow-xs cursor-pointer"
                  aria-label="Scroll right"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-800" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track: Sleek & Compact Construction Cards */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 lg:gap-4.5 overflow-x-auto no-scrollbar snap-x snap-mandatory overscroll-x-contain -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0 py-1.5 sm:py-2 scroll-pl-3.5 sm:scroll-pl-6"
            >
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="shrink-0 w-[235px] sm:w-[270px] lg:w-[295px] snap-start rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 hover:border-amber-500/50 hover:shadow-lg transition-[transform,box-shadow,border-color] duration-200 ease-out flex flex-col justify-between group overflow-hidden shadow-xs hover:-translate-y-1 transform-gpu crisp-transform"
                >
                  {/* Card Body */}
                  <div className="p-3.5 sm:p-4 lg:p-5 space-y-2.5 sm:space-y-3">
                    {/* Top: Icon + Badge */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        {getServiceIcon(service.iconName, "w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 group-hover:text-white stroke-[2] transition-colors")}
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[8.5px] sm:text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 font-mono tracking-wider truncate max-w-[140px]">
                        {service.badge}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-neutral-950 group-hover:text-amber-600 transition-colors leading-tight line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-[10.5px] sm:text-[11px] lg:text-xs text-neutral-500 leading-relaxed font-normal line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Deliverables (Clean, compact 2 items) */}
                    <ul className="pt-2 border-t border-neutral-100 space-y-1">
                      {service.deliverables.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10.5px] sm:text-[11px] text-neutral-700 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price & Turnaround Summary */}
                    <div className="pt-1.5 flex items-center justify-between text-[9.5px] sm:text-[10px] lg:text-[11px] text-neutral-500 border-t border-neutral-100/80 font-mono">
                      <span className="font-extrabold text-neutral-900 truncate pr-1">
                        {service.priceGuide}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-neutral-600 shrink-0">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
                        {service.turnaround}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Quick Actions */}
                  <div className="p-2.5 sm:p-3 lg:p-3.5 bg-neutral-50/80 border-t border-neutral-100 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <a
                      href={`https://wa.me/918472934031?text=${encodeURIComponent(
                        `Hi Design Nayan Build! I want to inquire about *${service.title}*.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                    >
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span>WhatsApp</span>
                    </a>

                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MATERIALS SECTION: Direct Wholesale Material Sourcing                  */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-20 bg-neutral-900 text-white px-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="pb-2 border-b border-neutral-800">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase font-mono">
                FACTORY-DIRECT BULK LOGISTICS
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Wholesale Building Materials
              </h2>
              <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-400 leading-relaxed font-normal">
                Procure certified TMT steel, Grade-53 cement, tiles, and fixtures directly from authorized mills at wholesale contractor pricing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {materialCategoriesData.map((mat, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[8.5px] sm:text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                      {mat.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {mat.category}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                    {mat.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-850">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    Partner Brands:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mat.brands.map((brand) => (
                      <span
                        key={brand}
                        className="text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-xs">
            <span>On-site truckload delivery active in Guwahati, Tezpur, Jorhat, Dibrugarh, Silchar & Shillong.</span>
            <span className="text-amber-400 font-mono font-bold">GST Invoicing & Lab Certificates Provided</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW WE WORK: 4-Step Civil Engineering Workflow                         */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
            <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-amber-600 uppercase font-mono">
              HOW WE WORK
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-950 tracking-tight">
              The Nayan Constructions Workflow
            </h2>
            <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-600 leading-relaxed">
              Every building is constructed through rigorous Bureau of Indian Standards (BIS) engineering specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {buildWorkflowSteps.map((p) => (
              <div
                key={p.step}
                className="p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2 sm:space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-extrabold">
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-base sm:text-lg font-extrabold text-amber-600 font-mono">{p.step}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-950">{p.title}</h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CONTACT & SITE INSPECTION CTA                                          */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-12 lg:py-16 px-3.5 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-3xl bg-neutral-950 text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 sm:space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.2em] text-amber-400 uppercase font-mono block">
              FREE PLOT EVALUATION & BOQ
            </span>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Planning to Build a House or Commercial Project?
            </h3>
            <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-400 leading-relaxed">
              Schedule a site visit with our senior structural engineers in Guwahati or get a free Bill of Quantities (BOQ) cost estimate.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/918472934031?text=Hi%20Design%20Nayan%20Build!%20I%20would%20like%20to%20book%20a%20free%20site%20inspection%20and%20civil%20estimate."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Civil Desk</span>
            </a>

            <Link
              href="/contact?service=Construction"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>SCHEDULE SITE VISIT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

