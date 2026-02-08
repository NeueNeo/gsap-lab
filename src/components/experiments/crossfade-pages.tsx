
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PAGES = [
  {
    title: "Dashboard",
    accent: "emerald",
    cards: [
      { label: "Revenue", value: "$12.4k" },
      { label: "Users", value: "2,847" },
      { label: "Growth", value: "+18%" },
    ],
  },
  {
    title: "Analytics",
    accent: "cyan",
    cards: [
      { label: "Pageviews", value: "84.2k" },
      { label: "Bounce Rate", value: "32%" },
      { label: "Avg. Session", value: "4m 12s" },
    ],
  },
];

const ACCENT: Record<string, { text: string; border: string; dot: string }> = {
  emerald: { text: "text-emerald-400", border: "border-emerald-400/20", dot: "bg-emerald-400" },
  cyan: { text: "text-cyan-400", border: "border-cyan-400/20", dot: "bg-cyan-400" },
};

interface Props {
  onReplay: () => void;
}

export function CrossfadePages({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const crossfade = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = activeIndex === 0 ? 1 : 0;
    const currentPage = containerRef.current?.querySelector(".page-active") as HTMLElement;
    const nextPage = containerRef.current?.querySelector(".page-inactive") as HTMLElement;

    if (!currentPage || !nextPage) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        setIsAnimating(false);
      },
    });

    // Fade out current page
    tl.to(currentPage, {
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
    });

    // Fade in next page with staggered children
    tl.set(nextPage, { autoAlpha: 1, scale: 1 });
    tl.from(
      nextPage,
      { autoAlpha: 0, scale: 1.05, duration: 0.5, ease: "power2.out" },
      "-=0.15"
    );

    const children = nextPage.querySelectorAll(".stagger-child");
    tl.from(
      children,
      { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" },
      "-=0.3"
    );
  });

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 flex flex-col">
      {/* Pages container */}
      <div className="flex-1 relative">
        {PAGES.map((page, idx) => {
          const isActive = idx === activeIndex;
          const colors = ACCENT[page.accent];

          return (
            <div
              key={idx}
              className={`absolute inset-0 flex items-center justify-center px-8 ${
                isActive ? "page-active" : "page-inactive"
              }`}
              style={{
                visibility: isActive ? "visible" : "hidden",
                opacity: isActive ? 1 : 0,
              }}
            >
              <div className="w-full max-w-lg">
                <div className="stagger-child mb-2">
                  <span className={`text-xs font-mono ${colors.text} tracking-widest uppercase`}>
                    View {idx + 1}
                  </span>
                </div>
                <h2 className={`stagger-child text-5xl font-bold tracking-tighter ${colors.text} mb-8`}>
                  {page.title}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {page.cards.map((card, ci) => (
                    <div
                      key={ci}
                      className={`stagger-child rounded-xl border ${colors.border} bg-zinc-900/50 p-4`}
                    >
                      <p className="text-xs font-mono text-zinc-500 mb-1">{card.label}</p>
                      <p className="text-xl font-bold text-zinc-100">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="stagger-child mt-6 p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} opacity-60`} />
                    <span className="text-xs font-mono text-zinc-500">Activity</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, bi) => (
                      <div
                        key={bi}
                        className={`flex-1 rounded-sm ${colors.dot} opacity-20`}
                        style={{ height: `${8 + Math.random() * 32}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="flex justify-center pb-10">
        <button
          onClick={crossfade}
          disabled={isAnimating}
          className="px-6 py-3 rounded-xl border border-zinc-700/50 bg-zinc-900/60 text-sm font-mono text-zinc-300 hover:bg-zinc-800/80 transition-colors disabled:opacity-40"
        >
          {isAnimating ? "Crossfading…" : "Switch View"}
        </button>
      </div>
    </div>
  );
}
