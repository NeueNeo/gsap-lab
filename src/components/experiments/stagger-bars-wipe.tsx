
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const BAR_COUNT = 10;

const BAR_COLORS = [
  "bg-emerald-900",
  "bg-emerald-800",
  "bg-emerald-700",
  "bg-emerald-600",
  "bg-emerald-500",
  "bg-emerald-500",
  "bg-emerald-600",
  "bg-emerald-700",
  "bg-emerald-800",
  "bg-emerald-900",
];

const PAGES = [
  {
    title: "Origin",
    subtitle: "Where it begins",
    accent: "emerald",
    items: ["Form", "Function", "Flow"],
  },
  {
    title: "Arrival",
    subtitle: "Where it lands",
    accent: "cyan",
    items: ["Motion", "Rhythm", "Grace"],
  },
];

const ACCENT: Record<string, { text: string; bg: string; border: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/20" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/20" },
};

interface Props {
  onReplay: () => void;
}

export function StaggerBarsWipe({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pageRef = useRef(0);

  useGSAP(
    () => {
      const bars = containerRef.current?.querySelectorAll(".bar-stripe");
      const pageA = containerRef.current?.querySelector(".bars-page-a") as HTMLElement;
      const pageB = containerRef.current?.querySelector(".bars-page-b") as HTMLElement;
      if (!bars || !pageA || !pageB) return;

      const barArr = Array.from(bars);

      // Initial state
      gsap.set(barArr, { scaleX: 0, transformOrigin: "left" });
      gsap.set(pageB, { autoAlpha: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        delay: 1.5,
        repeatDelay: 1.5,
      });

      // === Forward: A → B ===

      // Bars wipe IN from left with center stagger
      tl.to(barArr, {
        scaleX: 1,
        stagger: { each: 0.06, from: "center" },
        duration: 0.5,
        ease: "power3.inOut",
      });

      // Swap pages behind bars
      tl.set(pageA, { autoAlpha: 0 });
      tl.set(pageB, { autoAlpha: 1 });

      // Bars wipe OUT to the right
      tl.set(barArr, { transformOrigin: "right" });
      tl.to(barArr, {
        scaleX: 0,
        stagger: { each: 0.06, from: "edges" },
        duration: 0.5,
        ease: "power3.inOut",
        delay: 0.1,
      });

      // Hold Page B
      tl.to({}, { duration: 2 });

      // === Reverse: B → A ===

      // Bars wipe IN from right
      tl.set(barArr, { transformOrigin: "right" });
      tl.to(barArr, {
        scaleX: 1,
        stagger: { each: 0.06, from: "edges" },
        duration: 0.5,
        ease: "power3.inOut",
      });

      // Swap back
      tl.set(pageB, { autoAlpha: 0 });
      tl.set(pageA, { autoAlpha: 1 });

      // Bars wipe OUT to the left
      tl.set(barArr, { transformOrigin: "left" });
      tl.to(barArr, {
        scaleX: 0,
        stagger: { each: 0.06, from: "center" },
        duration: 0.5,
        ease: "power3.inOut",
        delay: 0.1,
      });

      // Hold Page A
      tl.to({}, { duration: 2 });

      tlRef.current = tl;
    },
    { scope: containerRef }
  );

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const pA = PAGES[0];
  const pB = PAGES[1];
  const sA = ACCENT[pA.accent];
  const sB = ACCENT[pB.accent];

  return (
    <div ref={containerRef} className="h-full relative bg-zinc-950 overflow-hidden">
      {/* Label */}
      <div className="absolute top-4 left-4 z-30">
        <span className="text-xs font-mono text-zinc-500">stagger bars · wipe</span>
      </div>

      {/* Page A */}
      <div className="bars-page-a absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className={`block text-xs font-mono ${sA.text} tracking-widest uppercase mb-4 opacity-60`}>
            {pA.subtitle}
          </span>
          <h2 className={`text-6xl font-bold tracking-tighter ${sA.text}`}>
            {pA.title}
          </h2>
          <div className="mt-8 flex justify-center gap-3">
            {pA.items.map((item, i) => (
              <span
                key={i}
                className={`px-4 py-2 rounded-lg border ${sA.border} bg-zinc-900/50 text-sm font-mono text-zinc-300`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Page B */}
      <div className="bars-page-b absolute inset-0 flex items-center justify-center" style={{ opacity: 0, visibility: "hidden" }}>
        <div className="text-center">
          <span className={`block text-xs font-mono ${sB.text} tracking-widest uppercase mb-4 opacity-60`}>
            {pB.subtitle}
          </span>
          <h2 className={`text-6xl font-bold tracking-tighter ${sB.text}`}>
            {pB.title}
          </h2>
          <div className="mt-8 flex justify-center gap-3">
            {pB.items.map((item, i) => (
              <span
                key={i}
                className={`px-4 py-2 rounded-lg border ${sB.border} bg-zinc-900/50 text-sm font-mono text-zinc-300`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bars overlay */}
      <div className="absolute inset-0 flex pointer-events-none z-20">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`bar-stripe flex-1 ${BAR_COLORS[i]} scale-x-0`}
          />
        ))}
      </div>
    </div>
  );
}
