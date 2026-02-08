
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINE1 = "WAVE MOTION";
const LINE2 = "RIPPLE EFFECT";

interface Props {
  onReplay: () => void;
}

export function TextWave({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars1 = container.querySelectorAll(".wave-line-1 .wave-char");
      const chars2 = container.querySelectorAll(".wave-line-2 .wave-char");

      // Initial fade in
      gsap.set([chars1, chars2], { opacity: 0, y: 20 });
      gsap.to([chars1, chars2], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        delay: 0.2,
        ease: "power2.out",
      });

      // Continuous sinusoidal wave — line 1
      chars1.forEach((char, i) => {
        gsap.to(char, {
          y: -25,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      });

      // Continuous sinusoidal wave — line 2 (opposite phase, different amplitude)
      chars2.forEach((char, i) => {
        gsap.to(char, {
          y: 20,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08 + 0.3,
        });
      });

      // Color cycle on line 1
      chars1.forEach((char, i) => {
        gsap.to(char, {
          color: "#34d399", // emerald-400
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08 + 0.5,
        });
      });

      // Scale pulse ripple on line 2
      chars2.forEach((char, i) => {
        gsap.to(char, {
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      });

      // Floating dots
      const dots = container.querySelectorAll(".wave-dot");
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          y: gsap.utils.random(-15, 15),
          x: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(1, 2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    },
    { scope: containerRef }
  );

  const renderWaveLine = (text: string, className: string) => (
    <div className={`${className} flex flex-wrap justify-center`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="wave-char inline-block text-6xl font-black tracking-tight text-zinc-100"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Text Wave
      </p>

      <div className="space-y-4">
        {renderWaveLine(LINE1, "wave-line-1")}
        {renderWaveLine(LINE2, "wave-line-2")}
      </div>

      {/* Floating dots below */}
      <div className="flex gap-4 mt-6">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="wave-dot w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                i % 3 === 0
                  ? "rgb(52, 211, 153)" // emerald
                  : i % 3 === 1
                  ? "rgb(34, 211, 238)" // cyan
                  : "rgb(161, 161, 170)", // zinc-400
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <p className="text-xs font-mono text-zinc-600 mt-2">
        sinusoidal · phase-offset · continuous
      </p>
    </div>
  );
}
