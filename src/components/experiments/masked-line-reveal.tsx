
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINES = [
  "We craft interfaces",
  "that feel inevitable —",
  "where every motion serves",
  "the story being told.",
];

interface Props {
  onReplay: () => void;
}

export function MaskedLineReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const lines = container.querySelectorAll(".reveal-line");
      if (lines.length === 0) return;

      // Start hidden below mask
      gsap.set(lines, { yPercent: 110 });

      const tl = gsap.timeline({ delay: 0.4 });

      // Reveal: slide up from below the overflow mask
      tl.to(lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Hold visible
      tl.to({}, { duration: 1.8 });

      // Exit: slide up and out above the mask
      tl.to(lines, {
        yPercent: -110,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.in",
      });

      // Pause, then loop
      tl.to({}, { duration: 0.6 });

      // Reset below and reveal again
      tl.set(lines, { yPercent: 110 });
      tl.to(lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
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
        Masked Line Reveal
      </p>

      <div className="flex flex-col items-center gap-1">
        {LINES.map((line, i) => (
          <div
            key={i}
            className="overflow-hidden"
          >
            <div className="reveal-line text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 whitespace-nowrap">
              {line}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex gap-1.5">
          {LINES.map((_, i) => (
            <div
              key={i}
              className="w-6 h-0.5 rounded-full bg-amber-400/40"
            />
          ))}
        </div>
        <span className="text-xs font-mono text-zinc-600">
          overflow mask — yPercent reveal
        </span>
      </div>
    </div>
  );
}
