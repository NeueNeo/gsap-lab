"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINES = [
  "The art of animation",
  "lies in the details",
  "that nobody notices",
];

interface Props {
  onReplay: () => void;
}

function TextBlock() {
  return (
    <div className="space-y-3">
      {LINES.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <div className="flex flex-wrap">
            {line.split("").map((char, ci) => (
              <span
                key={`${li}-${ci}`}
                className="char inline-block text-3xl font-bold tracking-tight text-zinc-100"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WordBlock() {
  return (
    <div className="space-y-3">
      {LINES.map((line, li) => (
        <div key={li} className="flex flex-wrap gap-x-2">
          {line.split(" ").map((word, wi) => (
            <span
              key={`${li}-${wi}`}
              className="word inline-block text-3xl font-bold tracking-tight text-zinc-100"
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CharacterReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Row 1, Col 1: Slide Up
      const col1 = container.querySelectorAll(".col-1 .char");
      gsap.fromTo(
        col1,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: "power3.out", delay: 0.3 }
      );

      // Row 1, Col 2: Scale Pop
      const col2 = container.querySelectorAll(".col-2 .char");
      col2.forEach((char) => {
        gsap.set(char, { scale: 0, opacity: 0, rotation: gsap.utils.random(-25, 25) });
      });
      gsap.to(col2, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Row 1, Col 3: Blur In (top to bottom)
      const col3 = container.querySelectorAll(".col-3 .char");
      gsap.fromTo(
        col3,
        { opacity: 0, filter: "blur(12px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: { amount: 1.2, from: "start" },
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Row 2, Col 4: Slide Right — chars slide in from the left
      const col4 = container.querySelectorAll(".col-4 .char");
      gsap.fromTo(
        col4,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Row 2, Col 5: Flip In — chars rotate in on X axis like flipping cards
      const col5 = container.querySelectorAll(".col-5 .char");
      gsap.fromTo(
        col5,
        { rotationX: -90, opacity: 0, transformPerspective: 600 },
        {
          rotationX: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Row 2, Col 6: Word Scale — each word scales in left to right, row by row
      const col6Words = container.querySelectorAll(".col-6 .word");
      // Scale in quick, opacity fades in slower so it's noticeable
      gsap.fromTo(
        col6Words,
        { scale: 0.6 },
        { scale: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        col6Words,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power1.out", delay: 0.3 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-6 gap-10 overflow-y-auto"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Character Reveal
      </p>

      {/* Row 1 */}
      <div className="flex gap-12">
        <div className="col-1">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Slide Up
          </p>
          <TextBlock />
        </div>

        <div className="w-px bg-zinc-800" />

        <div className="col-2">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Scale Pop
          </p>
          <TextBlock />
        </div>

        <div className="w-px bg-zinc-800" />

        <div className="col-3">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Blur In
          </p>
          <TextBlock />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-12">
        <div className="col-4">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Slide Right
          </p>
          <TextBlock />
        </div>

        <div className="w-px bg-zinc-800" />

        <div className="col-5">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Flip In
          </p>
          <TextBlock />
        </div>

        <div className="w-px bg-zinc-800" />

        <div className="col-6">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
            Word Scale
          </p>
          <WordBlock />
        </div>
      </div>
    </div>
  );
}
