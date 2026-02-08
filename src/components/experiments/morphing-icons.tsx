
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function MorphingIcons({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // === 1. Circle ↔ Square: animate rx and dimensions ===
      const circleShape = container.querySelector(".shape-circle");
      if (circleShape) {
        gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
          .to(circleShape, {
            attr: { rx: 4, ry: 4, width: 48, height: 48, x: 26, y: 26 },
            duration: 1,
            ease: "power2.inOut",
          })
          .to(circleShape, {
            duration: 0.8,
          })
          .to(circleShape, {
            attr: { rx: 25, ry: 25, width: 50, height: 50, x: 25, y: 25 },
            duration: 1,
            ease: "power2.inOut",
          })
          .to(circleShape, {
            duration: 0.8,
          });
      }

      // === 2. Plus ↔ Minus: animate vertical bar of the plus ===
      const plusV = container.querySelector(".plus-vertical");
      const plusH = container.querySelector(".plus-horizontal");
      if (plusV && plusH) {
        gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay: 0.3 })
          // Shrink vertical bar to zero (plus → minus)
          .to(plusV, {
            attr: { y1: 50, y2: 50 },
            duration: 0.8,
            ease: "power2.inOut",
          })
          .to(plusV, {
            duration: 1,
          })
          // Grow vertical bar back (minus → plus)
          .to(plusV, {
            attr: { y1: 28, y2: 72 },
            duration: 0.8,
            ease: "power2.inOut",
          })
          .to(plusV, {
            duration: 1,
          });
      }

      // === 3. Chevron ▶ ↔ ◀: flip horizontally ===
      const chevron = container.querySelector(".chevron-group");
      if (chevron) {
        gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 0.6 })
          .to(chevron, {
            scaleX: -1,
            duration: 0.6,
            ease: "power2.inOut",
            transformOrigin: "50px 50px",
          })
          .to(chevron, {
            duration: 1.2,
          })
          .to(chevron, {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.inOut",
            transformOrigin: "50px 50px",
          })
          .to(chevron, {
            duration: 1.2,
          });
      }

      // === 4. Check ✓ ↔ X ✗: strokeDashoffset crossfade ===
      const checkPath = container.querySelector(".check-path") as SVGPathElement | null;
      const xPath1 = container.querySelector(".x-path-1") as SVGPathElement | null;
      const xPath2 = container.querySelector(".x-path-2") as SVGPathElement | null;

      if (checkPath && xPath1 && xPath2) {
        const checkLen = checkPath.getTotalLength();
        const x1Len = xPath1.getTotalLength();
        const x2Len = xPath2.getTotalLength();

        // Initial state: check visible, X hidden (opacity 0 to kill linecap dots)
        gsap.set(checkPath, { strokeDasharray: checkLen, strokeDashoffset: 0, opacity: 1 });
        gsap.set([xPath1, xPath2], { opacity: 0 });
        gsap.set(xPath1, { strokeDasharray: x1Len, strokeDashoffset: x1Len });
        gsap.set(xPath2, { strokeDasharray: x2Len, strokeDashoffset: x2Len });

        gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay: 0.9 })
          // Hide check
          .to(checkPath, {
            strokeDashoffset: checkLen,
            duration: 0.5,
            ease: "power2.in",
          })
          .set(checkPath, { opacity: 0 })
          // Reset X dash, then fade in + draw
          .set([xPath1, xPath2], { opacity: 1 })
          .set(xPath1, { strokeDashoffset: x1Len })
          .set(xPath2, { strokeDashoffset: x2Len })
          .to([xPath1, xPath2], {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power2.out",
          })
          .to({}, { duration: 1 })
          // Hide X
          .to([xPath1, xPath2], {
            strokeDashoffset: (_i: number, target: SVGPathElement) => target.getTotalLength(),
            duration: 0.5,
            ease: "power2.in",
          })
          .set([xPath1, xPath2], { opacity: 0 })
          // Reset check dash, then fade in + draw
          .set(checkPath, { opacity: 1, strokeDashoffset: checkLen })
          .to(checkPath, {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power2.out",
          })
          .to({}, { duration: 1 });
      }

      // Entry animations for all icon cells
      gsap.from(".icon-cell", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.4)",
        delay: 0.1,
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
        <p className="text-xs font-mono text-zinc-500">
          icon morphing without MorphSVG · rx, line positions, scaleX, strokeDashoffset
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* === Circle ↔ Square === */}
          <div className="icon-cell flex flex-col items-center gap-3 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
              <rect
                className="shape-circle"
                x="25"
                y="25"
                width="50"
                height="50"
                rx="25"
                ry="25"
                stroke="#34d399"
                strokeWidth="3"
              />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400">Circle</span>
              <span className="text-zinc-600 text-[10px]">↔</span>
              <span className="text-[10px] font-mono text-emerald-400">Square</span>
            </div>
          </div>

          {/* === Plus ↔ Minus === */}
          <div className="icon-cell flex flex-col items-center gap-3 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
              <line
                className="plus-horizontal"
                x1="28"
                y1="50"
                x2="72"
                y2="50"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                className="plus-vertical"
                x1="50"
                y1="28"
                x2="50"
                y2="72"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400">Plus</span>
              <span className="text-zinc-600 text-[10px]">↔</span>
              <span className="text-[10px] font-mono text-cyan-400">Minus</span>
            </div>
          </div>

          {/* === Chevron ▶ ↔ ◀ === */}
          <div className="icon-cell flex flex-col items-center gap-3 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
              <g className="chevron-group">
                <polyline
                  points="38,25 65,50 38,75"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-violet-400">Right</span>
              <span className="text-zinc-600 text-[10px]">↔</span>
              <span className="text-[10px] font-mono text-violet-400">Left</span>
            </div>
          </div>

          {/* === Check ↔ X === */}
          <div className="icon-cell flex flex-col items-center gap-3 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
              {/* Check mark */}
              <path
                className="check-path"
                d="M 25 52 L 42 68 L 75 32"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
              {/* X mark — two diagonal lines */}
              <path
                className="x-path-1"
                d="M 30 30 L 70 70"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="butt"
              />
              <path
                className="x-path-2"
                d="M 70 30 L 30 70"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="butt"
              />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400">Check</span>
              <span className="text-zinc-600 text-[10px]">↔</span>
              <span className="text-[10px] font-mono text-amber-400">Cross</span>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-600">
          4 icon pairs · independent loops · rx morph, line animation, scaleX flip, dash draw
        </p>
      </div>
    </div>
  );
}
