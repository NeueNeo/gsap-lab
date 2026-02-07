"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function StaggerGrid({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".grid-card");
      if (!cards) return;

      gsap.set(cards, { y: 60, opacity: 0, scale: 0.85 });
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: {
          each: 0.06,
          grid: [4, 4],
          from: "start",
        },
        ease: "back.out(1.4)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="grid grid-cols-4 gap-4 max-w-lg w-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="grid-card aspect-square rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-700/60 transition-colors cursor-pointer"
          >
            <span className="text-2xl font-mono font-bold text-zinc-400">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
