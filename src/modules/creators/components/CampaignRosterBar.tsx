"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, X, Sparkles, Flame, ShieldCheck } from "lucide-react";
import { Creator } from "../creators.types";

interface CampaignRosterBarProps {
  selectedCreators: Creator[];
  onOpenBooking: () => void;
  onClearAll: () => void;
}

export function CampaignRosterBar({
  selectedCreators,
  onOpenBooking,
  onClearAll,
}: CampaignRosterBarProps) {
  if (selectedCreators.length === 0) return null;

  // Aggregate Reach Calculation
  const totalReachFormatted = React.useMemo(() => {
    let total = 0;
    selectedCreators.forEach((c) => {
      if (c.followersCount.includes("M")) {
        total += parseFloat(c.followersCount) * 1000000;
      } else if (c.followersCount.includes("K")) {
        total += parseFloat(c.followersCount) * 1000;
      }
    });

    if (total >= 1000000) {
      return (total / 1000000).toFixed(1) + "M+";
    }
    return (total / 1000).toFixed(0) + "K+";
  }, [selectedCreators]);

  // Average Engagement
  const avgEngagement = (
    selectedCreators.reduce((acc, c) => acc + c.engagementRate, 0) /
    selectedCreators.length
  ).toFixed(1);

  return (
    <div className="fixed bottom-20 sm:bottom-6 inset-x-3 sm:inset-x-6 z-50 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div className="bg-[#120406]/95 backdrop-blur-xl border border-red-600/40 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xl shadow-red-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Avatar Stack & Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-2.5 overflow-hidden shrink-0">
            {selectedCreators.map((creator) => (
              <div
                key={creator.id}
                className="relative w-9 h-9 rounded-full ring-2 ring-red-600/80 overflow-hidden bg-neutral-800"
              >
                <Image
                  src={creator.avatar || creator.featuredImage}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Text Summary */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white">
                {selectedCreators.length} Creator{selectedCreators.length > 1 ? "s" : ""} Selected
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-300">
              <span className="font-mono text-red-300">{totalReachFormatted} Combined Reach</span>
              <span>•</span>
              <span className="font-mono text-emerald-400">{avgEngagement}% Avg ER</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onClearAll}
            className="px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Campaign</span>
            <ArrowUpRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
