"use client";

import { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const DOCK_ITEMS = [
  { emoji: "🗂", label: "Files" },
  { emoji: "🎵", label: "Music" },
  { emoji: "📸", label: "Photos" },
  { emoji: "✉️", label: "Mail" },
  { emoji: "⚙️", label: "Settings" },
  { emoji: "🧭", label: "Safari" },
  { emoji: "💬", label: "Messages" },
  { emoji: "📝", label: "Notes" },
  { emoji: "🎨", label: "Design" },
];

const ITEM_SIZE = 40;
const GAP = 8;
const MAX_SCALE = 1.8;
const INFLUENCE_RADIUS = 120; // px distance for effect

function gaussian(x: number, sigma: number): number {
  return Math.exp(-(x * x) / (2 * sigma * sigma));
}

export function MacosDockEffect({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useGSAP(
    () => {
      gsap.from(".dock-item", {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const dock = dockRef.current;
    if (!dock) return;

    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;

    for (let i = 0; i < DOCK_ITEMS.length; i++) {
      const item = itemRefs.current[i];
      if (!item) continue;

      const itemCenter = (ITEM_SIZE + GAP) * i + ITEM_SIZE / 2;
      const distance = Math.abs(mouseX - itemCenter);

      // Gaussian falloff for scale
      const sigma = INFLUENCE_RADIUS / 2.5;
      const scale = 1 + (MAX_SCALE - 1) * gaussian(distance, sigma);
      const yOffset = -(scale - 1) * 20;

      gsap.to(item, {
        scale,
        y: yOffset,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Track hovered for tooltip
    const idx = Math.floor(mouseX / (ITEM_SIZE + GAP));
    setHoveredIndex(idx >= 0 && idx < DOCK_ITEMS.length ? idx : -1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(-1);
    for (let i = 0; i < DOCK_ITEMS.length; i++) {
      const item = itemRefs.current[i];
      if (!item) continue;
      gsap.to(item, {
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <p className="text-xs font-mono text-zinc-500">
        gaussian distance falloff · gsap.to() per icon · macOS Dock magnification
      </p>

      <div className="flex flex-col items-center gap-8">
        {/* Tooltip */}
        <div className="h-6 flex items-center">
          {hoveredIndex >= 0 && (
            <span className="text-sm font-medium text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-md">
              {DOCK_ITEMS[hoveredIndex].label}
            </span>
          )}
        </div>

        {/* Dock bar */}
        <div
          ref={dockRef}
          className="flex items-end px-4 py-3 rounded-2xl bg-zinc-800/30 border border-zinc-700/40 backdrop-blur-sm"
          style={{ gap: GAP }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {DOCK_ITEMS.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="dock-item flex items-center justify-center rounded-xl bg-zinc-800/60 border border-zinc-700/30 cursor-pointer will-change-transform select-none"
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                transformOrigin: "center bottom",
              }}
            >
              <span className="text-lg pointer-events-none">{item.emoji}</span>
            </div>
          ))}
        </div>

        {/* Dock indicator dots */}
        <div className="flex gap-2">
          {DOCK_ITEMS.map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: hoveredIndex === i ? "rgb(52, 211, 153)" : "rgb(63, 63, 70)",
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        {DOCK_ITEMS.length} icons · max scale {MAX_SCALE}× · influence radius {INFLUENCE_RADIUS}px · spring-back on leave
      </p>
    </div>
  );
}
