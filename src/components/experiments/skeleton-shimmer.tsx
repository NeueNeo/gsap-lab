"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const REAL_CARDS = [
  { title: "Project Alpha", status: "Active", metric: "98.2%", accent: "emerald" },
  { title: "Project Beta", status: "Building", metric: "74.5%", accent: "cyan" },
  { title: "Project Gamma", status: "Review", metric: "56.1%", accent: "violet" },
];

const ACCENT_MAP: Record<string, { dot: string; bar: string }> = {
  emerald: { dot: "bg-emerald-400", bar: "bg-emerald-400/30" },
  cyan: { dot: "bg-cyan-400", bar: "bg-cyan-400/30" },
  violet: { dot: "bg-violet-400", bar: "bg-violet-400/30" },
};

export function SkeletonShimmer({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      if (!loaded) {
        // Shimmer animation on skeleton lines
        const skeletons = gsap.utils.toArray<HTMLElement>(".skeleton-bar", container);

        skeletons.forEach((el) => {
          gsap.fromTo(
            el,
            { backgroundPosition: "-200% 0" },
            {
              backgroundPosition: "200% 0",
              duration: 1.5,
              ease: "none",
              repeat: -1,
            }
          );
        });
      }
    },
    { scope: containerRef, dependencies: [loaded] }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleLoad = contextSafe(() => {
    if (loaded) {
      // Reset
      setLoaded(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Fade out skeletons
    const skeletons = container.querySelectorAll(".skeleton-card");
    const tl = gsap.timeline({
      onComplete: () => setLoaded(true),
    });

    tl.to(skeletons, {
      autoAlpha: 0,
      y: -10,
      stagger: 0.08,
      duration: 0.3,
      ease: "power2.in",
    });
  });

  // After loaded state changes, animate real content in
  useGSAP(
    () => {
      if (!loaded) return;
      const container = containerRef.current;
      if (!container) return;

      const realCards = container.querySelectorAll(".real-card");
      gsap.from(realCards, {
        y: 30,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "back.out(1.4)",
      });
    },
    { scope: containerRef, dependencies: [loaded] }
  );

  return (
    <div ref={containerRef} className="h-full bg-zinc-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
              {loaded ? "Content Loaded" : "Loading…"}
            </p>
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
              {loaded ? "Projects" : "Skeleton Shimmer"}
            </h2>
          </div>

          {/* Content area */}
          <div className="space-y-4">
            {!loaded ? (
              <>
                {/* Skeleton cards */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="skeleton-card rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="skeleton-bar w-10 h-10 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(90deg, rgb(39 39 42) 25%, rgb(63 63 70) 50%, rgb(39 39 42) 75%)",
                          backgroundSize: "200% 100%",
                        }}
                      />
                      <div className="flex-1 space-y-2">
                        <div
                          className="skeleton-bar h-4 rounded"
                          style={{
                            width: `${60 + i * 10}%`,
                            background:
                              "linear-gradient(90deg, rgb(39 39 42) 25%, rgb(63 63 70) 50%, rgb(39 39 42) 75%)",
                            backgroundSize: "200% 100%",
                          }}
                        />
                        <div
                          className="skeleton-bar h-3 rounded"
                          style={{
                            width: `${40 + i * 5}%`,
                            background:
                              "linear-gradient(90deg, rgb(39 39 42) 25%, rgb(63 63 70) 50%, rgb(39 39 42) 75%)",
                            backgroundSize: "200% 100%",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="skeleton-bar h-2 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgb(39 39 42) 25%, rgb(63 63 70) 50%, rgb(39 39 42) 75%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Real cards */}
                {REAL_CARDS.map((card, i) => {
                  const colors = ACCENT_MAP[card.accent];
                  return (
                    <div
                      key={i}
                      className="real-card rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${colors.bar} flex items-center justify-center`}
                        >
                          <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">{card.title}</p>
                          <p className="text-xs font-mono text-zinc-500">{card.status}</p>
                        </div>
                        <span className="ml-auto text-lg font-bold text-zinc-200">{card.metric}</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${colors.dot} opacity-50`}
                          style={{ width: card.metric }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trigger */}
      <div className="flex justify-center pb-10">
        <button
          onClick={handleLoad}
          className="px-6 py-3 rounded-xl border border-zinc-700/50 bg-zinc-900/60 text-sm font-mono text-zinc-300 hover:bg-zinc-800/80 transition-colors"
        >
          {loaded ? "↻ Reset to Skeleton" : "Simulate Load →"}
        </button>
      </div>
    </div>
  );
}
