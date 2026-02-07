"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LINES = [
  "We don't just build software.",
  "We craft experiences that feel alive.",
  "Every interaction is intentional.",
  "Every transition has purpose.",
  "Speed is a feature.",
  "Simplicity is a discipline.",
  "The best design is invisible —",
  "it just works.",
];

interface Props {
  onReplay: () => void;
}

export function ScrollHighlightReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const lines = gsap.utils.toArray<HTMLElement>(".hl-line", scroller);

      // Each line gets its own ScrollTrigger — highlight as it crosses the center
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { color: "rgb(63 63 70)", scale: 0.95, opacity: 0.4 },
          {
            color: "rgb(52 211 153)", // emerald-400
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              scroller: scroller,
              start: "top 75%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );

        // Fade back out after passing center
        gsap.to(line, {
          color: "rgb(161 161 170)", // zinc-400
          scale: 0.97,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            scroller: scroller,
            start: "top 35%",
            end: "top 10%",
            scrub: 1,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-3xl mx-auto px-8">
        <div className="h-[50vh] flex items-end justify-center pb-8">
          <p className="text-xs font-mono text-zinc-600 tracking-widest">↓ SCROLL TO READ</p>
        </div>

        <div className="py-16 space-y-8">
          {LINES.map((line, i) => (
            <p
              key={i}
              className="hl-line text-4xl font-bold tracking-tight text-center"
              style={{ color: "rgb(63 63 70)" }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="py-8 border-t border-zinc-800/50">
          <p className="text-xs font-mono text-zinc-600">
            Line-by-line highlight · focus on center · fade after passing
          </p>
        </div>

        <div className="h-[50vh]" />
      </div>
    </div>
  );
}
