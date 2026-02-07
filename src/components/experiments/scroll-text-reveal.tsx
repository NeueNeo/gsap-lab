"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PARAGRAPH = `Design is not just what it looks like and feels like. Design is how it works. Every detail matters. Every pixel serves a purpose. The best interfaces disappear — they become invisible conduits between intention and action. We build systems that respect the user's time, handle every edge case, and feel intentional from the first interaction to the last. Typography sets the tone. Spacing creates rhythm. Color guides attention. Motion provides feedback. Together they form a language — one that speaks without words, guides without instruction, and delights without distraction. The craft is in the invisible work: the loading states that reassure, the error messages that help, the transitions that orient. Great software feels alive — responsive, aware, and effortlessly fluid.`;

interface Props {
  onReplay: () => void;
}

export function ScrollTextReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollerH, setScrollerH] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setScrollerH(containerRef.current.offsetHeight);
    }
  }, []);

  useGSAP(
    () => {
      if (!scrollerH) return;
      const scroller = containerRef.current;
      if (!scroller) return;

      const words = gsap.utils.toArray<HTMLSpanElement>(".reveal-word", scroller);
      if (!words.length) return;

      gsap.fromTo(
        words,
        { color: "rgb(63 63 70)" },
        {
          color: "rgb(244 244 245)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".text-reveal-block",
            scroller: scroller,
            start: "top bottom",
            end: "bottom center",
            scrub: 1,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  const words = PARAGRAPH.split(" ");

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-3xl mx-auto px-8">
        {/* Top spacer — full scroller height so text starts off-screen */}
        <div style={{ height: scrollerH || "100%" }} className="flex items-center justify-center">
          <p className="text-xs font-mono text-zinc-600 tracking-widest">↓ SCROLL TO REVEAL</p>
        </div>

        {/* Text block — scrolls naturally */}
        <div className="text-reveal-block py-16">
          <p className="text-3xl md:text-4xl font-semibold leading-relaxed tracking-tight">
            {words.map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.3em]" style={{ color: "rgb(63 63 70)" }}>
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Attribution */}
        <div className="py-8 border-t border-zinc-800/50">
          <p className="text-xs font-mono text-zinc-600 tracking-widest">
            Scrubbed word-by-word reveal · zinc-700 → zinc-100
          </p>
        </div>

        {/* Lots of bottom breathing room */}
        <div style={{ height: scrollerH ? scrollerH * 0.5 : "50%" }} className="flex items-center justify-center">
          <p className="text-xs font-mono text-zinc-700">◆</p>
        </div>
      </div>
    </div>
  );
}
