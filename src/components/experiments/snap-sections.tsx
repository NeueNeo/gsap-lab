"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SECTIONS = [
  {
    title: "01",
    heading: "Observe",
    body: "See how the page snaps between full-height sections.",
    bg: "bg-emerald-400/5",
    color: "text-emerald-400",
    line: "bg-emerald-400/40",
  },
  {
    title: "02",
    heading: "Scroll",
    body: "Natural momentum that locks into place.",
    bg: "bg-cyan-400/5",
    color: "text-cyan-400",
    line: "bg-cyan-400/40",
  },
  {
    title: "03",
    heading: "Snap",
    body: "Each section occupies the full viewport.",
    bg: "bg-violet-400/5",
    color: "text-violet-400",
    line: "bg-violet-400/40",
  },
  {
    title: "04",
    heading: "Land",
    body: "Smooth easing guides you to each stop.",
    bg: "bg-amber-400/5",
    color: "text-amber-400",
    line: "bg-amber-400/40",
  },
  {
    title: "05",
    heading: "Arrive",
    body: "Precision scroll with comfortable landing.",
    bg: "bg-emerald-400/5",
    color: "text-emerald-400",
    line: "bg-emerald-400/40",
  },
];

interface Props {
  onReplay: () => void;
}

export function SnapSections({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const panels = gsap.utils.toArray<HTMLElement>(".snap-panel", scroller);

      // Animate each panel's content when it enters view
      panels.forEach((panel) => {
        const heading = panel.querySelector(".snap-heading");
        const body = panel.querySelector(".snap-body");
        const num = panel.querySelector(".snap-num");
        const line = panel.querySelector(".snap-line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            scroller: scroller,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(num, { y: 30, autoAlpha: 0, duration: 0.5, ease: "power2.out" })
          .from(heading, { y: 50, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
          .from(body, { y: 30, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
          .from(line, { scaleX: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.3");
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-zinc-950"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {SECTIONS.map((section, i) => (
        <div
          key={i}
          className={`snap-panel w-full flex items-center justify-center ${section.bg}`}
          style={{
            height: containerRef.current?.offsetHeight || "100%",
            scrollSnapAlign: "start",
          }}
        >
          <div className="text-center max-w-lg px-8">
            <span className={`snap-num block text-sm font-mono ${section.color} tracking-widest mb-4`}>
              {section.title}
            </span>
            <h2 className={`snap-heading text-7xl font-bold tracking-tighter ${section.color}`}>
              {section.heading}
            </h2>
            <p className="snap-body text-lg text-zinc-400 mt-4 max-w-sm mx-auto">
              {section.body}
            </p>
            <div className={`snap-line mx-auto mt-8 h-px w-24 origin-left ${section.line}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
