"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowUpRight, 
  MapPin, 
  Pause, 
  Play, 
  Sparkles
} from "lucide-react";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { cn } from "@/lib/utils";

interface PortfolioMotionColumnsProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

// Prepares an array so it can loop seamlessly from 0% to -50% or -50% to 0%
function createSeamlessLoop(items: ProjectItem[], minItems = 5): ProjectItem[] {
  if (items.length === 0) return [];
  let base = [...items];
  while (base.length < minItems) {
    base = [...base, ...items];
  }
  // Duplicate for seamless 50% translation loop
  return [...base, ...base];
}

export function PortfolioMotionColumns({
  projects,
  onSelectProject,
}: PortfolioMotionColumnsProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Distribute projects across 3 columns
  const col1Items = useMemo(() => {
    const list = projects.filter((_, idx) => idx % 3 === 0);
    return createSeamlessLoop(list.length > 0 ? list : projects);
  }, [projects]);

  const col2Items = useMemo(() => {
    const list = projects.filter((_, idx) => idx % 3 === 1);
    return createSeamlessLoop(list.length > 0 ? list : projects);
  }, [projects]);

  const col3Items = useMemo(() => {
    const list = projects.filter((_, idx) => idx % 3 === 2);
    return createSeamlessLoop(list.length > 0 ? list : projects);
  }, [projects]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-2 select-none">
      
      {/* Dynamic Keyframes for Top-to-Bottom and Bottom-to-Top Infinite Motion */}
      <style jsx global>{`
        @keyframes flowDown {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0%, 0);
          }
        }

        @keyframes flowUp {
          0% {
            transform: translate3d(0, 0%, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }

        .motion-column-down {
          animation: flowDown 42s linear infinite;
          will-change: transform;
        }

        .motion-column-up {
          animation: flowUp 38s linear infinite;
          will-change: transform;
        }

        .motion-column-down-delayed {
          animation: flowDown 48s linear infinite;
          will-change: transform;
        }

        .motion-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Top Control Bar for Motion Mode */}
      <div className="flex items-center justify-end pb-3 sm:pb-4 px-1">
        {/* Global Motion Pause / Play Toggle */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white hover:bg-neutral-900 border border-neutral-200/90 hover:border-neutral-900 text-neutral-700 hover:text-white transition-all duration-300 text-[10.5px] font-mono shadow-2xs cursor-pointer active:scale-95"
          title={isPaused ? "Resume Motion" : "Pause Motion"}
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span>Resume Stream</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-rose-500 fill-rose-500 group-hover:text-rose-400" />
              <span>Pause Stream</span>
            </>
          )}
        </button>
      </div>

      {/* Main 3-Column Motion Container */}
      <div className="relative h-[660px] sm:h-[760px] lg:h-[820px] rounded-3xl overflow-hidden border border-neutral-200/80 bg-neutral-100/40 p-2 sm:p-4">
        
        {/* Top Vignette Gradient Mask */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-[#fafaf9] via-[#fafaf9]/80 to-transparent z-20" />
        
        {/* Bottom Vignette Gradient Mask */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/80 to-transparent z-20" />

        {/* 3 Columns Grid: All 3 columns visible across all devices */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 h-full overflow-hidden">
          
          {/* ================================================================= */}
          {/* COLUMN 1: TOP TO BOTTOM (DOWNWARDS)                               */}
          {/* ================================================================= */}
          <div className="relative h-full overflow-hidden group/col">
            <div
              className={cn(
                "motion-column-down flex flex-col gap-3 sm:gap-6 group-hover/col:[animation-play-state:paused]",
                isPaused && "motion-paused"
              )}
            >
              {col1Items.map((project, idx) => (
                <ProjectMotionCard
                  key={`col1-${project.id}-${idx}`}
                  project={project}
                  onClick={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* COLUMN 2: BOTTOM TO TOP (UPWARDS)                                 */}
          {/* ================================================================= */}
          <div className="relative h-full overflow-hidden group/col">
            <div
              className={cn(
                "motion-column-up flex flex-col gap-3 sm:gap-6 group-hover/col:[animation-play-state:paused]",
                isPaused && "motion-paused"
              )}
            >
              {col2Items.map((project, idx) => (
                <ProjectMotionCard
                  key={`col2-${project.id}-${idx}`}
                  project={project}
                  onClick={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* COLUMN 3: TOP TO BOTTOM (DOWNWARDS)                               */}
          {/* ================================================================= */}
          <div className="relative h-full overflow-hidden group/col">
            <div
              className={cn(
                "motion-column-down-delayed flex flex-col gap-3 sm:gap-6 group-hover/col:[animation-play-state:paused]",
                isPaused && "motion-paused"
              )}
            >
              {col3Items.map((project, idx) => (
                <ProjectMotionCard
                  key={`col3-${project.id}-${idx}`}
                  project={project}
                  onClick={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Individual Architectural Motion Card with responsive scaling
function ProjectMotionCard({
  project,
  onClick,
}: {
  project: ProjectItem;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="group/card relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer transform-gpu"
    >
      {/* Media Box */}
      <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Top Tags */}
        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex items-center gap-1 sm:gap-1.5">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md text-[8px] sm:text-[9px] font-mono font-medium text-white uppercase tracking-wider shadow-xs truncate max-w-[80px] sm:max-w-none">
            {project.categoryTag}
          </span>
          <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[8px] sm:text-[9px] font-mono text-neutral-800 shadow-xs">
            {project.year}
          </span>
        </div>

        {/* Hover Action Badge */}
        <div className="absolute bottom-1.5 sm:bottom-2.5 right-1.5 sm:right-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-md">
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-2 sm:p-4 space-y-1 sm:space-y-1.5">
        <div className="hidden sm:flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
          <span className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="truncate">{project.location}</span>
          </span>
          <span className="shrink-0">{project.area}</span>
        </div>

        <h3 className="text-xs sm:text-base font-semibold text-neutral-950 group-hover/card:text-rose-600 transition-colors leading-snug line-clamp-1">
          {project.title}
        </h3>

        <div className="pt-1.5 sm:pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] sm:text-[10.5px] font-mono text-neutral-400">
          <span className="truncate max-w-[60%] hidden xs:inline">{project.client}</span>
          <span className="text-neutral-900 group-hover/card:text-rose-600 font-semibold inline-flex items-center gap-0.5 sm:gap-1 shrink-0 ml-auto xs:ml-0">
            <span>View</span>
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
