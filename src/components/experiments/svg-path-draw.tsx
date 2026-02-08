
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function SvgPathDraw({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paths = containerRef.current?.querySelectorAll(".draw-path");
      if (!paths) return;

      paths.forEach((path, i) => {
        const p = path as SVGPathElement;
        const length = p.getTotalLength();

        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });

        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          delay: 0.3 + i * 0.3,
        });
      });

      // Fade in fills after stroke draw
      const fills = containerRef.current?.querySelectorAll(".fill-shape");
      if (fills) {
        gsap.from(fills, {
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.inOut",
          delay: 2,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          strokeDasharray/strokeDashoffset animation
        </p>

        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Geometric shapes */}
          {/* Triangle */}
          <path
            className="draw-path"
            d="M 100 220 L 200 60 L 300 220 Z"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
          <path
            className="fill-shape"
            d="M 100 220 L 200 60 L 300 220 Z"
            fill="#34d399"
            opacity="0.08"
          />

          {/* Circle */}
          <circle
            className="draw-path"
            cx="200"
            cy="150"
            r="80"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0"
          />
          <circle
            className="fill-shape"
            cx="200"
            cy="150"
            r="80"
            fill="#22d3ee"
            opacity="0.06"
          />

          {/* Diamond */}
          <path
            className="draw-path"
            d="M 200 40 L 280 150 L 200 260 L 120 150 Z"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
          <path
            className="fill-shape"
            d="M 200 40 L 280 150 L 200 260 L 120 150 Z"
            fill="#a78bfa"
            opacity="0.06"
          />

          {/* Decorative lines */}
          <path
            className="draw-path"
            d="M 30 280 Q 100 240 200 250 T 370 270"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="draw-path"
            d="M 30 290 Q 120 260 200 270 T 370 285"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
        </svg>

        <p className="text-xs font-mono text-zinc-600">
          5 paths drawn sequentially with stagger
        </p>
      </div>
    </div>
  );
}
