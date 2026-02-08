"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const GRID_SIZE = 24;
const DOT_COUNT = GRID_SIZE * GRID_SIZE;
const PUSH_STRENGTH = 30;
const DOT_NATIVE = 14;        // rendered size (px) — high res
const DOT_DISPLAY = 5;         // visual size at rest
const BASE_SCALE = DOT_DISPLAY / DOT_NATIVE;  // ~0.357

export function InertiaDotGrid({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Settings — state for UI, refs for rAF loop (no stale closures)
  const [radius, setRadius] = useState(100);
  const [scaleFactor, setScaleFactor] = useState(0.5);
  const radiusRef = useRef(100);
  const scaleFactorRef = useRef(0.5);

  const updateRadius = (v: number) => {
    setRadius(v);
    radiusRef.current = v;
  };
  const updateScaleFactor = (v: number) => {
    setScaleFactor(v);
    scaleFactorRef.current = v;
  };

  useGSAP(
    (_, contextSafe) => {
      const grid = gridRef.current;
      if (!grid) return;

      const dots = gsap.utils.toArray<HTMLElement>(".dot-item", grid);
      if (!dots.length) return;

      const dotData: {
        el: HTMLElement;
        originX: number;
        originY: number;
        qx: gsap.QuickToFunc;
        qy: gsap.QuickToFunc;
        pushed: boolean;
      }[] = [];

      gsap.set(dots, { scale: BASE_SCALE });
      gsap.from(dots, {
        scale: 0,
        opacity: 0,
        stagger: {
          each: 0.003,
          grid: [GRID_SIZE, GRID_SIZE],
          from: "center",
        },
        duration: 0.4,
        ease: "back.out(1.5)",
        delay: 0.2,
        onComplete: () => {
          initDots();
          startLoop();
        },
      });

      function initDots() {
        const gridRect = grid!.getBoundingClientRect();

        dots.forEach((el) => {
          const rect = el.getBoundingClientRect();
          dotData.push({
            el,
            originX: rect.left + rect.width / 2 - gridRect.left,
            originY: rect.top + rect.height / 2 - gridRect.top,
            qx: gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" }),
            qy: gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" }),
            pushed: false,
          });
        });

        dots.forEach((dot, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          gsap.to(dot, {
            opacity: gsap.utils.random(0.2, 0.6),
            duration: gsap.utils.random(2, 4),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: (row + col) * 0.03,
          });
        });
      }

      let mx = -1000;
      let my = -1000;
      let active = false;
      let rafId = 0;

      function updateDots() {
        if (!grid) return;
        const gridRect = grid.getBoundingClientRect();
        const localX = mx - gridRect.left;
        const localY = my - gridRect.top;
        const r = radiusRef.current;
        const sf = scaleFactorRef.current;

        for (let i = 0; i < dotData.length; i++) {
          const dot = dotData[i];
          const dx = dot.originX - localX;
          const dy = dot.originY - localY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (active && dist < r) {
            const force = (1 - dist / r) * PUSH_STRENGTH;
            const angle = Math.atan2(dy, dx);
            dot.qx(Math.cos(angle) * force);
            dot.qy(Math.sin(angle) * force);

            const proximity = 1 - dist / r;
            // Scale from BASE_SCALE up to BASE_SCALE * 2.5 at max
            const targetScale = BASE_SCALE * (1 + proximity * sf * 1.5);
            gsap.set(dot.el, { scale: targetScale });
            dot.pushed = true;

            const intensity = Math.min(1, force / PUSH_STRENGTH);
            const g = Math.round(120 + intensity * 135);
            dot.el.style.backgroundColor = `rgb(16, ${g}, 96)`;
          } else {
            dot.qx(0);
            dot.qy(0);
            if (dot.pushed) {
              gsap.to(dot.el, { scale: BASE_SCALE, duration: 0.3, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
              dot.pushed = false;
            }
            dot.el.style.backgroundColor = "";
          }
        }

        rafId = requestAnimationFrame(updateDots);
      }

      function startLoop() {
        rafId = requestAnimationFrame(updateDots);
      }

      const area = containerRef.current!;
      const handleMouseMove = contextSafe!((e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
      });

      const handleGridEnter = contextSafe!((e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        active = true;
      });

      const handleGridLeave = contextSafe!(() => {
        active = false;
        mx = -1000;
        my = -1000;
      });

      area.addEventListener("mousemove", handleMouseMove);
      grid.addEventListener("mouseenter", handleGridEnter);
      grid.addEventListener("mouseleave", handleGridLeave);

      return () => {
        area.removeEventListener("mousemove", handleMouseMove);
        grid.removeEventListener("mouseenter", handleGridEnter);
        grid.removeEventListener("mouseleave", handleGridLeave);
        cancelAnimationFrame(rafId);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-mono text-zinc-500">
          gsap.quickTo · proximity push · elastic spring-back · {GRID_SIZE}×{GRID_SIZE}
        </p>

        <div className="flex items-start gap-6">
          <div
            ref={gridRef}
            className="grid p-10 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 cursor-crosshair"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gap: "6px",
            }}
          >
            {Array.from({ length: DOT_COUNT }, (_, i) => (
              <div
                key={i}
                className="dot-item rounded-full bg-emerald-400/20 will-change-transform"
                style={{
                  width: DOT_NATIVE,
                  height: DOT_NATIVE,
                  transform: `scale(${BASE_SCALE})`,
                }}
              />
            ))}
          </div>

          {/* Settings panel */}
          <div className="flex flex-col gap-5 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/50 w-48 shrink-0">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Settings</p>

          {/* Radius */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-mono text-zinc-400">Radius</label>
              <span className="text-[10px] font-mono text-emerald-400">{radius}px</span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              value={radius}
              onChange={(e) => updateRadius(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600">
              <span>40</span>
              <span>200</span>
            </div>
          </div>

          {/* Scale */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-mono text-zinc-400">Scale</label>
              <span className="text-[10px] font-mono text-emerald-400">
                {scaleFactor === 0 ? "off" : `${(1 + scaleFactor * 1.5).toFixed(1)}×`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={scaleFactor * 100}
              onChange={(e) => updateScaleFactor(Number(e.target.value) / 100)}
              className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600">
              <span>off</span>
              <span>2.5×</span>
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}
