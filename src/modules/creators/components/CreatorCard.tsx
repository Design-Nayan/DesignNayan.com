"use client";

import React from "react";
import Image from "next/image";
import { Check, Plus, Eye, Sparkles, Clock, Flame, Award } from "lucide-react";
import { Creator } from "../creators.types";

interface CreatorCardProps {
  creator: Creator;
  isSelected: boolean;
  onToggleSelect: (creator: Creator) => void;
  onQuickView: (creator: Creator) => void;
}

export function CreatorCard({
  creator,
  isSelected,
  onToggleSelect,
  onQuickView,
}: CreatorCardProps) {
  return (
    <div
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? "border-red-600 ring-2 ring-red-600/40 shadow-xl shadow-red-950/10"
          : "border-neutral-200/90 hover:border-red-400/60 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Top Image Showcase Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => onQuickView(creator)}>
        <Image
          src={creator.featuredImage}
          alt={creator.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 filter contrast-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay for bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20 group-hover:via-black/35 transition-all" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-white">
            {creator.category.split(" ")[0]}
          </span>

          <div className="flex items-center gap-1.5">
            {creator.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                VETTED
              </span>
            )}
          </div>
        </div>

        {/* Floating Quick View Trigger on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="px-3.5 py-2 rounded-full bg-white/95 text-neutral-950 text-xs font-semibold tracking-wide shadow-2xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            Quick Profile & Showreel
          </span>
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-red-300 transition-colors">
              {creator.name}
            </h3>
            <span className="text-xs font-mono text-neutral-300">
              {creator.location.split("•")[0]}
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-light truncate mt-0.5">
            {creator.role}
          </p>

          {/* Social Proof Stats Pills */}
          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-white/15 text-[11px]">
            <span className="font-semibold text-white bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
              {creator.followersCount} Reach
            </span>
            <span className="font-semibold text-red-300 bg-red-950/60 border border-red-700/40 px-2 py-0.5 rounded flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              {creator.engagementRate}% ER
            </span>
            <span className="ml-auto text-[10px] text-neutral-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              {creator.turnaroundDays}d turnaround
            </span>
          </div>
        </div>
      </div>

      {/* Card Content & Agency Action Suite */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        
        {/* Past Brand Deals */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-neutral-400" />
            <span>Past Brand Collabs</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {creator.pastBrands.slice(0, 3).map((brand) => (
              <span
                key={brand}
                className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium"
              >
                {brand}
              </span>
            ))}
            {creator.pastBrands.length > 3 && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 text-[10px]">
                +{creator.pastBrands.length - 3}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 font-light line-clamp-2 leading-relaxed">
            {creator.bio}
          </p>
        </div>

        {/* Pricing & Selection Actions */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Deliverables from
            </span>
            <span className="text-sm font-bold text-neutral-950">
              {creator.startingRate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuickView(creator)}
              aria-label={`View profile for ${creator.name}`}
              className="px-2.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-300 text-xs font-medium transition-colors"
            >
              Details
            </button>

            <button
              onClick={() => onToggleSelect(creator)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? "bg-red-600 text-white shadow-md shadow-red-900/30 hover:bg-red-700"
                  : "bg-neutral-950 text-white hover:bg-neutral-800"
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
