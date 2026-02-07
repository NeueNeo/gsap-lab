"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WORDS = ["FUTURE", "MOTION", "DESIGN"];

interface Props {
  onReplay: () => void;
}

export function RollingText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // LEFT column — slot machine roll with clip reveal (overflow hidden on each char)
      const leftWords = container.querySelectorAll(".col-solid .roll-word");
      leftWords.forEach((word, wordIndex) => {
        const chars = word.querySelectorAll(".roll-inner");
        chars.forEach((inner, charIndex) => {
          const direction = charIndex % 2 === 0 ? -1 : 1;
          const extraSpins = gsap.utils.random(2, 5, 1);
          const startOffset = direction * (extraSpins * 100 + 100);

          gsap.fromTo(
            inner,
            { yPercent: startOffset },
            {
              yPercent: 0,
              duration: 0.8 + charIndex * 0.12,
              delay: 0.3 + wordIndex * 0.6 + charIndex * 0.06,
              ease: "power4.out",
            }
          );
        });
      });

      // RIGHT column — short roll + per-letter opacity fade
      const rightWords = container.querySelectorAll(".col-fade .roll-word");
      rightWords.forEach((word, wordIndex) => {
        const chars = word.querySelectorAll(".roll-inner");
        chars.forEach((inner, charIndex) => {
          const direction = charIndex % 2 === 0 ? -1 : 1;
          const startOffset = direction * 110;
          const del = 0.3 + wordIndex * 0.8 + charIndex * 0.12;

          // Y roll — quick slide into position
          gsap.fromTo(
            inner,
            { yPercent: startOffset },
            {
              yPercent: 0,
              duration: 0.5,
              delay: del,
              ease: "power3.out",
            }
          );

          // Opacity — each letter individually fades 0→1, slightly longer than roll
          gsap.fromTo(
            inner,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.8,
              delay: del,
              ease: "none",
            }
          );
        });
      });

      // THIRD column — opacity fade only, no y movement
      const fadeOnlyWords = container.querySelectorAll(".col-fade-only .roll-word");
      fadeOnlyWords.forEach((word, wordIndex) => {
        const chars = word.querySelectorAll(".roll-inner");
        chars.forEach((inner, charIndex) => {
          const del = 0.3 + wordIndex * 0.8 + charIndex * 0.12;

          gsap.fromTo(
            inner,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.8,
              delay: del,
              ease: "none",
            }
          );
        });
      });

      // Underline wipes for all columns
      container.querySelectorAll(".roll-underline").forEach((line, i) => {
        const wordIndex = i % WORDS.length;
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          delay: 0.8 + wordIndex * 0.6,
          ease: "power3.inOut",
        });
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
        Rolling Text
      </p>

      <div className="flex gap-16">
        {/* LEFT — Solid: slot machine roll, overflow clips each letter */}
        <div className="col-solid space-y-6">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Clip Reveal
          </p>
          {WORDS.map((word, wi) => (
            <div key={wi} className="roll-word relative">
              <div className="flex">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="inline-block overflow-hidden"
                    style={{ lineHeight: 1 }}
                  >
                    <span className="roll-inner inline-block text-7xl font-black tracking-tight text-zinc-100">
                      {char}
                    </span>
                  </span>
                ))}
              </div>
              <div className="roll-underline h-[2px] bg-emerald-400/60 mt-2" />
            </div>
          ))}
        </div>

        <div className="w-px bg-zinc-800" />

        {/* RIGHT — Fade: same roll + clip, but letters also fade from 0→100% opacity */}
        <div className="col-fade space-y-6">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Opacity Fade
          </p>
          {WORDS.map((word, wi) => (
            <div key={wi} className="roll-word relative">
              <div className="flex">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="inline-block overflow-hidden"
                    style={{ lineHeight: 1 }}
                  >
                    <span className="roll-inner inline-block text-7xl font-black tracking-tight text-zinc-100">
                      {char}
                    </span>
                  </span>
                ))}
              </div>
              <div className="roll-underline h-[2px] bg-emerald-400/60 mt-2" />
            </div>
          ))}
        </div>
        <div className="w-px bg-zinc-800" />

        {/* THIRD — Fade only: no y movement, pure opacity per letter */}
        <div className="col-fade-only space-y-6">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Fade Only
          </p>
          {WORDS.map((word, wi) => (
            <div key={wi} className="roll-word relative">
              <div className="flex">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="inline-block"
                    style={{ lineHeight: 1 }}
                  >
                    <span className="roll-inner inline-block text-7xl font-black tracking-tight text-zinc-100">
                      {char}
                    </span>
                  </span>
                ))}
              </div>
              <div className="roll-underline h-[2px] bg-emerald-400/60 mt-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-8 h-1 rounded-full bg-zinc-700" />
        ))}
      </div>
    </div>
  );
}
