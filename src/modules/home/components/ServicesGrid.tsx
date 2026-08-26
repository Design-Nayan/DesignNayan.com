"use client";

import React, { useState } from "react";
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
  HardHat, 
  Truck, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { allServices, serviceCategories } from "../data/home.data";
import { cn } from "@/lib/utils";

export function ServicesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL SERVICES");
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);

  const filteredServices = selectedCategory === "ALL SERVICES"
    ? allServices
    : allServices.filter((s) => s.category === selectedCategory);

  // On mobile: show first 6 services by default, or all if showAllMobile is true
  const mobileDisplayLimit = 6;
  const isFiltered = selectedCategory !== "ALL SERVICES";

  const getServiceIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4 sm:w-5 sm:h-5 text-rose-500 stroke-[1.75]" };
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
      case "HardHat":
        return <HardHat {...iconProps} />;
      case "Truck":
        return <Truck {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  return (
    <section id="services" className="py-14 sm:py-24 px-4 sm:px-6 bg-neutral-50/60 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 sm:mb-2">
            WHAT WE DO
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            All Services. <span className="text-rose-600">One Place.</span>
          </h2>
        </div>

        {/* Mobile Swipeable Category Tabs */}
        <div className="flex items-center sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 mb-6 sm:mb-14 -mx-4 px-4 sm:mx-0 sm:px-0">
          {serviceCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAllMobile(false);
                }}
                className={cn(
                  "shrink-0 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95",
                  isSelected
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Compact App-Style Grid: 2 columns on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 mb-8 sm:mb-14">
          {filteredServices.map((service, idx) => {
            const isHiddenOnMobile = !showAllMobile && !isFiltered && idx >= mobileDisplayLimit;

            return (
              <div
                key={service.id}
                className={cn(
                  "p-3.5 sm:p-5 lg:p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-rose-400/80 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 flex flex-col justify-between group active:scale-[0.98]",
                  isHiddenOnMobile ? "hidden sm:flex" : "flex"
                )}
              >
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-center mb-2.5 sm:mb-3 lg:mb-4 group-hover:scale-105 group-hover:bg-rose-100/80 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-neutral-900 mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-3 lg:pt-4 mt-1 border-t border-neutral-100 sm:border-t-0">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile "Explore More Services" Expand Toggle / Desktop View All Link */}
        <div className="flex flex-col items-center gap-2">
          {!isFiltered && filteredServices.length > mobileDisplayLimit && (
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="sm:hidden inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-sm"
            >
              <span>{showAllMobile ? "Show Less" : `Explore More Services (${filteredServices.length - mobileDisplayLimit}+)`}</span>
              {showAllMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <Link
            href="/services"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-wider border border-neutral-300 transition-all shadow-sm active:scale-95"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
