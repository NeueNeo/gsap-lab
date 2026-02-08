import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Variant = "sequential" | "random" | "from-center" | "from-edges";

interface Props {
  onReplay: () => void;
  variant: Variant;
}

const FONT_SIZE = 64;
const LINE_H = 76;

interface VariantConfig {
  label: string;
  detail: string;
  words: { text: string; color: string }[];
  animate: (container: HTMLElement) => void;
}

const CONFIGS: Record<Variant, VariantConfig> = {
  sequential: {
    label: "Sequential · power3.out",
    detail: "0.05s stagger · per letter · per word",
    words: [
      { text: "Collection", color: "text-emerald-400" },
      { text: "Animation", color: "text-cyan-400" },
      { text: "Beautiful", color: "text-violet-400" },
    ],
    animate: (container) => {
      const words = container.querySelectorAll(".lr-word");
      words.forEach((word, wi) => {
        const wraps = word.querySelectorAll(".v-wrap");
        wraps.forEach((wrap, ci) => {
          gsap.set(wrap, { yPercent: 0 });
          gsap.to(wrap, {
            yPercent: -50,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.2 + wi * 0.4 + ci * 0.05,
          });
        });
      });
    },
  },
  random: {
    label: "Random · expo.inOut",
    detail: "0.034s stagger · random order · 1s",
    words: [
      { text: "Magnetic", color: "text-emerald-400" },
      { text: "Snapping", color: "text-cyan-400" },
      { text: "Kinetics", color: "text-violet-400" },
    ],
    animate: (container) => {
      const wraps = container.querySelectorAll(".lr-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "expo.inOut",
        duration: 1,
        stagger: { each: 0.034, from: "random" },
      });
    },
  },
  "from-center": {
    label: "From Center · power4.out",
    detail: "0.04s stagger · center outward",
    words: [
      { text: "Expanding", color: "text-amber-400" },
      { text: "Outwards", color: "text-emerald-400" },
      { text: "Radiating", color: "text-cyan-400" },
    ],
    animate: (container) => {
      const wraps = container.querySelectorAll(".lr-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "power4.out",
        duration: 0.8,
        stagger: { each: 0.04, from: "center" },
      });
    },
  },
  "from-edges": {
    label: "From Edges · circ.inOut",
    detail: "0.04s stagger · edges inward · 1.2s",
    words: [
      { text: "Converging", color: "text-violet-400" },
      { text: "Inversion", color: "text-amber-400" },
      { text: "Collapsing", color: "text-emerald-400" },
    ],
    animate: (container) => {
      const wraps = container.querySelectorAll(".lr-word .v-wrap");
      gsap.to(wraps, {
        yPercent: -50,
        delay: 0.3,
        ease: "circ.inOut",
        duration: 1.2,
        stagger: { each: 0.04, from: "edges" },
      });
    },
  },
};

export function LetterRollupVariant({ onReplay, variant }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const config = CONFIGS[variant];

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      config.animate(container);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full flex flex-col items-center justify-center p-8">
      <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
        Letter Rollup · {config.label}
      </p>
      <p className="text-[10px] font-mono text-zinc-600 mb-10">{config.detail}</p>

      <div className="flex flex-col items-center gap-1">
        {config.words.map((word, wi) => (
          <div
            key={wi}
            className="lr-word flex justify-center overflow-hidden"
            style={{ height: LINE_H }}
          >
            {word.text.split("").map((char, ci) => (
              <span
                key={ci}
                className="v-wrap flex flex-col"
                style={{ height: LINE_H * 2, transform: "translateY(0%)" }}
              >
                <span
                  className={`block overflow-hidden ${word.color} font-bold`}
                  style={{ fontSize: FONT_SIZE, lineHeight: `${LINE_H}px`, height: LINE_H }}
                >
                  {char}
                </span>
                <span
                  className={`block overflow-hidden ${word.color} font-bold`}
                  style={{ fontSize: FONT_SIZE, lineHeight: `${LINE_H}px`, height: LINE_H }}
                >
                  {char}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
