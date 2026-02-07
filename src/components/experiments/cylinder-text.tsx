"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const DRUM_WORDS = [
  "Magnetic", "Kinetics", "Radiating", "Converge",
  "Synthesize", "Dissolving", "Fragments", "Construct",
];

const RING_WORDS = [
  "Neural", "Drift", "Signal", "Pulse",
  "Phase", "Static", "Cipher", "Bloom", "Glitch",
];

const CULLED_WORDS = [
  "Neural", "Drift", "Signal", "Pulse",
  "Phase", "Static", "Cipher", "Bloom", "Glitch",
];

const TILT_WORDS = [
  "Zenith", "Warp", "Apex", "Core",
  "Rift", "Echo", "Shift", "Void", "Drift",
];

const HELIX_A = [
  "Alpha", "Gamma", "Sigma", "Omega",
  "Delta", "Theta", "Kappa", "Zeta",
];

const HELIX_B = [
  "Bind", "Splice", "Weave", "Fuse",
  "Merge", "Link", "Chain", "Knot",
];

const DRUM_RADIUS = 200;
const DRUM_ANGLE = 360 / DRUM_WORDS.length;

const RING_RADIUS = 220;
const RING_ANGLE = 360 / RING_WORDS.length;

const CULLED_RADIUS = 220;
const CULLED_ANGLE = 360 / CULLED_WORDS.length;

const TILT_RADIUS = 240;
const TILT_ANGLE = 360 / TILT_WORDS.length;

const HELIX_RADIUS = 200;
const HELIX_COUNT = HELIX_A.length;
const HELIX_ANGLE = 360 / HELIX_COUNT;
const HELIX_SPREAD = 28; // vertical spacing per word

export function CylinderText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const culledRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const helixARef = useRef<HTMLDivElement>(null);
  const helixBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Drum: vertical rotation
      if (drumRef.current) {
        gsap.to(drumRef.current, {
          rotateX: -360,
          duration: 8,
          ease: "none",
          repeat: -1,
        });
      }

      // Ring: horizontal rotation with opacity fade
      if (ringRef.current) {
        const ringItems = ringRef.current.querySelectorAll(".ring-word");
        const count = ringItems.length;
        const step = 360 / count;

        gsap.to(ringRef.current, {
          rotateY: 360,
          duration: 10,
          ease: "none",
          repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(ringRef.current!, "rotateY") as number;
            ringItems.forEach((el, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const isBehind = cos < 0;
              const opacity = isBehind ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      // Culled: horizontal rotation, backface hidden + opacity fade
      if (culledRef.current) {
        const culledItems = culledRef.current.querySelectorAll(".culled-word");
        const cCount = culledItems.length;
        const cStep = 360 / cCount;

        gsap.to(culledRef.current, {
          rotateY: 360,
          duration: 12,
          ease: "none",
          repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(culledRef.current!, "rotateY") as number;
            culledItems.forEach((el, i) => {
              const angle = ((rot + i * cStep) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos > 0 ? 0.2 + 0.8 * cos : 0;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      // Tilted orbit: rotateY with fixed X tilt
      if (tiltRef.current) {
        const tiltItems = tiltRef.current.querySelectorAll(".tilt-word");
        const tCount = tiltItems.length;
        const tStep = 360 / tCount;

        gsap.to(tiltRef.current, {
          rotateY: 360,
          duration: 9,
          ease: "none",
          repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(tiltRef.current!, "rotateY") as number;
            tiltItems.forEach((el, i) => {
              const angle = ((rot + i * tStep) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const isBehind = cos < 0;
              const opacity = isBehind ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      // Double helix: two counter-rotating rings
      if (helixARef.current) {
        gsap.to(helixARef.current, {
          rotateY: 360,
          duration: 10,
          ease: "none",
          repeat: -1,
        });
      }
      if (helixBRef.current) {
        gsap.to(helixBRef.current, {
          rotateY: -360,
          duration: 10,
          ease: "none",
          repeat: -1,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-auto p-6">
      <div className="flex flex-col items-center gap-24 max-w-6xl mx-auto">

        {/* Row 1: Drum — full width */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs font-mono text-zinc-500 tracking-widest">Drum · rotateX</p>
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ perspective: 1000, width: "100%", height: 340 }}
          >
            <div ref={drumRef} style={{ transformStyle: "preserve-3d" }}>
              {DRUM_WORDS.map((word, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap"
                  style={{
                    fontSize: 56,
                    lineHeight: 1,
                    transform: `rotateX(${i * DRUM_ANGLE}deg) translateZ(${DRUM_RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
          </div>
        </div>

        {/* Row 2: Both rings side by side */}
        <div className="flex gap-12 w-full">
          <div className="flex-1 flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-zinc-500 tracking-widest">Ring · backface hidden</p>
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ perspective: 1000, width: "100%", height: 340 }}
            >
              <div ref={culledRef} style={{ transformStyle: "preserve-3d" }}>
                {CULLED_WORDS.map((word, i) => (
                  <div
                    key={i}
                    className="culled-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap"
                    style={{
                      fontSize: 44,
                      lineHeight: 1,
                      transform: `rotateY(${i * CULLED_ANGLE}deg) translateZ(${CULLED_RADIUS}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-zinc-500 tracking-widest">Ring · opacity fade</p>
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ perspective: 1000, width: "100%", height: 340 }}
            >
              <div ref={ringRef} style={{ transformStyle: "preserve-3d" }}>
                {RING_WORDS.map((word, i) => (
                  <div
                    key={i}
                    className="ring-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap"
                    style={{
                      fontSize: 44,
                      lineHeight: 1,
                      transform: `rotateY(${i * RING_ANGLE}deg) translateZ(${RING_RADIUS}px)`,
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
            </div>
          </div>
        </div>

        {/* Row 3: Tilted orbit + Double helix */}
        <div className="flex gap-12 w-full">
          {/* Tilted orbit */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-zinc-500 tracking-widest">Tilted orbit · rotateX 25°</p>
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ perspective: 1000, width: "100%", height: 340 }}
            >
              <div
                ref={tiltRef}
                style={{ transformStyle: "preserve-3d", transform: "rotateX(25deg)" }}
              >
                {TILT_WORDS.map((word, i) => (
                  <div
                    key={i}
                    className="tilt-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap"
                    style={{
                      fontSize: 48,
                      lineHeight: 1,
                      transform: `rotateY(${i * TILT_ANGLE}deg) translateZ(${TILT_RADIUS}px)`,
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
            </div>
          </div>

          {/* Double helix */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-zinc-500 tracking-widest">Double helix · counter-rotate</p>
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ perspective: 1000, width: "100%", height: 340 }}
            >
              {/* Strand A — emerald */}
              <div
                ref={helixARef}
                className="absolute"
                style={{ transformStyle: "preserve-3d" }}
              >
                {HELIX_A.map((word, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-emerald-400 whitespace-nowrap"
                    style={{
                      fontSize: 36,
                      lineHeight: 1,
                      top: (i - HELIX_COUNT / 2) * HELIX_SPREAD,
                      transform: `rotateY(${i * HELIX_ANGLE}deg) translateZ(${HELIX_RADIUS}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              {/* Strand B — violet, offset 180° */}
              <div
                ref={helixBRef}
                className="absolute"
                style={{ transformStyle: "preserve-3d" }}
              >
                {HELIX_B.map((word, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-violet-400 whitespace-nowrap"
                    style={{
                      fontSize: 36,
                      lineHeight: 1,
                      top: (i - HELIX_COUNT / 2) * HELIX_SPREAD,
                      transform: `rotateY(${i * HELIX_ANGLE + 180}deg) translateZ(${HELIX_RADIUS}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
              <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-600 tracking-widest pb-4">
          preserve-3d · continuous rotation · 5 variants
        </p>
      </div>
    </div>
  );
}
