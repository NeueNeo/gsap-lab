
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXT = "ELASTIC";

interface Props {
  onReplay: () => void;
}

export function ElasticDragText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const quickTosRef = useRef<
    { scale: (v: number) => void; fontWeight: (v: number) => void }[]
  >([]);

  useGSAP(
    () => {
      const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
      if (chars.length === 0) return;

      // Create quickTo tweens for each character — smooth interpolation
      quickTosRef.current = chars.map((char) => ({
        scale: gsap.quickTo(char, "scale", {
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        }),
        fontWeight: gsap.quickTo(char, "fontWeight", {
          duration: 0.4,
          ease: "power2.out",
        }),
      }));

      // Set initial state
      gsap.set(chars, { scale: 1, fontWeight: 400, transformOrigin: "center bottom" });

      // Entrance animation
      gsap.from(chars, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleCharEnter = useCallback(
    (hoveredIndex: number) => {
      const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
      const quickTos = quickTosRef.current;
      if (chars.length === 0 || quickTos.length === 0) return;

      chars.forEach((_, i) => {
        const distance = Math.abs(i - hoveredIndex);
        // Exponential falloff: 0 → full effect, 1 → 60%, 2 → 36%, 3+ → minimal
        const influence = Math.max(0, Math.pow(0.6, distance));

        const targetScale = 1 + 0.5 * influence; // max 1.5 at center
        const targetWeight = 400 + 500 * influence; // max 900 at center

        quickTos[i].scale(targetScale);
        quickTos[i].fontWeight(targetWeight);
      });
    },
    []
  );

  const handleCharLeave = useCallback(() => {
    const quickTos = quickTosRef.current;
    if (quickTos.length === 0) return;

    quickTos.forEach((qt) => {
      qt.scale(1);
      qt.fontWeight(400);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8"
    >
      <div
        className="flex"
        onMouseLeave={handleCharLeave}
      >
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el; }}
            className="inline-block text-6xl sm:text-7xl md:text-8xl font-normal tracking-tight text-zinc-100 cursor-default select-none px-1"
            onMouseEnter={() => handleCharEnter(i)}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
        <span className="text-xs font-mono text-zinc-600">
          hover characters — wave propagation
        </span>
      </div>
    </div>
  );
}
