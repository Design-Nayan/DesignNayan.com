"use client";

import React, { useRef } from "react";
import { ShieldCheck, Award, Sparkles, Zap, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import { AGENCY_GUARANTEES } from "../data";

const ICON_MAP = {
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
};

interface AgencyGuaranteesProps {
  onOpenBooking: () => void;
}

export function AgencyGuarantees({ onOpenBooking }: AgencyGuaranteesProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Heading comes from top on scroll down, reverses on scroll up
      gsap.fromTo(
        ".guarantees-heading",
        { y: -35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".guarantees-heading",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // 4 Guarantee cards stagger up on scroll down, reverse on scroll up
      gsap.fromTo(
        ".guarantee-card",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".guarantees-grid",
            start: "top 88%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      // Custom Campaign Banner: left text from left, right button from right
      gsap.fromTo(
        ".custom-campaign-left",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".custom-campaign-banner",
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        ".custom-campaign-right",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".custom-campaign-banner",
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#fcfcfb] text-[#141414] py-16 sm:py-24 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Simple Section Heading Only (No subtext) */}
        <div className="guarantees-heading text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
            THE AGENCY DIFFERENCE
          </h2>
        </div>

        {/* 4 Guarantees Cards (Redesigned Editorial Visuals) */}
        <div className="guarantees-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {AGENCY_GUARANTEES.map((item, idx) => {
            const Icon = ICON_MAP[item.iconName];
            return (
              <div
                key={idx}
                className="guarantee-card group relative bg-white hover:bg-neutral-50/80 border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-6 transition-colors duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md select-none"
              >
                <div>
                  {/* Top Bar: Icon + Minimal Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-red-600 group-hover:text-white text-neutral-800 flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
                    </div>

                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-neutral-400 group-hover:text-red-600 transition-colors">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>GUARANTEE 0{idx + 1}</span>
                  <span className="text-red-500 font-bold">● ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redesigned Custom Creator Campaign Callout Banner */}
        <div className="custom-campaign-banner rounded-3xl bg-neutral-950 text-white p-7 sm:p-10 lg:p-12 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Ambient Crimson Glow in Corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 blur-3xl rounded-full pointer-events-none" />

          <div className="custom-campaign-left space-y-2 text-center md:text-left relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
              BESPOKE TALENT CURATION
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
              NEED A CUSTOM CREATORS CAMPAIGN?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-light leading-relaxed">
              Tell our Talent Directors your budget, target demographics, and goals. We will build a customized campaign strategy within 24 hours.
            </p>
          </div>

          <div className="custom-campaign-right relative z-10 shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-red-600 text-neutral-950 hover:text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>REQUEST CUSTOM CAMPAIGN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
