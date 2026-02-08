"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const ITEM_COUNT = 10;
const RADIUS = 320;
const ANGLE_STEP = 360 / ITEM_COUNT;

const CARD_COLORS = [
  { bg: "from-emerald-500/30 to-emerald-700/20", border: "border-emerald-500/30", text: "text-emerald-400" },
  { bg: "from-cyan-500/30 to-cyan-700/20", border: "border-cyan-500/30", text: "text-cyan-400" },
  { bg: "from-violet-500/30 to-violet-700/20", border: "border-violet-500/30", text: "text-violet-400" },
  { bg: "from-amber-500/30 to-amber-700/20", border: "border-amber-500/30", text: "text-amber-400" },
  { bg: "from-pink-500/30 to-pink-700/20", border: "border-pink-500/30", text: "text-pink-400" },
  { bg: "from-emerald-500/30 to-cyan-700/20", border: "border-emerald-500/30", text: "text-emerald-400" },
  { bg: "from-cyan-500/30 to-violet-700/20", border: "border-cyan-500/30", text: "text-cyan-400" },
  { bg: "from-violet-500/30 to-amber-700/20", border: "border-violet-500/30", text: "text-violet-400" },
  { bg: "from-amber-500/30 to-emerald-700/20", border: "border-amber-500/30", text: "text-amber-400" },
  { bg: "from-pink-500/30 to-cyan-700/20", border: "border-pink-500/30", text: "text-pink-400" },
];

const LABELS = [
  "Design", "Motion", "Build", "Create", "Animate",
  "Render", "Compose", "Iterate", "Launch", "Refine",
];

export function CylinderGallery({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const targetSpeedRef = useRef(1);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0-1
    // Map x position to timeScale: left = slower, center = normal, right = faster
    const speed = gsap.utils.mapRange(0, 1, -1.5, 3, x);
    targetSpeedRef.current = speed;

    if (tlRef.current) {
      gsap.to(tlRef.current, {
        timeScale: speed,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetSpeedRef.current = 1;
    if (tlRef.current) {
      gsap.to(tlRef.current, {
        timeScale: 1,
        duration: 1.2,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, []);

  useGSAP(
    () => {
      const cylinder = cylinderRef.current;
      if (!cylinder) return;

      const items = gsap.utils.toArray<HTMLElement>(".gallery-item", cylinder);

      // Auto-rotation timeline
      const tl = gsap.timeline({ repeat: -1, ease: "none" });
      tl.to(cylinder, {
        rotateY: 360,
        duration: 20,
        ease: "none",
      });

      tlRef.current = tl;

      // Opacity update based on rotation angle
      const updateOpacity = () => {
        const rot = gsap.getProperty(cylinder, "rotateY") as number;
        items.forEach((el, i) => {
          const itemAngle = ((rot + i * ANGLE_STEP) % 360 + 360) % 360;
          const cos = Math.cos((itemAngle * Math.PI) / 180);
          const isBehind = cos < 0;
          const opacity = isBehind ? 0.08 + 0.07 * (1 + cos) : 0.2 + 0.8 * cos;
          const scale = isBehind ? 0.85 : 0.9 + 0.1 * cos;
          gsap.set(el, { opacity, scale });
        });
      };

      // Run opacity update on each tick
      gsap.ticker.add(updateOpacity);

      // Entry animation
      gsap.from(items, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      return () => {
        gsap.ticker.remove(updateOpacity);
        tlRef.current = null;
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-xs font-mono text-zinc-500">
          cylinder-gallery · auto-rotate · mouse drag adjusts speed
        </p>

        {/* Perspective container with mouse interaction */}
        <div
          className="relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ perspective: 1000, width: "100%", height: 420 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Rotating cylinder */}
          <div
            ref={cylinderRef}
            style={{ transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: ITEM_COUNT }).map((_, i) => {
              const color = CARD_COLORS[i];
              return (
                <div
                  key={i}
                  className={`gallery-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                  style={{
                    width: 140,
                    height: 180,
                    transform: `rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={`w-full h-full rounded-xl bg-gradient-to-br ${color.bg} border ${color.border} flex flex-col items-center justify-center gap-3 p-4`}
                  >
                    {/* Number */}
                    <span className={`text-4xl font-bold ${color.text} tabular-nums`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Divider */}
                    <div className={`w-8 h-px ${color.text} opacity-30`} />

                    {/* Label */}
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                      {LABELS[i]}
                    </span>

                    {/* Decorative dots */}
                    <div className="flex gap-1 mt-2">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className={`w-1.5 h-1.5 rounded-full ${color.text} opacity-30`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horizontal fade edges */}
          <div
            className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
            style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
            style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-mono text-zinc-600">
            {ITEM_COUNT} cards · rotateY + translateZ({RADIUS}px) · perspective: 1000
          </p>
          <p className="text-[10px] font-mono text-zinc-700">
            move mouse left/right to change rotation speed
          </p>
        </div>
      </div>
    </div>
  );
}
