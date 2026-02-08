"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function ParallaxHover({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const container = containerRef.current;
      const image = imageRef.current;
      if (!container || !image) return;

      const xImage = gsap.quickTo(image, "x", { duration: 0.8, ease: "power3" });
      const yImage = gsap.quickTo(image, "y", { duration: 0.8, ease: "power3" });

      const handleMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;

        xImage(-cx * 40);
        yImage(-cy * 40);
      };

      const handleLeave = () => {
        xImage(0);
        yImage(0);
      };

      container.addEventListener("mousemove", handleMove);
      container.addEventListener("mouseleave", handleLeave);

      return () => {
        container.removeEventListener("mousemove", handleMove);
        container.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center h-full overflow-hidden cursor-crosshair"
    >
      {/* Background plane — oversized to allow parallax movement */}
      <div
        ref={imageRef}
        className="absolute inset-[-60px] z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)",
            backgroundSize: "110%",
            backgroundPosition: "center",
            opacity: 0.4,
            filter: "saturate(0.6)",
            width: "100%",
            height: "100%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 30% 40%, rgba(16, 185, 129, 0.12) 0%, transparent 70%),
              radial-gradient(ellipse 60% 80% at 70% 60%, rgba(139, 92, 246, 0.10) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgb(9 9 11) 100%)",
        }}
      />

      {/* Title — foreground */}
      <div className="relative z-20 flex flex-col items-center gap-6 select-none">
        <h1 className="text-[120px] font-bold leading-none tracking-tighter text-white">
          BEYOND
        </h1>
        <p className="text-lg font-mono text-zinc-400 tracking-[0.3em]">
          MOVE YOUR CURSOR
        </p>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <p className="text-xs font-mono text-zinc-600 tracking-widest">
          quickTo · mouse parallax · foreground + background layers
        </p>
      </div>
    </div>
  );
}
