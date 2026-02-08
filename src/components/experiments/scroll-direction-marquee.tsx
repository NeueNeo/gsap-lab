"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ROW_1_ITEMS = [
  "INTERFACE",
  "KINETIC",
  "SYSTEMS",
  "RHYTHM",
  "DESIGN",
  "MOTION",
  "DIGITAL",
  "CRAFT",
];

const ROW_2_ITEMS = [
  "typography ◆",
  "animation ◆",
  "interaction ◆",
  "perception ◆",
  "dynamics ◆",
  "expression ◆",
  "structure ◆",
  "flow ◆",
];

interface Props {
  onReplay: () => void;
}

export function ScrollDirectionMarquee({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      // Row 1 timeline — moves left
      const row1Items = gsap.utils.toArray<HTMLElement>(".sdm-row-1 .sdm-group", scroller);
      const tl1 = gsap.to(row1Items, {
        xPercent: -100,
        duration: 20,
        ease: "none",
        repeat: -1,
      });

      // Row 2 timeline — moves right
      const row2Items = gsap.utils.toArray<HTMLElement>(".sdm-row-2 .sdm-group", scroller);
      const tl2 = gsap.fromTo(
        row2Items,
        { xPercent: -100 },
        {
          xPercent: 0,
          duration: 24,
          ease: "none",
          repeat: -1,
        }
      );

      // ScrollTrigger on inner scroller to detect direction & velocity
      ScrollTrigger.create({
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const direction = self.direction; // 1 = down, -1 = up

          // Speed multiplier based on velocity
          const speed = 1 + Math.min(Math.abs(velocity) / 500, 4);

          if (direction === 1) {
            // Scrolling DOWN — speed up in normal direction
            gsap.to(tl1, { timeScale: speed, duration: 0.3, overwrite: true });
            gsap.to(tl2, { timeScale: speed, duration: 0.3, overwrite: true });
          } else {
            // Scrolling UP — reverse direction
            gsap.to(tl1, { timeScale: -speed, duration: 0.3, overwrite: true });
            gsap.to(tl2, { timeScale: -speed, duration: 0.3, overwrite: true });
          }
        },
      });

      // When scroll stops, ease back to base speed
      ScrollTrigger.addEventListener("scrollEnd", () => {
        gsap.to(tl1, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
        gsap.to(tl2, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-zinc-950"
    >
      <div className="min-h-[200vh] flex flex-col">
        {/* Top spacer */}
        <div className="h-[30vh] flex items-end justify-center pb-8">
          <div className="text-center">
            <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
              Scroll-Reactive Marquee
            </p>
            <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
              Direction Marquee
            </h2>
            <p className="text-xs font-mono text-zinc-600 mt-3">
              ↓ scroll down to speed up · ↑ scroll up to reverse
            </p>
          </div>
        </div>

        {/* Marquee zone — sticky */}
        <div className="sticky top-0 py-12 space-y-6 overflow-hidden">
          {/* Row 1 — Large, left-moving */}
          <div className="overflow-hidden whitespace-nowrap">
            <div className="sdm-row-1 inline-flex">
              {[0, 1].map((copy) => (
                <div key={copy} className="sdm-group inline-flex items-center shrink-0">
                  {ROW_1_ITEMS.map((item, i) => (
                    <span
                      key={`${copy}-${i}`}
                      className="inline-flex items-center text-5xl font-bold text-zinc-200 mx-8 tracking-tight"
                    >
                      {item}
                      <span className="ml-8 text-emerald-400/30 text-2xl">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 — Medium, right-moving */}
          <div className="overflow-hidden whitespace-nowrap">
            <div className="sdm-row-2 inline-flex">
              {[0, 1].map((copy) => (
                <div key={copy} className="sdm-group inline-flex items-center shrink-0">
                  {ROW_2_ITEMS.map((item, i) => (
                    <span
                      key={`${copy}-${i}`}
                      className="inline-flex items-center text-xl font-mono text-zinc-500 mx-6"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom spacer with scroll hints */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xs font-mono text-zinc-700">
              ScrollTrigger · direction detection · timeScale control
            </p>
            <div className="flex gap-6 justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400/40" />
                <span className="text-xs font-mono text-zinc-600">Row 1 — left</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-500/40" />
                <span className="text-xs font-mono text-zinc-600">Row 2 — right</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
