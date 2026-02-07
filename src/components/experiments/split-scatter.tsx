"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXT = "SCATTER";

interface Props {
  onReplay: () => void;
}

export function SplitScatter({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll(".scatter-char");
      if (!chars) return;

      // Start assembled
      gsap.set(chars, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });

      const tl = gsap.timeline({ delay: 0.5 });

      // Scatter outwards
      tl.to(chars, {
        x: () => gsap.utils.random(-400, 400),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0.3,
        scale: () => gsap.utils.random(0.3, 1.8),
        duration: 1.2,
        stagger: 0.05,
        ease: "power3.out",
      });

      // Hold scattered
      tl.to({}, { duration: 0.4 });

      // Reassemble
      tl.to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.04,
        ease: "elastic.out(1, 0.5)",
      });

      // Subtle breathe after reassembly
      tl.to(chars, {
        scale: 1.05,
        duration: 0.6,
        stagger: 0.02,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Split & Scatter
      </p>
      <div className="flex">
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            className="scatter-char inline-block text-8xl font-black tracking-tight text-zinc-100"
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
            className="w-2 h-2 rounded-full bg-emerald-400/40"
          />
        ))}
      </div>
    </div>
  );
}
