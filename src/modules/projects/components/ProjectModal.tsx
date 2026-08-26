"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare 
} from "lucide-react";
import { ProjectItem } from "../types/projects.types";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project) return null;

  const currentHero = selectedImage || project.image;

  return (
    <div className="fixed inset-0 z-40 bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 pt-3 pb-24 sm:p-6 sm:pb-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[calc(100vh-130px)] sm:max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 text-neutral-900 relative my-auto overflow-hidden">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-950/80 hover:bg-neutral-950 text-white backdrop-blur-md flex items-center justify-center text-sm font-bold z-20 shadow-lg active:scale-95 transition-transform cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Project Hero Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden -mt-1 sm:mt-0">
            <img
              src={currentHero}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[9px] sm:text-xs font-bold tracking-wider text-white uppercase font-mono shadow-sm">
                {project.categoryTag}
              </span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 sm:p-4 rounded-xl text-white">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-rose-400 font-semibold mb-0.5">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{project.location}</span>
              </div>
              <h2 className="text-base sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Key Project Specs Pill Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl border border-neutral-200/80 text-center">
            <div>
              <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Area / Scale</div>
              <div className="text-[11px] sm:text-xs font-bold text-neutral-950 font-mono mt-0.5">{project.area}</div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Completed</div>
              <div className="text-[11px] sm:text-xs font-bold text-neutral-950 font-mono mt-0.5">{project.year}</div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-mono">Client Type</div>
              <div className="text-[11px] sm:text-xs font-bold text-neutral-950 mt-0.5 truncate">{project.client}</div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="space-y-1">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
              Project Overview & Scope
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">
              {project.overview}
            </p>
          </div>

          {/* Project Highlights Checklist */}
          <div className="space-y-1.5">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
              Execution Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-sm text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery Thumbnails */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Project Gallery
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {project.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentHero === imgUrl ? "border-rose-600 scale-95" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 sm:pt-4 pb-1 sm:pb-0 border-t border-neutral-100 flex flex-row items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/918638053380?text=${encodeURIComponent(
                `Hi Design Nayan! I was looking at your project *${project.title}* (${project.categoryTag} in ${project.location}) in your portfolio. I would like to discuss a similar project for my space.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-2 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              href={`/contact?service=${encodeURIComponent(project.categoryTag)}&project=${encodeURIComponent(project.title)}`}
              onClick={onClose}
              className="flex-1 py-3 px-2 sm:px-4 rounded-xl bg-neutral-950 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
