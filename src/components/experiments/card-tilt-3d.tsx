
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const card = cardRef.current;
      const glare = glareRef.current;
      if (!wrapper || !card || !glare) return;

      const MAX_TILT = 20;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0 → 1
        const y = (e.clientY - rect.top) / rect.height;   // 0 → 1

        // Tilt: rotateX inverted so card tilts toward cursor
        gsap.to(card, {
          rotateX: (0.5 - y) * MAX_TILT,
          rotateY: (x - 0.5) * MAX_TILT,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Glare follows cursor position
        gsap.to(glare, {
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          opacity: 0.15,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto",
        });
        gsap.to(glare, {
          opacity: 0,
          duration: 0.4,
          overwrite: "auto",
        });
      };

      wrapper.addEventListener("mousemove", handleMouseMove);
      wrapper.addEventListener("mouseleave", handleMouseLeave);

      // Entry animation
      gsap.from(card, {
        scale: 0.85,
        opacity: 0,
        rotateX: -15,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      return () => {
        wrapper.removeEventListener("mousemove", handleMouseMove);
        wrapper.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          hover to tilt · glare overlay tracks cursor · elastic snap-back
        </p>

        {/* Perspective wrapper — perspective goes on the PARENT */}
        <div ref={wrapperRef} style={{ perspective: 800 }}>
          <div
            ref={cardRef}
            className="relative w-80 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden cursor-pointer will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Glare */}
            <div
              ref={glareRef}
              className="absolute w-[200px] h-[200px] rounded-full bg-white pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                opacity: 0,
                transform: "translate(-50%, -50%)",
                filter: "blur(60px)",
              }}
            />

            {/* Card content */}
            <div
              className="relative h-full flex flex-col p-6"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex-1 rounded-xl bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-violet-400/20 border border-zinc-700/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                    <span className="text-emerald-400 text-xl">◆</span>
                  </div>
                  <p className="text-sm font-mono text-zinc-400">3D CARD</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Perspective Tilt
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Move your cursor over this card. It tilts toward the pointer
                  with a glare overlay tracking cursor position.
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  rotateX/Y
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  perspective
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-violet-400/10 text-violet-400 border border-violet-400/20">
                  elastic
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-600">
          perspective: 800px on parent · translateZ(30px) depth · ±{20}° tilt
        </p>
      </div>
    </div>
  );
}
