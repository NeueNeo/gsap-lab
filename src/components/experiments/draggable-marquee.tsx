"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MARQUEE_ITEMS = [
  { text: "DRAG ME", accent: "text-emerald-400" },
  { text: "FLING IT", accent: "text-cyan-400" },
  { text: "INFINITE", accent: "text-violet-400" },
  { text: "MOMENTUM", accent: "text-amber-400" },
  { text: "INERTIA", accent: "text-emerald-400" },
  { text: "VELOCITY", accent: "text-cyan-400" },
  { text: "KINETIC", accent: "text-violet-400" },
  { text: "ENERGY", accent: "text-amber-400" },
];

interface Props {
  onReplay: () => void;
}

export function DraggableMarquee({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef(0);

  useGSAP(
    () => {
      const groups = containerRef.current?.querySelectorAll(".dm-group");
      if (!groups) return;

      tlRef.current = gsap.to(groups, {
        xPercent: -100,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef }
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    velocity.current = 0;
    cancelAnimationFrame(rafId.current);

    // Pause auto-scroll while dragging
    if (tlRef.current) {
      tlRef.current.pause();
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !tlRef.current) return;

    const dx = e.clientX - lastX.current;
    velocity.current = dx;
    lastX.current = e.clientX;

    // Scrub the timeline based on drag distance
    // Moving right (positive dx) = scrub backward, moving left = scrub forward
    const totalDuration = tlRef.current.duration();
    const progressDelta = -dx / 2000;
    const newProgress = tlRef.current.progress() + progressDelta;
    tlRef.current.progress(gsap.utils.wrap(0, 1, newProgress));
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current || !tlRef.current) return;
    isDragging.current = false;

    const tl = tlRef.current;

    // Apply throw velocity as timeScale
    // Negative velocity (dragged left) = forward (positive timeScale)
    // Positive velocity (dragged right) = backward (negative timeScale)
    const throwScale = gsap.utils.clamp(-8, 8, -velocity.current / 5);
    tl.timeScale(throwScale || 1);
    tl.play();

    // Gradually ease back to base speed (1)
    gsap.to(tl, {
      timeScale: 1,
      duration: 2,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Label */}
      <div className="mb-12 text-center">
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Draggable Marquee
        </p>
        <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
          Grab & Fling
        </h2>
        <p className="text-xs font-mono text-zinc-600 mt-3">
          Click and drag to scrub · release to fling with inertia
        </p>
      </div>

      {/* Marquee track */}
      <div
        ref={marqueeRef}
        className="w-full select-none"
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Row */}
        <div className="overflow-hidden whitespace-nowrap py-8 border-y border-zinc-800/40">
          <div className="inline-flex">
            {[0, 1].map((copy) => (
              <div key={copy} className="dm-group inline-flex items-center shrink-0">
                {MARQUEE_ITEMS.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="inline-flex items-center mx-8 pointer-events-none"
                  >
                    <span className={`text-5xl font-bold ${item.accent} tracking-tight`}>
                      {item.text}
                    </span>
                    <span className="ml-8 text-zinc-700 text-2xl">—</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg border border-zinc-700 flex items-center justify-center">
            <span className="text-xs text-zinc-500">←</span>
          </div>
          <span className="text-xs font-mono text-zinc-600">drag left = forward</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg border border-zinc-700 flex items-center justify-center">
            <span className="text-xs text-zinc-500">→</span>
          </div>
          <span className="text-xs font-mono text-zinc-600">drag right = reverse</span>
        </div>
      </div>

      <p className="text-xs font-mono text-zinc-700 mt-6">
        Pointer events · velocity tracking · timeScale inertia
      </p>
    </div>
  );
}
