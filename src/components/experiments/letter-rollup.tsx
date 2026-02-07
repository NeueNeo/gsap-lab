"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const FONT_SIZE = 52;
const LINE_H = 62;

interface Variant {
  label: string;
  detail: string;
  words: { text: string; color: string }[];
  className: string;
  animate: (container: HTMLElement) => void;
}

const VARIANTS: Variant[] = [
  {
    label: "Sequential · power3.out",
    detail: "0.05s stagger · per letter · per word",
    words: [
      { text: "Collection", color: "text-emerald-400" },
      { text: "Animation", color: "text-cyan-400" },
      { text: "Beautiful", color: "text-violet-400" },
    ],
    className: "v0",
    animate: (container) => {
      const words = container.querySelectorAll(".v0-word");
      words.forEach((word, wi) => {
        const wraps = word.querySelectorAll(".v-wrap");
        wraps.forEach((wrap, ci) => {
          gsap.set(wrap, { yPercent: 0 });
          gsap.to(wrap, {
            yPercent: -50,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.2 + wi * 0.4 + ci * 0.05,
          });
        });
      });
    },
  },
  {
    label: "Random · expo.inOut",
    detail: "0.034s stagger · random order · 1s",
    words: [
      { text: "Magnetic", color: "text-emerald-400" },
      { text: "Snapping", color: "text-cyan-400" },
      { text: "Kinetics", color: "text-violet-400" },
    ],
    className: "v1",
    animate: (container) => {
      const wraps = container.querySelectorAll(".v1-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "expo.inOut",
        duration: 1,
        stagger: { each: 0.034, from: "random" },
      });
    },
  },
  {
    label: "From center · power4.out",
    detail: "0.04s stagger · center outward",
    words: [
      { text: "Expanding", color: "text-amber-400" },
      { text: "Outwards", color: "text-emerald-400" },
      { text: "Radiating", color: "text-cyan-400" },
    ],
    className: "v2",
    animate: (container) => {
      const wraps = container.querySelectorAll(".v2-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "power4.out",
        duration: 0.8,
        stagger: { each: 0.04, from: "center" },
      });
    },
  },
  {
    label: "From edges · circ.inOut",
    detail: "0.04s stagger · edges inward · 1.2s",
    words: [
      { text: "Converging", color: "text-violet-400" },
      { text: "Inversion", color: "text-amber-400" },
      { text: "Collapsing", color: "text-emerald-400" },
    ],
    className: "v3",
    animate: (container) => {
      const wraps = container.querySelectorAll(".v3-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "circ.inOut",
        duration: 1.2,
        stagger: { each: 0.04, from: "edges" },
      });
    },
  },
];

export function LetterRollup({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      VARIANTS.forEach((v) => {
        const block = container.querySelector(`.block-${v.className}`);
        if (block) v.animate(block as HTMLElement);
      });
    },
    { scope: containerRef, dependencies: [key] }
  );

  return (
    <div ref={containerRef} className="h-full overflow-auto p-6">
      <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {VARIANTS.map((v, vi) => (
          <div
            key={`${vi}-${key}`}
            className={`block-${v.className} flex flex-col items-center gap-5 border border-zinc-800/50 rounded-2xl py-6 px-4 bg-zinc-900/20`}
          >
            <p className="text-xs font-mono text-zinc-500 tracking-widest">
              {v.label}
            </p>

            <div className="flex flex-col items-center gap-0.5">
              {v.words.map((word, wi) => (
                <div
                  key={wi}
                  className={`${v.className}-word flex justify-center overflow-hidden`}
                  style={{ height: LINE_H }}
                >
                  {word.text.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="v-wrap flex flex-col"
                      style={{ height: LINE_H * 2, transform: "translateY(0%)" }}
                    >
                      <span
                        className={`block overflow-hidden ${word.color}`}
                        style={{ fontSize: FONT_SIZE, lineHeight: `${LINE_H}px`, height: LINE_H }}
                      >
                        {char}
                      </span>
                      <span
                        className={`block overflow-hidden ${word.color}`}
                        style={{ fontSize: FONT_SIZE, lineHeight: `${LINE_H}px`, height: LINE_H }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-zinc-600 tracking-widest text-center">
              {v.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setKey((k) => k + 1)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
        >
          Replay ↻
        </button>
      </div>
    </div>
  );
}
