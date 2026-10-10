"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Calculator,
  Briefcase,
  Megaphone,
  TrendingUp,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { allServices, serviceCategories, ServiceItem } from "../data/home.data";
import { StudioServiceDetail } from "@/modules/studio/types/studio.types";
import { BuildServiceDetail } from "@/modules/build/types/build.types";
import { cn } from "@/lib/utils";

interface ServicesGridProps {
  isFullPage?: boolean;
}

const computeActiveServices = (
  savedStudio?: StudioServiceDetail[] | null,
  savedBuild?: BuildServiceDetail[] | null
): ServiceItem[] => {
  const hasStudio = Array.isArray(savedStudio) && savedStudio.length > 0;
  const hasBuild = Array.isArray(savedBuild) && savedBuild.length > 0;

  if (!hasStudio && !hasBuild) {
    return allServices;
  }

  // Lookups for saved services from Admin
  const studioMap = new Map<string, StudioServiceDetail>();
  if (hasStudio) {
    savedStudio.forEach((s) => studioMap.set(s.id, s));
  }

  const buildMap = new Map<string, BuildServiceDetail>();
  if (hasBuild) {
    savedBuild.forEach((b) => buildMap.set(b.id, b));
  }

  const result: ServiceItem[] = [];
  const seenIds = new Set<string>();

  // 1. Maintain the balanced curated layout from allServices, updating any edited items
  for (const base of allServices) {
    if (base.destinationHub === "STUDIO") {
      if (hasStudio) {
        const updated = studioMap.get(base.id);
        if (updated) {
          result.push({
            id: updated.id,
            title: updated.title,
            description: updated.description,
            category: updated.category,
            iconName: updated.iconName || base.iconName,
            link: `/studio?service=${updated.id}`,
            destinationHub: "STUDIO",
          });
          seenIds.add(updated.id);
        }
      } else {
        result.push(base);
        seenIds.add(base.id);
      }
    } else if (base.destinationHub === "BUILD") {
      if (hasBuild) {
        const updated = buildMap.get(base.id);
        if (updated) {
          result.push({
            id: updated.id,
            title: updated.title,
            description: updated.description,
            category: "BUILD & CONSTRUCTION",
            iconName: updated.iconName || base.iconName,
            link: `/build?service=${updated.id}`,
            destinationHub: "BUILD",
          });
          seenIds.add(updated.id);
        }
      } else {
        result.push(base);
        seenIds.add(base.id);
      }
    } else {
      // CREATORS or other hubs
      result.push(base);
      seenIds.add(base.id);
    }
  }

  // 2. Append any newly added Studio services created in Admin (ignoring IDs already seen)
  if (hasStudio) {
    for (const s of savedStudio) {
      if (!seenIds.has(s.id)) {
        result.push({
          id: s.id,
          title: s.title,
          description: s.description,
          category: s.category,
          iconName: s.iconName || "Sparkles",
          link: `/studio?service=${s.id}`,
          destinationHub: "STUDIO",
        });
        seenIds.add(s.id);
      }
    }
  }

  // 3. Append any newly added Build services created in Admin (ignoring IDs already seen)
  if (hasBuild) {
    for (const b of savedBuild) {
      if (!seenIds.has(b.id)) {
        result.push({
          id: b.id,
          title: b.title,
          description: b.description,
          category: "BUILD & CONSTRUCTION",
          iconName: b.iconName || "HardHat",
          link: `/build?service=${b.id}`,
          destinationHub: "BUILD",
        });
        seenIds.add(b.id);
      }
    }
  }

  return result;
};

export function ServicesGrid({ isFullPage = false }: ServicesGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(allServices);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      let studio: StudioServiceDetail[] | null = null;
      let build: BuildServiceDetail[] | null = null;
      try {
        const rawStudio = localStorage.getItem("dn_studio_services");
        if (rawStudio) studio = JSON.parse(rawStudio);
      } catch {}
      try {
        const rawBuild = localStorage.getItem("dn_build_services");
        if (rawBuild) build = JSON.parse(rawBuild);
      } catch {}
      if (studio || build) {
        setServicesList(computeActiveServices(studio, build));
      }
    };

    loadFromLocalStorage();

    // Live Database Sync: fetch updated services from PostgreSQL
    fetch("/api/services", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) {
          const studio = Array.isArray(data.studio) && data.studio.length > 0 ? data.studio : null;
          const build = Array.isArray(data.build) && data.build.length > 0 ? data.build : null;
          if (studio || build) {
            setServicesList(computeActiveServices(studio, build));
            if (studio) {
              try {
                localStorage.setItem("dn_studio_services", JSON.stringify(studio));
              } catch {}
            }
            if (build) {
              try {
                localStorage.setItem("dn_build_services", JSON.stringify(build));
              } catch {}
            }
          }
        }
      })
      .catch((err) => console.warn("Failed to fetch live services:", err));

    window.addEventListener("storage", loadFromLocalStorage);
    return () => window.removeEventListener("storage", loadFromLocalStorage);
  }, []);

  const isAll = selectedCategory === "ALL";

  const filteredServices = isAll
    ? servicesList
    : servicesList.filter((s) => s.category === selectedCategory);

  const getServiceIcon = (iconName: string, destinationHub?: string) => {
    const isBuild = destinationHub === "BUILD";
    const isCreators = destinationHub === "CREATORS";
    const iconProps = { 
      className: cn(
        "w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75] transition-colors",
        isBuild ? "text-amber-600" : isCreators ? "text-rose-600" : "text-rose-500"
      ) 
    };
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
      case "Calculator":
        return <Calculator {...iconProps} />;
      case "Briefcase":
        return <Briefcase {...iconProps} />;
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
    <section id="services" className="py-14 sm:py-24 px-4 sm:px-6 bg-neutral-50/60 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 sm:mb-2 font-mono">
            WHAT WE DO
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            All Services. <span className="text-rose-600">One Place.</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-lg mx-auto font-normal">
            Click any service to navigate directly to its dedicated section in Studio, Build, or Creators.
          </p>
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
                  setIsExpanded(false);
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

        {/* Compact App-Style Grid: 2 columns on mobile, 3 on tablet, 5 on desktop (2 rows by default in ALL) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
          {filteredServices.map((service, idx) => {
            // Visibility: 2 rows by default in ALL tab (mobile: 4 items, tablet: 6 items, desktop: 10 items)
            let visibilityClass = "flex";
            if (isAll && !isExpanded) {
              if (idx < 4) {
                visibilityClass = "flex";
              } else if (idx < 6) {
                visibilityClass = "hidden md:flex";
              } else if (idx < 10) {
                visibilityClass = "hidden lg:flex";
              } else {
                visibilityClass = "hidden";
              }
            }

            const isBuild = service.destinationHub === "BUILD";
            const isCreators = service.destinationHub === "CREATORS";

            return (
              <Link
                key={`${service.destinationHub}-${service.id}-${idx}`}
                href={service.link}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                    e.preventDefault();
                    router.push(service.link);
                  }
                }}
                className={cn(
                  "p-3.5 sm:p-5 lg:p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between group active:scale-[0.98] cursor-pointer shadow-2xs hover:shadow-lg select-none",
                  isBuild
                    ? "border-neutral-200/80 hover:border-amber-400 hover:shadow-amber-500/10"
                    : isCreators
                    ? "border-neutral-200/80 hover:border-rose-400 hover:shadow-rose-500/10"
                    : "border-neutral-200/80 hover:border-rose-400/80 hover:shadow-rose-500/5",
                  visibilityClass
                )}
              >
                <div>
                  {/* Top: Icon + Destination Hub Pill */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-3 lg:mb-4">
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                      isBuild
                        ? "bg-amber-50/80 border border-amber-200/70 group-hover:bg-amber-100/90"
                        : isCreators
                        ? "bg-rose-50/90 border border-rose-200/70 group-hover:bg-rose-100"
                        : "bg-rose-50/70 border border-rose-100 group-hover:bg-rose-100/80"
                    )}>
                      {getServiceIcon(service.iconName, service.destinationHub)}
                    </div>

                    <span className={cn(
                      "text-[8.5px] sm:text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0",
                      isBuild
                        ? "bg-amber-50 text-amber-700 border-amber-200/80"
                        : isCreators
                        ? "bg-rose-50 text-rose-700 border-rose-200/80"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200/80"
                    )}>
                      {service.destinationHub}
                    </span>
                  </div>

                  <h3 className={cn(
                    "text-xs sm:text-sm lg:text-base font-bold text-neutral-900 mb-1 transition-colors line-clamp-1",
                    isBuild
                      ? "group-hover:text-amber-600"
                      : "group-hover:text-rose-600"
                  )}>
                    {service.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Route Indicator */}
                <div className="pt-2.5 sm:pt-3 lg:pt-4 mt-1 border-t border-neutral-100 sm:border-t-0 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold transition-colors",
                      isBuild
                        ? "text-amber-600 group-hover:text-amber-700"
                        : isCreators
                        ? "text-rose-600 group-hover:text-rose-700"
                        : "text-rose-600 group-hover:text-rose-700"
                    )}
                  >
                    <span>
                      {isBuild
                        ? "Explore Build"
                        : isCreators
                        ? "Explore Creators"
                        : "Explore Studio"}
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );

          })}
        </div>

        {/* View All Services / Show Less Toggle Button (Unified for Mobile, Tablet & Desktop) */}
        {isAll && (
          <div className="flex justify-center pt-1 sm:pt-2">
            <button
              onClick={() => {
                if (isExpanded) {
                  const el = document.getElementById("services");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }
                setIsExpanded(!isExpanded);
              }}
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-wider border border-neutral-300 transition-all shadow-xs active:scale-95 cursor-pointer select-none group"
            >
              <span>{isExpanded ? "SHOW LESS" : "VIEW ALL SERVICES"}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-neutral-600" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-neutral-600" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
