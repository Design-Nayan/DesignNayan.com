"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { projectsData } from "@/modules/projects/data/projects.data";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { ProjectModal } from "@/modules/projects/components/ProjectModal";
import { cn } from "@/lib/utils";

const categories = ["ALL", "ARCHITECTURE", "INTERIOR", "COMMERCIAL", "BRANDING", "RENDERING"];

export function PortfolioView() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = projectsData.filter((p) => {
    if (activeCategory === "ALL") return true;
    return p.categoryTag === activeCategory;
  });

  return (
    <div className="min-h-screen bg-white select-none pb-20 font-sans">
      
      {/* 1. Hero Header */}
      <section className="bg-neutral-950 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
              DESIGN NAYAN ARCHITECTURE & INTERIOR PORTFOLIO
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Featured Work & <span className="text-rose-500">Case Studies</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-base lg:text-lg leading-relaxed">
              Explore our curated portfolio of residential villas, bespoke interior projects, commercial corporate hubs, and digital brand identities across Northeast India.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Bar */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
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

      {/* 3. Portfolio Grid: 3-card mobile row (grid-cols-3 on mobile) */}
      <section className="py-6 sm:py-12 lg:py-16 px-2 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="rounded-xl sm:rounded-3xl bg-white border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between group active:scale-[0.98] cursor-pointer"
            >
              {/* Project Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3">
                  <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-neutral-900/80 backdrop-blur-md text-[8px] sm:text-[10px] font-bold tracking-wider text-white uppercase shadow-sm font-mono truncate max-w-[80px] sm:max-w-none block">
                    {project.categoryTag}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-2 sm:p-5 flex items-center justify-between border-t border-neutral-100">
                <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                  <h3 className="text-[11px] sm:text-base font-bold text-neutral-900 group-hover:text-rose-600 transition-colors truncate">
                    {project.title}
                  </h3>
                  <div className="text-[9px] sm:text-xs text-neutral-500 truncate mt-0.5 font-normal">
                    {project.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                  className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border border-neutral-200 group-hover:border-neutral-900 flex items-center justify-center text-neutral-600 group-hover:text-neutral-950 shrink-0 transition-colors active:scale-95 bg-neutral-50"
                  title="View Project Details"
                >
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}
