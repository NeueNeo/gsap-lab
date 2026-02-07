"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function MagneticButton({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const buttons = containerRef.current?.querySelectorAll(".magnetic-btn");
      if (!buttons) return;

      buttons.forEach((btn) => {
        const el = btn as HTMLElement;
        const strength = 40;

        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;

          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.4,
            ease: "power2.out",
          });

          const text = el.querySelector(".btn-text") as HTMLElement;
          if (text) {
            gsap.to(text, {
              x: dx * strength * 0.3,
              y: dy * strength * 0.3,
              duration: 0.4,
              ease: "power2.out",
            });
          }
        };

        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)",
          });
          const text = el.querySelector(".btn-text") as HTMLElement;
          if (text) {
            gsap.to(text, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.3)",
            });
          }
        };

        el.addEventListener("mousemove", onMove as EventListener);
        el.addEventListener("mouseleave", onLeave);
      });

      // Entry animation
      gsap.from(".magnetic-btn", {
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

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-16">
        <p className="text-sm font-mono text-zinc-500">
          Move your cursor near the buttons
        </p>
        <div className="flex gap-12">
          <button className="magnetic-btn w-40 h-40 rounded-full bg-emerald-400/10 border-2 border-emerald-400/30 flex items-center justify-center cursor-pointer hover:bg-emerald-400/20 transition-colors">
            <span className="btn-text text-lg font-semibold text-emerald-400">
              Hover Me
            </span>
          </button>
          <button className="magnetic-btn w-40 h-40 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center cursor-pointer hover:bg-cyan-400/20 transition-colors">
            <span className="btn-text text-lg font-semibold text-cyan-400">
              Pull Me
            </span>
          </button>
          <button className="magnetic-btn w-40 h-40 rounded-full bg-violet-400/10 border-2 border-violet-400/30 flex items-center justify-center cursor-pointer hover:bg-violet-400/20 transition-colors">
            <span className="btn-text text-lg font-semibold text-violet-400">
              Attract
            </span>
          </button>
        </div>
        <p className="text-xs font-mono text-zinc-600">
          gsap.to() + elastic.out easing on leave
        </p>
      </div>
    </div>
  );
}
