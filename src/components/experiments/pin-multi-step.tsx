"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    title: "Design",
    desc: "Define the vision. Sketch, prototype, iterate. Every pixel carries intention — nothing exists without reason.",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    accent: "emerald",
  },
  {
    title: "Build",
    desc: "Translate vision into code. Architecture emerges from constraints. Each component earns its place.",
    color: "text-cyan-400",
    dotColor: "bg-cyan-400",
    accent: "cyan",
  },
  {
    title: "Test",
    desc: "Break what you built. Edge cases reveal truth. Resilience is designed, not discovered.",
    color: "text-violet-400",
    dotColor: "bg-violet-400",
    accent: "violet",
  },
  {
    title: "Ship",
    desc: "Release to the world. The work speaks now. Feedback loops begin — the next cycle starts.",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    accent: "amber",
  },
];

interface Props {
  onReplay: () => void;
}

export function PinMultiStep({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollerH, setScrollerH] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setScrollerH(containerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const stepCount = STEPS.length;
  // Each step gets ~800px of scroll distance
  const scrollPerStep = 800;
  const totalScrollDistance = scrollPerStep * stepCount;
  const wrapperHeight = totalScrollDistance + (scrollerH || 0);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller || !scrollerH) return;

      const stepEls = gsap.utils.toArray<HTMLElement>(".pms-step", scroller);
      const dotEls = gsap.utils.toArray<HTMLElement>(".pms-dot", scroller);
      const progressLine = scroller.querySelector(".pms-progress-line") as HTMLElement;

      // Set all steps hidden initially
      gsap.set(stepEls, { autoAlpha: 0, y: 40 });

      // Build a timeline that cycles through all steps
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pms-pin-wrapper",
          scroller: scroller,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress indicator line
            if (progressLine) {
              progressLine.style.transform = `scaleX(${self.progress})`;
            }

            // Update dots based on progress
            const activeIdx = Math.min(
              Math.floor(self.progress * stepCount),
              stepCount - 1
            );
            dotEls.forEach((dot, i) => {
              if (i <= activeIdx) {
                dot.classList.add("scale-100", "opacity-100");
                dot.classList.remove("scale-50", "opacity-30");
              } else {
                dot.classList.remove("scale-100", "opacity-100");
                dot.classList.add("scale-50", "opacity-30");
              }
            });
          },
        },
      });

      stepEls.forEach((step, i) => {
        const labelIn = `step${i}-in`;
        const labelOut = `step${i}-out`;

        // Animate in
        tl.addLabel(labelIn);
        tl.to(step, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }, labelIn);

        // Hold
        tl.to({}, { duration: 2 });

        // Animate out (skip for last step)
        if (i < stepCount - 1) {
          tl.addLabel(labelOut);
          tl.to(step, {
            autoAlpha: 0,
            y: -40,
            duration: 1,
            ease: "power2.in",
          }, labelOut);
        }
      });
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  if (!scrollerH) {
    return <div ref={containerRef} className="h-full overflow-y-auto" />;
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Label */}
      <div className="sticky top-0 z-20 px-6 py-3">
        <p className="text-xs font-mono text-zinc-500">
          pin-multi-step · pinned section with scrubbed step transitions
        </p>
      </div>

      {/* Top spacer */}
      <div
        className="flex items-center justify-center"
        style={{ height: scrollerH * 0.5 }}
      >
        <p className="text-sm font-mono text-zinc-600 tracking-widest">
          ↓ SCROLL TO STEP THROUGH
        </p>
      </div>

      {/* Pinned wrapper */}
      <div className="pms-pin-wrapper relative" style={{ height: wrapperHeight }}>
        <div
          className="sticky top-0 flex items-center justify-center"
          style={{ height: scrollerH }}
        >
          <div className="max-w-xl w-full px-8">
            {/* Step content — stacked, absolutely positioned */}
            <div className="relative min-h-[240px]">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="pms-step absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ visibility: "hidden" }}
                >
                  {/* Step number */}
                  <span className={`text-xs font-mono ${step.color} opacity-50 mb-4 tracking-widest`}>
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h2 className={`text-7xl font-bold tracking-tighter ${step.color}`}>
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base text-zinc-400 mt-6 max-w-md leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress indicator — dots */}
            <div className="mt-16 flex flex-col items-center gap-4">
              {/* Dots row */}
              <div className="flex items-center gap-3">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`pms-dot w-3 h-3 rounded-full ${step.dotColor} transition-transform duration-300 scale-50 opacity-30`}
                  />
                ))}
              </div>

              {/* Progress line */}
              <div className="w-48 h-px bg-zinc-800 relative overflow-hidden rounded-full">
                <div
                  className="pms-progress-line absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 via-violet-400 to-amber-400 origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              {/* Step labels */}
              <div className="flex items-center gap-6">
                {STEPS.map((step, i) => (
                  <span key={i} className="text-[10px] font-mono text-zinc-600">
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-[20vh]" />
    </div>
  );
}
