"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const SLIDES = [
  {
    title: "Compose",
    body: "Build modular, composable interfaces from small pieces.",
    accent: "emerald",
    icon: "◇",
  },
  {
    title: "Animate",
    body: "Add motion that guides the eye and communicates state.",
    accent: "cyan",
    icon: "△",
  },
  {
    title: "Refine",
    body: "Polish every detail until the experience feels effortless.",
    accent: "violet",
    icon: "○",
  },
  {
    title: "Deploy",
    body: "Ship confidently with tested, accessible components.",
    accent: "amber",
    icon: "□",
  },
];

const ACCENT_MAP: Record<string, { text: string; border: string; bg: string }> = {
  emerald: { text: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/10" },
  cyan: { text: "text-cyan-400", border: "border-cyan-400/20", bg: "bg-cyan-400/10" },
  violet: { text: "text-violet-400", border: "border-violet-400/20", bg: "bg-violet-400/10" },
  amber: { text: "text-amber-400", border: "border-amber-400/20", bg: "bg-amber-400/10" },
};

interface Props {
  onReplay: () => void;
}

export function SlideTransition({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const goNext = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = (currentIndex + 1) % SLIDES.length;
    const current = containerRef.current?.querySelector(".slide-current") as HTMLElement;
    const next = containerRef.current?.querySelector(".slide-next") as HTMLElement;

    if (!current || !next) return;

    // Prepare next slide off-screen right
    gsap.set(next, { xPercent: 100, autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
      },
    });

    // Slide current out left
    tl.to(current, {
      xPercent: -100,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power3.inOut",
    });

    // Slide next in from right (overlapping timing)
    tl.to(
      next,
      {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.inOut",
      },
      "-=0.35"
    );

    // Stagger content within the new slide
    const children = next.querySelectorAll(".slide-child");
    tl.from(
      children,
      { x: 40, autoAlpha: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  });

  const goPrev = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const prevIndex = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    const current = containerRef.current?.querySelector(".slide-current") as HTMLElement;
    const prev = containerRef.current?.querySelector(".slide-prev") as HTMLElement;

    if (!current || !prev) return;

    // Prepare prev slide off-screen left
    gsap.set(prev, { xPercent: -100, autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(prevIndex);
        setIsAnimating(false);
      },
    });

    // Slide current out right
    tl.to(current, {
      xPercent: 100,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power3.inOut",
    });

    // Slide prev in from left
    tl.to(
      prev,
      {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.inOut",
      },
      "-=0.35"
    );

    const children = prev.querySelectorAll(".slide-child");
    tl.from(
      children,
      { x: -40, autoAlpha: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  });

  const prevIndex = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
  const nextIndex = (currentIndex + 1) % SLIDES.length;

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 flex flex-col overflow-hidden">
      {/* Slides container */}
      <div className="flex-1 relative">
        {SLIDES.map((slide, idx) => {
          const colors = ACCENT_MAP[slide.accent];
          let className = "";
          if (idx === currentIndex) className = "slide-current";
          else if (idx === nextIndex) className = "slide-next";
          else if (idx === prevIndex) className = "slide-prev";

          return (
            <div
              key={idx}
              className={`absolute inset-0 flex items-center justify-center px-8 ${className}`}
              style={{
                visibility: idx === currentIndex ? "visible" : "hidden",
                opacity: idx === currentIndex ? 1 : 0,
              }}
            >
              <div className="w-full max-w-md text-center">
                <div className={`slide-child inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border} mb-6`}>
                  <span className={`text-2xl ${colors.text}`}>{slide.icon}</span>
                </div>
                <h2 className={`slide-child text-5xl font-bold tracking-tighter ${colors.text}`}>
                  {slide.title}
                </h2>
                <p className="slide-child text-lg text-zinc-400 mt-4 max-w-sm mx-auto">
                  {slide.body}
                </p>
                <div className="slide-child mt-6">
                  <span className={`text-xs font-mono ${colors.text} opacity-60 tracking-widest`}>
                    {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 pb-10">
        <button
          onClick={goPrev}
          disabled={isAnimating}
          className="px-5 py-3 rounded-xl border border-zinc-700/50 bg-zinc-900/60 text-sm font-mono text-zinc-300 hover:bg-zinc-800/80 transition-colors disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          onClick={goNext}
          disabled={isAnimating}
          className="px-5 py-3 rounded-xl border border-zinc-700/50 bg-zinc-900/60 text-sm font-mono text-zinc-300 hover:bg-zinc-800/80 transition-colors disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
