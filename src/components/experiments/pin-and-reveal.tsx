"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SECTIONS = [
  { title: "Concept", text: "Every great design starts with an idea.", color: "text-emerald-400" },
  { title: "Design", text: "Shape the idea into something tangible.", color: "text-cyan-400" },
  { title: "Build", text: "Bring the design to life with code.", color: "text-violet-400" },
  { title: "Ship", text: "Deploy and share with the world.", color: "text-amber-400" },
];

interface Props {
  onReplay: () => void;
}

export function PinAndReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Measure the actual scroller dimensions (not viewport — header + sidebar eat into it)
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

  const panelCount = SECTIONS.length;
  const scrollDistance = dims.w * (panelCount - 1);
  // Wrapper must be exactly: scrollDistance + one screen height
  // so sticky has full scrollDistance of travel before it unsticks
  const wrapperHeight = scrollDistance + dims.h;

  useGSAP(
    () => {
      const scroller = containerRef.current;
      const track = trackRef.current;
      if (!scroller || !track || !dims.w) return;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: ".pin-section",
          scroller: scroller,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef, dependencies: [dims] }
  );

  if (!dims.w) {
    return <div ref={containerRef} className="h-full overflow-y-auto" />;
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
    >
      {/* Pre-content */}
      <div className="h-[20vh] flex items-center justify-center">
        <p className="text-sm font-mono text-zinc-500">↓ Scroll to reveal panels</p>
      </div>

      {/* Tall wrapper — height is exactly scrollDistance + one viewport so sticky never unsticks early */}
      <div
        className="pin-section relative"
        style={{ height: wrapperHeight }}
      >
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: dims.h }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ height: dims.h }}
          >
            {SECTIONS.map((section, i) => (
              <div
                key={i}
                className="panel flex-shrink-0 flex items-center justify-center"
                style={{ width: dims.w, height: dims.h }}
              >
                <div className="text-center space-y-4 px-8">
                  <span className="text-sm font-mono text-zinc-500">
                    {String(i + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
                  </span>
                  <h2 className={`text-7xl font-bold tracking-tighter ${section.color}`}>
                    {section.title}
                  </h2>
                  <p className="text-xl text-zinc-400 max-w-md mx-auto">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post-content */}
      <div className="h-[20vh] flex items-center justify-center">
        <p className="text-sm font-mono text-zinc-600">End of horizontal reveal</p>
      </div>
    </div>
  );
}
