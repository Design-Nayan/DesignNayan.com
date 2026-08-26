import React from "react";
import { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { processSteps, heroStats } from "@/modules/home/data/home.data";

export const metadata: Metadata = {
  title: "About Us | Design Nayan",
  description: "Learn more about Design Nayan, our holistic Design, Build & Stay ecosystem in Guwahati, Assam.",
};

export default function AboutPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-24 bg-white">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase">
          ABOUT DESIGN NAYAN
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight">
          One Ecosystem. One Unified Vision.
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          Headquartered in Guwahati, Assam, Design Nayan is an integrated ecosystem connecting architectural design, digital creative branding, turnkey construction, and premium stay properties.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {heroStats.map((s) => (
          <div key={s.label} className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 font-mono">
              {s.value}
            </div>
            <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-neutral-700 leading-relaxed text-base">
          <h2 className="text-3xl font-bold text-neutral-950">
            Why Design Nayan?
          </h2>
          <p>
            Traditional clients often face friction jumping between disparate architects, contractors, branding agencies, and suppliers.
          </p>
          <p>
            Design Nayan brings all disciplines under one roof: from the initial 3D visualization and municipal floor plans to on-site material supply, turnkey construction, and digital marketing.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
              <CheckCircle2 className="w-5 h-5 text-rose-600" />
              <span>Transparent Project Tracking & Pricing</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
              <CheckCircle2 className="w-5 h-5 text-rose-600" />
              <span>Authentic Certified Materials from Tier-1 Brands</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
              <CheckCircle2 className="w-5 h-5 text-rose-600" />
              <span>Award-Winning Architectural & Digital Aesthetics</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
            alt="Design Nayan Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 5-Step Process */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase">
            HOW WE WORK
          </span>
          <h2 className="text-3xl font-bold text-neutral-950">
            Our 5-Step Seamless Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col text-center items-center"
            >
              <div className="text-xs font-bold text-rose-600 mb-2 font-mono">{step.step}</div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">{step.title}</h3>
              <p className="text-xs text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
