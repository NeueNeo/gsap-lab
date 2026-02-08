
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXT = "WAVE MOTION";

interface Props {
  onReplay: () => void;
}

export function VariableFontWave({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll(".wave-char");
      if (!chars) return;

      // Set initial font weight
      gsap.set(chars, { fontWeight: 100 });

      // Per-character font-weight wave: stagger creates the wave offset
      // Each character cycles 100 → 900 → 100 with yoyo, offset by stagger
      gsap.to(chars, {
        fontWeight: 900,
        duration: 1.2,
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      });

      // Secondary subtle y-offset wave for organic feel
      gsap.to(chars, {
        y: -8,
        duration: 1.2,
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8"
    >
      <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
        Variable Font Wave
      </p>

      <div className="flex flex-wrap justify-center">
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            className="wave-char inline-block text-8xl tracking-tight text-zinc-100"
            style={{
              whiteSpace: char === " " ? "pre" : undefined,
              fontWeight: 100,
              fontFamily:
                '"Inter", "Inter Variable", system-ui, -apple-system, sans-serif',
              width: char === " " ? "0.4em" : undefined,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      {/* Weight scale indicator */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-[10px] font-mono text-zinc-600">100</span>
        <div className="flex gap-px">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="w-4 h-2 rounded-sm bg-violet-400"
              style={{ opacity: 0.15 + i * 0.1 }}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-zinc-600">900</span>
      </div>

      <p className="text-xs font-mono text-zinc-600 text-center">
        Per-character <span className="text-zinc-400">fontWeight</span> wave ·
        100 → 900 · Infinite yoyo with stagger offset
      </p>
    </div>
  );
}
