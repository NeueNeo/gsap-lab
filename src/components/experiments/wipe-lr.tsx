
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PAGES = [
  {
    title: "Explore",
    subtitle: "Discover what's possible",
    bg: "bg-zinc-950",
    accent: "emerald",
    items: ["Interfaces", "Systems", "Patterns", "Craft"],
  },
  {
    title: "Create",
    subtitle: "Build something meaningful",
    bg: "bg-zinc-950",
    accent: "cyan",
    items: ["Prototype", "Iterate", "Refine", "Ship"],
  },
  {
    title: "Launch",
    subtitle: "Put it in the world",
    bg: "bg-zinc-950",
    accent: "violet",
    items: ["Deploy", "Monitor", "Scale", "Evolve"],
  },
];

const ACCENT: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/20" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/20" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-400/20" },
};

interface Props {
  onReplay: () => void;
}

export function WipeLR({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const triggerWipe = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const bars = wipeRef.current?.children;
    if (!bars) return;

    const nextIndex = (pageIndex + 1) % PAGES.length;
    const barArr = Array.from(bars);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Wipe IN — bars scale from left to right, staggered
    tl.set(barArr, { scaleX: 0, transformOrigin: "left" });
    tl.to(barArr, {
      scaleX: 1,
      stagger: 0.08,
      duration: 0.4,
      ease: "power3.inOut",
    });

    // Swap content at full cover
    tl.call(() => setPageIndex(nextIndex));

    // Wipe OUT — bars scale out to the right
    tl.set(barArr, { transformOrigin: "right" });
    tl.to(barArr, {
      scaleX: 0,
      stagger: 0.08,
      duration: 0.4,
      ease: "power3.inOut",
      delay: 0.05,
    });

    // Animate new content in
    tl.from(".wlr-title", { x: -60, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.4");
    tl.from(".wlr-sub", { x: -40, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "-=0.3");
    tl.from(".wlr-item", { x: -30, autoAlpha: 0, stagger: 0.06, duration: 0.35, ease: "power2.out" }, "-=0.2");
    tl.from(".wlr-line", { scaleX: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
  });

  const page = PAGES[pageIndex];
  const s = ACCENT[page.accent];

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-lg">
          <span className={`wlr-sub block text-xs font-mono ${s.text} tracking-widest uppercase mb-4`}>
            {page.subtitle}
          </span>
          <h2 className={`wlr-title text-7xl font-bold tracking-tighter text-zinc-100 mb-8`}>
            {page.title}
          </h2>
          <div className={`wlr-line h-px w-24 ${s.bg} mb-8 origin-left`} />
          <div className="flex flex-wrap gap-3">
            {page.items.map((item, i) => (
              <span
                key={i}
                className={`wlr-item inline-block px-4 py-2 rounded-lg border ${s.border} bg-zinc-900/50 text-sm font-mono text-zinc-300`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center pb-10">
        <button
          onClick={triggerWipe}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-xl border ${s.border} bg-zinc-900/60 text-sm font-mono ${s.text} hover:bg-zinc-800/80 transition-colors disabled:opacity-40`}
        >
          {isAnimating ? "Wiping…" : "Wipe →"}
        </button>
      </div>

      {/* Wipe bars — 4 horizontal rows */}
      <div
        ref={wipeRef}
        className="absolute inset-0 flex flex-col pointer-events-none z-50"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 bg-zinc-800 scale-x-0" />
        ))}
      </div>

      {/* Page dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {PAGES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === pageIndex ? s.bg : "bg-zinc-700"}`}
          />
        ))}
      </div>
    </div>
  );
}
