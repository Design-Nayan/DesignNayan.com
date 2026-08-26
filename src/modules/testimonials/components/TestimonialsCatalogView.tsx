"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowLeft, MessageSquareQuote, ArrowRight, CheckCircle2 } from "lucide-react";
import { testimonialsData } from "../data/testimonials.data";

export function TestimonialsCatalogView() {
  return (
    <div className="min-h-screen bg-neutral-50/60 select-none pb-20 font-sans">
      
      {/* 1. Header Banner */}
      <section className="bg-neutral-950 text-white pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase block font-mono">
              CLIENT TESTIMONIALS & REVIEWS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              What Our Clients <span className="text-rose-500">Say About Us</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-base leading-relaxed">
              Read verified feedback from homeowners, hotel partners, commercial developers, and brand founders across Assam and Northeast India.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-2xl">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-3xl font-extrabold text-white font-mono">4.9 / 5.0</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Average Rating</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-3xl font-extrabold text-rose-500 font-mono">250+</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Projects Delivered</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-mono">98%</div>
              <div className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-rose-600">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-rose-600" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Project</span>
                  </span>
                </div>

                <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-normal mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-neutral-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-neutral-900 truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-neutral-500 truncate font-normal">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase font-mono block">
              READY TO BUILD WITH US?
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Start Your Design & Construction Journey Today
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Get an initial free consultation and architectural quotation for your residential, commercial, or branding project.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <span>START A PROJECT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
