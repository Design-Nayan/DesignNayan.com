import { CapabilityStepItem } from "../creators.types";

/**
 * EVERYTHING YOUR BRAND NEEDS: CAPABILITY STEPS
 *
 * Future Admin Panel Note:
 * Website owners can customize the capability step titles, step indices, and styling classes.
 */
export const CAPABILITIES_STEPS: CapabilityStepItem[] = [
  {
    id: "step-1",
    step: "01",
    title: "Branding Strategy",
    bgClass: "bg-[#2a1714] hover:bg-[#381e19]",
    borderClass: "border-[#f97316]/30 hover:border-[#f97316]/70",
    badgeClass: "bg-[#ea580c] text-white shadow-[0_0_12px_rgba(234,88,12,0.5)]",
    textClass: "text-[#fed7aa]",
    targetCategory: "Viral UGC & Short-Form",
  },
  {
    id: "step-2",
    step: "02",
    title: "Visual Identity",
    bgClass: "bg-[#111f38] hover:bg-[#162a4d]",
    borderClass: "border-[#38bdf8]/30 hover:border-[#38bdf8]/70",
    badgeClass: "bg-[#0284c7] text-white shadow-[0_0_12px_rgba(2,132,199,0.5)]",
    textClass: "text-[#bae6fd]",
    targetCategory: "High Fashion & Luxury",
  },
  {
    id: "step-3",
    step: "03",
    title: "Creative Direction",
    bgClass: "bg-[#162319] hover:bg-[#1d3022]",
    borderClass: "border-[#84cc16]/30 hover:border-[#84cc16]/70",
    badgeClass: "bg-[#65a30d] text-white shadow-[0_0_12px_rgba(101,163,13,0.5)]",
    textClass: "text-[#d9f99d]",
    targetCategory: "3D & CGI Motion",
  },
];
