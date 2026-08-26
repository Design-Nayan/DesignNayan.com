"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  Palette, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  PenTool, 
  Globe, 
  Megaphone, 
  Eye, 
  HardHat 
} from "lucide-react";
import { studioCategories, studioServicesData } from "../data/studio.data";
import { StudioService } from "../types/studio.types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  HardHat: <HardHat className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Palette: <Palette className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Layers: <Layers className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Sparkles: <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Eye: <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  PenTool: <PenTool className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Globe: <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
  Megaphone: <Megaphone className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />,
};

export function StudioView() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredServices = studioServicesData.filter((service) => {
    if (activeCategory === "ALL") return true;
    return service.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-white select-none pb-20 font-sans">
      
      {/* 1. Page Hero */}
      <section className="bg-neutral-950 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
            DESIGN NAYAN CREATIVE STUDIO
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Architecture, Interior & <span className="text-rose-500">Digital Design</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            From architectural blueprints and photorealistic 3D CGI to modern brand identities and software design, we craft extraordinary spaces and visual systems.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Navigation */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {studioCategories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95",
                  isSelected
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Studio Services Grid: 3-card mobile row (grid-cols-3 on mobile) */}
      <section className="py-8 sm:py-14 lg:py-20 px-2 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="rounded-xl sm:rounded-3xl bg-neutral-50 border border-neutral-200/80 p-2 sm:p-7 hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-6">
                  <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-white border border-neutral-200 flex items-center justify-center group-hover:scale-105 group-hover:border-rose-300 transition-transform">
                    {iconMap[service.iconName] || <Compass className="w-4 h-4 sm:w-6 sm:h-6 text-rose-600" />}
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-rose-600 uppercase font-mono tracking-wider truncate max-w-[80px] sm:max-w-none">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-[11px] sm:text-xl font-bold text-neutral-900 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2">
                  {service.name}
                </h3>
                
                <p className="text-[10px] sm:text-xs text-neutral-600 mt-1 sm:mt-2 leading-tight sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-none hidden sm:block">
                  {service.desc}
                </p>
              </div>

              <div className="pt-2 sm:pt-6 border-t border-neutral-200/60 mt-2 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <span className="text-[9px] sm:text-xs font-bold text-neutral-950 font-mono truncate">
                  {service.price}
                </span>

                <Link
                  href={`/contact?service=${encodeURIComponent(service.name)}`}
                  className="inline-flex items-center justify-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider py-1 sm:py-0"
                >
                  <span>Book</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase font-mono block">
              CUSTOM ARCHITECTURE & DESIGN CONSULTATION
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Have a Specific Space or Branding Requirement?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Talk directly with our principal architects and digital design team for a customized scope and site estimation.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <span>DISCUSS YOUR BRIEF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
