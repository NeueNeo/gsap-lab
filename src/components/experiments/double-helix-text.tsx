"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const STRAND_A = "DOUBLE HELIX".split("");
const STRAND_B = "GSAP MOTION".split("");

// Pad shorter strand to match length
const MAX_COUNT = Math.max(STRAND_A.length, STRAND_B.length);
const RADIUS = 120;
const VERTICAL_SPACING = 32;

export function DoubleHelixText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const strandARef = useRef<HTMLDivElement>(null);
  const strandBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const strandA = strandARef.current;
      const strandB = strandBRef.current;
      if (!strandA || !strandB) return;

      const charsA = gsap.utils.toArray<HTMLElement>(".helix-char-a", strandA);
      const charsB = gsap.utils.toArray<HTMLElement>(".helix-char-b", strandB);

      // Strand A: rotate clockwise
      gsap.to(strandA, {
        rotateY: 360,
        duration: 8,
        ease: "none",
        repeat: -1,
      });

      // Strand B: rotate counter-clockwise
      gsap.to(strandB, {
        rotateY: -360,
        duration: 8,
        ease: "none",
        repeat: -1,
      });

      // Opacity update based on character facing direction
      const updateCharOpacity = () => {
        // Strand A
        const rotA = gsap.getProperty(strandA, "rotateY") as number;
        charsA.forEach((el, i) => {
          const angleStep = 360 / STRAND_A.length;
          const angle = ((rotA + i * angleStep) % 360 + 360) % 360;
          const cos = Math.cos((angle * Math.PI) / 180);
          const opacity = cos < 0 ? 0.05 + 0.1 * (1 + cos) : 0.15 + 0.85 * cos;
          const blurVal = cos < 0 ? 2 : 0;
          gsap.set(el, { opacity, filter: `blur(${blurVal}px)` });
        });

        // Strand B
        const rotB = gsap.getProperty(strandB, "rotateY") as number;
        charsB.forEach((el, i) => {
          const angleStep = 360 / STRAND_B.length;
          const angle = ((rotB + i * angleStep) % 360 + 360) % 360;
          const cos = Math.cos((angle * Math.PI) / 180);
          const opacity = cos < 0 ? 0.05 + 0.1 * (1 + cos) : 0.15 + 0.85 * cos;
          const blurVal = cos < 0 ? 2 : 0;
          gsap.set(el, { opacity, filter: `blur(${blurVal}px)` });
        });
      };

      gsap.ticker.add(updateCharOpacity);

      // Entry animation
      gsap.from([...charsA, ...charsB], {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      return () => {
        gsap.ticker.remove(updateCharOpacity);
      };
    },
    { scope: containerRef }
  );

  const totalHeightA = (STRAND_A.length - 1) * VERTICAL_SPACING;
  const totalHeightB = (STRAND_B.length - 1) * VERTICAL_SPACING;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-xs font-mono text-zinc-500">
          double-helix-text · counter-rotating DNA strands · opacity depth
        </p>

        {/* Helix container with tilt */}
        <div
          className="relative flex items-center justify-center"
          style={{
            perspective: 900,
            width: "100%",
            height: 460,
          }}
        >
          {/* Outer tilt wrapper */}
          <div
            style={{
              transform: "rotateX(10deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Strand A — emerald (clockwise) */}
            <div
              ref={strandARef}
              className="absolute"
              style={{
                transformStyle: "preserve-3d",
                left: "50%",
                top: "50%",
                marginTop: -totalHeightA / 2,
                marginLeft: 0,
              }}
            >
              {STRAND_A.map((char, i) => {
                const angleStep = 360 / STRAND_A.length;
                return (
                  <div
                    key={`a-${i}`}
                    className="helix-char-a absolute"
                    style={{
                      transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`,
                      top: i * VERTICAL_SPACING,
                      left: -10,
                      width: 20,
                      textAlign: "center",
                    }}
                  >
                    <span className="text-2xl font-bold text-emerald-400 font-mono select-none">
                      {char}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Strand B — violet (counter-clockwise), offset 180° */}
            <div
              ref={strandBRef}
              className="absolute"
              style={{
                transformStyle: "preserve-3d",
                left: "50%",
                top: "50%",
                marginTop: -totalHeightB / 2,
                marginLeft: 0,
              }}
            >
              {STRAND_B.map((char, i) => {
                const angleStep = 360 / STRAND_B.length;
                return (
                  <div
                    key={`b-${i}`}
                    className="helix-char-b absolute"
                    style={{
                      transform: `rotateY(${i * angleStep + 180}deg) translateZ(${RADIUS}px)`,
                      top: i * VERTICAL_SPACING,
                      left: -10,
                      width: 20,
                      textAlign: "center",
                    }}
                  >
                    <span className="text-2xl font-bold text-violet-400 font-mono select-none">
                      {char}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical fade edges */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }}
          />
          {/* Horizontal fade edges */}
          <div
            className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="text-emerald-400/60">● DOUBLE HELIX → clockwise</span>
            <span className="text-zinc-700">|</span>
            <span className="text-violet-400/60">● GSAP MOTION → counter-clockwise</span>
          </div>
          <p className="text-xs font-mono text-zinc-600">
            rotateY + translateZ({RADIUS}px) · rotateX(10°) tilt · continuous
          </p>
        </div>
      </div>
    </div>
  );
}
