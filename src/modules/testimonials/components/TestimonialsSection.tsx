"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote, ArrowRight } from "lucide-react";
import { testimonialsData } from "../data/testimonials.data";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveIndex(Math.min(index, testimonialsData.length));
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

          {/* Desktop Only Navigation Arrows */}
          <div className="hidden 2xl:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-rose-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors active:scale-95 shadow-sm cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex 2xl:grid 2xl:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory overscroll-x-contain -mx-4 px-4 sm:-mx-6 sm:px-6 2xl:mx-0 2xl:px-0 pb-3 2xl:pb-0 scroll-pl-4 sm:scroll-pl-6"
        >
          {testimonialsData.slice(0, 5).map((testimonial) => (
            <div
              key={testimonial.id}
              className="shrink-0 w-[240px] sm:w-[320px] 2xl:w-auto snap-start rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 p-4 sm:p-6 lg:p-7 shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-rose-600 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-600" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal mb-5 sm:mb-6 flex-1 line-clamp-4">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 sm:gap-3 border-t border-neutral-100 pt-3 sm:pt-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-neutral-500 truncate font-normal">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* End-of-Scroll "View More" Card: Routes to /testimonials */}
          <Link
            href="/testimonials"
            className="shrink-0 w-[180px] sm:w-[240px] 2xl:hidden snap-start rounded-xl sm:rounded-2xl bg-neutral-950 text-white p-5 flex flex-col items-center justify-center text-center group hover:bg-neutral-900 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
              <MessageSquareQuote className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
              All Reviews
            </h4>
            <p className="text-[10px] text-neutral-400 mb-3">
              Read all verified client feedback
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 group-hover:text-rose-400">
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile & Tablet Swipe Indicator Dots */}
        <div className="flex 2xl:hidden items-center justify-center gap-1.5 pt-3 sm:pt-4">
          {[...testimonialsData.slice(0, 5), { id: "view-more" }].map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = scrollRef.current.clientWidth * 0.75;
                  scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                }
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === idx ? "w-6 bg-rose-600" : "w-1.5 bg-neutral-300"
              )}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
