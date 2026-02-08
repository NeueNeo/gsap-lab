
import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const SPOTLIGHT_RADIUS = 150;

export function SpotlightReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  useGSAP(
    () => {
      gsap.from(".spotlight-container", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  // We use quickTo for position tracking, but apply mask via RAF
  useEffect(() => {
    const reveal = revealRef.current;
    if (!reveal) return;

    // Track x/y with dummy elements so quickTo works
    const proxy = { x: 0, y: 0 };
    const xTo = gsap.quickTo(proxy, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(proxy, "y", { duration: 0.3, ease: "power3" });

    quickX.current = xTo;
    quickY.current = yTo;

    let raf: number;
    const update = () => {
      posRef.current = { x: proxy.x, y: proxy.y };
      reveal.style.maskImage = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${proxy.x}px ${proxy.y}px, black 0%, transparent 100%)`;
      reveal.style.webkitMaskImage = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${proxy.x}px ${proxy.y}px, black 0%, transparent 100%)`;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    quickX.current?.(x);
    quickY.current?.(y);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsInside(true);
    gsap.to(revealRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsInside(false);
    gsap.to(revealRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500">
        radial-gradient mask · gsap.quickTo() proxy tracking · hidden content reveal
      </p>

      <div
        className="spotlight-container relative w-full max-w-2xl h-96 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hidden content layer — revealed by spotlight */}
        <div
          ref={revealRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-zinc-950">
            {/* Large text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-7xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent select-none">
                HIDDEN
              </span>
            </div>

            {/* Geometric shapes */}
            <div className="absolute top-12 left-16 w-16 h-16 border-2 border-emerald-400/60 rotate-45" />
            <div className="absolute top-20 right-24 w-12 h-12 rounded-full border-2 border-cyan-400/60" />
            <div className="absolute bottom-16 left-24 w-20 h-20 rounded-full border-2 border-violet-400/40" />
            <div className="absolute bottom-20 right-16 w-14 h-14 border-2 border-amber-400/50 rotate-12" />
            <div className="absolute top-16 left-1/2 w-10 h-10 border-2 border-cyan-400/40 rotate-[30deg]" />

            {/* Triangle */}
            <svg className="absolute bottom-32 left-1/3" width="40" height="36" viewBox="0 0 40 36">
              <polygon points="20,0 40,36 0,36" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            </svg>

            {/* Dot pattern */}
            <div className="absolute top-8 right-8 grid grid-cols-5 gap-3">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
              ))}
            </div>

            {/* Bottom dot pattern */}
            <div className="absolute bottom-8 left-8 grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-cyan-400/30" />
              ))}
            </div>

            {/* Additional text */}
            <span className="absolute top-32 left-12 text-xs font-mono text-violet-400/70 rotate-[-8deg]">
              discover
            </span>
            <span className="absolute bottom-12 right-32 text-xs font-mono text-emerald-400/70 rotate-[5deg]">
              explore
            </span>
            <span className="absolute top-12 right-48 text-xs font-mono text-amber-400/60">
              reveal
            </span>

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 384">
              <line x1="80" y1="80" x2="200" y2="200" stroke="rgba(52, 211, 153, 0.15)" strokeWidth="1" />
              <line x1="500" y1="100" x2="400" y2="250" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
              <line x1="300" y1="50" x2="350" y2="300" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Dark overlay (always visible, content peeks through the mask) */}
        <div className="absolute inset-0 z-0 bg-zinc-950" />

        {/* Idle hint */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-500"
          style={{ opacity: isInside ? 0 : 1 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-600 animate-pulse" />
            </div>
            <p className="text-sm font-mono text-zinc-600">
              Move cursor to reveal hidden content
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        {SPOTLIGHT_RADIUS}px reveal radius · CSS mask-image radial-gradient · requestAnimationFrame sync
      </p>
    </div>
  );
}
