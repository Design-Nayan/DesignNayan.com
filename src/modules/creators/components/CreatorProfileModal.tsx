"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Star, 
  MapPin, 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Globe, 
  ShieldCheck,
  Crown
} from "lucide-react";
import { CreatorItem } from "../types/creators.types";

interface CreatorProfileModalProps {
  creator: CreatorItem | null;
  onClose: () => void;
}

export function CreatorProfileModal({ creator, onClose }: CreatorProfileModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (creator) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [creator, onClose]);

  if (!creator) return null;

  const whatsappMessage = `Hi Design Nayan Creators! I would like to book creator *${creator.name}* (${creator.username}) from ${creator.location} for an upcoming brand campaign. Starting rate: ₹${creator.startingPrice.toLocaleString()} / ${creator.priceUnit}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop Click Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Area */}
        <div className="relative h-36 sm:h-48 w-full bg-neutral-900 overflow-hidden shrink-0">
          {creator.coverImage ? (
            <img
              src={creator.coverImage}
              alt={creator.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-900/60 to-neutral-950" />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-950/70 hover:bg-neutral-950 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Chip */}
          <div className="absolute bottom-4 left-24 sm:left-32 pl-4 z-10">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-neutral-800 shadow-sm">
              {creator.category}
            </span>
          </div>
        </div>

        {/* Creator Info & Avatar Header */}
        <div className="px-6 sm:px-8 pb-4 relative pt-2 shrink-0">
          {/* Avatar floating over cover */}
          <div className="absolute -top-12 sm:-top-16 left-6 sm:left-8 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-white overflow-hidden bg-neutral-100 shadow-xl">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Header Badges */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Starting Rate</span>
              <span className="text-lg sm:text-xl font-extrabold text-neutral-950">
                {creator.currency}{creator.startingPrice.toLocaleString()}
                <span className="text-xs font-normal text-neutral-500"> / {creator.priceUnit}</span>
              </span>
            </div>
          </div>

          {/* Creator Title & Handle */}
          <div className="mt-3 sm:mt-4 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
                {creator.name}
              </h2>
              {creator.verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20 shrink-0" />
              )}
              {creator.featured && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono">
              {creator.username} &bull; <MapPin className="w-3 h-3 inline text-neutral-400 -mt-0.5" /> {creator.location}
            </p>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="px-6 sm:px-8 py-4 overflow-y-auto space-y-6 flex-1 text-neutral-800">
          
          {/* Analytics / Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
            <div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono">Followers</div>
              <div className="text-sm sm:text-base font-extrabold text-neutral-950 mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
                <span>{creator.followers}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono">Rating</div>
              <div className="text-sm sm:text-base font-extrabold text-neutral-950 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{creator.rating.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono">Avg Views</div>
              <div className="text-sm sm:text-base font-extrabold text-neutral-950 mt-0.5 flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
                <span>{creator.avgViews}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono">Engagement</div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{creator.engagementRate}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              About Creator
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {creator.bio}
            </p>
          </div>

          {/* Niches & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Niche &amp; Content Types
              </span>
              <div className="flex flex-wrap gap-1.5">
                {creator.nicheTags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Languages Spoken
              </span>
              <div className="flex flex-wrap gap-1.5">
                {creator.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3 text-neutral-400" />
                    <span>{lang}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Packages */}
          {creator.packages && creator.packages.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Available Deliverable Packages
              </h4>
              <div className="space-y-2.5">
                {creator.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-bold text-neutral-950">
                        {pkg.title}
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-snug">
                        {pkg.deliverables}
                      </p>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900 shrink-0 font-mono self-start sm:self-center">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer: Action Bar */}
        <div className="p-4 sm:p-6 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 w-full sm:w-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified creator backed by Design Nayan escrow guarantee.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/918472934031?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
