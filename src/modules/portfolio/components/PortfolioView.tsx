"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  MapPin, 
  X,
  Sparkles,
  LayoutGrid,
  Layers,
  Activity,
  Compass,
  Building2,
  Code2
} from "lucide-react";
import { projectsData } from "@/modules/projects/data/projects.data";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { ProjectModal } from "@/modules/projects/components/ProjectModal";
import { InteractiveDotGrid } from "./InteractiveDotGrid";
import { PortfolioMotionColumns } from "./PortfolioMotionColumns";
import { cn } from "@/lib/utils";

// Batched animated metric counter hook for ultra-smooth luxury numbers with a single RAF loop
function useAnimatedMetrics(
  targets: { total: number; designAndWeb: number; buildAndSpatial: number },
  duration = 1200
) {
  const [counts, setCounts] = useState({ total: 0, designAndWeb: 0, buildAndSpatial: 0 });

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        total: Math.floor(easeOut * targets.total),
        designAndWeb: Math.floor(easeOut * targets.designAndWeb),
        buildAndSpatial: Math.floor(easeOut * targets.buildAndSpatial),
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCounts(targets);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targets.total, targets.designAndWeb, targets.buildAndSpatial, duration]);

  return counts;
}

// Services for the animated typewriter placeholder cycling through all services
const typingServices = [
  "3D Rendering",
  "Floor Planning",
  "Civil Construction",
  "Interior Designing",
  "Exterior Designing",
  "Nayan Constructions",
  "Building Materials",
  "BOQ Estimation",
  "Brand Identity",
  "Website Development",
  "Digital Marketing",
  "Commercial Architecture",
  "Luxury Residence"
];

function useTypewriter(words: string[], typingSpeed = 75, deletingSpeed = 35, pauseTime = 1400) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

// Service synonyms dictionary for dynamic matching without exact keywords
const serviceSynonyms: Record<string, string[]> = {
  "3d": ["rendering", "cgi", "visualization", "walkthrough", "render", "animation", "model"],
  "render": ["3d", "rendering", "cgi", "walkthrough", "visualization"],
  "rendering": ["3d", "render", "cgi", "walkthrough", "visualization"],
  "floor": ["plan", "planning", "layout", "blueprint", "vastu", "drawing", "section"],
  "planning": ["floor", "plan", "blueprint", "layout", "architectural", "vastu"],
  "plan": ["floor", "planning", "blueprint", "layout", "vastu"],
  "construction": ["nayan", "civil", "build", "turnkey", "contractor", "structural", "materials", "plaza", "rcc", "foundation"],
  "civil": ["construction", "nayan", "build", "turnkey", "structural", "rcc", "contractor"],
  "nayan": ["constructions", "civil", "turnkey", "build", "plaza"],
  "turnkey": ["construction", "nayan", "build", "civil", "handover"],
  "interior": ["decor", "living", "furniture", "space", "home", "renovation", "commercial", "room", "office"],
  "exterior": ["elevation", "facade", "villa", "residence", "architecture", "resort"],
  "architecture": ["villa", "residence", "building", "floor", "plan", "blueprint", "structural", "elevation"],
  "branding": ["brand", "logo", "identity", "creative", "packaging", "typography", "graphic"],
  "brand": ["branding", "logo", "identity", "creative", "packaging"],
  "marketing": ["digital", "ads", "social", "media", "campaign", "growth", "video", "content"],
  "digital": ["marketing", "website", "web", "platform", "software", "development", "ecommerce"],
  "web": ["development", "website", "platform", "software", "code", "app", "ecommerce", "system", "tech"],
  "website": ["web", "development", "platform", "ecommerce", "software", "code"],
  "materials": ["wholesale", "steel", "cement", "estimation", "boq", "rate", "cost", "tmt"],
  "estimation": ["boq", "cost", "budget", "quotes", "pricing", "calculation", "materials"],
  "boq": ["estimation", "materials", "cost", "budget", "calculation"]
};

function matchesFuzzyToken(target: string, token: string): boolean {
  const normTarget = target.toLowerCase();
  const normToken = token.toLowerCase();

  // Direct substring match
  if (normTarget.includes(normToken)) return true;

  // Prefix / stem match for words >= 3 characters
  if (normToken.length >= 3) {
    const words = normTarget.split(/[\s,.-]+/);
    for (const w of words) {
      if (w.startsWith(normToken) || normToken.startsWith(w)) return true;
      // Single typo tolerance for tokens >= 4 characters
      if (w.length >= 4 && Math.abs(w.length - normToken.length) <= 1) {
        let diffs = 0;
        const minLen = Math.min(w.length, normToken.length);
        for (let i = 0; i < minLen; i++) {
          if (w[i] !== normToken[i]) diffs++;
        }
        if (diffs <= 1) return true;
      }
    }
  }

  // Check synonym matching
  for (const [key, syns] of Object.entries(serviceSynonyms)) {
    if (key.includes(normToken) || normToken.includes(key)) {
      if (syns.some((syn) => normTarget.includes(syn))) return true;
    }
    if (syns.some((syn) => syn.includes(normToken) || normToken.includes(syn))) {
      if (normTarget.includes(key) || syns.some((syn) => normTarget.includes(syn))) return true;
    }
  }

  return false;
}

export function PortfolioView() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewMode, setViewMode] = useState<"motion" | "grid">("motion");

  // Dynamically derive stats directly from uploaded portfolio projects
  const metricTargets = useMemo(() => {
    const total = projectsData.length;

    // Design & Web (Digital Web Development, E-Commerce, 3D CGI Rendering, Brand Identity, Marketing)
    const designAndWeb = projectsData.filter((p) =>
      /BRANDING|DEVELOPMENT|RENDERING|MARKETING|DESIGN/i.test(p.categoryTag)
    ).length;

    // Build & Spatial (Architecture, Civil Construction, Commercial, Interior, Floor Planning)
    const buildAndSpatial = projectsData.filter((p) =>
      /ARCHITECTURE|INTERIOR|COMMERCIAL|CONSTRUCTION|FLOOR/i.test(p.categoryTag)
    ).length;

    return { total, designAndWeb, buildAndSpatial };
  }, []);
  const metrics = useAnimatedMetrics(metricTargets, 1200);

  // Dynamic discipline balance percentages computed directly from the live portfolio data
  const digitalPercent = metricTargets.total > 0 ? Math.round((metricTargets.designAndWeb / metricTargets.total) * 100) : 50;
  const spatialPercent = 100 - digitalPercent;

  // Typewriter placeholder hook
  const typedService = useTypewriter(typingServices, 70, 35, 1500);

  // Dynamic fuzzy search without requiring exact keywords
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projectsData;

    const tokens = q.split(/\s+/).filter(Boolean);

    return projectsData.filter((project) => {
      const searchableContent = [
        project.title,
        project.location,
        project.categoryTag,
        project.year,
        project.client,
        project.area,
        project.overview,
        ...project.highlights,
      ].join(" ");

      return tokens.every((token) => matchesFuzzyToken(searchableContent, token));
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 pb-24 font-sans select-none selection:bg-neutral-900 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. OUT-OF-THIS-WORLD ARCHITECTURAL MONOLITH HERO                          */}
      {/* ========================================================================= */}
      <section 
        ref={heroSectionRef}
        className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        
        {/* Ambient Chromatic Prismatic Light Layer */}
        <div className="absolute top-0 right-1/4 w-[540px] h-[360px] bg-gradient-to-br from-rose-500/6 via-amber-500/4 to-transparent blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-16 left-10 w-[420px] h-[280px] bg-gradient-to-tr from-sky-500/5 via-indigo-500/3 to-transparent blur-[110px] rounded-full pointer-events-none" />

        {/* Interactive Architectural Canvas Grid with Dynamic Mouse & Touch Physics */}
        <InteractiveDotGrid containerRef={heroSectionRef} dotSpacing={28} />

        {/* Top Architectural Telemetry Ribbon: Island Navigation & Live Geolocation */}
        <div className="relative z-10 flex items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-neutral-200/80">
          
          {/* Island "Button-in-Button" Navigation Pill */}
          <Link
            href="/"
            className="group inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-950 text-white border border-neutral-800 text-xs font-mono transition-all duration-300 shadow-sm cursor-pointer select-none active:scale-[0.98]"
          >
            <span className="tracking-widest text-[11px] text-neutral-300 group-hover:text-white transition-colors">
              HOME
            </span>
            <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-neutral-950 flex items-center justify-center transition-all duration-300 shrink-0">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </span>
          </Link>

          {/* Minimalist Live Coordinates & Status Telemetry */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400 select-none">
            <span className="hidden sm:inline-flex items-center gap-2 tracking-wider text-neutral-500">
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>26.14° N, 91.73° E &bull; GUWAHATI HQ</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">/</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10.5px] font-semibold tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE ARCHIVE &bull; {projectsData.length} COMMISSIONS
            </span>
          </div>
        </div>

        {/* Main Hero Grid: Monumental Editorial Statement + Sculptural Telemetry Monolith */}
        <div className="relative z-10 pt-8 sm:pt-12 lg:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Monumental Editorial Statement (Clean, Architectural, Minimalist) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">

            {/* Monumental Editorial Masterpiece Heading */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[82px] font-extralight tracking-[-0.045em] text-neutral-950 leading-[0.94] select-none">
              All our <span className="font-semibold text-neutral-950 tracking-tight">works</span>
              <br />
              <span className="font-serif italic font-normal text-neutral-400 mr-2 sm:mr-3">&amp;</span>
              <span className="relative inline-block font-semibold text-neutral-950 tracking-tight">
                services
                <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 ml-1.5 sm:ml-2 align-baseline animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
              </span>
            </h1>

            {/* Concise Multidisciplinary Paragraph */}
            <p className="text-base sm:text-lg lg:text-[18px] text-neutral-600 font-light leading-relaxed max-w-xl">
              A multidisciplinary spatial &amp; digital atelier. We bridge the tangible and virtual&mdash;engineering luxury architecture, turnkey civil construction, and bespoke interiors, while crafting photorealistic 3D CGI, brand systems, and high-performance web platforms.
            </p>

          </div>

          {/* Right Column: Out-of-This-World Double-Bezel Holographic Monolith Deck */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            
            {/* Outer Hardware Chassis (Double-Bezel Layer 1) */}
            <div className="relative p-2 sm:p-2.5 rounded-[2.25rem] bg-gradient-to-b from-neutral-200/70 via-neutral-100/50 to-neutral-200/80 border border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] select-none">
              
              {/* Top Hairline Specular Reflection */}
              <div className="absolute top-0 inset-x-10 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
              
              {/* Corner Crosshair Accents */}
              <span className="absolute top-3 right-3 text-[9px] font-mono text-neutral-400/80 pointer-events-none">+</span>
              <span className="absolute bottom-3 left-3 text-[9px] font-mono text-neutral-400/80 pointer-events-none">+</span>

              {/* Inner Vitrine Core (Double-Bezel Layer 2) */}
              <div className="rounded-[calc(2.25rem-0.625rem)] bg-white/95 backdrop-blur-xl p-5 sm:p-6 space-y-4 border border-white/70 shadow-xs relative overflow-hidden">
                
                {/* Telemetry Bar Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 font-mono text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5 uppercase tracking-wider text-neutral-500 font-semibold">
                    <Activity className="w-3.5 h-3.5 text-neutral-400" />
                    <span>PORTFOLIO MATRIX</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold tracking-wider text-[9.5px]">REAL-TIME SYNC</span>
                  </div>
                </div>

                {/* Primary Card: Obsidian Master Aggregate (Total Works) */}
                <div className="relative group/master bg-neutral-950 text-white rounded-2xl p-4 sm:p-5 overflow-hidden border border-neutral-800 shadow-md transition-all duration-300 hover:shadow-lg">
                  
                  {/* Subtle Background Glow Inside Card */}
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br from-rose-500/25 to-amber-500/20 blur-2xl rounded-full pointer-events-none" />
                  
                  {/* Top Line in Master Card */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                      <span>01 // TOTAL DISPATCH</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 text-[9px] font-mono">
                      LIVE REPOSITORY
                    </span>
                  </div>

                  {/* Dynamic Big Number + Label */}
                  <div className="relative z-10 mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-4xl xs:text-5xl sm:text-6xl font-light font-mono text-white tracking-tighter leading-none group-hover/master:text-rose-400 transition-colors duration-300">
                        {String(metrics.total).padStart(2, "0")}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-neutral-200 mt-1.5 tracking-tight">
                        All Curated Projects
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] text-neutral-400 space-y-0.5">
                      <div className="text-neutral-300 font-semibold">100% VERIFIED</div>
                      <div className="text-neutral-500">DYNAMIC ARCHIVE</div>
                    </div>
                  </div>
                </div>

                {/* Secondary Cards: Dual Core Grid (Digital & Web + Build & Spatial) */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Pod 2: Design & Web (Digital Atelier) */}
                  <div className="group/pod bg-gradient-to-b from-neutral-50/90 to-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/90 hover:border-sky-300 hover:shadow-sm transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[9.5px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                        <span>02 // DIGITAL</span>
                      </span>
                      <span className="text-sky-700 font-bold bg-sky-50 px-1.5 py-0.2 rounded text-[9px]">
                        {digitalPercent}%
                      </span>
                    </div>

                    <div className="text-3xl sm:text-4xl font-light font-mono text-neutral-950 tracking-tighter leading-none group-hover/pod:text-sky-600 transition-colors duration-300">
                      {String(metrics.designAndWeb).padStart(2, "0")}
                    </div>

                    <div className="text-xs font-bold text-neutral-950 mt-1 tracking-tight">
                      Design &amp; Web
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5 truncate">
                      3D CGI &bull; Web &bull; Brand
                    </div>
                  </div>

                  {/* Pod 3: Build & Spatial (Physical Engineering) */}
                  <div className="group/pod bg-gradient-to-b from-neutral-50/90 to-white rounded-2xl p-3.5 sm:p-4 border border-neutral-200/90 hover:border-amber-300 hover:shadow-sm transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[9.5px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>03 // SPATIAL</span>
                      </span>
                      <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded text-[9px]">
                        {spatialPercent}%
                      </span>
                    </div>

                    <div className="text-3xl sm:text-4xl font-light font-mono text-neutral-950 tracking-tighter leading-none group-hover/pod:text-amber-600 transition-colors duration-300">
                      {String(metrics.buildAndSpatial).padStart(2, "0")}
                    </div>

                    <div className="text-xs font-bold text-neutral-950 mt-1 tracking-tight">
                      Build &amp; Spatial
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5 truncate">
                      Civil &bull; Arch &bull; Interior
                    </div>
                  </div>

                </div>

                {/* Bottom Architectural Balance Telemetry Bar */}
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-neutral-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-sky-700 font-medium">
                      <span>Digital Atelier ({metrics.designAndWeb})</span>
                    </span>
                    <span className="font-semibold text-neutral-600 tracking-widest text-[9px]">
                      {digitalPercent}% / {spatialPercent}% RATIO
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <span>Spatial Build ({metrics.buildAndSpatial})</span>
                    </span>
                  </div>

                  {/* Visual Segmented Architectural Progress Beam */}
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex p-[1px] border border-neutral-200/70">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-l-full transition-all duration-1000 ease-out"
                      style={{ width: `${digitalPercent}%` }}
                    />
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-r-full transition-all duration-1000 ease-out"
                      style={{ width: `${spatialPercent}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FULL-FLEDGED DYNAMIC SEARCH BAR WITH AUTOMATED TYPEWRITER PLACEHOLDER   */}
      {/* ========================================================================= */}
      <section className="sticky top-16 z-30 bg-[#fafaf9]/95 backdrop-blur-md border-y border-neutral-200/80 py-3.5 sm:py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-2.5">
          
          {/* Main Full-Fledged Search Input */}
          <div className="relative flex items-center bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-neutral-400 focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950/5 transition-all">
            
            {/* Search Icon */}
            <div className="pl-4 sm:pl-5 pr-2 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
            </div>

            {/* Input Field with Animated Typewriter Placeholder */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search work e.g. ${typedService}`}
              className="w-full py-3 sm:py-3.5 pr-14 sm:pr-24 bg-transparent text-sm sm:text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none font-sans"
            />

            {/* Right Action: Clear Button or Status Pill */}
            <div className="absolute right-3 sm:right-4 flex items-center gap-2">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <span>Clear</span>
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded-md">
                  Dynamic Search
                </span>
              )}
            </div>

          </div>

          {/* Quick Suggestions, View Switcher & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-mono text-neutral-400">Suggested:</span>
              {[
                "3D Rendering",
                "Floor Planning",
                "Nayan Constructions",
                "Interior",
                "Materials & BOQ",
                "Branding",
                "Web & Tech"
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-950 text-neutral-600 text-[11px] font-mono transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Motion (3-Column Flow) vs Grid */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center p-0.5 rounded-full bg-neutral-200/70 border border-neutral-300/60">
                <button
                  onClick={() => setViewMode("motion")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer",
                    viewMode === "motion"
                      ? "bg-neutral-950 text-white shadow-xs font-medium"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                  title="3-Column Infinite Motion Stream"
                >
                  <Activity className="w-3 h-3 text-rose-500" />
                  <span>Motion</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-neutral-950 text-white shadow-xs font-medium"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                  title="All Works Grid Showcase"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Grid</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
                {filteredProjects.length === projectsData.length ? (
                  <span>All {projectsData.length} works</span>
                ) : (
                  <span className="text-neutral-950 font-medium">
                    {filteredProjects.length} {filteredProjects.length === 1 ? "work" : "works"}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOWCASE: 3-COLUMN COUNTER-FLOW MOTION (DEFAULT) OR APP-NATIVE GRID    */}
      {/* ========================================================================= */}
      <main className="pt-4 sm:pt-6">
        
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-base font-medium text-neutral-900">
              No matching works found
            </p>
            <p className="text-xs text-neutral-500 font-mono">
              Try searching with a different term like &quot;3D&quot;, &quot;Floor Plan&quot;, &quot;Nayan Constructions&quot;, or &quot;Interior&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-mono hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : viewMode === "motion" ? (
          /* Primary 3-Column Counter-Flow Infinite Motion Showcase */
          <PortfolioMotionColumns
            projects={filteredProjects}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        ) : (
          /* Alternate Multi-Column Grid View */
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer transform-gpu crisp-transform"
                >
                  {/* Media Presentation */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Subtle Minimal Pill Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-[9px] font-mono font-medium text-white uppercase tracking-wider">
                        {project.categoryTag}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-mono text-neutral-700">
                        {project.year}
                      </span>
                    </div>

                    {/* Corner Inspect Icon */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-md">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Minimal Card Meta */}
                  <div className="p-4 sm:p-5 lg:p-6 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {project.location}
                      </span>
                      <span>{project.area}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-rose-600 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="truncate max-w-[65%]">{project.client}</span>
                      <span className="text-neutral-900 group-hover:text-rose-600 font-medium inline-flex items-center gap-1 shrink-0">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. LUXURY DIALOGUE FOOTER: Quiet Elegance                                 */}
      {/* ========================================================================= */}
      <footer className="mt-8 sm:mt-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-10">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              START A PROJECT
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-neutral-950 tracking-tight">
              Have an architectural, construction, or creative vision?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal">
              Direct consultation with our architects, civil builders, and creative team.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/918472934031?text=${encodeURIComponent(
                "Hi Design Nayan! I am looking at your portfolio and would like to discuss a project across your services."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium transition-all shadow-xs active:scale-95 text-center whitespace-nowrap"
            >
              WhatsApp
            </a>

            <Link
              href="/contact"
              className="flex-1 sm:flex-none py-3 px-5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono font-medium transition-all shadow-xs active:scale-95 text-center whitespace-nowrap"
            >
              Inquire
            </Link>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX MODAL (Full Project Monograph)                                */}
      {/* ========================================================================= */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}
