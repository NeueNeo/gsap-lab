"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  color: string;
  dotColor: string;
  borderColor: string;
  bgColor: string;
}

const EVENTS: TimelineEvent[] = [
  {
    year: "2019",
    title: "Project Genesis",
    description: "Initial concept and prototype development. The first lines of code were written in a garage.",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
  },
  {
    year: "2020",
    title: "Alpha Release",
    description: "Private alpha shipped to 50 early testers. Core architecture finalized, API stabilized.",
    color: "text-cyan-400",
    dotColor: "bg-cyan-400",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-400/5",
  },
  {
    year: "2021",
    title: "Open Source",
    description: "Codebase open-sourced under MIT. Community contributions began flooding in from day one.",
    color: "text-violet-400",
    dotColor: "bg-violet-400",
    borderColor: "border-violet-400/30",
    bgColor: "bg-violet-400/5",
  },
  {
    year: "2022",
    title: "1M Downloads",
    description: "Hit one million downloads. Enterprise adoption accelerated with dedicated support tiers.",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/5",
  },
  {
    year: "2023",
    title: "V2 Launch",
    description: "Major rewrite with 10× performance improvements. New plugin architecture unlocked infinite extensibility.",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
  },
  {
    year: "2024",
    title: "Acquisition",
    description: "Acquired by a major platform. All plugins made free forever. The dream realized.",
    color: "text-cyan-400",
    dotColor: "bg-cyan-400",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-400/5",
  },
  {
    year: "2025",
    title: "AI Integration",
    description: "AI-powered animation suggestions. Natural language to timeline. The future of motion design.",
    color: "text-violet-400",
    dotColor: "bg-violet-400",
    borderColor: "border-violet-400/30",
    bgColor: "bg-violet-400/5",
  },
  {
    year: "2026",
    title: "Present Day",
    description: "Powering 5M+ sites. The most popular animation library on the web. Still growing.",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/5",
  },
];

export function TimelineScroll({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      // Animate the vertical timeline line drawing
      gsap.from(".timeline-line-fill", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-track",
          scroller,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      // Animate each event card
      const items = scroller.querySelectorAll(".timeline-item");
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;

        gsap.from(item, {
          x: isLeft ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            scroller,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        // Dot scale-in
        const dot = item.querySelector(".timeline-dot");
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: item,
              scroller,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="py-20 px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-zinc-500">
            scroll down · events animate from alternating sides
          </p>
        </div>

        <div className="timeline-track relative max-w-3xl mx-auto">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="w-full h-full bg-zinc-800" />
            <div className="timeline-line-fill absolute inset-0 bg-gradient-to-b from-emerald-400 via-cyan-400 via-violet-400 to-amber-400 opacity-40" />
          </div>

          {/* Timeline events */}
          <div className="space-y-16">
            {EVENTS.map((event, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={i}
                  className={`timeline-item relative flex items-center gap-6 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`w-[calc(50%-2rem)] ${
                      isLeft ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-xl ${event.bgColor} border ${event.borderColor} p-5 ${
                        isLeft ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      <span
                        className={`text-xs font-mono ${event.color} opacity-60`}
                      >
                        {event.year}
                      </span>
                      <h3
                        className={`text-lg font-semibold ${event.color} mt-1`}
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`timeline-dot w-4 h-4 rounded-full ${event.dotColor} border-4 border-zinc-950`}
                    />
                  </div>

                  {/* Spacer for the other side */}
                  <div className="w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-xs font-mono text-zinc-600">
            ScrollTrigger per-item · gradient line draws on scrub · 8 events
          </p>
        </div>
      </div>
    </div>
  );
}
