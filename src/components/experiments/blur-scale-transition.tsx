"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PAGES = [
  {
    title: "Clarity",
    subtitle: "Sharp focus, clear intent",
    accent: "emerald",
    icon: "◇",
    items: ["Precision", "Purpose"],
  },
  {
    title: "Dreamscape",
    subtitle: "Soft edges, deep layers",
    accent: "violet",
    icon: "○",
    items: ["Atmosphere", "Depth"],
  },
  {
    title: "Momentum",
    subtitle: "Forward motion, smooth energy",
    accent: "cyan",
    icon: "△",
    items: ["Velocity", "Flow"],
  },
];

const ACCENT: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/20" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-400/20" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/20" },
};

interface Props {
  onReplay: () => void;
}

export function BlurScaleTransition({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  // Everything inside useGSAP — runs before paint, auto-cleanup on unmount & strict mode
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const pageEls = gsap.utils.toArray<HTMLElement>(".blur-page", container);
      if (pageEls.length < 2) return;

      const count = pageEls.length;
      const HOLD = 1.6;
      const FADE = 0.8;
      const OVERLAP = 0.5;

      // Build one master timeline that plays the full cycle: 1 → 2 → 3 → back to 1
      // Then repeat infinitely
      const tl = gsap.timeline({ repeat: -1 });

      for (let i = 0; i < count; i++) {
        const curr = pageEls[i];
        const next = pageEls[(i + 1) % count];

        if (i === 0) {
          // Page 1 starts visible — just hold it
          tl.set(curr, { autoAlpha: 1, scale: 1, filter: "blur(0px)", zIndex: 2 }, 0);
          // Make sure all others are hidden at the start
          for (let j = 1; j < count; j++) {
            tl.set(pageEls[j], { autoAlpha: 0, scale: 0.9, filter: "blur(20px)", zIndex: 1 }, 0);
          }
        }

        // Hold current page
        tl.to(curr, { duration: HOLD });

        // Bring next page to front for the crossfade
        tl.set(next, { zIndex: 2 });
        tl.set(curr, { zIndex: 1 });

        // Fade out current
        tl.to(curr, {
          filter: "blur(20px)",
          scale: 1.1,
          autoAlpha: 0,
          duration: FADE,
          ease: "power2.inOut",
        });

        // Fade in next (overlapped)
        tl.fromTo(
          next,
          { filter: "blur(20px)", scale: 0.9, autoAlpha: 0 },
          { filter: "blur(0px)", scale: 1, autoAlpha: 1, duration: FADE, ease: "power2.inOut" },
          `>-${OVERLAP}`,
        );
      }
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 overflow-hidden">
      <div className="absolute top-4 left-4 z-30">
        <span className="text-xs font-mono text-zinc-500">blur · scale transition</span>
      </div>

      {PAGES.map((page, i) => {
        const s = ACCENT[page.accent];
        return (
          <div
            key={i}
            className="blur-page absolute inset-0 flex items-center justify-center"
            style={{
              opacity: i === 0 ? 1 : 0,
              visibility: i === 0 ? "visible" : "hidden",
              transform: i === 0 ? "scale(1)" : "scale(0.9)",
              filter: i === 0 ? "blur(0px)" : "blur(20px)",
              zIndex: i === 0 ? 2 : 1,
            }}
          >
            <div className="text-center max-w-md">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900/50 border ${s.border} mb-6`}
              >
                <span className={`text-2xl ${s.text}`}>{page.icon}</span>
              </div>
              <h2 className={`text-6xl font-bold tracking-tighter ${s.text}`}>
                {page.title}
              </h2>
              <p className="text-sm font-mono text-zinc-400 mt-4 tracking-wide">
                {page.subtitle}
              </p>
              <div className="mt-8 flex justify-center gap-3">
                {page.items.map((item, j) => (
                  <span
                    key={j}
                    className={`px-4 py-2 rounded-lg border ${s.border} bg-zinc-900/50 text-sm font-mono text-zinc-300`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-1">
                {Array.from({ length: 12 }).map((_, k) => (
                  <div
                    key={k}
                    className={`w-1 rounded-full ${s.bg} opacity-20`}
                    style={{ height: `${12 + Math.sin(k * 0.8) * 20}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {PAGES.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        ))}
      </div>
    </div>
  );
}
