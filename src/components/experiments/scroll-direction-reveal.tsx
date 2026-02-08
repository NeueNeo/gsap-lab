"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CARDS = [
  { num: "01", title: "Perception", desc: "Every scroll reveals intent — direction shapes experience.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", icon: "◆" },
  { num: "02", title: "Momentum", desc: "Forward motion carries weight. Each element enters with purpose.", color: "text-cyan-400", bg: "bg-cyan-400/5", border: "border-cyan-400/20", icon: "◇" },
  { num: "03", title: "Cadence", desc: "Rhythm emerges from staggered reveals. Timing is everything.", color: "text-violet-400", bg: "bg-violet-400/5", border: "border-violet-400/20", icon: "○" },
  { num: "04", title: "Contrast", desc: "Up and down feel different. The animation acknowledges direction.", color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: "□" },
  { num: "05", title: "Tension", desc: "The pause before appearance creates anticipation. Space breathes.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", icon: "△" },
  { num: "06", title: "Release", desc: "Elements resolve into position — the animation completes its arc.", color: "text-cyan-400", bg: "bg-cyan-400/5", border: "border-cyan-400/20", icon: "▽" },
  { num: "07", title: "Echo", desc: "Reversing scroll reverses the story. Symmetry in motion.", color: "text-violet-400", bg: "bg-violet-400/5", border: "border-violet-400/20", icon: "◎" },
  { num: "08", title: "Silence", desc: "Between animations, stillness. The negative space of motion.", color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: "▫" },
  { num: "09", title: "Gravity", desc: "Scroll down: elements rise to meet you. Scroll up: they descend.", color: "text-rose-400", bg: "bg-rose-400/5", border: "border-rose-400/20", icon: "●" },
  { num: "10", title: "Resolve", desc: "The final card. All motion converges into clarity.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", icon: "✦" },
];

interface Props {
  onReplay: () => void;
}

export function ScrollDirectionReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollerH, setScrollerH] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setScrollerH(containerRef.current.offsetHeight);
    }
  }, []);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller || !scrollerH) return;

      const cards = gsap.utils.toArray<HTMLElement>(".sdr-card", scroller);

      // Set initial state — hidden below
      gsap.set(cards, { autoAlpha: 0, y: 80 });

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          scroller: scroller,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => {
            // Scrolling DOWN — enter from bottom
            gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              overwrite: true,
            });
          },
          onLeave: () => {
            // Leaving top — fade out upward
            gsap.to(card, {
              autoAlpha: 0,
              y: -40,
              duration: 0.4,
              ease: "power2.in",
              overwrite: true,
            });
          },
          onEnterBack: () => {
            // Scrolling UP — enter from top
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: -80 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                overwrite: true,
              }
            );
          },
          onLeaveBack: () => {
            // Leaving bottom — fade out downward
            gsap.to(card, {
              autoAlpha: 0,
              y: 80,
              duration: 0.4,
              ease: "power2.in",
              overwrite: true,
            });
          },
        });
      });
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Label */}
      <div className="sticky top-0 z-20 px-6 py-3">
        <p className="text-xs font-mono text-zinc-500">
          scroll-direction-reveal · direction-aware enter/exit animations
        </p>
      </div>

      {/* Top spacer */}
      <div
        className="flex items-center justify-center"
        style={{ height: scrollerH ? scrollerH * 0.6 : "60vh" }}
      >
        <div className="text-center space-y-3">
          <p className="text-sm font-mono text-zinc-600 tracking-widest">
            ↓ SCROLL DOWN
          </p>
          <p className="text-xs text-zinc-700">
            Cards enter from below · scroll back up to see them enter from above
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-2xl mx-auto px-6 space-y-12 pb-8">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={`sdr-card rounded-xl ${card.bg} border ${card.border} p-8`}
            style={{ visibility: "hidden" }}
          >
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className={`text-xl ${card.color}`}>{card.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className={`text-xs font-mono ${card.color} opacity-60`}>
                    {card.num}
                  </span>
                  <h3 className={`text-xl font-semibold ${card.color}`}>
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacer */}
      <div
        className="flex items-center justify-center"
        style={{ height: scrollerH ? scrollerH * 0.6 : "60vh" }}
      >
        <p className="text-sm font-mono text-zinc-600 tracking-widest">
          ↑ SCROLL BACK UP
        </p>
      </div>
    </div>
  );
}
