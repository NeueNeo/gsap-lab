"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PAGES = [
  {
    title: "First View",
    subtitle: "Click the button to trigger a wipe transition",
    accent: "emerald",
    items: ["Layout", "Typography", "Color", "Spacing"],
  },
  {
    title: "Second View",
    subtitle: "Content revealed behind the wipe bars",
    accent: "cyan",
    items: ["Motion", "Feedback", "Flow", "Rhythm"],
  },
  {
    title: "Third View",
    subtitle: "Staggered columns create a cinematic feel",
    accent: "violet",
    items: ["System", "Pattern", "Grid", "Balance"],
  },
];

const BAR_COUNT = 6;

const ACCENT_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/20" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/20" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-400/20" },
};

interface Props {
  onReplay: () => void;
}

export function WipeTransition({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const triggerWipe = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const bars = barsRef.current?.children;
    if (!bars) return;

    const nextIndex = (pageIndex + 1) % PAGES.length;
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Wipe IN — bars scale up from bottom
    tl.set(Array.from(bars), { scaleY: 0, transformOrigin: "bottom" });
    tl.to(Array.from(bars), {
      scaleY: 1,
      stagger: 0.06,
      duration: 0.4,
      ease: "power3.inOut",
    });

    // Swap content at peak
    tl.call(() => setPageIndex(nextIndex));

    // Wipe OUT — bars scale down from top
    tl.set(Array.from(bars), { transformOrigin: "top" });
    tl.to(Array.from(bars), {
      scaleY: 0,
      stagger: 0.06,
      duration: 0.4,
      ease: "power3.inOut",
      delay: 0.1,
    });

    // Animate new page content
    tl.from(
      ".page-title",
      { y: 40, autoAlpha: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
    tl.from(
      ".page-subtitle",
      { y: 20, autoAlpha: 0, duration: 0.4, ease: "power2.out" },
      "-=0.3"
    );
    tl.from(
      ".page-item",
      { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  });

  const page = PAGES[pageIndex];
  const styles = ACCENT_STYLES[page.accent];

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 flex flex-col">
      {/* Page content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <span className={`page-subtitle block text-xs font-mono ${styles.text} tracking-widest uppercase mb-4`}>
            {page.subtitle}
          </span>
          <h2 className={`page-title text-6xl font-bold tracking-tighter ${styles.text}`}>
            {page.title}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {page.items.map((item, i) => (
              <span
                key={i}
                className={`page-item inline-block px-4 py-2 rounded-lg border ${styles.border} bg-zinc-900/50 text-sm font-mono text-zinc-300`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger button */}
      <div className="flex justify-center pb-10">
        <button
          onClick={triggerWipe}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-xl border ${styles.border} bg-zinc-900/60 text-sm font-mono ${styles.text} hover:bg-zinc-800/80 transition-colors disabled:opacity-40`}
        >
          {isAnimating ? "Transitioning…" : "Wipe Transition →"}
        </button>
      </div>

      {/* Wipe bars overlay */}
      <div
        ref={barsRef}
        className="absolute inset-0 flex pointer-events-none z-50"
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-zinc-900 scale-y-0"
          />
        ))}
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {PAGES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === pageIndex ? styles.bg : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
