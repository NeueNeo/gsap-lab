"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PANELS = [
  { num: "01", label: "Origin", color: "bg-emerald-400", text: "text-emerald-400", accent: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { num: "02", label: "Flow", color: "bg-cyan-400", text: "text-cyan-400", accent: "bg-cyan-400/10", border: "border-cyan-400/20" },
  { num: "03", label: "Shift", color: "bg-violet-400", text: "text-violet-400", accent: "bg-violet-400/10", border: "border-violet-400/20" },
  { num: "04", label: "Pulse", color: "bg-amber-400", text: "text-amber-400", accent: "bg-amber-400/10", border: "border-amber-400/20" },
  { num: "05", label: "Apex", color: "bg-rose-400", text: "text-rose-400", accent: "bg-rose-400/10", border: "border-rose-400/20" },
];

interface Props {
  onReplay: () => void;
}

export function HorizontalScrollPanels({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const panelCount = PANELS.length;
  const scrollDistance = dims.w * (panelCount - 1);
  const wrapperHeight = scrollDistance + dims.h;

  useGSAP(
    () => {
      const scroller = containerRef.current;
      const track = trackRef.current;
      if (!scroller || !track || !dims.w) return;

      // Progress bar
      const bar = scroller.querySelector(".hsp-progress-bar") as HTMLElement;
      if (bar) {
        scroller.addEventListener("scroll", () => {
          const max = scroller.scrollHeight - scroller.clientHeight;
          const p = max > 0 ? scroller.scrollTop / max : 0;
          bar.style.transform = `scaleX(${p})`;
        });
      }

      // Horizontal scroll driven by vertical scrolling
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: ".hsp-wrapper",
          scroller: scroller,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Per-panel content reveal
      const panels = gsap.utils.toArray<HTMLElement>(".hsp-panel-content", scroller);
      panels.forEach((panel) => {
        gsap.from(panel, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            scroller: scroller,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef, dependencies: [dims] }
  );

  if (!dims.w) {
    return <div ref={containerRef} className="h-full overflow-y-auto" />;
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Label */}
      <div className="sticky top-0 z-20 px-6 py-3">
        <p className="text-xs font-mono text-zinc-500">
          horizontal-scroll-panels · vertical scroll → horizontal movement
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="hsp-progress-bar fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400 origin-left z-50"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Tall wrapper drives the horizontal scroll */}
      <div className="hsp-wrapper relative" style={{ height: wrapperHeight }}>
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: dims.h }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ height: dims.h }}
          >
            {PANELS.map((panel, i) => (
              <div
                key={i}
                className={`flex-shrink-0 flex items-center justify-center ${panel.accent} border-r ${panel.border}`}
                style={{ width: dims.w, height: dims.h }}
              >
                <div className="hsp-panel-content text-center space-y-6 px-8">
                  {/* Large number */}
                  <span
                    className={`block text-[12rem] font-black leading-none tracking-tighter ${panel.text} opacity-15 select-none`}
                  >
                    {panel.num}
                  </span>

                  {/* Label */}
                  <h2 className={`text-5xl font-bold tracking-tight ${panel.text} -mt-20`}>
                    {panel.label}
                  </h2>

                  {/* Counter */}
                  <p className="text-sm font-mono text-zinc-500">
                    {panel.num} / {String(panelCount).padStart(2, "0")}
                  </p>

                  {/* Decorative bar */}
                  <div className={`mx-auto h-1 w-16 rounded-full ${panel.color} opacity-40`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
