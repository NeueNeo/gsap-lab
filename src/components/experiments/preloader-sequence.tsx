"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const SUBTITLE_TEXT = "ANIMATION LABORATORY";

export function PreloaderSequence({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const counterEl = container.querySelector(".preloader-counter") as HTMLElement;
      const counterObj = { value: 0 };

      const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

      // ─── Phase 1: Counter 0 → 100 ───
      master.addLabel("counter");
      master.to(counterObj, {
        value: 100,
        duration: 1.5,
        ease: "power2.inOut",
        snap: { value: 1 },
        onUpdate: () => {
          if (counterEl) {
            counterEl.textContent = String(Math.round(counterObj.value)).padStart(3, "0");
          }
        },
      });

      // Progress bar fills alongside counter
      master.to(
        ".preloader-bar-fill",
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "counter"
      );

      // Fade out counter elements
      master.to([".preloader-counter", ".preloader-bar", ".preloader-percent"], {
        autoAlpha: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });

      // ─── Phase 2: Logo reveal ───
      master.addLabel("logo");
      master.fromTo(
        ".preloader-logo",
        { autoAlpha: 0, scale: 0.6 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "logo"
      );

      // Logo mask reveal — clip from center outward
      master.fromTo(
        ".preloader-logo-mask",
        { clipPath: "inset(50% 50% 50% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power3.out",
        },
        "logo"
      );

      // ─── Phase 3: Subtitle characters ───
      master.addLabel("subtitle", "+=0.2");
      const charEls = container.querySelectorAll(".preloader-char");
      master.fromTo(
        charEls,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.4,
          ease: "power2.out",
        },
        "subtitle"
      );

      // Brief hold
      master.to({}, { duration: 1 });

      // ─── Phase 4: Wipe away ───
      master.addLabel("wipe");

      // Wipe bars slide in from left
      const wipeBars = container.querySelectorAll(".preloader-wipe-bar");
      master.fromTo(
        wipeBars,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.inOut",
          transformOrigin: "left center",
        },
        "wipe"
      );

      // Hide logo and subtitle behind wipe
      master.to(
        [".preloader-logo-mask", ".preloader-subtitle"],
        {
          autoAlpha: 0,
          duration: 0.1,
        },
        "wipe+=0.3"
      );

      // Wipe bars slide out to right
      master.to(
        wipeBars,
        {
          scaleX: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.inOut",
          transformOrigin: "right center",
        },
        "wipe+=0.5"
      );

      // ─── Phase 5: Content revealed ───
      master.addLabel("content", "+=0.1");
      master.fromTo(
        ".preloader-content",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "content"
      );

      master.fromTo(
        ".preloader-content-items > *",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        },
        "content+=0.2"
      );

      // Hold content visible
      master.to({}, { duration: 1.5 });

      // ─── Reset: Fade everything out before repeat ───
      master.to(".preloader-content", {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      // Reset counter for next loop
      master.call(() => {
        counterObj.value = 0;
        if (counterEl) counterEl.textContent = "000";
        gsap.set(".preloader-bar-fill", { scaleX: 0 });
        gsap.set([".preloader-counter", ".preloader-bar", ".preloader-percent"], {
          autoAlpha: 1,
          y: 0,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="h-full bg-zinc-950 flex items-center justify-center overflow-hidden relative"
    >
      {/* Label */}
      <div className="absolute top-6 left-6 z-10">
        <p className="text-xs font-mono text-zinc-500">
          Preloader Sequence · 5 phases · master timeline
        </p>
      </div>

      {/* Main stage */}
      <div className="relative flex flex-col items-center justify-center w-full">
        {/* Counter */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="preloader-counter text-7xl font-bold text-emerald-400 font-mono tabular-nums tracking-tighter">
            000
          </div>
          <div className="preloader-percent text-sm font-mono text-zinc-600">%</div>
          <div className="preloader-bar w-48 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="preloader-bar-fill h-full bg-emerald-400 rounded-full origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>

        {/* Logo — hidden initially */}
        <div className="preloader-logo-mask absolute inset-0 flex items-center justify-center" style={{ clipPath: "inset(50% 50% 50% 50%)" }}>
          <div className="preloader-logo invisible">
            <h1 className="text-7xl font-black text-zinc-100 tracking-tighter">
              GSAP <span className="text-emerald-400">LAB</span>
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <div className="preloader-subtitle absolute inset-0 flex items-center justify-center pt-24">
          <div className="flex gap-0.5">
            {SUBTITLE_TEXT.split("").map((char, i) => (
              <span
                key={i}
                className="preloader-char text-sm font-mono text-zinc-500 tracking-widest invisible"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Wipe bars */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="preloader-wipe-bar w-full bg-emerald-400"
              style={{ height: "20%", transform: "scaleX(0)" }}
            />
          ))}
        </div>

        {/* Content — revealed after wipe */}
        <div className="preloader-content absolute inset-0 flex items-center justify-center invisible">
          <div className="preloader-content-items text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 mx-auto flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Ready</h2>
            <p className="text-sm font-mono text-zinc-500">Content loaded successfully</p>
            <div className="flex gap-3 justify-center pt-2">
              <div className="px-4 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-xs font-mono text-emerald-400">
                ENTER
              </div>
              <div className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-400">
                SKIP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6">
        <p className="text-xs font-mono text-zinc-700">
          counter → logo → subtitle → wipe → content → loop
        </p>
      </div>
    </div>
  );
}
