"use client";

import React, { useState } from "react";
import { 
  Star, 
  MapPin, 
  Users, 
  Heart, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Crown
} from "lucide-react";
import { CreatorItem } from "../types/creators.types";
import { cn } from "@/lib/utils";

interface CreatorCardProps {
  creator: CreatorItem;
  onSelect: (creator: CreatorItem) => void;
  viewMode?: "grid" | "list";
}

export function CreatorCard({ creator, onSelect, viewMode = "grid" }: CreatorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (viewMode === "list") {
    return (
      <article
        onClick={() => onSelect(creator)}
        className="group relative bg-white rounded-2xl border border-neutral-200/90 hover:border-neutral-300 p-4 sm:p-5 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Avatar / Photo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {creator.featured && (
              <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xs">
                <Crown className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-rose-600 transition-colors truncate">
                {creator.name}
              </h3>
              {creator.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0" />
              )}
            </div>

            <p className="text-xs text-neutral-500 font-medium">
              {creator.nicheTags.join(" • ")}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-1">
              <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{creator.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({creator.reviewCount})</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{creator.location}</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span>{creator.followers}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-neutral-400 block font-sans">Starting at</span>
            <span className="text-base sm:text-lg font-extrabold text-neutral-900">
              {creator.currency}{creator.startingPrice.toLocaleString()}
              <span className="text-xs font-normal text-neutral-500"> / {creator.priceUnit}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(creator);
            }}
            className="px-4 py-2 rounded-xl border border-rose-200 hover:border-rose-600 bg-rose-50/50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            View Profile
          </button>
        </div>
      </article>
    );
  }

  // Grid Card View (Faithful reproduction of reference design)
  return (
    <article
      onClick={() => onSelect(creator)}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 hover:border-neutral-300 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between transform-gpu"
    >
      {/* Top Image Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges: Featured Crown + Heart Favorite */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {creator.featured ? (
            <span className="w-7 h-7 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-md backdrop-blur-xs">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </span>
          ) : (
            <span className="w-7 h-7 rounded-full bg-neutral-900/60 text-white flex items-center justify-center shadow-md backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}

          <button
            type="button"
            onClick={handleFavoriteClick}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-rose-600 flex items-center justify-center shadow-md backdrop-blur-xs pointer-events-auto transition-transform active:scale-90 cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "fill-rose-500 text-rose-500" : "")} />
          </button>
        </div>

        {/* Bottom Play Button Overlay (Video preview affordance) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center shadow-md backdrop-blur-xs group-hover:scale-110 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </span>
        </div>

        {/* Gradient shadow for smooth image contrast */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Card Info Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          {/* Creator Name + Verified Tick */}
          <div className="flex items-center gap-1.5">
            <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-rose-600 transition-colors truncate">
              {creator.name}
            </h3>
            {creator.verified && (
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0" />
            )}
          </div>

          {/* Categories / Niche */}
          <p className="text-xs text-neutral-500 font-medium truncate">
            {creator.nicheTags.join(" • ")}
          </p>

          {/* Rating, Reviews & Location */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span className="inline-flex items-center gap-1 text-neutral-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{creator.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({creator.reviewCount})</span>
            </span>

            <span className="inline-flex items-center gap-1 text-neutral-500 truncate max-w-[50%]">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{creator.location}</span>
            </span>
          </div>

          {/* Followers Count */}
          <div className="text-xs font-semibold text-neutral-700 pt-0.5">
            <span>{creator.followers} Followers</span>
          </div>
        </div>

        {/* Pricing & View Profile Button */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
              Starting at
            </span>
            <span className="text-sm sm:text-base font-extrabold text-neutral-950">
              {creator.currency}{creator.startingPrice.toLocaleString()}
              <span className="text-[11px] font-normal text-neutral-500"> / {creator.priceUnit}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(creator);
            }}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 hover:border-rose-600 bg-rose-50/60 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}
