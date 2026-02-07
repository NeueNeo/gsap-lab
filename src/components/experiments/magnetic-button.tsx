"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

/* ── Attract: follows the cursor ── */
function AttractBtn() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(btnRef.current, { x: x * 50, y: y * 50, duration: 0.4, ease: "power2.out" });
    gsap.to(textRef.current, { x: x * 15, y: y * 15, duration: 0.4, ease: "power2.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
  }, []);

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="flex flex-col items-center gap-4" style={{ width: 220, height: 260 }}>
      <div className="flex-1 flex items-center justify-center">
        <button ref={btnRef} className="w-36 h-36 rounded-full bg-emerald-400/10 border-2 border-emerald-400/30 flex items-center justify-center cursor-pointer will-change-transform">
          <span ref={textRef} className="text-lg font-semibold text-emerald-400 pointer-events-none will-change-transform">Attract</span>
        </button>
      </div>
      <p className="text-[10px] font-mono text-zinc-600 text-center">Follows cursor</p>
    </div>
  );
}

/* ── Repel: pushes away from cursor ── */
function RepelBtn() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    // Negative = repel
    gsap.to(btnRef.current, { x: x * -45, y: y * -45, duration: 0.3, ease: "power3.out" });
    gsap.to(textRef.current, { x: x * -12, y: y * -12, duration: 0.3, ease: "power3.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.25)" });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.25)" });
  }, []);

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="flex flex-col items-center gap-4" style={{ width: 220, height: 260 }}>
      <div className="flex-1 flex items-center justify-center">
        <button ref={btnRef} className="w-36 h-36 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center cursor-pointer will-change-transform">
          <span ref={textRef} className="text-lg font-semibold text-cyan-400 pointer-events-none will-change-transform">Repel</span>
        </button>
      </div>
      <p className="text-[10px] font-mono text-zinc-600 text-center">Pushes away</p>
    </div>
  );
}

/* ── Stretch: scales and rotates toward cursor ── */
function StretchBtn() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const dist = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    gsap.to(btnRef.current, {
      x: x * 30,
      y: y * 30,
      scaleX: 1 + dist * 0.2,
      scaleY: 1 - dist * 0.1,
      rotation: angle * 0.08,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(textRef.current, { x: x * 10, y: y * 10, duration: 0.4, ease: "power2.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  }, []);

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="flex flex-col items-center gap-4" style={{ width: 220, height: 260 }}>
      <div className="flex-1 flex items-center justify-center">
        <button ref={btnRef} className="w-36 h-36 rounded-full bg-violet-400/10 border-2 border-violet-400/30 flex items-center justify-center cursor-pointer will-change-transform">
          <span ref={textRef} className="text-lg font-semibold text-violet-400 pointer-events-none will-change-transform">Stretch</span>
        </button>
      </div>
      <p className="text-[10px] font-mono text-zinc-600 text-center">Deforms toward cursor</p>
    </div>
  );
}

export function MagneticButton({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".mag-entry", {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full p-8">
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500 tracking-widest">
          Move cursor near each button
        </p>
        <div className="flex gap-4">
          <div className="mag-entry"><AttractBtn /></div>
          <div className="mag-entry"><RepelBtn /></div>
          <div className="mag-entry"><StretchBtn /></div>
        </div>
      </div>
    </div>
  );
}
