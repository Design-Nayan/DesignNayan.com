"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  ChevronDown,
  RotateCcw,
  Star,
  Users,
  Heart
} from "lucide-react";
import { creatorsData } from "../data/creators.data";
import { CreatorItem, CreatorCategory } from "../types/creators.types";
import { CreatorCard } from "./CreatorCard";
import { CreatorProfileModal } from "./CreatorProfileModal";
import { cn } from "@/lib/utils";

const categories: CreatorCategory[] = [
  "ALL",
  "Beauty",
  "Fashion",
  "Travel",
  "Food",
  "Fitness",
  "Tech",
  "Lifestyle",
  "UGC"
];

const locations = [
  "All Locations",
  "Guwahati",
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Shillong",
  "Pune"
];

const followerTiers = [
  { label: "All Followers", value: "all" },
  { label: "10K - 20K", value: "10k-20k", min: 10000, max: 20000 },
  { label: "20K - 35K", value: "20k-35k", min: 20000, max: 35000 },
  { label: "35K+", value: "35k-plus", min: 35000, max: Infinity },
];

const typingExamples = [
  "Beauty & Skincare",
  "Guwahati Creators",
  "Travel & Stays",
  "Fashion & Lookbooks",
  "Tech & Gadgets",
  "Food & Restaurants",
  "Fitness & Gym",
  "UGC Reels"
];

// Automated Typewriter Hook for dynamic search placeholder
function useTypewriter(words: string[], typingSpeed = 70, deletingSpeed = 35, pauseTime = 1400) {
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

// Smart fuzzy token matcher for dynamic search without exact keyword
function matchesFuzzySearch(creator: CreatorItem, tokens: string[]): boolean {
  const searchableText = [
    creator.name,
    creator.username,
    creator.category,
    creator.location,
    ...creator.nicheTags,
    creator.bio,
    ...creator.languages,
    creator.priceUnit
  ].join(" ").toLowerCase();

  return tokens.every((token) => {
    if (searchableText.includes(token)) return true;
    // Prefix / stem match for words >= 3 characters
    if (token.length >= 3) {
      const words = searchableText.split(/[\s,.-]+/);
      for (const w of words) {
        if (w.startsWith(token) || token.startsWith(w)) return true;
        if (w.length >= 4 && Math.abs(w.length - token.length) <= 1) {
          let diffs = 0;
          const minLen = Math.min(w.length, token.length);
          for (let i = 0; i < minLen; i++) {
            if (w[i] !== token[i]) diffs++;
          }
          if (diffs <= 1) return true;
        }
      }
    }
    return false;
  });
}

export function CreatorsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [selectedFollowerTier, setSelectedFollowerTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "followers" | "price_asc" | "price_desc">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCreator, setSelectedCreator] = useState<CreatorItem | null>(null);

  const gridSectionRef = useRef<HTMLDivElement>(null);
  const typedExample = useTypewriter(typingExamples, 70, 35, 1400);

  const scrollToGrid = () => {
    gridSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Dynamic filter and sorting pipeline
  const filteredCreators = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);

    let result = creatorsData.filter((creator) => {
      // 1. Search Query
      if (tokens.length > 0 && !matchesFuzzySearch(creator, tokens)) {
        return false;
      }

      // 2. Category
      if (selectedCategory !== "ALL" && creator.category !== selectedCategory) {
        return false;
      }

      // 3. Location
      if (
        selectedLocation !== "All Locations" &&
        !creator.location.toLowerCase().includes(selectedLocation.toLowerCase())
      ) {
        return false;
      }

      // 4. Follower Tier
      if (selectedFollowerTier !== "all") {
        const tier = followerTiers.find((t) => t.value === selectedFollowerTier);
        if (tier) {
          if (creator.followersRaw < (tier.min || 0) || creator.followersRaw > (tier.max || Infinity)) {
            return false;
          }
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "followers") return b.followersRaw - a.followersRaw;
      if (sortBy === "price_asc") return a.startingPrice - b.startingPrice;
      if (sortBy === "price_desc") return b.startingPrice - a.startingPrice;
      // Default: Popular (featured first, then rating)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedLocation, selectedFollowerTier, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedLocation("All Locations");
    setSelectedFollowerTier("all");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 font-sans select-none pb-24 selection:bg-rose-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Title + Floating Category Collage (Matching Reference)   */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-rose-600 uppercase block font-mono">
              FIND. HIRE. CREATE. GROW.
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.08]">
              Find the perfect <span className="text-rose-600">creator for your brand</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed max-w-xl font-normal">
              Discover verified content creators, compare transparent pricing, and hire the right talent for your next social campaign.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={scrollToGrid}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-rose-600/25 active:scale-95 cursor-pointer"
              >
                Browse Creators
              </button>

              <a
                href={`https://wa.me/918472934031?text=${encodeURIComponent(
                  "Hi Design Nayan Creators! We want to post a brand campaign and hire creators."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xs active:scale-95 text-center cursor-pointer"
              >
                Post a Campaign
              </a>
            </div>

            {/* Live Trust Metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-500 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>1,200+ Active Creators</span>
              </div>
              <div>&bull;</div>
              <div>100% Verified Profiles</div>
            </div>
          </div>

          {/* Right Hero Column: Floating Category Cards Collage (From Reference) */}
          <div className="lg:col-span-6 relative w-full h-[360px] sm:h-[440px] flex items-center justify-center">
            
            {/* Ambient decorative gradient background */}
            <div className="absolute w-72 h-72 rounded-full bg-rose-200/40 blur-3xl -top-10 -right-10 pointer-events-none" />
            <div className="absolute w-60 h-60 rounded-full bg-amber-100/50 blur-3xl bottom-0 left-10 pointer-events-none" />

            {/* Card 1: Beauty Creator (Left) */}
            <div 
              onClick={() => setSelectedCategory("Beauty")}
              className="absolute left-2 sm:left-6 top-8 sm:top-10 w-44 sm:w-52 rounded-2xl sm:rounded-3xl bg-white p-2.5 shadow-xl border border-neutral-200/80 -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
                  alt="Beauty Creator"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Beauty</span>
                  <span className="text-[10px] text-neutral-500 font-mono">12.4K Creators</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                  ✨
                </span>
              </div>
            </div>

            {/* Card 2: Food Creator (Top Right) */}
            <div 
              onClick={() => setSelectedCategory("Food")}
              className="absolute right-4 sm:right-10 top-0 sm:top-4 w-40 sm:w-48 rounded-2xl sm:rounded-3xl bg-white p-2.5 shadow-xl border border-neutral-200/80 rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-10"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80"
                  alt="Food Burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Food</span>
                  <span className="text-[10px] text-neutral-500 font-mono">7.1K Creators</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                  🍔
                </span>
              </div>
            </div>

            {/* Card 3: Travel Creator (Center Floating) */}
            <div 
              onClick={() => setSelectedCategory("Travel")}
              className="absolute left-28 sm:left-40 bottom-12 sm:bottom-16 w-44 sm:w-52 rounded-2xl sm:rounded-3xl bg-white p-2.5 shadow-2xl border border-neutral-200/80 -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-30"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="Travel Creator"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Travel</span>
                  <span className="text-[10px] text-neutral-500 font-mono">8.7K Creators</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                  ✈️
                </span>
              </div>
            </div>

            {/* Card 4: Fitness Creator (Bottom Right) */}
            <div 
              onClick={() => setSelectedCategory("Fitness")}
              className="absolute right-2 sm:right-6 bottom-2 sm:bottom-6 w-36 sm:w-44 rounded-2xl sm:rounded-3xl bg-white p-2.5 shadow-xl border border-neutral-200/80 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
                  alt="Fitness Creator"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Fitness</span>
                  <span className="text-[10px] text-neutral-500 font-mono">9.3K Creators</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                  ⚡
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC SEARCH BAR & MULTI-ATTRIBUTE FILTERS DECK                       */}
      {/* ========================================================================= */}
      <section 
        ref={gridSectionRef}
        className="sticky top-16 z-30 bg-[#fafaf9]/95 backdrop-blur-md border-y border-neutral-200/80 py-4 px-4 sm:px-6 lg:px-8 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto space-y-3">
          
          {/* Main Search Bar with Automated Typewriter */}
          <div className="relative flex items-center bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-neutral-400 focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950/5 transition-all">
            <div className="pl-4 sm:pl-5 pr-2 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search creators by name, city, or niche e.g. "${typedExample}"`}
              className="w-full py-3 sm:py-3.5 pr-14 sm:pr-24 bg-transparent text-sm sm:text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none font-sans"
            />

            {/* Clear Button or Status Badge */}
            <div className="absolute right-3 sm:right-4 flex items-center gap-2">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
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

          {/* Filter Dropdowns Bar (Matching Reference Design) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            
            {/* Filter Pills / Dropdowns Group */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={cn(
                    "appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs focus:outline-none",
                    selectedCategory !== "ALL"
                      ? "bg-rose-50 border-rose-300 text-rose-700"
                      : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  )}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>

              {/* Location Dropdown */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={cn(
                    "appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs focus:outline-none",
                    selectedLocation !== "All Locations"
                      ? "bg-rose-50 border-rose-300 text-rose-700"
                      : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  )}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>

              {/* Followers Tier */}
              <div className="relative">
                <select
                  value={selectedFollowerTier}
                  onChange={(e) => setSelectedFollowerTier(e.target.value)}
                  className={cn(
                    "appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs focus:outline-none",
                    selectedFollowerTier !== "all"
                      ? "bg-rose-50 border-rose-300 text-rose-700"
                      : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  )}
                >
                  {followerTiers.map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>

              {/* Reset Filter Button if active */}
              {(selectedCategory !== "ALL" || selectedLocation !== "All Locations" || selectedFollowerTier !== "all" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}

            </div>

            {/* Right Controls: Sort Dropdown, Result Count & Grid/List Switcher */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="hidden lg:inline text-neutral-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-neutral-900 border-b border-neutral-300 py-0.5 focus:outline-none cursor-pointer"
                >
                  <option value="popular">Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="followers">Most Followers</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* View Switcher: Grid vs List (Hidden on mobile as mobile is permanently List view) */}
              <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-neutral-200/70 border border-neutral-300/60">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-all cursor-pointer",
                    viewMode === "grid" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
                  )}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-all cursor-pointer",
                    viewMode === "list" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
                  )}
                  title="List view"
                  aria-label="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Quick Result Count Indicator */}
          <div className="text-xs font-bold text-neutral-800 pt-1">
            <span>{filteredCreators.length} Creators found</span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CREATORS SHOWCASE GRID / LIST                                          */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {filteredCreators.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-base font-bold text-neutral-900">
              No creators found matching your criteria
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed font-mono">
              Try searching with another keyword like &quot;Beauty&quot;, &quot;Guwahati&quot;, &quot;Fashion&quot;, or reset your filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-mono font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: Permanent List View */}
            <div className="block sm:hidden space-y-3.5">
              {filteredCreators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  onSelect={(c) => setSelectedCreator(c)}
                  viewMode="list"
                />
              ))}
            </div>

            {/* Tablet & Desktop View: Toggleable Grid / List View */}
            <div className="hidden sm:block">
              {viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
                  {filteredCreators.map((creator) => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      onSelect={(c) => setSelectedCreator(c)}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-w-5xl mx-auto">
                  {filteredCreators.map((creator) => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      onSelect={(c) => setSelectedCreator(c)}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. PLATFORM VALUE HIGHLIGHTS / TRUST BAR (Matching Reference Image)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-950">
                  Verified Creators
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  All creators are verified, background-checked, and quality assured.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-950">
                  Secure Payments
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your payments are safe with our milestone escrow and invoice system.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-950">
                  Easy Communication
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Direct WhatsApp desk to share briefs, scripts, and manage campaigns easily.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-950">
                  On-Time Delivery
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Creators deliver quality content and live link updates strictly on schedule.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CREATOR PROFILE LIGHTBOX MODAL                                         */}
      {/* ========================================================================= */}
      <CreatorProfileModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />

    </div>
  );
}
