"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Box, 
  Grid, 
  Sofa, 
  Building2, 
  Compass, 
  Palette, 
  Sparkles, 
  Laptop, 
  Share2, 
  Target, 
  Film, 
  Layout, 
  Camera, 
  Megaphone,
  TrendingUp,
  Users,
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Clock,
  Search,
  X,
  SlidersHorizontal,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import dynamic from "next/dynamic";
import { studioServicesData } from "../data/studio.data";
import { StudioServiceDetail } from "../types/studio.types";

const StudioInteractiveCanvas = dynamic(
  () => import("./StudioInteractiveCanvas").then((mod) => mod.StudioInteractiveCanvas),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
  }
);

// Comprehensive Semantic & Fuzzy Keyword Mapping Dictionary
const serviceKeywordsMap: Record<string, string[]> = {
  "3d-rendering": [
    "render", "rendering", "3d", "cgi", "cg", "modelling", "modeling", "photorealistic", 
    "exterior render", "interior render", "visual", "vray", "lumion", "blender", "perspective", 
    "elevation 3d", "view", "walkthrough", "rendring", "model", "cad", "camera", "lighting"
  ],
  "floor-plan": [
    "floor", "plan", "planning", "blueprint", "blue print", "layout", "2d", "map", "naksha", 
    "vastu", "sanction", "gmc", "municipal", "dimension", "house plan", "building plan", 
    "flr", "pln", "drawing", "section", "staircase", "autocad", "sanction drawing"
  ],
  "interior-design": [
    "interior", "interiors", "decor", "decoration", "living room", "bedroom", "ceiling", 
    "false ceiling", "lighting", "kitchen", "modular", "wardrobe", "furniture", "styling", 
    "home interior", "office interior", "interor", "aesthetic", "room"
  ],
  "exterior-design": [
    "exterior", "facade", "front", "elevation", "stone", "cladding", "acp", "hpl", 
    "louvers", "railing", "gate", "wall", "exteror", "villa front", "outdoor"
  ],
  "architecture": [
    "architect", "architecture", "building", "structure", "structural", "civil", "rcc", 
    "foundation", "soil", "house design", "villa", "bungalow", "construction drawing", 
    "commercial", "architcture", "arch", "construction"
  ],
  "graphic-design": [
    "graphic", "graphics", "designing", "brochure", "pamphlet", "flyer", "poster", "banner", 
    "hoarding", "billboard", "print", "packaging", "catalogue", "menu", "artwork", "graphc", "visiting card"
  ],
  "branding": [
    "brand", "branding", "logo", "identity", "brand identity", "symbol", "trademark", 
    "brandbook", "guidelines", "typography", "letterhead", "business card", "brandng", "vector"
  ],
  "video-editing": [
    "video", "editing", "reel", "reels", "shorts", "youtube", "cut", "color grade", 
    "grading", "motion", "subtitles", "clip", "teaser", "promo", "vidoe", "edit", "filmmaking"
  ],
  "content-creation": [
    "content", "creation", "photography", "photoshoot", "photo", "camera", "drone", 
    "aerial", "shoot", "b-roll", "broll", "videography", "photographer", "production"
  ],
  "campaigns": [
    "campaign", "campaigns", "launch", "brand launch", "outdoor", "hoarding campaign", 
    "pr", "marketing campaign", "teaser", "viral", "campain", "promotion", "event"
  ],
  "website-design": [
    "website", "web", "site", "web design", "developer", "coding", "nextjs", "react", 
    "frontend", "portfolio", "portal", "landing page", "webpage", "websit", "ecommerce"
  ],
  "social-media": [
    "social", "media", "instagram", "facebook", "linkedin", "insta", "fb", "post", 
    "posts", "calendar", "feed", "followers", "growth", "handling", "socail"
  ],
  "ads-management": [
    "ad", "ads", "meta ads", "facebook ads", "google ads", "paid ads", "ppc", "lead", 
    "leads", "lead generation", "inquiries", "conversion", "sponsor", "advertising"
  ],
  "digital-marketing": [
    "seo", "digital", "marketing", "google search", "ranking", "google maps", 
    "google business", "traffic", "organic", "search engine", "sem", "mktg", "local seo"
  ],
  "influencers": [
    "influencer", "influencers", "creator", "creators", "pr", "collab", "collaboration", 
    "shoutout", "celebrity", "artist", "tieup", "northeast creators", "sponsorship"
  ],
  "ui-ux-design": [
    "ui", "ux", "uiux", "figma", "app", "mobile app", "prototype", "wireframe", 
    "interface", "user experience", "user interface", "dashboard", "software", "screen"
  ]
};

export function StudioView() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ==========================================
  // 1. ROTATING TYPING ANIMATION (Smooth & Fluid)
  // ==========================================
  const typingWords = useMemo(
    () => ["Design & Architecture", "Branding & Creative", "Digital Marketing"],
    []
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typingWords[wordIndex];
    // Smooth, consistent typing pace
    const typingSpeed = isDeleting ? 32 : 58;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.slice(0, displayedText.length + 1);
        setDisplayedText(nextText);
        if (nextText.length === currentWord.length) {
          // Pause when word is fully typed
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
      "3D Rendering",
      "Floor Planning",
      "Branding & Logo",
      "Website Design",
      "Video Editing",
      "Interior Designing",
      "Social Media Growth",
      "Ads Management",
      "UI / UX Design",
      "Architecture Blueprints",
      "Content Creation",
      "Exterior Facades"
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

  // ==========================================
  // 3. DYNAMIC & FUZZY SEARCH FILTERING
  // ==========================================
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return studioServicesData.filter((service) => {
      if (!q) return true;

      // Exact substring matches in core fields
      const matchesTitle = service.title.toLowerCase().includes(q);
      const matchesDesc = service.description.toLowerCase().includes(q);
      const matchesBadge = service.badge.toLowerCase().includes(q);
      const matchesCategoryText = service.category.toLowerCase().includes(q);
      const matchesDeliverables = service.deliverables.some((d) => d.toLowerCase().includes(q));

      // Semantic & Similar Keyword Dictionary Lookup
      const relatedKeywords = serviceKeywordsMap[service.id] || [];
      const matchesRelated = relatedKeywords.some((kw) => {
        return kw.includes(q) || q.includes(kw);
      });

      // Fuzzy tokens match (handles queries with multiple words or slight typos)
      const qWords = q.split(/\s+/).filter(Boolean);
      const matchesWordTokens = qWords.some((w) => {
        return (
          service.title.toLowerCase().includes(w) ||
          service.description.toLowerCase().includes(w) ||
          relatedKeywords.some((kw) => kw.includes(w))
        );
      });

      return (
        matchesTitle || 
        matchesDesc || 
        matchesBadge || 
        matchesCategoryText || 
        matchesDeliverables || 
        matchesRelated || 
        matchesWordTokens
      );
    });
  }, [searchQuery]);

  // Group services by category for horizontal scroll sections
  const categorizedServices = useMemo(() => {
    const map: Record<string, StudioServiceDetail[]> = {
      "DESIGN & ARCHITECTURE": [],
      "BRANDING & CREATIVE": [],
      "DIGITAL & MARKETING": [],
    };
    filteredServices.forEach((s) => {
      if (map[s.category]) {
        map[s.category].push(s);
      }
    });
    return map;
  }, [filteredServices]);

  // Section Configurations with titles, taglines, and descriptions
  const categorySectionsConfig = useMemo(
    () => [
      {
        id: "design-architecture-section",
        category: "DESIGN & ARCHITECTURE",
        tagline: "SPATIAL & ARCHITECTURAL ATELIER",
        title: "Design & Architecture",
        description: "From photorealistic 3D rendering and municipal floor plans to luxury interior styling and structural architecture.",
      },
      {
        id: "branding-creative-section",
        category: "BRANDING & CREATIVE",
        tagline: "BRAND IDENTITY & PRODUCTION",
        title: "Branding & Creative",
        description: "Graphic design, master brand identities, high-retention video editing, on-location shoots, and 360° launch campaigns.",
      },
      {
        id: "digital-marketing-section",
        category: "DIGITAL & MARKETING",
        tagline: "DIGITAL ENGINEERING & GROWTH",
        title: "Digital & Marketing",
        description: "High-speed modern websites, active social media management, targeted lead ads, local SEO, creators, and UI/UX design.",
      },
    ],
    []
  );

  // Scroll references for each horizontal section
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollCategory = (category: string, direction: "left" | "right") => {
    const el = scrollRefs.current[category];
    if (el) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollTo({
        left: direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getServiceIcon = (iconName: string, className = "w-5 h-5 text-rose-600 stroke-[1.75]") => {
    const iconProps = { className };
    switch (iconName) {
      case "Box":
        return <Box {...iconProps} />;
      case "Grid":
        return <Grid {...iconProps} />;
      case "Sofa":
        return <Sofa {...iconProps} />;
      case "Building2":
        return <Building2 {...iconProps} />;
      case "Compass":
        return <Compass {...iconProps} />;
      case "Palette":
        return <Palette {...iconProps} />;
      case "Sparkles":
        return <Sparkles {...iconProps} />;
      case "Laptop":
        return <Laptop {...iconProps} />;
      case "Share2":
        return <Share2 {...iconProps} />;
      case "Target":
        return <Target {...iconProps} />;
      case "Film":
        return <Film {...iconProps} />;
      case "Layout":
        return <Layout {...iconProps} />;
      case "Camera":
        return <Camera {...iconProps} />;
      case "Megaphone":
        return <Megaphone {...iconProps} />;
      case "TrendingUp":
        return <TrendingUp {...iconProps} />;
      case "Users":
        return <Users {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* ========================================================================= */}
      {/* 1. STUDIO HERO: Exact Single-Frame on Mobile & Tablet, Fixed on Desktop   */}
      {/* ========================================================================= */}
      <section className="relative bg-neutral-950 text-white h-[calc(100svh-64px-64px)] md:h-[calc(100svh-80px)] lg:h-auto lg:min-h-0 lg:pt-24 lg:pb-28 px-4 sm:px-6 overflow-hidden flex flex-col justify-between items-center select-none">
        {/* Live Interactive 3D Parametric & Chromatic Modeling Canvas */}
        <StudioInteractiveCanvas />

        {/* Cinematic Atmospheric Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950/95 pointer-events-none z-[1]" />
        <div className="absolute top-0 right-1/4 w-[280px] sm:w-[450px] lg:w-[500px] h-[280px] sm:h-[450px] lg:h-[500px] bg-rose-600/10 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none z-[1]" />

        {/* Main Hero Frame Content: Vertically Centered Dynamically in Mobile & Tablet */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-2 sm:space-y-4 lg:space-y-6 my-auto py-2 sm:py-6 lg:py-0 w-full flex flex-col justify-center items-center">
          
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[8.5px] sm:text-[10px] md:text-xs font-semibold tracking-widest uppercase text-rose-300">
              Creative & Architectural Atelier
            </span>
          </div>

          {/* STUDIO Heading (Centered & Scaled for any mobile size) */}
          <div className="px-2 sm:px-8 overflow-visible flex justify-center items-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-none select-none px-1 py-0.5">
              <span className="inline-block pr-1 sm:pr-2 bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-sm">
                STUDIO
              </span>
            </h1>
          </div>

          {/* Typewriter Dynamic Cycling Subtitle */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight min-h-[30px] sm:min-h-[44px] lg:min-h-[56px] px-2">
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300 bg-clip-text text-transparent">
              {displayedText}
            </span>
            <span className="inline-block w-1 sm:w-1.5 h-5 sm:h-8 lg:h-11 bg-rose-500 animate-pulse rounded-full" />
          </div>

          <p className="text-neutral-400 text-[11px] sm:text-sm md:text-base max-w-[280px] sm:max-w-md lg:max-w-lg mx-auto leading-snug sm:leading-relaxed font-normal">
            Explore our 16 specialized disciplines across Architecture, Visual Identity, and Digital Engineering.
          </p>

          {/* Dynamic Search Box with Rotating Placeholder */}
          <div className="pt-1 sm:pt-3 max-w-[280px] sm:max-w-sm md:max-w-md mx-auto w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 sm:left-4 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search services (e.g. ${rotatingServices[placeholderIndex]})...`}
                className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl bg-neutral-900/90 border border-neutral-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-[11px] sm:text-sm text-white placeholder:text-neutral-500 transition-all outline-none shadow-xl backdrop-blur-md"
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
            <ChevronDown className="w-3 h-3 text-rose-500" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY-WISE HORIZONTALLY SCROLLABLE STUDIO SECTIONS                  */}
      {/* ========================================================================= */}
      <div id="studio-catalog" className="py-8 sm:py-14 lg:py-20 space-y-12 sm:space-y-20 lg:space-y-28 max-w-7xl mx-auto px-3.5 sm:px-6">

        {/* Global Search Results Alert if user entered a search query */}
        {searchQuery && (
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="text-xs sm:text-sm font-semibold text-neutral-700">
              Found <span className="font-bold text-neutral-950 font-mono">{filteredServices.length}</span> services matching &quot;{searchQuery}&quot;
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline uppercase tracking-wider cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {filteredServices.length === 0 && searchQuery ? (
          <div className="text-center py-16 sm:py-20 bg-neutral-50 rounded-2xl sm:rounded-3xl border border-neutral-200 space-y-4">
            <SlidersHorizontal className="w-9 h-9 sm:w-10 sm:h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">No matching studio services found</h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              Try searching with terms like &quot;3D&quot;, &quot;Floor Plan&quot;, &quot;Logo&quot;, &quot;Interior&quot;, or &quot;Website&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Show All Categories
            </button>
          </div>
        ) : (
          categorySectionsConfig.map((catConfig) => {
            const sectionServices = categorizedServices[catConfig.category] || [];
            if (sectionServices.length === 0) return null;

            return (
              <section key={catConfig.id} id={catConfig.id} className="relative space-y-4 sm:space-y-7 lg:space-y-8">
                
                {/* Section Header: Pure, clean category heading with service count and scroll controls */}
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 tracking-tight">
                      {catConfig.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 font-mono">
                      {sectionServices.length}
                    </span>
                  </div>

                  {/* Desktop / Tablet Scroll Navigation Controls */}
                  <div className="hidden sm:flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => scrollCategory(catConfig.category, "left")}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all active:scale-95 shadow-xs cursor-pointer"
                      aria-label={`Scroll ${catConfig.title} left`}
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4 text-neutral-800" />
                    </button>
                    <button
                      onClick={() => scrollCategory(catConfig.category, "right")}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all active:scale-95 shadow-xs cursor-pointer"
                      aria-label={`Scroll ${catConfig.title} right`}
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4 text-neutral-800" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Track: App-like swipe on mobile & tablet, smooth grid-feel scroll */}
                <div
                  ref={(el) => {
                    scrollRefs.current[catConfig.category] = el;
                  }}
                  className="flex gap-3 sm:gap-4 lg:gap-4.5 overflow-x-auto no-scrollbar snap-x snap-mandatory overscroll-x-contain -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0 py-1.5 sm:py-2 scroll-pl-3.5 sm:scroll-pl-6"
                >
                  {sectionServices.map((service) => (
                    <div
                      key={service.id}
                      id={service.id}
                      className="shrink-0 w-[225px] sm:w-[260px] lg:w-[285px] snap-start rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-900/40 hover:shadow-lg transition-[transform,box-shadow,border-color] duration-200 ease-out flex flex-col justify-between group overflow-hidden shadow-xs hover:-translate-y-1 transform-gpu crisp-transform"
                    >
                      {/* Card Body */}
                      <div className="p-3.5 sm:p-4 lg:p-5 space-y-2.5 sm:space-y-3">
                        {/* Top: Icon + Badge */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            {getServiceIcon(service.iconName, "w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-rose-600 group-hover:text-white stroke-[2] transition-colors")}
                          </div>

                          <span className="px-2 py-0.5 rounded-md text-[8.5px] sm:text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 font-mono tracking-wider truncate max-w-[125px] sm:max-w-[140px]">
                            {service.badge}
                          </span>
                        </div>

                        {/* Title & Short Description */}
                        <div className="space-y-0.5 sm:space-y-1">
                          <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-neutral-950 group-hover:text-rose-600 transition-colors leading-tight line-clamp-1">
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
                              <CheckCircle2 className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
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
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500" />
                            {service.turnaround}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Quick Actions */}
                      <div className="p-2.5 sm:p-3 lg:p-3.5 bg-neutral-50/80 border-t border-neutral-100 grid grid-cols-2 gap-1.5 sm:gap-2">
                        <a
                          href={`https://wa.me/918472934031?text=${encodeURIComponent(
                            `Hi Design Nayan Studio! I want to inquire about *${service.title}*.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                        >
                          <MessageSquare className="w-3 h-3 shrink-0" />
                          <span>WhatsApp</span>
                        </a>

                        {service.id === "content-creation" || service.id === "influencers" ? (
                          <Link
                            href="/creators"
                            className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                          >
                            <span>Creators</span>
                            <ArrowRight className="w-3 h-3 shrink-0" />
                          </Link>
                        ) : (
                          <Link
                            href={`/contact?service=${encodeURIComponent(service.title)}`}
                            className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center"
                          >
                            <span>Inquire</span>
                            <ArrowRight className="w-3 h-3 shrink-0" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. STUDIO WORKFLOW: 4-Step Atelier Process                               */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
            <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase font-mono">
              HOW WE WORK
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-950 tracking-tight">
              The Design Nayan Studio Workflow
            </h2>
            <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-600 leading-relaxed">
              Every space, brand, and digital software is crafted through an iterative, rigorous atelier methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[
              {
                step: "01",
                title: "Brief & Discovery",
                desc: "We analyze your site drawings, plot dimensions, target audience, and functional goals.",
                icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />,
              },
              {
                step: "02",
                title: "Concept & 3D Moodboard",
                desc: "Our architects & designers produce 2D concept layouts, initial 3D renders, and visual design moodboards.",
                icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />,
              },
              {
                step: "03",
                title: "Refinement & Detailing",
                desc: "We refine details with your feedback, finalizing material palettes, municipal blueprints, and brand assets.",
                icon: <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />,
              },
              {
                step: "04",
                title: "Final Delivery & Handover",
                desc: "You receive high-res 4K CGI renders, municipal CAD blueprints, design system files, and on-site support.",
                icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />,
              },
            ].map((p) => (
              <div
                key={p.step}
                className="p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2 sm:space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className="text-base sm:text-lg font-extrabold text-rose-600 font-mono">{p.step}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-950">{p.title}</h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STUDIO CONSULTATION CTA                                                */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-12 lg:py-16 px-3.5 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-3xl bg-neutral-950 text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 sm:space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.2em] text-rose-500 uppercase font-mono block">
              CUSTOM STUDIO CONSULTATION
            </span>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to Design Your Space or Brand?
            </h3>
            <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-400 leading-relaxed">
              Book a 1-on-1 consultation with our principal architects and digital design leads in Guwahati or schedule a virtual discovery call.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/918472934031?text=Hi%20Design%20Nayan%20Studio!%20I%20would%20like%20to%20book%20a%20design%20consultation%20for%20my%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Studio</span>
            </a>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>SUBMIT STUDIO BRIEF</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
