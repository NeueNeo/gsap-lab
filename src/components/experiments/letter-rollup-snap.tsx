"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const WORDS = [
  { text: "Magnetic", color: "text-emerald-400" },
  { text: "Snapping", color: "text-cyan-400" },
  { text: "Kinetics", color: "text-violet-400" },
];

const FONT_SIZE = 96;
const LINE_H = 110;

export function LetterRollupSnap({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const wrappers = container.querySelectorAll(".lrs-wrap");
      gsap.to(wrappers, {
        yPercent: -50,
        delay: 0.3,
        ease: "expo.inOut",
        duration: 1,
        stagger: { each: 0.034, from: "random" },
      });
    },
    { scope: containerRef, dependencies: [key] }
  );

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full p-8">
      <div className="flex flex-col items-center gap-12">
        <p className="text-sm font-mono text-zinc-500 tracking-widest">
          expo.inOut · random stagger · steep curve
        </p>

        <div className="flex flex-col items-center gap-2">
          {WORDS.map((word, wi) => (
            <div
              key={`${wi}-${key}`}
              className="flex justify-center overflow-hidden"
              style={{ height: LINE_H }}
            >
              {word.text.split("").map((char, ci) => (
                <span
                  key={ci}
                  className="lrs-wrap flex flex-col"
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

        <button
          onClick={() => setKey((k) => k + 1)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
        >
          Replay ↻
        </button>

        <p className="text-xs font-mono text-zinc-600 tracking-widest">
          expo.inOut · 1s · stagger 0.034 from random
        </p>
      </div>
    </div>
  );
}
