"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function CardTilt3d({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const glare = glareRef.current;
      if (!card || !glare) return;

      // Create quickTo instances for 60fps smooth tracking
      const rotateXTo = gsap.quickTo(card, "rotateX", {
        duration: 0.4,
        ease: "power3",
      });
      const rotateYTo = gsap.quickTo(card, "rotateY", {
        duration: 0.4,
        ease: "power3",
      });
      const glareXTo = gsap.quickTo(glare, "xPercent", {
        duration: 0.3,
        ease: "power2",
      });
      const glareYTo = gsap.quickTo(glare, "yPercent", {
        duration: 0.3,
        ease: "power2",
      });
      const glareOpacityTo = gsap.quickTo(glare, "opacity", {
        duration: 0.3,
        ease: "power2",
      });

      gsap.set(card, { transformPerspective: 800 });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0-1
        const y = (e.clientY - rect.top) / rect.height; // 0-1

        const maxTilt = 15;
        rotateXTo((y - 0.5) * -maxTilt);
        rotateYTo((x - 0.5) * maxTilt);

        // Glare follows cursor
        glareXTo((x - 0.5) * 100);
        glareYTo((y - 0.5) * 100);
        glareOpacityTo(0.15);
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
        glareOpacityTo(0);
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      // Entry animation
      gsap.from(card, {
        scale: 0.8,
        opacity: 0,
        rotateX: -20,
        duration: 0.8,
        ease: "back.out(1.4)",
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
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          quickTo for 60fps tilt tracking · glare overlay follows cursor
        </p>

        <div
          ref={cardRef}
          className="relative w-80 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden cursor-pointer will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glare overlay */}
          <div
            ref={glareRef}
            className="absolute w-[250px] h-[250px] rounded-full bg-white opacity-0 blur-[80px] pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Card content — elevated in 3D */}
          <div
            className="relative h-full flex flex-col p-6"
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Fake image area */}
            <div className="flex-1 rounded-xl bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-violet-400/20 border border-zinc-700/30 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                  <span className="text-emerald-400 text-xl">◆</span>
                </div>
                <p className="text-sm font-mono text-zinc-400">3D CARD</p>
              </div>
            </div>

            {/* Text content */}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-zinc-100">
                Perspective Tilt
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Move your cursor over this card. It tilts toward the pointer
                with a glare overlay tracking cursor position.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                quickTo
              </span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                perspective
              </span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-violet-400/10 text-violet-400 border border-violet-400/20">
                3D
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-600">
          transformPerspective: 800 · translateZ for depth layers
        </p>
      </div>
    </div>
  );
}
