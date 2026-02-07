"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TEXT = "ANIMATION IS THE ILLUSION OF LIFE";

interface Props {
  onReplay: () => void;
}

export function ScrollCharFill({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
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

      const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!chars.length) return;

      // Explicitly set starting state
      chars.forEach((c) => { c.style.color = "rgb(39 39 42)"; });

      // The key: end distance must account for stagger.
      // Total timeline duration = default 0.5 + (stagger * (n-1))
      // We want the scroll distance to cover the ENTIRE timeline.
      // Using a fixed end distance that's generous ensures 0→100%.
      const scrollDist = scrollerH * 2;

      gsap.to(chars, {
        color: "rgb(52 211 153)",
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".fill-trigger",
          scroller: scroller,
          start: "top top",
          end: `+=${scrollDist}`,
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  const chars = TEXT.split("");

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Spacer above — one full viewport to ensure trigger starts at 0 */}
      <div style={{ height: scrollerH || "100%" }} className="flex items-end justify-center pb-8">
        <p className="text-xs font-mono text-zinc-600 tracking-widest">↓ SCROLL TO FILL</p>
      </div>

      {/* Trigger — pinned with sticky, tall enough for full scroll range */}
      <div className="fill-trigger" style={{ height: scrollerH ? scrollerH * 3 : "300%" }}>
        <div className="sticky top-[35%]">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
              {chars.map((char, i) => (
                <span
                  key={i}
                  ref={(el) => { charRefs.current[i] = el; }}
                  className="inline-block text-7xl font-black tracking-tight"
                  style={{
                    color: "rgb(39 39 42)",
                    whiteSpace: char === " " ? "pre" : undefined,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
            <p className="text-xs font-mono text-zinc-600 text-center mt-12">
              Per-character color fill · zinc-800 → emerald-400
            </p>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-[20vh]" />
    </div>
  );
}
