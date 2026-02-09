
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
          start: "top center",
          end: `+=${scrollDist}`,
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  const words = TEXT.split(" ");
  let charIndex = 0;

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Spacer above — half viewport so it starts sooner */}
      <div style={{ height: scrollerH ? scrollerH * 0.5 : "50%" }} className="flex items-center justify-center">
        <p className="text-xs font-mono text-zinc-600 tracking-widest">↓ SCROLL TO FILL</p>
      </div>

      {/* Trigger — pinned with sticky, tall enough for full scroll range */}
      <div className="fill-trigger" style={{ height: scrollerH ? scrollerH * 3 : "300%" }}>
        <div className="sticky top-[35%]">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
              {words.map((word, wi) => {
                const wordChars = word.split("");
                const startIdx = charIndex;
                charIndex += wordChars.length;
                return (
                  <span key={wi} className="inline-flex whitespace-nowrap">
                    {wordChars.map((char, ci) => (
                      <span
                        key={ci}
                        ref={(el) => { charRefs.current[startIdx + ci] = el; }}
                        className="inline-block text-5xl sm:text-7xl font-black tracking-tight"
                        style={{ color: "rgb(39 39 42)" }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                );
              })}
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
