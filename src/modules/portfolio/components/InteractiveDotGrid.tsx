"use client";

import React, { useEffect, useRef, useState } from "react";

interface InteractiveDotGridProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  dotSpacing?: number;
}

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  alpha: number;
  color: string;
}

export function InteractiveDotGrid({
  containerRef,
  className = "",
  dotSpacing = 28,
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pointerCoords, setPointerCoords] = useState<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Track width, height, and dots array
    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];

    // Pointer state with target and smooth interpolated positions
    const pointer = {
      x: -999,
      y: -999,
      targetX: -999,
      targetY: -999,
      active: false,
      hasMoved: false,
    };

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;

      // Center the grid
      const offsetX = (width - (cols - 1) * dotSpacing) / 2;
      const offsetY = (height - (rows - 1) * dotSpacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * dotSpacing;
          const originY = offsetY + r * dotSpacing;

          dots.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            radius: 1.15,
            targetRadius: 1.15,
            alpha: 0.38,
            color: "#d4d4d4",
          });
        }
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initDots();
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Pointer event listeners on target container (or canvas parent)
    const targetElement = containerRef?.current || canvas.parentElement || window;

    const onPointerMove = (e: MouseEvent | TouchEvent | PointerEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      pointer.targetX = localX;
      pointer.targetY = localY;
      pointer.active = true;
      pointer.hasMoved = true;

      setPointerCoords({
        x: Math.round(localX),
        y: Math.round(localY),
        active: true,
      });
    };

    const onPointerLeave = () => {
      pointer.active = false;
      setPointerCoords((prev) => ({ ...prev, active: false }));
    };

    const el = targetElement as HTMLElement;
    el.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    el.addEventListener("pointerdown", onPointerMove as EventListener, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave as EventListener, { passive: true });
    el.addEventListener("pointerup", onPointerLeave as EventListener, { passive: true });
    el.addEventListener("pointercancel", onPointerLeave as EventListener, { passive: true });

    // Touch fallbacks for maximum mobile responsiveness
    el.addEventListener("touchmove", onPointerMove as EventListener, { passive: true });
    el.addEventListener("touchstart", onPointerMove as EventListener, { passive: true });
    el.addEventListener("touchend", onPointerLeave as EventListener, { passive: true });

    // Animation render loop
    let animId: number;
    const interactionRadius = 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer position interpolation
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.18;
        pointer.y += (pointer.targetY - pointer.y) * 0.18;
      } else {
        pointer.x += (-999 - pointer.x) * 0.08;
        pointer.y += (-999 - pointer.y) * 0.08;
      }

      // 1. Draw subtle ambient spotlight aura following pointer
      if (pointer.active && pointer.x > -50 && pointer.x < width + 50) {
        const glow = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          interactionRadius * 1.5
        );
        glow.addColorStop(0, "rgba(244, 63, 94, 0.08)");
        glow.addColorStop(0.4, "rgba(14, 165, 233, 0.04)");
        glow.addColorStop(1, "rgba(250, 250, 249, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, interactionRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update and render all dots
      const numDots = dots.length;
      for (let i = 0; i < numDots; i++) {
        const dot = dots[i];

        let targetX = dot.originX;
        let targetY = dot.originY;
        let targetRadius = 1.15;
        let targetAlpha = 0.38;
        let targetColor = "#d4d4d4";

        if (pointer.active) {
          const dx = dot.originX - pointer.x;
          const dy = dot.originY - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius) {
            const factor = 1 - dist / interactionRadius;
            const pushDist = factor * 14; // gentle magnetic repulsion
            const angle = Math.atan2(dy, dx);

            targetX = dot.originX + Math.cos(angle) * pushDist;
            targetY = dot.originY + Math.sin(angle) * pushDist;

            // Expand dot slightly and brighten
            targetRadius = 1.15 + factor * 1.75;
            targetAlpha = 0.45 + factor * 0.45;

            // Architectural chromatic shift: Rose/Dark Graphite highlight
            if (factor > 0.5) {
              targetColor = "#e11d48"; // vibrant architectural crimson/rose
            } else {
              targetColor = "#171717"; // high-contrast dark graphite
            }
          }
        }

        // Spring physics interpolation
        const ax = (targetX - dot.x) * 0.16;
        const ay = (targetY - dot.y) * 0.16;
        dot.vx = (dot.vx + ax) * 0.74;
        dot.vy = (dot.vy + ay) * 0.74;
        dot.x += dot.vx;
        dot.y += dot.vy;

        dot.radius += (targetRadius - dot.radius) * 0.2;
        dot.alpha += (targetAlpha - dot.alpha) * 0.2;
        dot.color = targetColor;

        // Draw dot
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;

      // 3. Draw subtle architectural coordinate reticle / crosshair at pointer
      if (pointer.active && pointer.x > 0 && pointer.x < width && pointer.y > 0 && pointer.y < height) {
        ctx.strokeStyle = "rgba(225, 29, 72, 0.35)";
        ctx.lineWidth = 1;

        // Micro crosshair at center
        const crosshairSize = 6;
        ctx.beginPath();
        ctx.moveTo(pointer.x - crosshairSize, pointer.y);
        ctx.lineTo(pointer.x + crosshairSize, pointer.y);
        ctx.moveTo(pointer.x, pointer.y - crosshairSize);
        ctx.lineTo(pointer.x, pointer.y + crosshairSize);
        ctx.stroke();

        // Delicate floating concentric coordinate ring
        ctx.strokeStyle = "rgba(23, 23, 23, 0.12)";
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 22, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      el.removeEventListener("pointermove", onPointerMove as EventListener);
      el.removeEventListener("pointerdown", onPointerMove as EventListener);
      el.removeEventListener("pointerleave", onPointerLeave as EventListener);
      el.removeEventListener("pointerup", onPointerLeave as EventListener);
      el.removeEventListener("pointercancel", onPointerLeave as EventListener);
      el.removeEventListener("touchmove", onPointerMove as EventListener);
      el.removeEventListener("touchstart", onPointerMove as EventListener);
      el.removeEventListener("touchend", onPointerLeave as EventListener);
    };
  }, [containerRef, dotSpacing]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {/* HTML5 Canvas for dynamic spring-interactive dots */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating Micro Live Coordinate Tag near pointer on desktop */}
      {pointerCoords.active && (
        <div
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/80 backdrop-blur-xs border border-neutral-300/60 text-[9px] font-mono text-neutral-500 shadow-2xs pointer-events-none absolute transition-transform duration-75"
          style={{
            left: `${pointerCoords.x + 28}px`,
            top: `${pointerCoords.y - 12}px`,
          }}
        >
          <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
          <span>
            {pointerCoords.x} &times; {pointerCoords.y}
          </span>
        </div>
      )}
    </div>
  );
}
