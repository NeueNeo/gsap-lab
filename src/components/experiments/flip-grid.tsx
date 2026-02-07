"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Flip);

interface Props {
  onReplay: () => void;
}

type FilterType = "all" | "design" | "dev" | "motion";

interface GridItem {
  id: number;
  label: string;
  category: FilterType;
  color: string;
  borderColor: string;
  bgColor: string;
}

const ITEMS: GridItem[] = [
  { id: 1, label: "UI Kit", category: "design", color: "text-emerald-400", borderColor: "border-emerald-400/30", bgColor: "bg-emerald-400/10" },
  { id: 2, label: "API", category: "dev", color: "text-cyan-400", borderColor: "border-cyan-400/30", bgColor: "bg-cyan-400/10" },
  { id: 3, label: "Easing", category: "motion", color: "text-violet-400", borderColor: "border-violet-400/30", bgColor: "bg-violet-400/10" },
  { id: 4, label: "Icons", category: "design", color: "text-emerald-400", borderColor: "border-emerald-400/30", bgColor: "bg-emerald-400/10" },
  { id: 5, label: "CLI Tool", category: "dev", color: "text-cyan-400", borderColor: "border-cyan-400/30", bgColor: "bg-cyan-400/10" },
  { id: 6, label: "Scroll FX", category: "motion", color: "text-violet-400", borderColor: "border-violet-400/30", bgColor: "bg-violet-400/10" },
  { id: 7, label: "Typography", category: "design", color: "text-emerald-400", borderColor: "border-emerald-400/30", bgColor: "bg-emerald-400/10" },
  { id: 8, label: "Database", category: "dev", color: "text-cyan-400", borderColor: "border-cyan-400/30", bgColor: "bg-cyan-400/10" },
  { id: 9, label: "Parallax", category: "motion", color: "text-violet-400", borderColor: "border-violet-400/30", bgColor: "bg-violet-400/10" },
  { id: 10, label: "Color Sys", category: "design", color: "text-emerald-400", borderColor: "border-emerald-400/30", bgColor: "bg-emerald-400/10" },
  { id: 11, label: "Auth", category: "dev", color: "text-cyan-400", borderColor: "border-cyan-400/30", bgColor: "bg-cyan-400/10" },
  { id: 12, label: "Morph", category: "motion", color: "text-violet-400", borderColor: "border-violet-400/30", bgColor: "bg-violet-400/10" },
];

const FILTERS: { label: string; value: FilterType; color: string }[] = [
  { label: "All", value: "all", color: "text-zinc-100 border-zinc-500" },
  { label: "Design", value: "design", color: "text-emerald-400 border-emerald-400/50" },
  { label: "Dev", value: "dev", color: "text-cyan-400 border-cyan-400/50" },
  { label: "Motion", value: "motion", color: "text-violet-400 border-violet-400/50" },
];

export function FlipGrid({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entry animation
  useGSAP(
    () => {
      gsap.from(".flip-item", {
        scale: 0,
        opacity: 0,
        stagger: { each: 0.04, from: "center", grid: "auto" },
        duration: 0.5,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleFilter = contextSafe((filter: FilterType) => {
    if (!gridRef.current) return;

    // 1. Snapshot current state
    const state = Flip.getState(".flip-item", {
      props: "opacity",
    });

    // 2. Update filter
    setActiveFilter(filter);

    // 3. Use requestAnimationFrame to wait for React render
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.03,
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4 }
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0, duration: 0.3 }),
      });
    });
  });

  const visibleItems =
    activeFilter === "all"
      ? ITEMS
      : ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <p className="text-sm font-mono text-zinc-500">
          Flip.getState → filter → Flip.from with enter/leave
        </p>

        {/* Filter buttons */}
        <div className="flex gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono border cursor-pointer transition-none ${
                f.color
              } ${
                activeFilter === f.value
                  ? "bg-zinc-800"
                  : "bg-transparent opacity-50 hover:opacity-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full"
        >
          {visibleItems.map((item) => (
            <div
              key={item.id}
              data-flip-id={`item-${item.id}`}
              className={`flip-item rounded-xl ${item.bgColor} border ${item.borderColor} p-4 flex flex-col items-center justify-center gap-2 aspect-square`}
            >
              <div
                className={`w-8 h-8 rounded-lg border ${item.borderColor} flex items-center justify-center`}
              >
                <span className={`text-xs ${item.color}`}>
                  {item.id.toString().padStart(2, "0")}
                </span>
              </div>
              <span className={`text-xs font-mono ${item.color}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          GSAP Flip plugin · absolute positioning during animation · stagger 0.03s
        </p>
      </div>
    </div>
  );
}
