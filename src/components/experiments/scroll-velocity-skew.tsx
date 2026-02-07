"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CARDS = [
  { title: "Velocity", subtitle: "Responsive motion", accent: "emerald" },
  { title: "Momentum", subtitle: "Scroll-driven skew", accent: "cyan" },
  { title: "Kinetic", subtitle: "Dynamic distortion", accent: "violet" },
  { title: "Elastic", subtitle: "Spring recovery", accent: "amber" },
  { title: "Reactive", subtitle: "Speed-aware UI", accent: "emerald" },
  { title: "Fluid", subtitle: "Organic motion", accent: "cyan" },
  { title: "Impulse", subtitle: "Burst energy", accent: "violet" },
  { title: "Inertia", subtitle: "Continued force", accent: "amber" },
];

const ACCENT_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  emerald: { border: "border-emerald-400/20", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  cyan: { border: "border-cyan-400/20", text: "text-cyan-400", bg: "bg-cyan-400/10" },
  violet: { border: "border-violet-400/20", text: "text-violet-400", bg: "bg-violet-400/10" },
  amber: { border: "border-amber-400/20", text: "text-amber-400", bg: "bg-amber-400/10" },
};

interface Props {
  onReplay: () => void;
}

export function ScrollVelocitySkew({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const cards = gsap.utils.toArray<HTMLElement>(".skew-card", scroller);
      const proxy = { skew: 0 };
      const clamp = gsap.utils.clamp(-20, 20);

      gsap.set(cards, { transformOrigin: "center center", force3D: true });

      ScrollTrigger.create({
        scroller: scroller,
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -300);

          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => {
                cards.forEach((card) => {
                  gsap.set(card, { skewY: proxy.skew });
                });
              },
            });
          }
        },
      });

      // Fade-in each card as it enters viewport
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller: scroller,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-zinc-100 tracking-tight">Velocity Skew</h2>
        </div>
        <p className="text-center font-mono text-sm text-zinc-500 mb-16">
          Scroll fast — elements skew with velocity. Stop — they spring back.
        </p>

        {/* Cards */}
        <div className="space-y-6">
          {CARDS.map((card, i) => {
            const colors = ACCENT_COLORS[card.accent];
            return (
              <div
                key={i}
                className={`skew-card rounded-2xl border ${colors.border} bg-zinc-900/60 p-8 backdrop-blur-sm will-change-transform`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-mono ${colors.text} tracking-widest uppercase`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold text-zinc-100 mt-1">{card.title}</h3>
                    <p className="text-sm font-mono text-zinc-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <div className={`w-3 h-3 rounded-full ${colors.bg.replace("/10", "/60")}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-xs font-mono text-zinc-600">◆ Scroll velocity → skewY transform</p>
        </div>
      </div>
    </div>
  );
}
