"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TICKER_ITEMS = [
  "GSAP",
  "ScrollTrigger",
  "React",
  "Next.js",
  "Tailwind",
  "Motion",
  "Design",
  "Creative",
  "Animate",
  "Build",
];

const SECOND_ROW = [
  "Typography ◆",
  "Interaction ◆",
  "Layout ◆",
  "System ◆",
  "Color ◆",
  "Grid ◆",
  "Rhythm ◆",
  "Flow ◆",
];

interface Props {
  onReplay: () => void;
}

export function MarqueeTicker({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Row 1 — moves left
      const row1 = container.querySelector(".ticker-row-1") as HTMLElement;
      if (row1) {
        const items = row1.querySelectorAll(".ticker-group");
        if (items.length > 0) {
          gsap.to(items, {
            xPercent: -100,
            duration: 25,
            ease: "none",
            repeat: -1,
          });
        }
      }

      // Row 2 — moves right (starts offset)
      const row2 = container.querySelector(".ticker-row-2") as HTMLElement;
      if (row2) {
        const items = row2.querySelectorAll(".ticker-group");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { xPercent: -100 },
            {
              xPercent: 0,
              duration: 30,
              ease: "none",
              repeat: -1,
            }
          );
        }
      }

      // Row 3 — moves left, faster
      const row3 = container.querySelector(".ticker-row-3") as HTMLElement;
      if (row3) {
        const items = row3.querySelectorAll(".ticker-group");
        if (items.length > 0) {
          gsap.to(items, {
            xPercent: -100,
            duration: 18,
            ease: "none",
            repeat: -1,
          });
        }
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Label */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">Marquee Ticker</h2>
        <p className="text-xs font-mono text-zinc-500 mt-2">
          Infinite seamless loops · no gaps · pure GSAP
        </p>
      </div>

      {/* Ticker rows */}
      <div className="w-full space-y-6">
        {/* Row 1 — Large, left-moving */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-row-1 inline-flex">
            {[0, 1].map((copy) => (
              <div key={copy} className="ticker-group inline-flex items-center shrink-0">
                {TICKER_ITEMS.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="inline-flex items-center text-4xl font-bold text-zinc-200 mx-6 tracking-tight"
                  >
                    {item}
                    <span className="ml-6 text-emerald-400/40 text-lg">●</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Medium, right-moving */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-row-2 inline-flex">
            {[0, 1].map((copy) => (
              <div key={copy} className="ticker-group inline-flex items-center shrink-0">
                {SECOND_ROW.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="inline-flex items-center text-xl font-mono text-zinc-500 mx-5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 — Small, left-moving, fastest */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-row-3 inline-flex">
            {[0, 1].map((copy) => (
              <div key={copy} className="ticker-group inline-flex items-center shrink-0">
                {TICKER_ITEMS.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="inline-flex items-center text-sm font-mono text-cyan-400/30 mx-4 uppercase tracking-widest"
                  >
                    {item}
                    <span className="ml-4 text-zinc-700">—</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs font-mono text-zinc-700">3 rows · 3 speeds · 2 directions</p>
      </div>
    </div>
  );
}
