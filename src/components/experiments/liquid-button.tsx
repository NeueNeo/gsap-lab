"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function LiquidButton({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entry animation
  useGSAP(
    () => {
      gsap.from(".liquid-btn", {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleEnter = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const blob = btn.querySelector(".blob") as HTMLElement;
    const text = btn.querySelector(".btn-text") as HTMLElement;

    gsap.to(blob, {
      scale: 1.15,
      borderRadius: "32% 68% 60% 40% / 40% 30% 70% 60%",
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
    gsap.to(text, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleLeave = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const blob = btn.querySelector(".blob") as HTMLElement;
    const text = btn.querySelector(".btn-text") as HTMLElement;

    gsap.to(blob, {
      scale: 1,
      borderRadius: "50%",
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
    gsap.to(text, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMove = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const blob = btn.querySelector(".blob") as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    gsap.to(blob, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const buttons = [
    {
      label: "Liquid Hover",
      bgClass: "bg-emerald-400",
      glowClass: "bg-emerald-400/20",
      textClass: "text-zinc-950",
    },
    {
      label: "Elastic Blob",
      bgClass: "bg-cyan-400",
      glowClass: "bg-cyan-400/20",
      textClass: "text-zinc-950",
    },
    {
      label: "Gooey Press",
      bgClass: "bg-violet-400",
      glowClass: "bg-violet-400/20",
      textClass: "text-zinc-950",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      {/* SVG Gooey Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col items-center gap-10">
        <p className="text-sm font-mono text-zinc-500">
          SVG gooey filter + elastic ease deformation
        </p>

        <div className="flex flex-col sm:flex-row gap-10">
          {buttons.map((btn, i) => (
            <div key={i} className="liquid-btn flex flex-col items-center gap-3">
              <button
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onMouseMove={handleMove}
                className="relative w-48 h-48 flex items-center justify-center cursor-pointer"
                style={{ filter: "url(#goo-filter)" }}
              >
                {/* Main blob */}
                <div
                  className={`blob absolute w-40 h-40 rounded-full ${btn.bgClass} transition-none`}
                />
                {/* Satellite blobs for gooey effect */}
                <div
                  className={`absolute w-8 h-8 rounded-full ${btn.bgClass} -top-1 left-1/2 -translate-x-1/2`}
                />
                <div
                  className={`absolute w-6 h-6 rounded-full ${btn.bgClass} -bottom-1 left-1/2 -translate-x-1/2`}
                />
                <div
                  className={`absolute w-5 h-5 rounded-full ${btn.bgClass} top-1/2 -left-1 -translate-y-1/2`}
                />
                <div
                  className={`absolute w-5 h-5 rounded-full ${btn.bgClass} top-1/2 -right-1 -translate-y-1/2`}
                />
              </button>
              {/* Text outside the filter to keep it crisp */}
              <div className="text-center -mt-2">
                <span className={`btn-text text-sm font-semibold ${btn.textClass === "text-zinc-950" ? (i === 0 ? "text-emerald-400" : i === 1 ? "text-cyan-400" : "text-violet-400") : btn.textClass}`}>
                  {btn.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          feGaussianBlur + feColorMatrix for gooey merge · borderRadius morph
        </p>
      </div>
    </div>
  );
}
