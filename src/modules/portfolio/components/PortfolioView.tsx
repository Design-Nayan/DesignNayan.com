"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Layers
} from "lucide-react";
import dynamic from "next/dynamic";
import { projectsData } from "@/modules/projects/data/projects.data";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { ProjectModal } from "@/modules/projects/components/ProjectModal";
import { cn } from "@/lib/utils";

const Portfolio3DCarousel = dynamic(
  () => import("./Portfolio3DCarousel").then((mod) => mod.Portfolio3DCarousel),
  {
    ssr: false,
    loading: () => <div className="h-[520px] sm:h-[560px] lg:h-[590px] w-full" aria-hidden="true" />
  }
);

// Batched animated metric counter hook for ultra-smooth luxury numbers with a single RAF loop
function useAnimatedMetrics(targets: { projects: number; sqft: number; awards: number }, duration = 1200) {
  const [counts, setCounts] = useState({ projects: 0, sqft: 0, awards: 0 });

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        projects: Math.floor(easeOut * targets.projects),
        sqft: Math.floor(easeOut * targets.sqft),
        awards: Math.floor(easeOut * targets.awards),
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCounts(targets);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targets.projects, targets.sqft, targets.awards, duration]);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  // Animated metric counters batched into a single RAF hook
  const metricTargets = useMemo(() => ({
    projects: projectsData.length,
    sqft: 48,
    awards: 100
  }), []);
  const metrics = useAnimatedMetrics(metricTargets, 1200);

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
      {/* 1. LUXURY MINIMAL HERO: Designed Equally for Mobile, Tablet & Desktop     */}
      {/* ========================================================================= */}
      <section className="pt-6 sm:pt-10 lg:pt-16 pb-6 sm:pb-10 lg:pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* Top Backlink & Live Status */}
        <div className="flex items-center justify-between gap-4 pb-5 sm:pb-8 border-b border-neutral-200/80">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Archive &bull; All Services &amp; Works</span>
          </div>
        </div>

        {/* Hero Title & Tablet-Safe Luxury Numbers */}
        <div className="pt-6 sm:pt-10 lg:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          
          {/* Simple, Large, Elegant Title for All Works & Services */}
          <div className="space-y-2 sm:space-y-3 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase block">
              DESIGN NAYAN &bull; PORTFOLIO
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-neutral-950 tracking-tight leading-[1.08]">
              All our works &amp; <span className="font-semibold text-neutral-900">services.</span>
            </h1>
          </div>

          {/* Animated Luxury Numbers: Protected against Tablet Right-Cutoff */}
          <div className="w-full md:w-auto shrink-0 bg-white/70 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none border border-neutral-200/80 md:border-none rounded-2xl p-4 md:p-0">
            <div className="grid grid-cols-3 divide-x divide-neutral-200 items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              <div className="pr-2 sm:pr-4 md:pr-0">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-mono text-neutral-950 tracking-tight block">
                  {String(metrics.projects).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  All Works
                </span>
              </div>

              <div className="px-2 sm:px-4 md:px-4 lg:px-6">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-mono text-neutral-950 tracking-tight block">
                  {metrics.sqft}k+
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Sq.Ft Built
                </span>
              </div>

              <div className="pl-2 sm:pl-4 md:pl-4 lg:pl-6">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-mono text-neutral-950 tracking-tight block">
                  {metrics.awards}%
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mt-1 whitespace-nowrap">
                  Bespoke
                </span>
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

            {/* View Mode Toggle: 3D Infinite Stream vs All Grid */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center p-0.5 rounded-full bg-neutral-200/70 border border-neutral-300/60">
                <button
                  onClick={() => setViewMode("carousel")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer",
                    viewMode === "carousel"
                      ? "bg-neutral-950 text-white shadow-xs font-medium"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                  title="3D Infinite Stream"
                >
                  <Layers className="w-3 h-3" />
                  <span>3D Carousel</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-neutral-950 text-white shadow-xs font-medium"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                  title="Grid Showcase"
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
      {/* 3. SHOWCASE: INFINITE 3D CAROUSEL (DEFAULT) OR APP-NATIVE GRID             */}
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
        ) : viewMode === "carousel" ? (
          /* Primary 3D Infinite Carousel (Left to Right, 3D Depth & Feel) */
          <Portfolio3DCarousel
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
