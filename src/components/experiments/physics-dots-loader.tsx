"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const NUM_DOTS = 5;
const DOT_SIZE = 20;
const DOT_GAP = 32;
const STAGGER = 0.12;

export function PhysicsDotsLoader({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const dots = gsap.utils.toArray<HTMLElement>(".pdl-dot", container);
      const shadows = gsap.utils.toArray<HTMLElement>(".pdl-shadow", container);

      if (!dots.length) return;

      const master = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

      dots.forEach((dot, i) => {
        const shadow = shadows[i];
        const dotTl = gsap.timeline();
        const baseY = 0;
        const dropHeight = -120;

        // Start elevated
        dotTl.set(dot, { y: dropHeight });
        if (shadow) {
          dotTl.set(shadow, { scale: 0.3, opacity: 0.1 });
        }

        // Fall down (accelerating — gravity feel)
        dotTl.to(dot, {
          y: baseY,
          duration: 0.35,
          ease: "power2.in",
        });

        // Shadow grows as dot approaches ground
        if (shadow) {
          dotTl.to(
            shadow,
            {
              scale: 1,
              opacity: 0.5,
              duration: 0.35,
              ease: "power2.in",
            },
            "<"
          );
        }

        // Squash on impact
        dotTl.to(dot, {
          scaleX: 1.4,
          scaleY: 0.6,
          duration: 0.08,
          ease: "power2.in",
        });

        // Glow pulse on impact
        if (shadow) {
          dotTl.to(
            shadow,
            {
              scale: 1.6,
              opacity: 0.7,
              duration: 0.08,
              ease: "power1.out",
            },
            "<"
          );
        }

        // Unsquash + start bounce up
        dotTl.to(dot, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.1,
          ease: "power1.out",
        });

        // Bounce sequence with decreasing heights
        const bounceHeights = [80, 45, 22, 10];
        bounceHeights.forEach((height) => {
          const upDuration = 0.22 * (height / 80);
          const downDuration = 0.22 * (height / 80);

          // Bounce up (decelerating)
          dotTl.to(dot, {
            y: -height,
            duration: upDuration,
            ease: "power2.out",
          });

          if (shadow) {
            dotTl.to(
              shadow,
              {
                scale: 0.3 + (1 - height / 120) * 0.3,
                opacity: 0.15,
                duration: upDuration,
                ease: "power2.out",
              },
              "<"
            );
          }

          // Fall back down (accelerating)
          dotTl.to(dot, {
            y: baseY,
            duration: downDuration,
            ease: "power2.in",
          });

          if (shadow) {
            dotTl.to(
              shadow,
              {
                scale: 1,
                opacity: 0.4,
                duration: downDuration,
                ease: "power2.in",
              },
              "<"
            );
          }

          // Micro-squash on each landing
          if (height > 15) {
            dotTl.to(dot, {
              scaleX: 1 + (height / 200),
              scaleY: 1 - (height / 200),
              duration: 0.05,
              ease: "power1.in",
            });
            dotTl.to(dot, {
              scaleX: 1,
              scaleY: 1,
              duration: 0.08,
              ease: "power1.out",
            });
          }
        });

        // Settle
        dotTl.to(dot, { y: baseY, duration: 0.1, ease: "power1.out" });
        if (shadow) {
          dotTl.to(shadow, { scale: 0.8, opacity: 0.3, duration: 0.1 }, "<");
        }

        // Add to master with stagger
        master.add(dotTl, i * STAGGER);
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Label */}
      <div className="mb-16 text-center">
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Physics Dots Loader
        </p>
        <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
          Gravity Bounce
        </h2>
        <p className="text-xs font-mono text-zinc-600 mt-3">
          Simulated gravity · staggered wave · decay bounce
        </p>
      </div>

      {/* Dots area */}
      <div className="flex items-end justify-center" style={{ height: 180 }}>
        <div
          className="flex items-end justify-center"
          style={{ gap: DOT_GAP }}
        >
          {Array.from({ length: NUM_DOTS }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Dot */}
              <div className="relative" style={{ height: 140 }}>
                <div
                  className="pdl-dot absolute bottom-0 rounded-full bg-emerald-400"
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    transformOrigin: "center bottom",
                    boxShadow: "0 0 12px rgba(52, 211, 153, 0.3)",
                  }}
                />
              </div>
              {/* Shadow */}
              <div
                className="pdl-shadow rounded-full bg-emerald-400/20 mt-1"
                style={{
                  width: DOT_SIZE * 1.4,
                  height: DOT_SIZE * 0.25,
                  filter: "blur(2px)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Status label */}
      <div className="mt-16 flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-emerald-400/60"
            />
          ))}
        </div>
        <span className="text-sm font-mono text-zinc-500">Loading</span>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-emerald-400/60"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs font-mono text-zinc-700 mt-8">
        {NUM_DOTS} dots · power2.in/out · squash & stretch · glow on impact
      </p>
    </div>
  );
}
