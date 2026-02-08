"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const CARD_COUNT = 7;

const CARD_GRADIENTS = [
  "from-emerald-500/40 to-emerald-900/60",
  "from-cyan-500/40 to-cyan-900/60",
  "from-violet-500/40 to-violet-900/60",
  "from-amber-500/40 to-amber-900/60",
  "from-pink-500/40 to-pink-900/60",
  "from-emerald-500/40 to-cyan-900/60",
  "from-violet-500/40 to-amber-900/60",
];

const CARD_BORDERS = [
  "border-emerald-500/30",
  "border-cyan-500/30",
  "border-violet-500/30",
  "border-amber-500/30",
  "border-pink-500/30",
  "border-emerald-500/30",
  "border-violet-500/30",
];

const CARD_TEXT_COLORS = [
  "text-emerald-400",
  "text-cyan-400",
  "text-violet-400",
  "text-amber-400",
  "text-pink-400",
  "text-emerald-400",
  "text-violet-400",
];

const CARD_LABELS = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
];

export function PerspectiveCardStack({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", container);

      // Initial stacked state: each card has increasing rotateX and slight Y offset
      const setStackedState = () => {
        cards.forEach((card, i) => {
          gsap.set(card, {
            rotateX: i * 8,
            translateZ: -i * 20,
            y: -i * 28,
            x: 0,
            opacity: 1 - i * 0.06,
            zIndex: CARD_COUNT - i,
          });
        });
      };

      setStackedState();

      // Entry animation
      gsap.from(cards, {
        opacity: 0,
        scale: 0.8,
        y: 60,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      // Looping timeline: stack → spread → hold → stack
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.5,
        delay: 1.5,
      });

      // Phase 1: Spread out horizontally
      const spreadWidth = Math.min(600, 80 * CARD_COUNT);
      const halfSpread = spreadWidth / 2;

      cards.forEach((card, i) => {
        const xPos = gsap.utils.mapRange(0, CARD_COUNT - 1, -halfSpread, halfSpread, i);

        tl.to(
          card,
          {
            rotateX: 0,
            translateZ: 0,
            y: 0,
            x: xPos,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          i * 0.06
        );
      });

      // Phase 2: Hold in spread position
      tl.to({}, { duration: 2 });

      // Phase 3: Collapse back to stack
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            rotateX: i * 8,
            translateZ: -i * 20,
            y: -i * 28,
            x: 0,
            opacity: 1 - i * 0.06,
            duration: 0.8,
            ease: "power2.inOut",
          },
          `collapse+=${(CARD_COUNT - 1 - i) * 0.04}` // reverse stagger: top card moves first
        );
      });

      tl.addLabel("collapse", `>-=${CARD_COUNT * 0.04 + 0.8}`);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-10 w-full">
        <p className="text-xs font-mono text-zinc-500">
          perspective-card-stack · 3D stack ↔ spread · timed loop
        </p>

        {/* Perspective container */}
        <div
          className="relative flex items-center justify-center"
          style={{
            perspective: 800,
            width: "100%",
            height: 380,
          }}
        >
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              width: 200,
              height: 260,
            }}
          >
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`stack-card absolute inset-0 rounded-xl bg-gradient-to-br ${CARD_GRADIENTS[i]} border ${CARD_BORDERS[i]} backdrop-blur-sm flex flex-col items-center justify-center gap-3 will-change-transform`}
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Card number */}
                <span className={`text-5xl font-bold ${CARD_TEXT_COLORS[i]} tabular-nums opacity-80`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Divider */}
                <div className={`w-10 h-px ${CARD_TEXT_COLORS[i]} opacity-20`} />

                {/* Label */}
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  {CARD_LABELS[i]}
                </span>

                {/* Decorative corner marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-white/10" />
                <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-white/10" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-white/10" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-mono text-zinc-600">
            {CARD_COUNT} cards · perspective: 800px · rotateX + translateZ stack
          </p>
          <p className="text-[10px] font-mono text-zinc-700">
            auto-loops: stacked → spread → stacked
          </p>
        </div>
      </div>
    </div>
  );
}
