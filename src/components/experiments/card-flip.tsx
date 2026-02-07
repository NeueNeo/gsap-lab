"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CARDS = [
  { front: "React", back: "UI Library", color: "from-cyan-500/20 to-cyan-700/20" },
  { front: "GSAP", back: "Animation Engine", color: "from-emerald-500/20 to-emerald-700/20" },
  { front: "Next.js", back: "Framework", color: "from-violet-500/20 to-violet-700/20" },
  { front: "Tailwind", back: "Utility CSS", color: "from-amber-500/20 to-amber-700/20" },
  { front: "TypeScript", back: "Type Safety", color: "from-blue-500/20 to-blue-700/20" },
  { front: "Vercel", back: "Deployment", color: "from-pink-500/20 to-pink-700/20" },
];

interface Props {
  onReplay: () => void;
}

export function CardFlip({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".flip-card");
      if (!cards) return;

      gsap.set(cards, { opacity: 0, scale: 0.9 });
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });

      cards.forEach((card) => {
        const inner = card.querySelector(".flip-inner") as HTMLElement;
        if (!inner) return;

        card.addEventListener("mouseenter", () => {
          gsap.to(inner, {
            rotationY: 180,
            duration: 0.6,
            ease: "power2.inOut",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(inner, {
            rotationY: 0,
            duration: 0.6,
            ease: "power2.inOut",
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="grid grid-cols-3 gap-5 max-w-xl w-full" style={{ perspective: "1200px" }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="flip-card aspect-[4/5] cursor-pointer"
          >
            <div
              className="flip-inner relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} border border-zinc-700/50 flex items-center justify-center`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-2xl font-bold text-zinc-100">
                  {card.front}
                </span>
              </div>
              {/* Back */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} border border-zinc-600/50 flex flex-col items-center justify-center`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <span className="text-lg font-mono text-zinc-300">
                  {card.back}
                </span>
                <span className="text-xs text-zinc-500 mt-2 font-mono">
                  hover to flip
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
