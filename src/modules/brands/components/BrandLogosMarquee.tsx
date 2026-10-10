"use client";

import React, { useState, useEffect } from "react";
import { partnerBrandsData } from "../data/brands.data";
import { PartnerBrand } from "../types/brands.types";

export function BrandLogosMarquee() {
  const [brandsList, setBrandsList] = useState<PartnerBrand[]>(partnerBrandsData);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const saved = localStorage.getItem("dn_partner_brands");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBrandsList(parsed);
          }
        }
      } catch {}
    };

    loadFromStorage();

    fetch("/api/brands", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
          setBrandsList(json.data);
          try {
            localStorage.setItem("dn_partner_brands", JSON.stringify(json.data));
          } catch {}
        }
      })
      .catch((err) => console.warn("Failed to fetch live partner brands:", err));

    window.addEventListener("storage", loadFromStorage);
    return () => window.removeEventListener("storage", loadFromStorage);
  }, []);

  const marqueeItems = [...brandsList, ...brandsList, ...brandsList];

  return (
    <section className="py-8 sm:py-10 bg-white border-y border-neutral-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 text-center">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase font-mono">
          TRUSTED BY TOP MATERIAL & LUXURY BRANDS
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex whitespace-nowrap mask-radial-edges">
        <div className="flex animate-marquee items-center gap-8 sm:gap-12 lg:gap-16 shrink-0 py-2">
          {marqueeItems.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm sm:text-base font-black tracking-widest text-neutral-800 font-mono group-hover:text-rose-600 transition-colors">
                {brand.name}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono">
                {brand.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
