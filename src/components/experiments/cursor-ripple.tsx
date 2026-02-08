"use client";

import { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const MAX_RIPPLES = 10;

export function CursorRipple({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const rippleCount = useRef(0);
  const [clickCount, setClickCount] = useState(0);

  useGSAP(
    () => {
      gsap.from(".ripple-container", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const spawnRipple = useCallback((x: number, y: number, color: string, delay: number, size: number) => {
    const field = fieldRef.current;
    if (!field) return;

    const el = document.createElement("div");
    el.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      margin-left: ${-size / 2}px;
      margin-top: ${-size / 2}px;
      border-radius: 50%;
      border: 2px solid ${color};
      pointer-events: none;
      will-change: transform, opacity;
      transform: scale(0);
      opacity: 0;
    `;
    field.appendChild(el);
    rippleCount.current++;

    gsap.to(el, {
      scale: 15,
      opacity: 0,
      duration: 1.2,
      delay,
      ease: "power2.out",
      onStart: () => {
        gsap.set(el, { opacity: 1 });
      },
      onComplete: () => {
        el.remove();
        rippleCount.current--;
      },
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (rippleCount.current >= MAX_RIPPLES) return;

    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickCount((c) => c + 1);

    // Primary ripple — emerald
    spawnRipple(x, y, "rgb(52, 211, 153)", 0, 20);

    // Secondary ripple — cyan, slightly delayed and larger start
    if (rippleCount.current < MAX_RIPPLES - 1) {
      spawnRipple(x, y, "rgb(6, 182, 212)", 0.1, 16);
    }
  }, [spawnRipple]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500">
        click to spawn ripples · gsap scale + opacity · dual-ring emerald/cyan · max {MAX_RIPPLES} concurrent
      </p>

      <div
        ref={fieldRef}
        className="ripple-container relative w-full max-w-2xl h-96 rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden cursor-crosshair"
        onClick={handleClick}
      >
        {/* Center hint */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700"
          style={{ opacity: clickCount === 0 ? 1 : 0 }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated hint ring */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 border-2 border-emerald-400/40" />
            </div>
            <p className="text-sm font-mono text-zinc-500">Click anywhere to create ripples</p>
          </div>
        </div>

        {/* Click counter */}
        {clickCount > 0 && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <span className="text-[10px] font-mono text-zinc-600">
              clicks: {clickCount}
            </span>
          </div>
        )}
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        primary: emerald-400 · secondary: cyan-400 (0.1s delay) · scale 0 → 15 · 1.2s duration
      </p>
    </div>
  );
}
