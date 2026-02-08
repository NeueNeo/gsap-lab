"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXT = "ZIPPER";

interface Props {
  onReplay: () => void;
}

export function ZipperTextReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll(".zipper-char");
      if (!chars) return;

      // Starting state: odd chars above, even chars below, all invisible
      gsap.set(chars, {
        y: gsap.utils.wrap([-200, 200]),
        opacity: 0,
        scale: 0.5,
        rotation: gsap.utils.wrap([-15, 15]),
      });

      const tl = gsap.timeline({ delay: 0.5 });

      // Phase 1: Characters zip into place simultaneously
      tl.to(chars, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: {
          each: 0.06,
          from: "edges",
        },
        ease: "back.out(1.4)",
      });

      // Phase 2: Subtle scale pulse on assembly
      tl.to(chars, {
        scale: 1.12,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.out",
      });

      tl.to(chars, {
        scale: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "elastic.out(1, 0.6)",
      });

      // Phase 3: Color flash — brief highlight
      tl.to(chars, {
        color: gsap.utils.wrap(["#34d399", "#22d3ee"]),
        duration: 0.2,
        stagger: 0.03,
        ease: "power1.out",
      }, "-=0.3");

      tl.to(chars, {
        color: "#f4f4f5",
        duration: 0.6,
        stagger: 0.03,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8 overflow-hidden"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Zipper Text Reveal
      </p>

      <div className="flex">
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            className="zipper-char inline-block text-9xl font-black tracking-tight text-zinc-100"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        {TEXT.split("").map((_, i) => (
          <div
            key={i}
            className={`w-2 h-6 rounded-sm ${
              i % 2 === 0 ? "bg-emerald-400/30" : "bg-cyan-400/30"
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-mono text-zinc-600 text-center">
        Odd characters from above · Even from below ·{" "}
        <span className="text-zinc-400">gsap.utils.wrap([-200, 200])</span>
      </p>
    </div>
  );
}
