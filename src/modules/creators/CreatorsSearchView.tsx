"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
  X,
  Flame,
  Sparkles,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { CREATORS_DATA } from "./data";
import { Creator, CreatorCategory, DeliverableFormat, ReachTier } from "./creators.types";
import { CreatorProfileModal } from "./components/CreatorProfileModal";
import { CampaignRosterBar } from "./components/CampaignRosterBar";
import { CampaignBookingModal } from "./components/CampaignBookingModal";

const ALL_FILTER_CATEGORIES: CreatorCategory[] = [
  "All",
  "High Fashion & Luxury",
  "Viral UGC & Short-Form",
  "3D & CGI Motion",
  "Tech & Gadgets",
  "Architecture & Spaces",
  "Lifestyle & Travel",
];

const DELIVERABLE_FORMATS: (DeliverableFormat | "All")[] = [
  "All",
  "4K Viral Reels & TikTok",
  "Commercial Production",
  "Editorial Photo Stills",
  "3D / CGI Product VFX",
];

const REACH_TIERS: (ReachTier | "All")[] = [
  "All",
  "Rising (25K-100K)",
  "Prime (100K-500K)",
  "Macro (500K-1.5M)",
  "Icon (1.5M+)",
];

const BUDGET_OPTIONS = [
  { label: "All Budgets", value: "All" },
  { label: "Under $1,500", value: "under-1500" },
  { label: "$1,500 - $3,000", value: "1500-3000" },
  { label: "$3,000+", value: "above-3000" },
];

// Levenshtein distance for forgiving fuzzy matching
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Synonyms and semantic expansions
const SYNONYMS: Record<string, string[]> = {
  fashion: ["luxury", "editorial", "style", "model", "clothes", "outfit", "vogue", "prada", "dior", "balenciaga"],
  luxury: ["fashion", "editorial", "high-end", "premium", "gentle monster", "prada", "designer"],
  viral: ["ugc", "reels", "tiktok", "short-form", "views", "hook", "social"],
  ugc: ["viral", "reels", "tiktok", "short-form", "creator", "content", "authentic"],
  reels: ["viral", "ugc", "tiktok", "video", "short-form", "clip"],
  tiktok: ["viral", "ugc", "reels", "video", "short-form"],
  "3d": ["cgi", "motion", "vfx", "render", "animation", "blender", "visual"],
  cgi: ["3d", "motion", "vfx", "render", "animation", "visual"],
  tech: ["gadgets", "ai", "hardware", "software", "apple", "smart", "device", "dyson"],
  gadget: ["tech", "devices", "hardware", "apple", "dji"],
  architecture: ["spaces", "interior", "design", "building", "home", "minimalist"],
  interior: ["architecture", "spaces", "design", "home", "vitra"],
  travel: ["lifestyle", "places", "resort", "hotel", "explore", "city", "dubai", "bali"],
  lifestyle: ["travel", "fitness", "vlog", "everyday", "living"],
};

export function CreatorsSearchView() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CreatorCategory>(() => {
    if (urlCategory && ALL_FILTER_CATEGORIES.includes(urlCategory as CreatorCategory)) {
      return urlCategory as CreatorCategory;
    }
    return "All";
  });

  // Sync if URL query parameter changes
  useEffect(() => {
    if (urlCategory && ALL_FILTER_CATEGORIES.includes(urlCategory as CreatorCategory)) {
      setSelectedCategory(urlCategory as CreatorCategory);
    }
  }, [urlCategory]);

  const [selectedFormat, setSelectedFormat] = useState<DeliverableFormat | "All">("All");
  const [selectedTier, setSelectedTier] = useState<ReachTier | "All">("All");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [quickViewCreator, setQuickViewCreator] = useState<Creator | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const suggestedScrollRef = useRef<HTMLDivElement>(null);

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Selected creators objects
  const selectedCreators = useMemo(() => {
    return CREATORS_DATA.filter((c) => selectedCreatorIds.includes(c.id));
  }, [selectedCreatorIds]);

  const handleToggleSelect = (creator: Creator) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creator.id)
        ? prev.filter((id) => id !== creator.id)
        : [...prev, creator.id]
    );
  };

  const handleRemoveCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) => prev.filter((id) => id !== creatorId));
  };

  const handleClearAll = () => {
    setSelectedCreatorIds([]);
  };

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedFormat("All");
    setSelectedTier("All");
    setSelectedBudget("All");
    setVerifiedOnly(false);
  };

  // Count active custom filters (excluding search query)
  const activeCustomFilterCount = useMemo(() => {
    let count = 0;
    if (selectedFormat !== "All") count++;
    if (selectedTier !== "All") count++;
    if (selectedBudget !== "All") count++;
    if (verifiedOnly) count++;
    return count;
  }, [selectedFormat, selectedTier, selectedBudget, verifiedOnly]);

  // Check if user has engaged in searching or filtering
  const isSearchActive = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      selectedCategory !== "All" ||
      selectedFormat !== "All" ||
      selectedTier !== "All" ||
      selectedBudget !== "All" ||
      verifiedOnly
    );
  }, [searchQuery, selectedCategory, selectedFormat, selectedTier, selectedBudget, verifiedOnly]);

  // Top 6 Suggested / Trending Creators for the small horizontal section
  const suggestedCreators = useMemo(() => {
    return CREATORS_DATA.filter((c) => c.verified).slice(0, 6);
  }, []);

  const scrollSuggested = (direction: "left" | "right") => {
    if (suggestedScrollRef.current) {
      const scrollAmount = suggestedScrollRef.current.clientWidth * 0.7;
      suggestedScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? suggestedScrollRef.current.scrollLeft - scrollAmount
            : suggestedScrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Smart Forgiving Search Scoring Function
  const scoreCreator = (c: Creator, tokens: string[]): number => {
    let totalScore = 0;
    const nameLower = c.name.toLowerCase();
    const roleLower = c.role.toLowerCase();
    const bioLower = c.bio.toLowerCase();
    const catLower = c.category.toLowerCase();
    const locLower = c.location.toLowerCase();
    const tagsLower = c.tags.map((t) => t.toLowerCase());
    const brandsLower = c.pastBrands.map((b) => b.toLowerCase());
    const formatsLower = c.formats.map((f) => f.toLowerCase());

    for (const token of tokens) {
      let tokenScore = 0;

      // 1. Direct Substring Match
      if (nameLower.includes(token)) tokenScore += 50;
      else if (roleLower.includes(token)) tokenScore += 30;
      else if (catLower.includes(token)) tokenScore += 25;
      else if (tagsLower.some((t) => t.includes(token))) tokenScore += 20;
      else if (brandsLower.some((b) => b.includes(token))) tokenScore += 20;
      else if (locLower.includes(token)) tokenScore += 15;
      else if (formatsLower.some((f) => f.includes(token))) tokenScore += 15;
      else if (bioLower.includes(token)) tokenScore += 10;

      // 2. Semantic Synonyms Match
      if (tokenScore === 0) {
        for (const [key, synList] of Object.entries(SYNONYMS)) {
          if (token === key || synList.includes(token)) {
            // Check if creator matches any synonym
            if (
              catLower.includes(key) ||
              tagsLower.some((t) => t.includes(key)) ||
              roleLower.includes(key)
            ) {
              tokenScore += 18;
              break;
            }
          }
        }
      }

      // 3. Forgiving Fuzzy / Typo tolerance (Levenshtein distance <= 2 for words >= 4 letters)
      if (tokenScore === 0 && token.length >= 4) {
        const wordsInCreator = [
          ...nameLower.split(/\s+/),
          ...roleLower.split(/\s+/),
          ...catLower.split(/\s+/),
          ...tagsLower,
          ...brandsLower,
        ];

        for (const word of wordsInCreator) {
          const cleanWord = word.replace(/[^a-z0-9]/gi, "").toLowerCase();
          if (cleanWord.length >= 4) {
            const dist = levenshtein(token, cleanWord);
            if (dist <= 1) {
              tokenScore += 16;
              break;
            } else if (dist === 2 && token.length >= 5) {
              tokenScore += 10;
              break;
            }
          }
        }
      }

      if (tokenScore === 0) return 0; // All tokens must have some match
      totalScore += tokenScore;
    }

    return totalScore;
  };

  // Filtered and Ranked Creators
  const filteredCreators = useMemo(() => {
    let list = CREATORS_DATA;

    // Category Pill Filter
    if (selectedCategory !== "All") {
      list = list.filter((c) => c.category === selectedCategory);
    }

    // Format Filter
    if (selectedFormat !== "All") {
      list = list.filter((c) => c.formats.includes(selectedFormat as DeliverableFormat));
    }

    // Tier Filter
    if (selectedTier !== "All") {
      list = list.filter((c) => c.tier === selectedTier);
    }

    // Budget Filter
    if (selectedBudget !== "All") {
      list = list.filter((c) => {
        const numRate = parseInt(c.startingRate.replace(/[^0-9]/g, ""), 10);
        if (selectedBudget === "under-1500") return numRate < 1500;
        if (selectedBudget === "1500-3000") return numRate >= 1500 && numRate <= 3000;
        if (selectedBudget === "above-3000") return numRate > 3000;
        return true;
      });
    }

    // Verified Filter
    if (verifiedOnly) {
      list = list.filter((c) => c.verified);
    }

    // Search Query with Forgiving Scoring
    const rawQ = searchQuery.toLowerCase().trim();
    if (rawQ) {
      const tokens = rawQ.split(/\s+/).filter((t) => t.length > 0);
      const scored = list
        .map((creator) => ({
          creator,
          score: scoreCreator(creator, tokens),
        }))
        .filter((item) => item.score > 0);

      // Sort by highest relevance score
      scored.sort((a, b) => b.score - a.score);
      return scored.map((item) => item.creator);
    }

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedFormat,
    selectedTier,
    selectedBudget,
    verifiedOnly,
  ]);

  return (
    <div className="min-h-screen bg-[#fcfcfb] text-neutral-900 selection:bg-red-600 selection:text-white pt-20 sm:pt-22 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Sleek Thin Top Strip: Back Button + Title + Campaign Button */}
        <div className="flex items-center justify-between gap-3 py-2.5 sm:py-3 border-b border-neutral-200/90">
          {/* Left: Back to Creators (Scrolls to Browse & Select Creators section) */}
          <Link
            href="/creators#creator-directory"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-red-600" />
            <span className="hidden sm:inline">Back to Creators</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Center: Search Creators Network Title */}
          <h1 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-neutral-900 font-mono text-center truncate px-2">
            SEARCH CREATORS NETWORK
          </h1>

          {/* Right: Campaign Button */}
          <button
            onClick={() => setIsBookingOpen(true)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border shadow-2xs transition-all duration-300 cursor-pointer shrink-0 ${
              selectedCreatorIds.length > 0
                ? "bg-red-600 text-white border-red-600 shadow-md hover:bg-red-700"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:text-neutral-950"
            }`}
            title="View Selected Creators / Launch Campaign"
          >
            <ShoppingBag
              className={`w-3.5 h-3.5 shrink-0 ${
                selectedCreatorIds.length > 0 ? "text-white" : "text-neutral-600"
              }`}
            />
            <span className="text-xs font-semibold font-mono tracking-wider uppercase">
              Campaign
            </span>
            {selectedCreatorIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
                {selectedCreatorIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar + Filter Tab Row */}
        <div className="mt-5 sm:mt-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Main Search Input */}
            <div className="relative flex-1 flex items-center rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 shadow-xs transition-all duration-200 p-1.5 sm:p-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by creator name, niche, brand, or location..."
                autoFocus
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors cursor-pointer mr-1 shrink-0"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tab Button (On the Right of Search Bar) */}
            <div className="relative" ref={filterPopoverRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs ${
                  isFilterOpen || activeCustomFilterCount > 0
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:text-neutral-950"
                }`}
                title="Filter creators by format, tier, price, or verification"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeCustomFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeCustomFilterCount}
                  </span>
                )}
              </button>

              {/* Small Filter Dropdown Popover Box */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-neutral-200 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-red-600" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
                        FILTERS & CRITERIA
                      </span>
                    </div>
                    {activeCustomFilterCount > 0 && (
                      <button
                        onClick={resetAllFilters}
                        className="text-[11px] font-mono text-red-600 hover:text-red-700 underline cursor-pointer"
                      >
                        Reset all
                      </button>
                    )}
                  </div>

                  {/* Filter Option 1: Format */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                      Deliverable Format
                    </label>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as DeliverableFormat | "All")}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {DELIVERABLE_FORMATS.map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt === "All" ? "All Formats" : fmt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Option 2: Reach Tier */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                      Audience Reach Tier
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value as ReachTier | "All")}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {REACH_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier === "All" ? "All Reach Tiers" : tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Option 3: Starting Rate / Price */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                      Starting Rate
                    </label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Option 4: Verified Toggle */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-700 font-medium">
                      Verified Talent Only
                    </span>
                    <button
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                        verifiedOnly
                          ? "bg-red-600 border-red-600 text-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {verifiedOnly && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    Apply Filters ({filteredCreators.length} Found)
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Category Filter Pills (Directly below search bar) */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {ALL_FILTER_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-2xs ring-1 ring-neutral-800"
                      : "bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {category === "All" ? "All Creators" : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* DEFAULT STATE: When Search Box is Empty & No Filters Active */}
        {!isSearchActive && (
          <div className="mt-8 mb-12 sm:mb-16 pt-6 border-t border-neutral-200/80">
            {/* Suggested Creators Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-900">
                  SUGGESTED CREATORS
                </h2>
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 hidden sm:inline">
                  // Recommended for Brand Campaigns
                </span>
              </div>

              {/* Scroll Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSuggested("left")}
                  aria-label="Scroll suggested creators left"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => scrollSuggested("right")}
                  aria-label="Scroll suggested creators right"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Carousel of Square Cards */}
            <div
              ref={suggestedScrollRef}
              className="flex items-center gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden no-scrollbar py-2 -mx-5 px-5 sm:-mx-8 sm:px-8"
            >
              {suggestedCreators.map((creator) => {
                const isSelected = selectedCreatorIds.includes(creator.id);
                return (
                  <div
                    key={creator.id}
                    onClick={() => setQuickViewCreator(creator)}
                    className={`group relative shrink-0 w-[190px] sm:w-[210px] aspect-square rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 snap-start select-none ${
                      isSelected ? "ring-2 ring-red-500" : "hover:-translate-y-1"
                    }`}
                  >
                    <Image
                      src={creator.featuredImage}
                      alt={creator.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out filter contrast-[1.06] group-hover:scale-105"
                      sizes="210px"
                    />

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/25 transition-all duration-300" />

                    {/* Top Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[8.5px] font-mono font-medium uppercase tracking-wider text-white">
                        {creator.category.split(" ")[0]}
                      </span>
                    </div>

                    {/* Top Right: Shortlist Select / View Action */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(creator);
                      }}
                      className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                        isSelected
                          ? "bg-red-600 text-white shadow-md scale-105"
                          : "bg-black/50 text-white/80 border border-white/20 hover:bg-white hover:text-neutral-950"
                      }`}
                      title={isSelected ? "Remove from campaign" : "Add to campaign"}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 inset-x-0 p-3 text-white z-10">
                      <div className="flex items-center gap-1 mb-0.5 text-[8px] font-mono text-red-400 font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="w-2.5 h-2.5 text-red-400" />
                        <span>TOP VETTED</span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white truncate group-hover:text-red-300 transition-colors">
                        {creator.name}
                      </h3>
                      <p className="text-[10px] text-neutral-300 font-light truncate">
                        {creator.role}
                      </p>

                      <div className="mt-1.5 pt-1.5 border-t border-white/15 flex items-center justify-between text-[9px] font-mono">
                        <span className="text-white font-semibold">
                          {creator.followersCount}
                        </span>
                        <span className="text-red-400 font-semibold flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" />
                          {creator.engagementRate}% ER
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clean White Space when empty (as requested) */}
            <div className="h-28 sm:h-36 w-full" />
          </div>
        )}

        {/* ACTIVE SEARCH STATE: Results Shown As User Types / Selects Filter */}
        {isSearchActive && (
          <div className="mt-8 space-y-5 animate-in fade-in duration-200">
            {/* Results Status Header */}
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-neutral-900">
                  {searchQuery ? `SEARCH RESULTS` : selectedCategory === "All" ? "MATCHING TALENT" : selectedCategory}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-mono font-medium">
                  {filteredCreators.length} Found
                </span>
              </div>

              {/* Reset search button */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  resetAllFilters();
                }}
                className="text-xs font-mono text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>

            {/* No Results Fallback */}
            {filteredCreators.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3.5 text-neutral-400">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-1">
                  No similar creators found
                </h4>
                <p className="text-xs text-neutral-500 mb-4">
                  We couldn&apos;t find any talent matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reset your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    resetAllFilters();
                  }}
                  className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-mono font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            ) : (
              /* Creators Square Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredCreators.map((creator) => {
                  const isSelected = selectedCreatorIds.includes(creator.id);

                  return (
                    <div
                      key={creator.id}
                      onClick={() => setQuickViewCreator(creator)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 select-none ${
                        isSelected ? "ring-2 ring-red-500 scale-[1.01]" : "hover:-translate-y-1"
                      }`}
                    >
                      <Image
                        src={creator.featuredImage}
                        alt={creator.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out filter contrast-[1.06] group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/25 transition-all duration-300" />

                      {/* Top Corner Pill: Category */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium uppercase tracking-wider text-white">
                          {creator.category.split(" ")[0]}
                        </span>
                      </div>

                      {/* Top Right: Shortlist Select / View Action */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(creator);
                        }}
                        className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                          isSelected
                            ? "bg-red-600 text-white shadow-md scale-105"
                            : "bg-black/50 text-white/80 border border-white/20 hover:bg-white hover:text-neutral-950"
                        }`}
                        title={isSelected ? "Remove from campaign" : "Add to campaign"}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>

                      {/* Bottom Details on Image */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white z-10">
                        <div className="flex items-center gap-1.5 mb-1 text-[8.5px] font-mono text-red-400 font-semibold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-red-400" />
                          <span>VERIFIED CREATOR</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-between">
                          <span className="truncate">{creator.name}</span>
                          <span className="text-[10px] font-mono font-normal text-white/60 shrink-0 ml-1">
                            {creator.location.split("•")[0]}
                          </span>
                        </h4>

                        <p className="text-xs text-neutral-300 font-light mt-0.5 truncate">
                          {creator.role}
                        </p>

                        {/* Reach + View CTA */}
                        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
                          <div>
                            <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block">
                              AUDIENCE REACH
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                              {creator.followersCount}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewCreator(creator);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-neutral-950 hover:bg-red-600 hover:text-white transition-all duration-300 text-xs font-semibold cursor-pointer shadow-sm group/btn"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Floating Campaign Shortlist Dock (Appears when 1+ creators selected) */}
      <CampaignRosterBar
        selectedCreators={selectedCreators}
        onOpenBooking={() => setIsBookingOpen(true)}
        onClearAll={handleClearAll}
      />

      {/* Creator Quick View & Showreel Modal */}
      <CreatorProfileModal
        creator={quickViewCreator}
        isSelected={
          quickViewCreator
            ? selectedCreatorIds.includes(quickViewCreator.id)
            : false
        }
        onClose={() => setQuickViewCreator(null)}
        onToggleSelect={handleToggleSelect}
        onBookDirect={(creator) => {
          if (!selectedCreatorIds.includes(creator.id)) {
            setSelectedCreatorIds((prev) => [...prev, creator.id]);
          }
          setIsBookingOpen(true);
        }}
      />

      {/* Agency Campaign Booking Modal */}
      <CampaignBookingModal
        isOpen={isBookingOpen}
        selectedCreators={selectedCreators}
        onClose={() => setIsBookingOpen(false)}
        onRemoveCreator={handleRemoveCreator}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
