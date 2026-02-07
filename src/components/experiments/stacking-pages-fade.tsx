"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PAGES = [
  {
    title: "Introduction",
    subtitle: "01",
    body: "Every project begins with a question. What problem are we solving? Who are we solving it for?",
    bg: "bg-zinc-900",
    accent: "text-emerald-400",
    border: "border-emerald-400/20",
  },
  {
    title: "Research",
    subtitle: "02",
    body: "We dig deep. Interviews, data, competitors. Understanding the landscape before drawing a single line.",
    bg: "bg-zinc-800",
    accent: "text-cyan-400",
    border: "border-cyan-400/20",
  },
  {
    title: "Design",
    subtitle: "03",
    body: "Wireframes become mockups. Mockups become prototypes. Each iteration sharper than the last.",
    bg: "bg-zinc-700",
    accent: "text-violet-400",
    border: "border-violet-400/20",
  },
  {
    title: "Launch",
    subtitle: "04",
    body: "Ship it. Monitor it. Iterate. The best products are never truly finished — they evolve.",
    bg: "bg-zinc-600",
    accent: "text-amber-400",
    border: "border-amber-400/20",
  },
];

interface Props {
  onReplay: () => void;
}

export function StackingPagesFade({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDims({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!dims.h) return;
      const scroller = containerRef.current;
      if (!scroller) return;

      // Progress bar: intro = 0%, page 1 = 25%, page 4 = 100%
      const bar = scroller.querySelector(".stack-fade-progress-bar") as HTMLElement;
      const numPages = 4;
      if (bar) {
        const update = () => {
          const p = dims.h > 0 ? scroller.scrollTop / (numPages * dims.h) : 0;
          bar.style.transform = `scaleX(${Math.min(p, 1)})`;
        };
        update();
        scroller.addEventListener("scroll", update);
      }

      // Fade out intro on scroll
      const intro = scroller.querySelector(".stack-fade-intro") as HTMLElement;
      if (intro) {
        scroller.addEventListener("scroll", () => {
          const p = Math.min(scroller.scrollTop / (dims.h * 0.5), 1);
          intro.style.opacity = String(1 - p);
        });
      }

      const pages = gsap.utils.toArray<HTMLElement>(".stack-fade-page", scroller);

      pages.forEach((page, i) => {
        if (i === 0) return;

        // Next page slides up from below
        ScrollTrigger.create({
          trigger: page,
          scroller: scroller,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const yPos = (1 - self.progress) * dims.h;
            gsap.set(page, { y: yPos });
          },
        });

        // Previous page scales down, drifts up, and fades out
        const prev = pages[i - 1];
        ScrollTrigger.create({
          trigger: page,
          scroller: scroller,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const scale = 1 - p * 0.1;
            const opacity = 1 - p;
            const yShift = -p * dims.h * 0.15;
            gsap.set(prev, { scale, opacity, y: yShift });
          },
        });
      });
    },
    { scope: containerRef, dependencies: [dims] }
  );

  if (!dims.h) {
    return <div ref={containerRef} className="h-full overflow-y-auto" />;
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="stack-fade-progress-bar fixed top-0 left-0 w-full h-1 bg-emerald-400 origin-left z-50" style={{ transform: "scaleX(0)" }} />

      {/* Intro section */}
      <div className="stack-fade-intro flex flex-col items-center justify-center" style={{ height: dims.h }}>
        <p className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-6">Stacking Pages</p>
        <h1 className="text-5xl font-bold text-zinc-100 tracking-tight mb-8">Scroll Down</h1>
        <div className="animate-bounce text-zinc-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {PAGES.map((page, i) => (
        <div
          key={i}
          className="stack-fade-page sticky top-0"
          style={{ height: dims.h, zIndex: i + 1, transformOrigin: "center top", willChange: "transform, opacity" }}
        >
          <div
            className={`${page.bg} ${page.border} border-t w-full h-full flex items-center justify-center shadow-2xl shadow-black/50`}
          >
            <div className="text-center max-w-lg px-8">
              <span className={`block text-sm font-mono ${page.accent} tracking-widest mb-4`}>
                {page.subtitle}
              </span>
              <h2 className="text-6xl font-bold tracking-tighter text-zinc-100 mb-6">
                {page.title}
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                {page.body}
              </p>
              <div className={`mx-auto mt-8 h-px w-16 ${page.accent.replace("text-", "bg-")}/30`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
