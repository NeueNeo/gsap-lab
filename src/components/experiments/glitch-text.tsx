
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GLITCH_TEXT = "GLITCH";

interface Props {
  onReplay: () => void;
}

export function GlitchText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mainChars = container.querySelectorAll(".glitch-main .g-char");
      const topChars = container.querySelectorAll(".glitch-top .g-char");
      const bottomChars = container.querySelectorAll(".glitch-bottom .g-char");
      const scanlines = container.querySelector(".scanlines");
      const bar = container.querySelector(".glitch-bar");

      // Initial fade in
      gsap.set([mainChars, topChars, bottomChars], { opacity: 0 });
      gsap.to(mainChars, {
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.3,
      });

      // Continuous glitch timeline
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 1 });

      // Glitch burst 1
      tl.to(topChars, {
        opacity: 0.8,
        x: () => gsap.utils.random(-8, 8),
        duration: 0.05,
      })
        .to(
          bottomChars,
          {
            opacity: 0.6,
            x: () => gsap.utils.random(-6, 6),
            duration: 0.05,
          },
          "<"
        )
        .to(
          mainChars,
          {
            x: () => gsap.utils.random(-3, 3),
            skewX: () => gsap.utils.random(-5, 5),
            duration: 0.05,
          },
          "<"
        )
        .to(bar, { opacity: 1, y: () => gsap.utils.random(-50, 50), duration: 0.03 }, "<")
        .to(scanlines, { opacity: 0.3, duration: 0.05 }, "<");

      // Reset
      tl.to(mainChars, { x: 0, skewX: 0, duration: 0.05 })
        .to(topChars, { opacity: 0, x: 0, duration: 0.05 }, "<")
        .to(bottomChars, { opacity: 0, x: 0, duration: 0.05 }, "<")
        .to(bar, { opacity: 0, duration: 0.03 }, "<")
        .to(scanlines, { opacity: 0, duration: 0.05 }, "<");

      // Glitch burst 2 — rapid
      tl.to(
        topChars,
        { opacity: 0.7, x: 6, duration: 0.03 },
        "+=0.1"
      )
        .to(bottomChars, { opacity: 0.5, x: -4, duration: 0.03 }, "<")
        .to(mainChars, { x: -2, duration: 0.03 }, "<")
        .to(scanlines, { opacity: 0.5, duration: 0.03 }, "<");

      // Quick reset
      tl.to(mainChars, { x: 0, duration: 0.03 })
        .to(topChars, { opacity: 0, x: 0, duration: 0.03 }, "<")
        .to(bottomChars, { opacity: 0, x: 0, duration: 0.03 }, "<")
        .to(scanlines, { opacity: 0, duration: 0.03 }, "<");

      // Burst 3 — big shift
      tl.to(
        topChars,
        { opacity: 1, x: -12, duration: 0.04 },
        "+=0.05"
      )
        .to(bottomChars, { opacity: 0.9, x: 10, duration: 0.04 }, "<")
        .to(
          mainChars,
          {
            x: () => gsap.utils.random(-4, 4),
            skewX: 10,
            duration: 0.04,
          },
          "<"
        )
        .to(bar, { opacity: 1, y: 20, scaleY: 3, duration: 0.03 }, "<");

      // Final reset
      tl.to(mainChars, { x: 0, skewX: 0, duration: 0.06 })
        .to(topChars, { opacity: 0, x: 0, duration: 0.06 }, "<")
        .to(bottomChars, { opacity: 0, x: 0, duration: 0.06 }, "<")
        .to(bar, { opacity: 0, scaleY: 1, duration: 0.04 }, "<")
        .to(scanlines, { opacity: 0, duration: 0.05 }, "<");

      // Individual character jitter
      mainChars.forEach((char) => {
        gsap.to(char, {
          y: () => gsap.utils.random(-2, 2),
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          ease: "steps(2)",
          delay: gsap.utils.random(0, 3),
          repeatDelay: gsap.utils.random(2, 5),
        });
      });
    },
    { scope: containerRef }
  );

  const renderChars = (className: string) => (
    <div className={`${className} flex absolute inset-0 items-center justify-center`}>
      {GLITCH_TEXT.split("").map((char, i) => (
        <span
          key={i}
          className="g-char inline-block text-7xl sm:text-8xl font-black tracking-tight"
        >
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <div className="relative w-full max-w-xl h-40">
        {/* Scanlines overlay */}
        <div
          className="scanlines absolute inset-0 opacity-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />

        {/* Glitch bar */}
        <div className="glitch-bar absolute left-0 right-0 h-2 bg-emerald-400/60 opacity-0 z-10" />

        {/* Top clone — cyan channel */}
        {renderChars("glitch-top text-cyan-400/80")}

        {/* Bottom clone — red/rose channel */}
        {renderChars("glitch-bottom text-rose-400/80")}

        {/* Main text */}
        <div className="glitch-main flex absolute inset-0 items-center justify-center z-[5]">
          {GLITCH_TEXT.split("").map((char, i) => (
            <span
              key={i}
              className="g-char inline-block text-7xl sm:text-8xl font-black tracking-tight text-zinc-100"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
