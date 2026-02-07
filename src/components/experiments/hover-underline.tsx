"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

interface LinkStyle {
  label: string;
  description: string;
  color: string;
  lineColor: string;
  onEnter: (line: HTMLElement) => void;
  onLeave: (line: HTMLElement) => void;
}

export function HoverUnderline({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entry animation
  useGSAP(
    () => {
      gsap.from(".link-row", {
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const linkStyles: LinkStyle[] = [
    {
      label: "Left to Right Wipe",
      description: "scaleX from left origin → right origin on leave",
      color: "text-emerald-400",
      lineColor: "bg-emerald-400",
      onEnter: (line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.35, ease: "power2.out" }
        );
      },
      onLeave: (line) => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.35,
          ease: "power2.in",
        });
      },
    },
    {
      label: "Center Expand",
      description: "scaleX from center origin",
      color: "text-cyan-400",
      lineColor: "bg-cyan-400",
      onEnter: (line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "center center" },
          { scaleX: 1, duration: 0.35, ease: "power2.out" }
        );
      },
      onLeave: (line) => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.in",
        });
      },
    },
    {
      label: "Elastic Bounce",
      description: "elastic.out ease for springy feel",
      color: "text-violet-400",
      lineColor: "bg-violet-400",
      onEnter: (line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" }
        );
      },
      onLeave: (line) => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.3,
          ease: "power3.in",
        });
      },
    },
    {
      label: "Thick to Thin Morph",
      description: "height shrinks from 4px → 1px on hover",
      color: "text-amber-400",
      lineColor: "bg-amber-400",
      onEnter: (line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, height: 4, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.to(line, {
          height: 1,
          duration: 0.4,
          delay: 0.2,
          ease: "power2.inOut",
        });
      },
      onLeave: (line) => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.3,
          ease: "power2.in",
        });
        gsap.set(line, { height: 4, delay: 0.3 });
      },
    },
    {
      label: "Slide Through",
      description: "line slides from left to right across, then resets",
      color: "text-rose-400",
      lineColor: "bg-rose-400",
      onEnter: (line) => {
        gsap.set(line, { transformOrigin: "left center" });
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.3, ease: "power2.out" }
        );
      },
      onLeave: (line) => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(line, { transformOrigin: "left center" });
          },
        });
      },
    },
  ];

  const makeHandlers = contextSafe(
    (style: LinkStyle) => {
      return {
        onMouseEnter: (e: React.MouseEvent) => {
          const line = (e.currentTarget as HTMLElement).querySelector(
            ".underline-el"
          ) as HTMLElement;
          if (line) style.onEnter(line);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          const line = (e.currentTarget as HTMLElement).querySelector(
            ".underline-el"
          ) as HTMLElement;
          if (line) style.onLeave(line);
        },
      };
    }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          5 animated underline styles · contextSafe mouse events
        </p>

        <nav className="flex flex-col gap-6">
          {linkStyles.map((style, i) => {
            const handlers = makeHandlers(style);
            return (
              <div key={i} className="link-row flex items-center gap-6">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={handlers.onMouseEnter}
                  onMouseLeave={handlers.onMouseLeave}
                  className={`relative text-2xl font-semibold ${style.color} cursor-pointer`}
                >
                  {style.label}
                  <span
                    className={`underline-el absolute bottom-0 left-0 w-full h-[2px] ${style.lineColor} scale-x-0`}
                  />
                </a>
                <span className="text-[10px] font-mono text-zinc-600 hidden md:inline">
                  {style.description}
                </span>
              </div>
            );
          })}
        </nav>

        <p className="text-xs font-mono text-zinc-600 mt-4">
          transformOrigin swap for directional wipe · hover to preview
        </p>
      </div>
    </div>
  );
}
