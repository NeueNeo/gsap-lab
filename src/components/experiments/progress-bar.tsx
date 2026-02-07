"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTENT_SECTIONS = [
  { title: "Introduction", body: "GSAP is the industry-standard JavaScript animation library. It powers millions of websites and apps with buttery-smooth animations that work everywhere." },
  { title: "Performance", body: "GSAP is up to 20x faster than jQuery. It uses requestAnimationFrame, lazy rendering, and intelligent property caching to deliver maximum performance." },
  { title: "Ease of Use", body: "With an intuitive API, powerful plugins, and extensive documentation, GSAP makes complex animations feel simple and approachable." },
  { title: "Compatibility", body: "GSAP works in every major browser, with React, Vue, Angular, Svelte, and vanilla JS. It handles SVG, Canvas, CSS, and WebGL." },
  { title: "Plugins", body: "ScrollTrigger, Flip, DrawSVG, MorphSVG, MotionPath, SplitText — GSAP's plugin ecosystem extends your creative possibilities infinitely." },
  { title: "Community", body: "With millions of developers, an active forum, and world-class support, the GSAP community is one of the most helpful in web development." },
];

interface Props {
  onReplay: () => void;
}

export function ProgressBar({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      ScrollTrigger.create({
        trigger: ".scroll-content",
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setProgress(Math.round(self.progress * 100));
        },
      });

      // Fade in sections
      const sections = scroller.querySelectorAll(".content-section");
      sections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            scroller: scroller,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="h-full relative">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 z-10 h-1 bg-zinc-800">
        <div
          className="h-full bg-emerald-400 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute top-3 right-4 z-10">
        <span className="text-xs font-mono text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded-md backdrop-blur-sm">
          {progress}%
        </span>
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
      >
        <div className="scroll-content max-w-2xl mx-auto px-8 py-20">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
              The GSAP Story
            </h2>
            <p className="text-sm font-mono text-zinc-500 mt-2">
              Scroll to read · Watch the progress bar
            </p>
          </div>

          <div className="space-y-24">
            {CONTENT_SECTIONS.map((section, i) => (
              <div key={i} className="content-section">
                <span className="text-xs font-mono text-emerald-400/60 mb-2 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                  {section.title}
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 mb-12 text-center">
            <p className="text-sm font-mono text-zinc-600">
              ✓ You&apos;ve reached the end
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
