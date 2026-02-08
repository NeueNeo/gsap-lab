
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CARDS = [
  { title: "Kinetic", subtitle: "Motion system", accent: "emerald", icon: "◆" },
  { title: "Elastic", subtitle: "Spring physics", accent: "cyan", icon: "●" },
  { title: "Orbital", subtitle: "Path animation", accent: "violet", icon: "✦" },
  { title: "Fluid", subtitle: "Organic flow", accent: "amber", icon: "◈" },
  { title: "Impulse", subtitle: "Burst energy", accent: "emerald", icon: "▲" },
  { title: "Rhythm", subtitle: "Timed sequence", accent: "cyan", icon: "◎" },
  { title: "Vector", subtitle: "Direction force", accent: "violet", icon: "⬡" },
];

const ACCENT_MAP: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-400/10", border: "border-emerald-400/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  cyan: { bg: "bg-cyan-400/10", border: "border-cyan-400/20", text: "text-cyan-400", dot: "bg-cyan-400" },
  violet: { bg: "bg-violet-400/10", border: "border-violet-400/20", text: "text-violet-400", dot: "bg-violet-400" },
  amber: { bg: "bg-amber-400/10", border: "border-amber-400/20", text: "text-amber-400", dot: "bg-amber-400" },
};

interface Props {
  onReplay: () => void;
}

export function InfiniteCardSlider({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const cards = gsap.utils.toArray<HTMLElement>(".ics-card", container);
      const numCards = cards.length;
      const cardWidth = 280;
      const gap = 24;
      const totalWidth = (cardWidth + gap) * numCards;

      // Position cards initially in a row
      gsap.set(cards, {
        x: (i) => i * (cardWidth + gap),
      });

      // Create the wrap function to keep cards cycling
      const wrap = gsap.utils.wrap(-cardWidth - gap, totalWidth - cardWidth - gap);

      // Create a single master timeline that moves all cards left
      const tl = gsap.timeline({ repeat: -1, paused: true });

      // Animate xPercent of a proxy, then reposition cards
      const proxy = { x: 0 };
      const totalDist = totalWidth;

      tl.to(proxy, {
        x: -totalDist,
        duration: numCards * 4,
        ease: "none",
        onUpdate: () => {
          const dx = proxy.x;
          cards.forEach((card, i) => {
            const baseX = i * (cardWidth + gap) + dx;
            const wrappedX = wrap(baseX);
            gsap.set(card, { x: wrappedX });
          });
        },
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalDist),
        },
      });

      tl.play();
      tlRef.current = tl;
    },
    { scope: containerRef }
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    lastX.current = e.clientX;
    velocity.current = 0;

    if (tlRef.current) {
      tlRef.current.pause();
    }

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !tlRef.current) return;

    const dx = e.clientX - lastX.current;
    velocity.current = dx;
    lastX.current = e.clientX;

    // Scrub timeline
    const tl = tlRef.current;
    const progressDelta = -dx / 3000;
    const newProgress = gsap.utils.wrap(0, 1, tl.progress() + progressDelta);
    tl.progress(newProgress);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current || !tlRef.current) return;
    isDragging.current = false;

    const tl = tlRef.current;
    const throwScale = gsap.utils.clamp(-6, 6, -velocity.current / 4);
    tl.timeScale(throwScale || 1);
    tl.play();

    gsap.to(tl, {
      timeScale: 1,
      duration: 1.5,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Label */}
      <div className="mb-10 text-center">
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Infinite Card Slider
        </p>
        <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
          Card Carousel
        </h2>
        <p className="text-xs font-mono text-zinc-600 mt-3">
          Auto-scrolls · drag to scrub · fling with inertia
        </p>
      </div>

      {/* Slider track */}
      <div
        className="w-full relative select-none"
        style={{ height: 320, cursor: "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-0 flex items-center">
          {CARDS.map((card, i) => {
            const colors = ACCENT_MAP[card.accent];
            return (
              <div
                key={i}
                className={`ics-card absolute rounded-2xl border ${colors.border} bg-zinc-900/70 backdrop-blur-sm p-6 pointer-events-none`}
                style={{ width: 280, height: 280, top: "50%", transform: "translateY(-50%)" }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                      <span className={`text-xl ${colors.text}`}>{card.icon}</span>
                    </div>
                    <span className={`text-xs font-mono ${colors.text} tracking-widest uppercase`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold text-zinc-100 mt-1">{card.title}</h3>
                    <p className="text-sm font-mono text-zinc-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <div className={`flex-1 h-1 rounded-full ${colors.bg}`}>
                      <div
                        className={`h-full rounded-full ${colors.dot} opacity-50`}
                        style={{ width: `${40 + i * 8}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10">
        <p className="text-xs font-mono text-zinc-700">
          {CARDS.length} cards · gsap.utils.wrap() · infinite loop
        </p>
      </div>
    </div>
  );
}
