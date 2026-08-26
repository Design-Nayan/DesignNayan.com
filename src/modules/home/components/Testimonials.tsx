"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight, MessageSquareHeart } from "lucide-react";
import { testimonials } from "../data/home.data";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.65));
      setActiveIndex(Math.min(index, testimonials.length));
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
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12 lg:mb-16 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase block mb-1.5 sm:mb-2 font-mono">
              TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              What Our <span className="text-rose-600">Clients Say</span>
            </h2>
          </div>
        </div>

        {/* Testimonials Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex 2xl:grid 2xl:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar snap-x-mandatory overscroll-x-contain -mx-4 px-4 sm:-mx-6 sm:px-6 2xl:mx-0 2xl:px-0 pb-3 2xl:pb-0 scroll-pl-4 sm:scroll-pl-6"
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-[240px] sm:w-[340px] 2xl:w-auto snap-start p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-neutral-50/80 border border-neutral-200/90 hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between shadow-sm active:scale-[0.99]"
            >
              <div>
                <Quote className="w-5 h-5 sm:w-7 sm:h-7 text-rose-600 mb-2.5 sm:mb-5 fill-rose-600/10 stroke-[1.5]" />
                <p className="text-neutral-700 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-normal line-clamp-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author & Rating */}
              <div className="flex items-center justify-between pt-3 sm:pt-5 border-t border-neutral-200/60">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 truncate">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-950 truncate">{item.name}</h4>
                    <span className="text-[9px] sm:text-[11px] text-neutral-500 truncate block">{item.role}</span>
                  </div>
                </div>

                {/* 5 Stars in Crimson */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-rose-600 text-rose-600" />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* End-of-Scroll "View All Reviews" Card: Routes to /testimonials */}
          <Link
            href="/testimonials"
            className="shrink-0 w-[180px] sm:w-[240px] 2xl:hidden snap-start rounded-xl sm:rounded-2xl bg-neutral-950 text-white p-5 flex flex-col items-center justify-center text-center group hover:bg-neutral-900 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
              <MessageSquareHeart className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
              All Reviews
            </h4>
            <p className="text-[10px] text-neutral-400 mb-3">
              Read all client stories
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 group-hover:text-rose-400">
              <span>View All</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile & Tablet Swipe Indicator Dots */}
        <div className="flex 2xl:hidden items-center justify-center gap-1.5 pt-3 sm:pt-4">
          {[...testimonials, { id: "view-more" }].map((_, idx) => (
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
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
