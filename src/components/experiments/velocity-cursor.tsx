"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function VelocityCursor({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);

  useGSAP(
    () => {
      const field = fieldRef.current;
      if (!field) return;

      const inner = field.querySelector(".vc-inner") as HTMLElement;
      const outer = field.querySelector(".vc-outer") as HTMLElement;
      if (!inner || !outer) return;

      // Hide both initially
      gsap.set([inner, outer], { opacity: 0, xPercent: -50, yPercent: -50 });

      // quickTo for smooth tracking
      const innerXTo = gsap.quickTo(inner, "x", { duration: 0.15, ease: "power3" });
      const innerYTo = gsap.quickTo(inner, "y", { duration: 0.15, ease: "power3" });
      const outerXTo = gsap.quickTo(outer, "x", { duration: 0.5, ease: "power3" });
      const outerYTo = gsap.quickTo(outer, "y", { duration: 0.5, ease: "power3" });

      let prevX = 0;
      let prevY = 0;
      let prevTime = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = field.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = performance.now();
        const dt = now - prevTime;

        // Move both cursors
        innerXTo(x);
        innerYTo(y);
        outerXTo(x);
        outerYTo(y);

        // Velocity-based deformation on inner cursor
        if (dt > 0 && prevTime > 0) {
          const vx = (x - prevX) / dt;
          const vy = (y - prevY) / dt;
          const speed = Math.sqrt(vx * vx + vy * vy);
          const angle = Math.atan2(vy, vx) * (180 / Math.PI);

          const stretch = Math.min(speed * 8, 2.5);
          const sx = 1 + stretch * 0.6;
          const sy = Math.max(0.5, 1 - stretch * 0.2);

          if (speed > 0.05) {
            gsap.to(inner, { scaleX: sx, scaleY: sy, rotation: angle, duration: 0.2, ease: "power2.out", overwrite: "auto" });
          } else {
            gsap.to(inner, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          }
        }

        prevX = x;
        prevY = y;
        prevTime = now;
      };

      const handleMouseEnter = (e: MouseEvent) => {
        const rect = field.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Snap to entry point then show
        gsap.set([inner, outer], { x, y });
        gsap.to(inner, { opacity: 1, duration: 0.2 });
        gsap.to(outer, { opacity: 1, duration: 0.3 });
        prevTime = 0; // Reset velocity tracking
      };

      const handleMouseLeave = () => {
        gsap.to([inner, outer], { opacity: 0, duration: 0.3 });
        gsap.to(inner, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.3 });
        prevTime = 0;
      };

      field.addEventListener("mousemove", handleMouseMove);
      field.addEventListener("mouseenter", handleMouseEnter);
      field.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        field.removeEventListener("mousemove", handleMouseMove);
        field.removeEventListener("mouseenter", handleMouseEnter);
        field.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500">
        velocity tracking · scaleX/rotation from mouse speed · dual-ring cursor
      </p>

      <div
        ref={fieldRef}
        className="relative w-full max-w-2xl h-96 rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden"
        style={{ cursor: "none" }}
        onMouseEnter={() => setIsInside(true)}
        onMouseLeave={() => setIsInside(false)}
      >
        {/* Inner cursor — deforms with velocity */}
        <div
          className="vc-inner absolute top-0 left-0 pointer-events-none will-change-transform rounded-full"
          style={{ width: 20, height: 20, backgroundColor: "#34d399" }}
        />

        {/* Outer ring — slower follow */}
        <div
          className="vc-outer absolute top-0 left-0 pointer-events-none will-change-transform rounded-full"
          style={{ width: 48, height: 48, border: "2px solid rgba(52, 211, 153, 0.35)" }}
        />

        {/* Idle hint */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none"
          style={{ opacity: isInside ? 0 : 1 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-400/60" />
                <span className="text-[10px] font-mono text-zinc-600">slow</span>
              </div>
              <svg width="24" height="8" viewBox="0 0 24 8" className="text-zinc-600">
                <path d="M0,4 L20,4 M16,1 L20,4 L16,7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-4 rounded-full bg-emerald-400/60" style={{ transform: "rotate(-20deg)" }} />
                <span className="text-[10px] font-mono text-zinc-600">fast</span>
              </div>
            </div>
            <p className="text-sm font-mono text-zinc-500">Move mouse — speed distorts cursor</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        inner: 0.15s · outer: 0.5s lag · velocity → scaleX (max 2.5×) + atan2 rotation
      </p>
    </div>
  );
}
