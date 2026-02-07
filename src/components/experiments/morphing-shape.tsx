"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Blob shapes as clip-path polygons (using percentages for clean morphing)
const SHAPES = [
  // Circle-ish blob
  "50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%",
  // Star-ish
  "50% 0%, 65% 35%, 100% 35%, 75% 60%, 85% 95%, 50% 75%, 15% 95%, 25% 60%, 0% 35%, 35% 35%",
  // Rounded square
  "10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%, 5% 5%, 95% 5%",
  // Organic blob
  "40% 0%, 70% 5%, 95% 25%, 100% 55%, 85% 85%, 55% 100%, 25% 95%, 5% 70%, 0% 40%, 15% 10%",
];

const COLORS = [
  "from-emerald-500 to-cyan-500",
  "from-cyan-500 to-violet-500",
  "from-violet-500 to-rose-500",
  "from-rose-500 to-emerald-500",
];

interface Props {
  onReplay: () => void;
}

export function MorphingShape({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shape = shapeRef.current;
      if (!shape) return;

      let currentShape = 0;

      function morphToNext() {
        currentShape = (currentShape + 1) % SHAPES.length;
        const nextClip = `polygon(${SHAPES[currentShape]})`;

        gsap.to(shape, {
          clipPath: nextClip,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.delayedCall(0.8, morphToNext);
          },
        });

        // Rotate slowly
        gsap.to(shape, {
          rotation: `+=${45}`,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }

      // Initial state
      gsap.set(shape, {
        clipPath: `polygon(${SHAPES[0]})`,
        scale: 0,
      });

      // Entry animation
      gsap.to(shape, {
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3,
        onComplete: () => {
          gsap.delayedCall(0.5, morphToNext);
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          clip-path polygon morphing with rotation
        </p>

        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full" />

          <div
            ref={shapeRef}
            className={`w-56 h-56 bg-gradient-to-br ${COLORS[0]} opacity-80`}
            style={{
              clipPath: `polygon(${SHAPES[0]})`,
            }}
          />
        </div>

        <div className="flex gap-4">
          {["Circle", "Star", "Square", "Blob"].map((name, i) => (
            <span
              key={i}
              className="text-xs font-mono text-zinc-600 px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
