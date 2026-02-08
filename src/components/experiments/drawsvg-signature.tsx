"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

// Handwriting-style bezier path spelling "gsap" in cursive
// Designed for a 600x300 viewBox
const SIGNATURE_PATH =
  // "g" — loop down with descender
  "M 80 140 C 85 120, 110 110, 115 130 C 120 150, 95 165, 80 160 C 65 155, 65 175, 80 185 C 90 192, 105 180, 115 165 " +
  // connector to "s"
  "C 125 150, 135 135, 150 130 " +
  // "s" — double curve
  "C 165 125, 180 120, 175 135 C 170 150, 145 148, 150 158 C 155 168, 180 165, 185 155 " +
  // connector to "a"
  "C 190 145, 200 132, 215 128 " +
  // "a" — round with stem
  "C 240 122, 255 130, 250 148 C 245 165, 220 170, 215 155 C 210 140, 230 128, 250 135 C 255 137, 260 145, 260 155 " +
  // connector to "p"
  "C 260 165, 270 130, 285 125 " +
  // "p" — bowl and descender
  "C 300 120, 325 125, 325 145 C 325 165, 300 175, 285 165 C 275 158, 278 140, 290 135 " +
  // descender
  "C 285 145, 282 175, 280 195";

// Decorative underline flourish
const UNDERLINE_PATH =
  "M 65 200 C 120 195, 200 188, 280 192 C 320 194, 340 200, 350 195";

export function DrawSvgSignature({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const sigPath = container.querySelector(".sig-path") as SVGPathElement | null;
      const underline = container.querySelector(".sig-underline") as SVGPathElement | null;
      const penDot = container.querySelector(".pen-dot");
      const fillText = container.querySelector(".sig-fill");

      if (!sigPath) return;

      const sigLen = sigPath.getTotalLength();

      // Set up dash for line-drawing technique
      gsap.set(sigPath, {
        strokeDasharray: sigLen,
        strokeDashoffset: sigLen,
        opacity: 1,
      });

      if (underline) {
        const ulLen = underline.getTotalLength();
        gsap.set(underline, {
          strokeDasharray: ulLen,
          strokeDashoffset: ulLen,
          opacity: 1,
        });
      }

      if (fillText) {
        gsap.set(fillText, { opacity: 0 });
      }

      if (penDot) {
        gsap.set(penDot, { opacity: 0 });
      }

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, delay: 0.5 });

      // Show pen dot at starting position
      if (penDot) {
        const startPoint = sigPath.getPointAtLength(0);
        gsap.set(penDot, { attr: { cx: startPoint.x, cy: startPoint.y } });

        tl.to(penDot, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Draw the signature
      const drawDuration = 3;
      tl.to(sigPath, {
        strokeDashoffset: 0,
        duration: drawDuration,
        ease: "power1.inOut",
      }, "<");

      // Move pen dot along path while drawing
      if (penDot && sigPath) {
        const proxy = { progress: 0 };
        tl.to(proxy, {
          progress: 1,
          duration: drawDuration,
          ease: "power1.inOut",
          onUpdate: () => {
            const point = sigPath.getPointAtLength(proxy.progress * sigLen);
            gsap.set(penDot, {
              attr: { cx: point.x, cy: point.y },
            });
          },
        }, "<");
      }

      // Draw underline flourish
      if (underline) {
        tl.to(underline, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.2");

        // Move pen dot along underline
        if (penDot) {
          const ulLen = underline.getTotalLength();
          const proxy2 = { progress: 0 };
          tl.to(proxy2, {
            progress: 1,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
              const point = underline.getPointAtLength(proxy2.progress * ulLen);
              gsap.set(penDot, {
                attr: { cx: point.x, cy: point.y },
              });
            },
          }, "<");
        }
      }

      // Fade in fill after drawing
      if (fillText) {
        tl.to(fillText, {
          opacity: 0.15,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.3");
      }

      // Hide pen dot
      if (penDot) {
        tl.to(penDot, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        }, "-=0.5");
      }

      // Hold
      tl.to({}, { duration: 1.5 });

      // Fade everything out to reset
      tl.to([sigPath, underline, fillText].filter(Boolean), {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          // Reset for next loop
          gsap.set(sigPath, {
            strokeDashoffset: sigLen,
            opacity: 1,
          });
          if (underline) {
            const ulLen = underline.getTotalLength();
            gsap.set(underline, {
              strokeDashoffset: ulLen,
              opacity: 1,
            });
          }
          if (fillText) {
            gsap.set(fillText, { opacity: 0 });
          }
        },
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
          strokeDashoffset line-drawing · pen dot follows path tip
        </p>

        <div className="relative">
          {/* Glow backdrop */}
          <div className="absolute inset-0 bg-emerald-400/5 blur-3xl rounded-full" />

          <svg
            viewBox="0 0 420 280"
            className="w-full max-w-xl relative"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fill layer (fades in after stroke draw) */}
            <path
              className="sig-fill"
              d={SIGNATURE_PATH}
              stroke="#34d399"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            />

            {/* Main stroke path */}
            <path
              className="sig-path"
              d={SIGNATURE_PATH}
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            />

            {/* Underline flourish */}
            <path
              className="sig-underline"
              d={UNDERLINE_PATH}
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0"
            />

            {/* Pen dot — follows the drawing tip */}
            <circle
              className="pen-dot"
              cx="80"
              cy="140"
              r="4"
              fill="#34d399"
              opacity="0"
            >
              {/* Static glow around pen dot handled by filter */}
            </circle>

            {/* Pen dot glow */}
            <circle
              className="pen-dot"
              cx="80"
              cy="140"
              r="8"
              fill="#34d399"
              opacity="0"
              style={{ filter: "blur(4px)" }}
            />
          </svg>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {[
            { label: "Stroke draw", color: "text-cyan-400" },
            { label: "Pen tracker", color: "text-emerald-400" },
            { label: "Fill fade-in", color: "text-emerald-400/60" },
            { label: "Flourish", color: "text-cyan-400" },
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
          cursive "gsap" · dashoffset 0→length · pen dot via getPointAtLength · fill fade · loop
        </p>
      </div>
    </div>
  );
}
