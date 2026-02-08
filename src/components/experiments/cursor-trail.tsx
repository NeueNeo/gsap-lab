"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const DOT_COUNT = 18;

export function CursorTrail({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGSAP(
    () => {
      const field = fieldRef.current;
      if (!field) return;

      const dots = gsap.utils.toArray<HTMLElement>(".trail-dot", field);
      if (!dots.length) return;

      // Hide dots initially (they'll appear at cursor on first move)
      gsap.set(dots, { xPercent: -50, yPercent: -50, opacity: 0 });

      // Create quickTo per dot — duration increases for stagger effect
      const xFns: gsap.QuickToFunc[] = [];
      const yFns: gsap.QuickToFunc[] = [];

      dots.forEach((dot, i) => {
        const duration = 0.08 + (i / (DOT_COUNT - 1)) * 0.47;
        xFns.push(gsap.quickTo(dot, "x", { duration, ease: "power3" }));
        yFns.push(gsap.quickTo(dot, "y", { duration, ease: "power3" }));
      });

      let entered = false;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = field.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!entered) {
          // First move: snap all dots to cursor position instantly, then show
          entered = true;
          dots.forEach((dot) => gsap.set(dot, { x, y, opacity: 1 }));
        }

        for (let i = 0; i < dots.length; i++) {
          xFns[i](x);
          yFns[i](y);
        }
      };

      const handleMouseEnter = () => {
        entered = false; // Reset so dots snap to new entry point
        gsap.to(dots, { opacity: 1, duration: 0.2, stagger: 0.01 });
      };

      const handleMouseLeave = () => {
        gsap.to(dots, { opacity: 0, duration: 0.3, stagger: 0.01 });
        entered = false;
      };

      field.addEventListener("mousemove", handleMouseMove);
      field.addEventListener("mouseenter", handleMouseEnter);
      field.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        field.removeEventListener("mousemove", handleMouseMove);
        field.removeEventListener("mouseenter", handleMouseEnter);
        field.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef },
  );

  const handleReactMove = () => {
    if (isIdle) setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500">
        gsap.quickTo() per dot · staggered duration · {DOT_COUNT} trail particles
      </p>

      <div
        ref={fieldRef}
        className="relative w-full max-w-2xl h-96 rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden cursor-none"
        onMouseMove={handleReactMove}
      >
        {Array.from({ length: DOT_COUNT }).map((_, i) => {
          const progress = i / (DOT_COUNT - 1);
          const size = Math.max(3, 14 - i * 0.65);
          const opacity = 1 - progress * 0.85;
          const r = 52 + Math.round(progress * 30);
          const g = 211 - Math.round(progress * 80);
          const b = 153 - Math.round(progress * 50);

          return (
            <div
              key={i}
              className="trail-dot absolute top-0 left-0 rounded-full pointer-events-none will-change-transform"
              style={{
                width: size,
                height: size,
                backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                boxShadow:
                  i === 0
                    ? "0 0 12px rgba(52, 211, 153, 0.4)"
                    : i < 3
                    ? "0 0 6px rgba(52, 211, 153, 0.2)"
                    : "none",
              }}
            />
          );
        })}

        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none"
          style={{ opacity: isIdle ? 1 : 0 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm font-mono text-zinc-500">Move mouse to create trail</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        first dot: 0.08s · last dot: 0.55s · size &amp; opacity gradient
      </p>
    </div>
  );
}
