
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function SvgLineArt({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paths = containerRef.current?.querySelectorAll(".circuit-line");
      if (!paths) return;

      // Set up stroke-dasharray and dashoffset for each path
      paths.forEach((path) => {
        const p = path as SVGPathElement | SVGLineElement | SVGCircleElement | SVGRectElement;
        let length: number;
        if ("getTotalLength" in p && typeof p.getTotalLength === "function") {
          length = p.getTotalLength();
        } else {
          length = 400; // fallback for elements without getTotalLength
        }

        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      // Draw lines sequentially with stagger
      const tl = gsap.timeline({ delay: 0.4 });

      // Group 1: Main circuit board traces
      tl.to(".trace-main", {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.inOut",
      });

      // Group 2: Branch lines
      tl.to(
        ".trace-branch",
        {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.inOut",
        },
        "-=0.5"
      );

      // Group 3: Nodes / connection points
      tl.to(
        ".trace-node",
        {
          strokeDashoffset: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Group 4: Decorative geometric shapes
      tl.to(
        ".trace-geo",
        {
          strokeDashoffset: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power2.inOut",
        },
        "-=0.4"
      );

      // Glow fills appear after stroke draw
      tl.from(
        ".node-fill",
        {
          opacity: 0,
          scale: 0,
          transformOrigin: "center center",
          stagger: 0.05,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "-=0.2"
      );

      // Pulse animation on nodes after draw completes
      tl.to(".node-fill", {
        opacity: 0.3,
        duration: 1,
        stagger: { each: 0.1, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      });
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
          circuit-board pattern drawn line-by-line · strokeDashoffset technique
        </p>

        <svg
          viewBox="0 0 500 400"
          className="w-full max-w-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* === Main horizontal traces === */}
          <path
            className="circuit-line trace-main"
            d="M 20 100 L 150 100 L 170 80 L 280 80 L 300 100 L 480 100"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-main"
            d="M 20 200 L 100 200 L 120 220 L 200 220 L 220 200 L 350 200 L 370 180 L 480 180"
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-main"
            d="M 20 300 L 180 300 L 200 280 L 320 280 L 340 300 L 480 300"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0"
          />

          {/* === Vertical branch lines === */}
          <path
            className="circuit-line trace-branch"
            d="M 150 100 L 150 200"
            stroke="#34d399"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-branch"
            d="M 280 80 L 280 160 L 350 160 L 350 200"
            stroke="#22d3ee"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-branch"
            d="M 200 220 L 200 280"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-branch"
            d="M 400 100 L 400 180"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-branch"
            d="M 100 200 L 100 300"
            stroke="#34d399"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="circuit-line trace-branch"
            d="M 340 300 L 340 340 L 420 340 L 420 300"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0"
          />

          {/* === Node circles (connection points) === */}
          {[
            { cx: 150, cy: 100, color: "#34d399" },
            { cx: 280, cy: 80, color: "#22d3ee" },
            { cx: 150, cy: 200, color: "#34d399" },
            { cx: 200, cy: 220, color: "#a78bfa" },
            { cx: 350, cy: 200, color: "#22d3ee" },
            { cx: 400, cy: 100, color: "#fbbf24" },
            { cx: 400, cy: 180, color: "#fbbf24" },
            { cx: 100, cy: 200, color: "#34d399" },
            { cx: 100, cy: 300, color: "#34d399" },
            { cx: 200, cy: 280, color: "#a78bfa" },
            { cx: 340, cy: 300, color: "#a78bfa" },
            { cx: 300, cy: 100, color: "#34d399" },
          ].map(({ cx, cy, color }, i) => (
            <g key={`node-${i}`}>
              <circle
                className="circuit-line trace-node"
                cx={cx}
                cy={cy}
                r="4"
                stroke={color}
                strokeWidth="1.5"
                opacity="0"
              />
              <circle
                className="node-fill"
                cx={cx}
                cy={cy}
                r="2"
                fill={color}
                opacity="0.6"
              />
            </g>
          ))}

          {/* === Geometric decorative shapes === */}
          {/* Central chip/processor outline */}
          <rect
            className="circuit-line trace-geo"
            x="210"
            y="130"
            width="80"
            height="60"
            rx="4"
            stroke="#34d399"
            strokeWidth="1"
            opacity="0"
          />
          <rect
            className="circuit-line trace-geo"
            x="220"
            y="140"
            width="60"
            height="40"
            rx="2"
            stroke="#34d399"
            strokeWidth="0.5"
            opacity="0"
          />

          {/* Hexagonal shape top-right */}
          <path
            className="circuit-line trace-geo"
            d="M 420 40 L 450 25 L 480 40 L 480 70 L 450 85 L 420 70 Z"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0"
          />

          {/* Diamond shape bottom-left */}
          <path
            className="circuit-line trace-geo"
            d="M 50 340 L 80 320 L 110 340 L 80 360 Z"
            stroke="#22d3ee"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0"
          />

          {/* Triangle bottom-right */}
          <path
            className="circuit-line trace-geo"
            d="M 430 320 L 470 360 L 390 360 Z"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0"
          />

          {/* Small crosses at intersections */}
          {[
            { x: 250, y: 160 },
            { x: 450, y: 55 },
            { x: 80, y: 340 },
          ].map(({ x, y }, i) => (
            <g key={`cross-${i}`} className="node-fill" opacity="0.4">
              <line
                x1={x - 3}
                y1={y}
                x2={x + 3}
                y2={y}
                stroke="#fbbf24"
                strokeWidth="0.5"
              />
              <line
                x1={x}
                y1={y - 3}
                x2={x}
                y2={y + 3}
                stroke="#fbbf24"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        <div className="flex gap-4 flex-wrap justify-center">
          {[
            { label: "Main traces", color: "text-emerald-400" },
            { label: "Branches", color: "text-cyan-400" },
            { label: "Nodes", color: "text-violet-400" },
            { label: "Geometry", color: "text-amber-400" },
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
          4-phase timeline: traces → branches → nodes → geometry · node pulse loop
        </p>
      </div>
    </div>
  );
}
