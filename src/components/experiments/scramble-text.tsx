"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const FINAL_TEXT = "GSAP ANIMATION LABORATORY";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface Props {
  onReplay: () => void;
}

export function ScrambleText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayChars, setDisplayChars] = useState<string[]>(
    Array(FINAL_TEXT.length).fill("")
  );
  const [resolvedMask, setResolvedMask] = useState<boolean[]>(
    Array(FINAL_TEXT.length).fill(false)
  );

  const animate = useCallback(() => {
    const newResolved = Array(FINAL_TEXT.length).fill(false);
    setResolvedMask([...newResolved]);

    // Scramble phase
    const scrambleObj = { progress: 0 };
    gsap.to(scrambleObj, {
      progress: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = scrambleObj.progress;
        const newChars = [...FINAL_TEXT.split("")];
        const newMask = [...newResolved];

        for (let i = 0; i < FINAL_TEXT.length; i++) {
          if (FINAL_TEXT[i] === " ") {
            newChars[i] = " ";
            newMask[i] = true;
            continue;
          }
          const charThreshold = i / FINAL_TEXT.length;
          if (p > charThreshold + 0.3) {
            newChars[i] = FINAL_TEXT[i];
            newMask[i] = true;
          } else if (p > charThreshold * 0.5) {
            newChars[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
            newMask[i] = false;
          } else {
            newChars[i] = "";
            newMask[i] = false;
          }
        }

        setDisplayChars(newChars);
        setResolvedMask(newMask);
      },
    });
  }, []);

  useGSAP(
    () => {
      gsap.delayedCall(0.3, animate);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="text-center">
        <div className="text-5xl font-bold font-mono tracking-widest text-zinc-100 mb-8">
          {displayChars.map((char, i) => (
            <span
              key={i}
              className={`inline-block min-w-[0.6em] transition-colors duration-150 ${
                resolvedMask[i] ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              {char === " " ? "\u00A0" : char || "\u00A0"}
            </span>
          ))}
        </div>
        <p className="text-sm font-mono text-zinc-500">
          Character-by-character scramble resolve
        </p>
      </div>
    </div>
  );
}
