"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ITEMS = Array.from({ length: 24 }, (_, i) => {
  const accents = ["emerald", "cyan", "violet", "amber"] as const;
  const accent = accents[i % accents.length];
  return {
    id: i,
    label: `Item ${String(i + 1).padStart(2, "0")}`,
    accent,
  };
});

const ACCENT_MAP: Record<string, { border: string; dot: string; text: string }> = {
  emerald: { border: "border-emerald-400/15", dot: "bg-emerald-400", text: "text-emerald-400/60" },
  cyan: { border: "border-cyan-400/15", dot: "bg-cyan-400", text: "text-cyan-400/60" },
  violet: { border: "border-violet-400/15", dot: "bg-violet-400", text: "text-violet-400/60" },
  amber: { border: "border-amber-400/15", dot: "bg-amber-400", text: "text-amber-400/60" },
};

interface Props {
  onReplay: () => void;
}

export function BatchStaggerReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const cards = gsap.utils.toArray<HTMLElement>(".batch-card", scroller);

      gsap.set(cards, { y: 80, autoAlpha: 0 });

      ScrollTrigger.batch(cards, {
        scroller: scroller,
        interval: 0.1,
        batchMax: 3,
        start: "top 90%",
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeave: (batch) => {
          gsap.set(batch, { autoAlpha: 0, y: -60, overwrite: true });
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.set(batch, { autoAlpha: 0, y: 80, overwrite: true });
        },
      });

      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(cards, { y: 0 });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-zinc-100 tracking-tight">Batch Reveal</h2>
        </div>
        <p className="text-center font-mono text-sm text-zinc-500 mb-16">
          ScrollTrigger.batch() — cards reveal in staggered groups as they enter
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ITEMS.map((item) => {
            const colors = ACCENT_MAP[item.accent];
            return (
              <div
                key={item.id}
                className={`batch-card rounded-xl border ${colors.border} bg-zinc-900/50 p-6 will-change-transform`}
              >
                <div className={`w-2 h-2 rounded-full ${colors.dot} mb-4 opacity-60`} />
                <p className="text-lg font-semibold text-zinc-200">{item.label}</p>
                <p className={`text-xs font-mono ${colors.text} mt-1`}>{item.accent}</p>
                <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${colors.dot} opacity-30`}
                    style={{ width: `${30 + Math.random() * 60}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-xs font-mono text-zinc-600">◆ 24 cards · batch stagger on scroll</p>
        </div>
      </div>
    </div>
  );
}
