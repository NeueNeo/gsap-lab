"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const STRIPE_COLORS = [
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#fbbf24", // amber
  "#f43f5e", // rose
  "#34d399",
  "#22d3ee",
  "#a78bfa",
  "#fbbf24",
  "#f43f5e",
  "#34d399",
  "#22d3ee",
];

export function SvgMaskTextReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

      // Animate the mask text: start small & below, scale up to fill, then shrink away
      tl.fromTo(
        ".mask-text",
        {
          attr: {
            transform: `translate(300, 250) scale(0.1)`,
          },
          opacity: 0,
        },
        {
          attr: {
            transform: `translate(300, 200) scale(1)`,
          },
          opacity: 1,
          duration: 1.8,
          ease: "power3.out",
        }
      );

      // Hold
      tl.to(".mask-text", {
        duration: 1.5,
      });

      // Shrink away
      tl.to(".mask-text", {
        attr: {
          transform: `translate(300, 150) scale(2.5)`,
        },
        opacity: 0,
        duration: 1.4,
        ease: "power3.in",
      });

      // Animate stripes continuously (independent of mask timeline)
      gsap.to(".color-stripe", {
        y: -50,
        duration: 3,
        ease: "sine.inOut",
        stagger: {
          each: 0.15,
          yoyo: true,
          repeat: -1,
        },
      });

      // Parallax: shift the stripe group in opposite direction of text
      gsap.to(".stripe-group", {
        x: 40,
        duration: 4.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Subtle rotation on stripes for extra depth
      gsap.to(".stripe-group", {
        rotation: 2,
        transformOrigin: "center center",
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: containerRef }
  );

  const stripeWidth = 60;
  const stripeCount = STRIPE_COLORS.length;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-xs font-mono text-zinc-500">
          SVG mask text reveal · animated stripe pattern beneath
        </p>

        <svg
          viewBox="0 0 600 400"
          className="w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask: white text on black = text is the visible window */}
            <mask id="text-reveal-mask">
              <rect width="600" height="400" fill="black" />
              <text
                className="mask-text"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="160"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-0.03em"
                fill="white"
                transform="translate(300, 200) scale(0.1)"
                opacity="0"
              >
                REVEAL
              </text>
            </mask>
          </defs>

          {/* Background: subtle grid for depth */}
          <g opacity="0.05">
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`vl-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="400"
                stroke="#fff"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`hl-${i}`}
                x1="0"
                y1={i * 50}
                x2="600"
                y2={i * 50}
                stroke="#fff"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Colorful layer revealed through the mask */}
          <g mask="url(#text-reveal-mask)">
            {/* Dark backdrop */}
            <rect width="600" height="400" fill="#09090b" />

            {/* Animated color stripes */}
            <g className="stripe-group">
              {STRIPE_COLORS.map((color, i) => (
                <rect
                  key={`stripe-${i}`}
                  className="color-stripe"
                  x={-30 + i * stripeWidth}
                  y="-30"
                  width={stripeWidth - 4}
                  height="460"
                  fill={color}
                  rx="2"
                  opacity="0.85"
                  transform={`skewX(-12)`}
                />
              ))}
            </g>

            {/* Overlay gradient for richness */}
            <rect
              width="600"
              height="400"
              fill="url(#reveal-gradient)"
              opacity="0.3"
            />
          </g>

          {/* Gradient def */}
          <defs>
            <radialGradient id="reveal-gradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Border outline of mask area (decorative) */}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            x="300"
            y="200"
            fontSize="160"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.03em"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="0.5"
            opacity="0.2"
          >
            REVEAL
          </text>
        </svg>

        <div className="flex gap-4 flex-wrap justify-center">
          {[
            { label: "Mask text", color: "text-zinc-400" },
            { label: "Stripes", color: "text-emerald-400" },
            { label: "Parallax", color: "text-cyan-400" },
            { label: "Loop", color: "text-violet-400" },
          ].map(({ label, color }, i) => (
            <span
              key={i}
              className={`text-[10px] font-mono ${color} px-2 py-1 rounded bg-zinc-900 border border-zinc-800`}
            >
              {label}
            </span>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          text mask scales in → reveals animated stripes → shrinks away · infinite loop
        </p>
      </div>
    </div>
  );
}
