"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const ITEMS = [
  { title: "Design Systems", desc: "Building consistent, scalable UI components with design tokens and shared patterns.", icon: "◆" },
  { title: "Motion Design", desc: "Creating meaningful animations that guide users and communicate state changes.", icon: "◇" },
  { title: "Typography", desc: "The art of arranging type to make written language legible, readable, and appealing.", icon: "○" },
  { title: "Color Theory", desc: "Understanding color relationships, contrast, and harmony for effective visual design.", icon: "□" },
];

interface Props {
  onReplay: () => void;
}

export function ExpandingCard({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".exp-card");
      if (!cards) return;

      gsap.set(cards, { opacity: 0, y: 30 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const handleClick = contextSafe((idx: number) => {
    const container = containerRef.current;
    if (!container) return;

    if (expandedId === idx) {
      // Collapse — animate description out, then scale card back
      const card = container.querySelector(`[data-card="${idx}"]`) as HTMLElement;
      const desc = card?.querySelector(".card-desc") as HTMLElement;
      if (desc) {
        gsap.to(desc, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
      if (card) {
        gsap.to(card, {
          duration: 0.4,
          ease: "power3.inOut",
        });
      }
      setExpandedId(null);
    } else {
      // Collapse previous
      if (expandedId !== null) {
        const prevCard = container.querySelector(`[data-card="${expandedId}"]`) as HTMLElement;
        const prevDesc = prevCard?.querySelector(".card-desc") as HTMLElement;
        if (prevDesc) {
          gsap.to(prevDesc, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        }
      }

      // Expand new
      setExpandedId(idx);

      // Wait a tick for React to apply col-span-2, then animate desc in
      requestAnimationFrame(() => {
        const card = container.querySelector(`[data-card="${idx}"]`) as HTMLElement;
        const desc = card?.querySelector(".card-desc") as HTMLElement;
        if (desc) {
          gsap.fromTo(
            desc,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }
  });

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        {ITEMS.map((item, i) => {
          const isExpanded = expandedId === i;
          return (
            <div
              key={i}
              data-card={i}
              onClick={() => handleClick(i)}
              className={`exp-card rounded-xl border cursor-pointer transition-colors duration-300 ${
                isExpanded
                  ? "bg-zinc-800 border-emerald-400/40 col-span-2 p-8"
                  : "bg-zinc-800/50 border-zinc-700/50 p-6 hover:bg-zinc-800/80"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`text-3xl ${
                    isExpanded ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <div className="card-desc overflow-hidden" style={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}>
                    <p className="text-sm text-zinc-400 mt-2">
                      {item.desc}
                    </p>
                    <p className="text-xs font-mono text-zinc-600 mt-4">
                      Click to collapse
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
