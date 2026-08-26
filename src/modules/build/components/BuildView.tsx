"use client";

import React from "react";
import Link from "next/link";
import { 
  HardHat, 
  Truck, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Hammer, 
  Sparkles,
  PhoneCall,
  MessageSquare
} from "lucide-react";
import { buildOfferingsData, materialCategoriesData } from "../data/build.data";

const iconMap: Record<string, React.ReactNode> = {
  HardHat: <HardHat className="w-6 h-6 text-rose-600" />,
  Truck: <Truck className="w-6 h-6 text-rose-600" />,
  Building2: <Building2 className="w-6 h-6 text-rose-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-rose-600" />,
};

export function BuildView() {
  return (
    <div className="min-h-screen bg-white select-none pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <section className="bg-neutral-950 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
            DESIGN NAYAN BUILD & MATERIALS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Turnkey Civil Construction & <span className="text-rose-500">Material Supply</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            From single-family luxury residences to commercial multi-story developments and factory-direct material procurement across Assam & the Northeast.
          </p>
        </div>
      </section>

      {/* 2. Construction Offerings Grid */}
      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase font-mono">
            CORE CONTRACTING CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Engineered For Seismic Zone V Longevity
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base">
            Every project follows rigorous Bureau of Indian Standards (BIS) codes with dedicated site engineers and real-time tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {buildOfferingsData.map((offering, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-neutral-50 border border-neutral-200/80 p-6 sm:p-8 hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center group-hover:scale-105 group-hover:border-rose-300 transition-transform">
                    {iconMap[offering.iconName] || <HardHat className="w-6 h-6 text-rose-600" />}
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase font-mono tracking-wider">
                    {offering.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                  {offering.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed font-normal">
                  {offering.desc}
                </p>

                <div className="mt-6 space-y-2.5">
                  {offering.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-700 font-normal">
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200/60 mt-8">
                <Link
                  href={`/contact?service=${encodeURIComponent(offering.title)}`}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <span>{offering.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Direct Wholesale Material Sourcing */}
      <section className="py-10 sm:py-16 bg-neutral-900 text-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
              DIRECT FACTORY TIE-UPS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Procure Certified Raw Materials At Wholesale Rates
            </h2>
            <p className="text-neutral-400 text-xs sm:text-base leading-relaxed">
              We supply high-grade raw building materials directly from authorized steel mills and cement manufacturing hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materialCategoriesData.map((mat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {mat.category}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {mat.desc}
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-neutral-800">
                  <div className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                    Partner Brands:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mat.brands.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
            <div className="text-xs sm:text-sm text-neutral-300">
              Need bulk quotes for on-site delivery in Guwahati, Tezpur, Jorhat, Dibrugarh, or Shillong?
            </div>
            <a
              href="https://wa.me/918638053380?text=Hi%20Design%20Nayan%20Build!%20I%20would%20like%20to%20get%20a%20wholesale%20material%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Material Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Start Construction Project CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase font-mono block">
              ESTIMATE YOUR CONSTRUCTION COST
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
              Planning to Build a House or Commercial Space?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
              Get an itemized BOQ (Bill of Quantities), foundation analysis, and turnkey construction timeline for your plot.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <span>GET FREE CIVIL ESTIMATE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
