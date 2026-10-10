"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { initialAboutData } from "../data/about.data";
import { AboutPageData } from "../types/about.types";

const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.startsWith("data:video/") ||
    clean.includes("youtube.com") ||
    clean.includes("youtu.be") ||
    clean.includes("vimeo.com") ||
    /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(clean)
  );
};

const isImageUrl = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.startsWith("data:image/") ||
    clean.includes("unsplash.com") ||
    /\.(jpg|jpeg|png|webp|avif|gif|svg)($|\?)/i.test(clean)
  );
};

const getEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
  }
  return null;
};

export function AboutView() {
  const [data, setData] = useState<AboutPageData>(initialAboutData);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    const mergeData = (incoming: any): AboutPageData => {
      if (!incoming || typeof incoming !== "object") return initialAboutData;
      return {
        ...initialAboutData,
        ...incoming,
        stats: Array.isArray(incoming.stats) && incoming.stats.length > 0 ? incoming.stats : initialAboutData.stats,
        philosophyHighlights:
          Array.isArray(incoming.philosophyHighlights) && incoming.philosophyHighlights.length > 0
            ? incoming.philosophyHighlights
            : initialAboutData.philosophyHighlights,
        processSteps:
          Array.isArray(incoming.processSteps) && incoming.processSteps.length > 0
            ? incoming.processSteps
            : initialAboutData.processSteps,
      };
    };

    const loadData = () => {
      try {
        const saved = localStorage.getItem("dn_about_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setData(mergeData(parsed));
          }
        }
      } catch {}
    };

    loadData();

    // Fetch live from database with no-store cache so all visitors see updates immediately
    fetch("/api/about", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json?.data) {
          const merged = mergeData(json.data);
          setData(merged);
          setMediaError(false);
          try {
            localStorage.setItem("dn_about_data", JSON.stringify(merged));
          } catch {}
        }
      })
      .catch((err) => console.warn("Failed to fetch live about data:", err));

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // Determine media presentation
  const rawUrl = data.mediaUrl?.trim();
  const activeMediaUrl = mediaError || !rawUrl ? initialAboutData.mediaUrl : rawUrl;
  const isVideo =
    !mediaError &&
    Boolean(rawUrl) &&
    (data.mediaType === "video" || isVideoUrl(rawUrl)) &&
    !isImageUrl(rawUrl);
  const embedUrl = isVideo ? getEmbedUrl(activeMediaUrl) : null;


  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-24 bg-white">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase">
          {data.tagline}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight">
          {data.headline}
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.stats.map((s, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-1 hover:border-neutral-300 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 font-mono">
              {s.value}
            </div>
            <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy Section with Photo/Video Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-neutral-700 leading-relaxed text-base">
          <h2 className="text-3xl font-bold text-neutral-950">
            {data.philosophyTitle}
          </h2>
          <p>{data.philosophyParagraph1}</p>
          <p>{data.philosophyParagraph2}</p>
          <div className="space-y-3 pt-2">
            {data.philosophyHighlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
                <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Media Container: Photo & Video Compatible */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[4/3] bg-neutral-950 relative group">
          {isVideo ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Design Nayan Video Presentation"
              />
            ) : (
              <video
                key={activeMediaUrl}
                src={activeMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img
              key={activeMediaUrl}
              src={activeMediaUrl}
              alt="Design Nayan Studio"
              onError={() => setMediaError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
          )}
          {isVideo && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-white font-medium text-[10px] flex items-center gap-1 pointer-events-none">
              <Play className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>Video Presentation</span>
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Process */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold tracking-[0.2em] text-rose-600 uppercase">
            {data.processTagline}
          </span>
          <h2 className="text-3xl font-bold text-neutral-950">
            {data.processTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {data.processSteps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col text-center items-center hover:border-neutral-300 transition-colors"
            >
              <div className="text-xs font-bold text-rose-600 mb-2 font-mono">{step.step}</div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">{step.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
