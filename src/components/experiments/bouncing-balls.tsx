"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const BALLS = [
  { color: "bg-emerald-400", size: 60, delay: 0 },
  { color: "bg-cyan-400", size: 48, delay: 0.15 },
  { color: "bg-violet-400", size: 56, delay: 0.3 },
  { color: "bg-amber-400", size: 40, delay: 0.45 },
  { color: "bg-rose-400", size: 52, delay: 0.6 },
  { color: "bg-blue-400", size: 44, delay: 0.75 },
];

interface Props {
  onReplay: () => void;
}

export function BouncingBalls({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const balls = containerRef.current?.querySelectorAll(".ball");
      if (!balls) return;

      balls.forEach((ball, i) => {
        const dropHeight = 300;
        const data = BALLS[i];

        const tl = gsap.timeline({ delay: data.delay + 0.3, repeat: -1, repeatDelay: 1 });

        // Drop from top
        tl.fromTo(
          ball,
          { y: -dropHeight, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.in",
          }
        );

        // Bounce sequence with decreasing height
        const bounceHeights = [120, 60, 30, 12];
        bounceHeights.forEach((height) => {
          // Up
          tl.to(ball, {
            y: -height,
            duration: 0.25 * (height / 120),
            ease: "power2.out",
          });
          // Down
          tl.to(ball, {
            y: 0,
            duration: 0.25 * (height / 120),
            ease: "power2.in",
          });
        });

        // Squash on impact
        tl.to(
          ball,
          {
            scaleX: 1.3,
            scaleY: 0.7,
            duration: 0.1,
            ease: "power2.in",
          },
          0.6
        );
        tl.to(ball, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
          ease: "elastic.out(1, 0.3)",
        });

        // Shadow animation
        const shadow = containerRef.current?.querySelectorAll(".ball-shadow")[i];
        if (shadow) {
          tl.fromTo(
            shadow,
            { scale: 0.3, opacity: 0.1 },
            { scale: 1, opacity: 0.4, duration: 0.6, ease: "power2.in" },
            0
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-mono text-zinc-500 mb-8">
          Physics-like bounce with custom easing
        </p>
        <div className="flex gap-10 items-end">
          {BALLS.map((ball, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative" style={{ height: 320 }}>
                <div
                  className={`ball ${ball.color} rounded-full absolute bottom-0`}
                  style={{
                    width: ball.size,
                    height: ball.size,
                    transformOrigin: "center bottom",
                  }}
                />
              </div>
              <div
                className="ball-shadow bg-white/10 rounded-full mt-2"
                style={{
                  width: ball.size * 0.8,
                  height: ball.size * 0.15,
                }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-600 mt-8">
          Staggered drops · Squash & stretch · Decreasing bounces
        </p>
      </div>
    </div>
  );
}
