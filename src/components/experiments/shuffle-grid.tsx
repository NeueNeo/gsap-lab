"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

const COLORS = [
  "bg-emerald-500/30", "bg-cyan-500/30", "bg-violet-500/30", "bg-amber-500/30",
  "bg-rose-500/30", "bg-blue-500/30", "bg-pink-500/30", "bg-teal-500/30",
  "bg-orange-500/30", "bg-lime-500/30", "bg-indigo-500/30", "bg-fuchsia-500/30",
];

interface Props {
  onReplay: () => void;
}

export function ShuffleGrid({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tiles = containerRef.current?.querySelectorAll(".tile");
      if (!tiles) return;

      gsap.set(tiles, { opacity: 0, scale: 0.8 });
      gsap.to(tiles, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.2)",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const shuffle = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const tiles = Array.from(grid.querySelectorAll(".tile")) as HTMLElement[];

    // Record current positions
    const firstPositions = tiles.map((tile) => {
      const rect = tile.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    });

    // Fisher-Yates shuffle DOM order
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      grid.insertBefore(tiles[j], tiles[i]);
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // Record new positions and invert
    tiles.forEach((tile, i) => {
      const lastRect = tile.getBoundingClientRect();
      const dx = firstPositions[i].x - lastRect.left;
      const dy = firstPositions[i].y - lastRect.top;

      // Set to old position instantly
      gsap.set(tile, { x: dx, y: dy });

      // Animate to new position
      gsap.to(tile, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: i * 0.02,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
    >
      <div ref={gridRef} className="grid grid-cols-4 gap-3 max-w-md w-full">
        {COLORS.map((color, i) => (
          <div
            key={i}
            className={`tile aspect-square rounded-lg ${color} border border-zinc-700/30 flex items-center justify-center`}
          >
            <span className="text-lg font-mono font-bold text-zinc-300">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
      <Button
        onClick={shuffle}
        variant="outline"
        className="font-mono text-sm bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      >
        Shuffle Tiles
      </Button>
    </div>
  );
}
