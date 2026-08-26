"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { projectsData } from "../data/projects.data";
import { ProjectItem } from "../types/projects.types";
import { ProjectModal } from "./ProjectModal";
import { cn } from "@/lib/utils";

export function RecentWorkCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.65));
      setActiveIndex(Math.min(index, projectsData.length));
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="portfolio" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-white select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="flex items-end justify-between mb-6 sm:mb-10 lg:mb-14 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 sm:mb-2 font-mono">
              FEATURED PROJECTS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Some Of Our <span className="text-rose-600">Recent Work</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Only Navigation Arrows */}
            <div className="hidden 2xl:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-4 h-4 text-rose-600" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
                aria-label="Next project"
              >
                <ChevronRight className="w-4 h-4 text-rose-600" />
              </button>
            </div>

            {/* Desktop View All Link */}
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 transition-colors"
            >
              <span>View All Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Project Cards Horizontal Scroll */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex 2xl:grid 2xl:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory touch-pan-x -mx-4 px-4 sm:-mx-6 sm:px-6 2xl:mx-0 2xl:px-0 pb-3 2xl:pb-0 scroll-pl-4 sm:scroll-pl-6"
        >
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="shrink-0 w-[220px] sm:w-[280px] 2xl:w-auto snap-start rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between group active:scale-[0.98] shadow-sm cursor-pointer"
            >
              {/* Project Image with Category Badge */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-[9px] font-bold tracking-wider text-white uppercase shadow-sm font-mono">
                    {project.categoryTag}
                  </span>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="p-3 sm:p-4 flex items-center justify-between border-t border-neutral-100">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-rose-600 transition-colors truncate">
                    {project.title}
                  </h3>
                  <div className="text-[10px] sm:text-[11px] text-neutral-500 truncate mt-0.5 font-normal">
                    {project.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalProject(project);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-neutral-200 group-hover:border-neutral-900 flex items-center justify-center text-neutral-600 group-hover:text-neutral-950 shrink-0 transition-colors active:scale-95 bg-neutral-50"
                  title="View Project Details"
                >
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* End-of-Scroll "View More" Card */}
          <Link
            href="/portfolio"
            className="shrink-0 w-[180px] sm:w-[240px] 2xl:hidden snap-start rounded-xl sm:rounded-2xl bg-neutral-950 text-white p-5 flex flex-col items-center justify-center text-center group hover:bg-neutral-900 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
              <Sparkles className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
              Explore All
            </h4>
            <p className="text-[10px] text-neutral-400 mb-3">
              View full portfolio
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 group-hover:text-rose-400">
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile & Tablet Swipe Indicator Dots */}
        <div className="flex 2xl:hidden items-center justify-center gap-1.5 pt-3 sm:pt-4">
          {[...projectsData, { id: "view-more" }].map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = scrollRef.current.clientWidth * 0.65;
                  scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                }
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === idx ? "w-6 bg-rose-600" : "w-1.5 bg-neutral-300"
              )}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
