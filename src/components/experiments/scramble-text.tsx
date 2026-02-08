"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WAVE_TEXT = "GSAP LABORATORY";
const DECODE_TEXT = "SYSTEM ONLINE";
const ALPHA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const GLYPHS = "§¥₿∆◊⌘∞∑∏√∫≈≠±⊗⊕⌥⎔⟁⟐";

interface Props {
  onReplay: () => void;
}

export function ScrambleText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Wave Scramble state ---
  const [waveChars, setWaveChars] = useState<string[]>(
    Array(WAVE_TEXT.length).fill("")
  );
  const [waveResolved, setWaveResolved] = useState<boolean[]>(
    Array(WAVE_TEXT.length).fill(false)
  );

  // --- Sequential Decode state ---
  const [decodeChars, setDecodeChars] = useState<string[]>(
    Array(DECODE_TEXT.length).fill("_")
  );
  const [decodeResolved, setDecodeResolved] = useState<boolean[]>(
    Array(DECODE_TEXT.length).fill(false)
  );
  const [cursorPos, setCursorPos] = useState(0);
  const [decodeComplete, setDecodeComplete] = useState(false);

  const animateWave = useCallback(() => {
    const newResolved = Array(WAVE_TEXT.length).fill(false);
    setWaveResolved([...newResolved]);

    const scrambleObj = { progress: 0 };
    gsap.to(scrambleObj, {
      progress: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = scrambleObj.progress;
        const newChars = [...WAVE_TEXT.split("")];
        const newMask = [...newResolved];

        for (let i = 0; i < WAVE_TEXT.length; i++) {
          if (WAVE_TEXT[i] === " ") {
            newChars[i] = " ";
            newMask[i] = true;
            continue;
          }
          const charThreshold = i / WAVE_TEXT.length;
          if (p > charThreshold + 0.3) {
            newChars[i] = WAVE_TEXT[i];
            newMask[i] = true;
          } else if (p > charThreshold * 0.5) {
            newChars[i] = ALPHA_CHARS[Math.floor(Math.random() * ALPHA_CHARS.length)];
            newMask[i] = false;
          } else {
            newChars[i] = "";
            newMask[i] = false;
          }
        }

        setWaveChars(newChars);
        setWaveResolved(newMask);
      },
    });
  }, []);

  const animateDecode = useCallback(() => {
    setDecodeComplete(false);
    const newChars = Array(DECODE_TEXT.length).fill("_");
    const newDecoded = Array(DECODE_TEXT.length).fill(false);
    setDecodeChars([...newChars]);
    setDecodeResolved([...newDecoded]);
    setCursorPos(0);

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => setDecodeComplete(true),
    });

    DECODE_TEXT.split("").forEach((target, i) => {
      if (target === " ") {
        tl.call(() => {
          setDecodeChars((prev) => { const next = [...prev]; next[i] = " "; return next; });
          setDecodeResolved((prev) => { const next = [...prev]; next[i] = true; return next; });
          setCursorPos(i + 1);
        });
        tl.to({}, { duration: 0.05 });
        return;
      }

      const scrambleCount = 4 + Math.floor(Math.random() * 4);
      for (let s = 0; s < scrambleCount; s++) {
        tl.call(() => {
          setDecodeChars((prev) => {
            const next = [...prev];
            next[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return next;
          });
          setCursorPos(i);
        });
        tl.to({}, { duration: 0.04 + Math.random() * 0.03 });
      }

      tl.call(() => {
        setDecodeChars((prev) => { const next = [...prev]; next[i] = target; return next; });
        setDecodeResolved((prev) => { const next = [...prev]; next[i] = true; return next; });
        setCursorPos(i + 1);
      });
      tl.to({}, { duration: 0.06 });
    });
  }, []);

  useGSAP(
    () => {
      gsap.delayedCall(0.3, animateWave);
      gsap.delayedCall(0.3, animateDecode);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-12"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Scramble Text
      </p>

      {/* Wave Scramble */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-5xl font-bold font-mono tracking-widest text-zinc-100">
          {waveChars.map((char, i) => (
            <span
              key={i}
              className={`inline-block min-w-[0.6em] transition-colors duration-150 ${
                waveResolved[i] ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              {char === " " ? "\u00A0" : char || "\u00A0"}
            </span>
          ))}
        </div>
        <p className="text-[10px] font-mono text-zinc-600">
          parallel wave · all characters scramble simultaneously
        </p>
      </div>

      <div className="w-48 h-px bg-zinc-800" />

      {/* Sequential Decode */}
      <div className="flex flex-col items-center gap-3">
        <div className="font-mono text-5xl tracking-[0.12em]">
          {decodeChars.map((char, i) => (
            <span
              key={i}
              className={`inline-block min-w-[0.6em] transition-colors duration-75 ${
                decodeResolved[i] ? "text-cyan-400" : "text-cyan-800"
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          <span
            className={`inline-block w-[3px] h-[1em] ml-0.5 align-middle ${
              decodeComplete
                ? "bg-cyan-400 animate-pulse"
                : "bg-cyan-400 animate-[blink_0.4s_step-end_infinite]"
            }`}
          />
        </div>
        <p className="text-[10px] font-mono text-zinc-600">
          sequential decode · one character at a time
          {!decodeComplete && (
            <span className="ml-2 text-cyan-800">
              [{Math.round((cursorPos / DECODE_TEXT.length) * 100)}%]
            </span>
          )}
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
