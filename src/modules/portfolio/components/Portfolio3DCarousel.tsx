"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { 
  ArrowUpRight, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  Pause, 
  Play
} from "lucide-react";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { cn } from "@/lib/utils";

interface Portfolio3DCarouselProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export function Portfolio3DCarousel({ projects, onSelectProject }: Portfolio3DCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  // Carousel motion state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Animation refs for continuous, smooth 60fps rotation without React render lag
  const cylinderAngleRef = useRef(0);
  const isPlayingRef = useRef(true);
  const isDraggingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Sync isPlaying ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Responsive dimensions calculation for true 3D cylinder
  const dimensions = useMemo(() => {
    if (containerWidth < 640) {
      return { cardWidth: 280, cardHeight: 410, radius: 560 };
    } else if (containerWidth < 1024) {
      return { cardWidth: 320, cardHeight: 450, radius: 680 };
    } else {
      return { cardWidth: 360, cardHeight: 480, radius: 760 };
    }
  }, [containerWidth]);

  const radiusRef = useRef(dimensions.radius);
  radiusRef.current = dimensions.radius;

  // Always balance into a 12-slot cylinder for an even, circular 360-degree geometry
  const cylinderItems = useMemo(() => {
    if (projects.length === 0) return [];

    const targetSlots = 12;
    const repeats = Math.max(1, Math.ceil(targetSlots / projects.length));
    const items: Array<{ project: ProjectItem; uniqueKey: string; baseAngle: number }> = [];

    let count = 0;
    for (let r = 0; r < repeats && count < targetSlots; r++) {
      for (let i = 0; i < projects.length && count < targetSlots; i++) {
        items.push({
          project: projects[i],
          uniqueKey: `${projects[i].id}-slot-${count}`,
          baseAngle: 0,
        });
        count++;
      }
    }

    const angleStep = 360 / items.length;
    return items.map((item, idx) => ({
      ...item,
      baseAngle: idx * angleStep,
    }));
  }, [projects]);

  // Track container width for responsive radius
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Update cylinder transform when radius changes
  useEffect(() => {
    if (cylinderRef.current) {
      cylinderRef.current.style.transform = `translateZ(${-dimensions.radius}px) rotateY(${cylinderAngleRef.current}deg)`;
    }
  }, [dimensions.radius]);

  // IntersectionObserver to pause RAF loop when carousel is out of viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Continuous physics animation loop (left-to-right, brisk speed, irrespective of hover)
  useEffect(() => {
    let lastTime = performance.now();
    const rotationSpeed = 17.5; // Degrees per second (fast, lively, continuous)

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isVisibleRef.current && !isDraggingRef.current) {
        // Inertia throw decay if user flicked the carousel
        if (Math.abs(velocityRef.current) > 0.2) {
          cylinderAngleRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else {
          velocityRef.current = 0;
          // Unconditional continuous rotation from left to right (positive angle increment)
          if (isPlayingRef.current) {
            cylinderAngleRef.current += rotationSpeed * dt;
          }
        }

        // Keep angle in [0, 360) range
        cylinderAngleRef.current = (cylinderAngleRef.current % 360 + 360) % 360;
        if (cylinderRef.current) {
          cylinderRef.current.style.transform = `translateZ(${-radiusRef.current}px) rotateY(${cylinderAngleRef.current}deg)`;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Pointer drag & fling handlers (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = cylinderAngleRef.current;
    dragDistanceRef.current = 0;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);

    // Convert pixel delta to degrees: moving cursor right rotates cylinder forward
    const sensitivity = 0.22;
    const newAngle = dragStartAngleRef.current + deltaX * sensitivity;

    // Track release velocity for throw momentum
    const now = performance.now();
    const dt = (now - lastPointerTimeRef.current) / 1000;
    if (dt > 0.008) {
      velocityRef.current = ((e.clientX - lastPointerXRef.current) * sensitivity) / dt;
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }

    cylinderAngleRef.current = (newAngle % 360 + 360) % 360;
    if (cylinderRef.current) {
      cylinderRef.current.style.transform = `translateZ(${-radiusRef.current}px) rotateY(${cylinderAngleRef.current}deg)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Step controls (Nudge forward / backward by one card angle)
  const stepCylinder = (direction: "left" | "right") => {
    const angleStep = 360 / (cylinderItems.length || 12);
    velocityRef.current = direction === "right" ? angleStep * 3 : -angleStep * 3;
  };

  if (projects.length === 0) {
    return null;
  }

  const { cardWidth, cardHeight, radius } = dimensions;

  return (
    <div className="relative w-full overflow-hidden select-none py-4 sm:py-6">
      
      {/* 3D Cylindrical Viewport Stage (No white smoke/gradient overlays) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative w-full h-[520px] sm:h-[560px] lg:h-[590px] cursor-grab active:cursor-grabbing touch-pan-y flex items-center justify-center",
          isDragging && "cursor-grabbing"
        )}
        style={{
          perspective: "1250px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* 3D Cylinder Rigid Body */}
        <div
          ref={cylinderRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-radius}px) rotateY(${cylinderAngleRef.current}deg)`,
            willChange: "transform",
          }}
        >
          {cylinderItems.map((item) => {
            return (
              <div
                key={item.uniqueKey}
                onClick={() => {
                  // If user tapped/clicked without a significant drag gesture, open preview modal
                  if (dragDistanceRef.current < 10) {
                    onSelectProject(item.project);
                  }
                }}
                className="absolute left-1/2 top-1/2 rounded-3xl overflow-hidden bg-white border border-neutral-200/95 shadow-lg group cursor-pointer transition-colors duration-200 pointer-events-auto"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${item.baseAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform",
                  boxShadow: "0 24px 44px -12px rgba(0, 0, 0, 0.16)",
                }}
              >
                {/* Subtle Specular Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)",
                  }}
                />

                {/* Media Presentation */}
                <div className="relative h-[58%] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={item.project.image}
                    alt={item.project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Gradient shadow overlay inside image */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md text-[9px] font-mono font-medium text-white uppercase tracking-wider shadow-xs">
                      {item.project.categoryTag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-mono text-neutral-800 shadow-xs">
                      {item.project.year}
                    </span>
                  </div>

                  {/* Corner Inspect Icon */}
                  <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="h-[42%] p-5 sm:p-6 flex flex-col justify-between bg-white">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1 truncate max-w-[60%]">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{item.project.location}</span>
                      </span>
                      <span className="shrink-0">{item.project.area}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                      {item.project.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="truncate max-w-[65%] text-neutral-500">{item.project.client}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(item.project);
                      }}
                      className="text-neutral-950 group-hover:text-rose-600 font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Preview</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Carousel Navigation Dock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-2 flex items-center justify-between gap-4">
        
        {/* Interaction Guide */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">3D Cylindrical Stream &bull; Drag to spin &bull; Click anywhere on card to preview</span>
          <span className="sm:hidden">3D Cylinder &bull; Tap card to preview</span>
        </div>

        {/* Step / Pause Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => stepCylinder("left")}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200/90 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title="Nudge Left"
            aria-label="Previous card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause Stream" : "Resume Stream"}
            aria-label={isPlaying ? "Pause Stream" : "Resume Stream"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => stepCylinder("right")}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200/90 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title="Nudge Right"
            aria-label="Next card"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
