"use client";

import { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

interface Props {
  onReplay: () => void;
}

const ORBITS = [
  {
    radius: 80,
    duration: 4,
    items: [
      { color: "bg-emerald-400", size: "w-3 h-3" },
      { color: "bg-emerald-400/50", size: "w-2 h-2" },
    ],
  },
  {
    radius: 140,
    duration: 7,
    items: [
      { color: "bg-cyan-400", size: "w-4 h-4" },
      { color: "bg-cyan-400/60", size: "w-2.5 h-2.5" },
      { color: "bg-cyan-400/30", size: "w-2 h-2" },
    ],
  },
  {
    radius: 210,
    duration: 11,
    items: [
      { color: "bg-violet-400", size: "w-3.5 h-3.5" },
      { color: "bg-violet-400/40", size: "w-2 h-2" },
      { color: "bg-violet-400/60", size: "w-3 h-3" },
      { color: "bg-violet-400/20", size: "w-1.5 h-1.5" },
    ],
  },
];

function createCirclePath(radius: number): string {
  return `M${radius},0 A${radius},${radius} 0 1,1 ${-radius},0 A${radius},${radius} 0 1,1 ${radius},0`;
}

export function OrbitAnimation({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Animate each orbit's items
      ORBITS.forEach((orbit, oi) => {
        orbit.items.forEach((_, ii) => {
          const selector = `.orbit-${oi}-item-${ii}`;
          const el = container.querySelector(selector);
          if (!el) return;

          const offsetAngle = (ii / orbit.items.length) * 360;

          gsap.to(el, {
            motionPath: {
              path: createCirclePath(orbit.radius),
              align: "self",
              alignOrigin: [0.5, 0.5],
              start: offsetAngle / 360,
              end: offsetAngle / 360 + 1,
            },
            duration: orbit.duration,
            ease: "none",
            repeat: -1,
          });
        });
      });

      // Pulse the center
      gsap.to(".orbit-center", {
        scale: 1.15,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Subtle glow pulse
      gsap.to(".orbit-glow", {
        opacity: 0.15,
        scale: 1.3,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full bg-zinc-950 flex flex-col items-center justify-center relative">
      {/* Label */}
      <div className="absolute top-6 left-6">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Orbit</h2>
        <p className="text-xs font-mono text-zinc-500 mt-1">MotionPathPlugin · 3 rings</p>
      </div>

      {/* Orbit area */}
      <div className="relative" style={{ width: 480, height: 480 }}>
        {/* Orbit ring guides */}
        {ORBITS.map((orbit, oi) => (
          <div
            key={`ring-${oi}`}
            className="absolute rounded-full border border-zinc-800/40"
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Center glow */}
        <div
          className="orbit-glow absolute rounded-full bg-emerald-400/10 blur-xl"
          style={{
            width: 80,
            height: 80,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Center point */}
        <div
          className="orbit-center absolute w-6 h-6 rounded-full bg-zinc-100 shadow-lg shadow-zinc-100/20"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Orbiting items */}
        {ORBITS.map((orbit, oi) =>
          orbit.items.map((item, ii) => (
            <div
              key={`${oi}-${ii}`}
              className={`orbit-${oi}-item-${ii} absolute rounded-full ${item.color} ${item.size}`}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-zinc-600">Inner · 4s</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-600">Mid · 7s</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-xs font-mono text-zinc-600">Outer · 11s</span>
        </div>
      </div>
    </div>
  );
}
