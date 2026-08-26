import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactCTASplit() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-neutral-50/70 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Split: Call to Action & Visuals (White Background) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 md:p-14 flex flex-col justify-between">
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                Ready To Start <br />
                Your Project?
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Let&apos;s discuss your idea and turn it into something amazing.
              </p>

              {/* Horizontal Side-by-Side Buttons in Mobile Mode & Desktop */}
              <div className="pt-2 flex flex-row items-center gap-2 sm:gap-3">
                <Link
                  href="/contact"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-2 px-3.5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 active:scale-95 whitespace-nowrap shrink-0"
                >
                  <span>START A PROJECT</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Link>
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Thumbnail Collage */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-8 sm:pt-10">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-sm border border-neutral-200/60">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80"
                  alt="Modern House"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-sm border border-neutral-200/60">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&auto=format&fit=crop&q=80"
                  alt="Interior Room"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-sm border border-neutral-200/60">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=80"
                  alt="Architecture Detail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Split: Direct Contact Details (Dark Background) */}
          <div className="lg:col-span-5 bg-neutral-950 text-white p-6 sm:p-10 md:p-14 flex flex-col justify-center space-y-6 sm:space-y-8 border-t lg:border-t-0 lg:border-l border-neutral-800">
            {/* Phone */}
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Call / WhatsApp
                </div>
                <a
                  href={siteConfig.contact.whatsapp}
                  className="text-base sm:text-lg font-bold text-white hover:text-rose-400 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Email us
                </div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-base sm:text-lg font-bold text-white hover:text-rose-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            {/* Office Location */}
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Office Location
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {siteConfig.contact.address}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
