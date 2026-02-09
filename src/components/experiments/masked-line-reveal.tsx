
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

      const tl = gsap.timeline({ delay: 0.4, repeat: -1 });

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

      // Pause before loop restarts (lines reset to yPercent: 110 via gsap.set above)
      tl.to({}, { duration: 0.6 });

      // Reset below for next loop iteration
      tl.set(lines, { yPercent: 110 });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8"
    >
      <div className="flex flex-col items-start gap-1">
        {LINES.map((line, i) => (
          <div
            key={i}
            className="overflow-hidden"
          >
            <div className="reveal-line text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 md:whitespace-nowrap">
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
