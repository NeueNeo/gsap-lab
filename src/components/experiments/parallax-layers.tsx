"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

export function ParallaxLayers({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const triggerConfig = {
        trigger: ".parallax-content",
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      };

      // Layer 0 — deep background grid (slowest)
      gsap.to(".prlx-grid", {
        y: -100,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Layer 1 — background circles
      gsap.to(".prlx-l1", {
        y: -250,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Layer 2 — mid-back elements
      gsap.to(".prlx-l2", {
        y: -450,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Layer 3 — mid-front elements
      gsap.to(".prlx-l3", {
        y: -650,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Layer 4 — foreground (fastest)
      gsap.to(".prlx-l4", {
        y: -900,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Reverse layer — moves DOWN as you scroll
      gsap.to(".prlx-reverse", {
        y: 300,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Horizontal drift elements
      gsap.to(".prlx-drift-r", {
        x: 200,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      gsap.to(".prlx-drift-l", {
        x: -200,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Rotation elements
      gsap.to(".prlx-spin", {
        rotation: 360,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      gsap.to(".prlx-spin-slow", {
        rotation: 180,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });

      // Scale elements
      gsap.to(".prlx-grow", {
        scale: 2,
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="parallax-content relative" style={{ height: "300vh" }}>

        {/* ===== LAYER 0: Deep background grid ===== */}
        <div className="prlx-grid absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* ===== LAYER 1: Background — slow circles & shapes ===== */}
        <div className="prlx-l1 absolute inset-0 pointer-events-none">
          {/* Top zone */}
          <div className="absolute top-[5vh] left-[10%] w-24 h-24 rounded-full border border-emerald-400/10" />
          <div className="absolute top-[8vh] right-[15%] w-16 h-16 rounded-full bg-emerald-400/5" />
          <div className="absolute top-[15vh] left-[50%] w-32 h-32 rounded-full border border-cyan-400/8" />

          {/* Mid zone */}
          <div className="absolute top-[60vh] left-[8%] w-20 h-20 rounded-full bg-zinc-700/20" />
          <div className="absolute top-[80vh] right-[10%] w-28 h-28 rounded-full border border-zinc-600/15" />
          <div className="absolute top-[100vh] left-[30%] w-36 h-36 rounded-full border border-emerald-400/8" />
          <div className="absolute top-[110vh] right-[25%] w-14 h-14 rounded-full bg-cyan-400/5" />

          {/* Bottom zone */}
          <div className="absolute top-[150vh] left-[15%] w-24 h-24 rounded-full border border-zinc-600/10" />
          <div className="absolute top-[170vh] right-[20%] w-40 h-40 rounded-full border border-emerald-400/6" />
          <div className="absolute top-[200vh] left-[45%] w-20 h-20 rounded-full bg-zinc-700/15" />
          <div className="absolute top-[230vh] left-[8%] w-32 h-32 rounded-full border border-cyan-400/8" />
          <div className="absolute top-[260vh] right-[12%] w-24 h-24 rounded-full bg-emerald-400/5" />
        </div>

        {/* ===== LAYER 2: Mid-back — geometric shapes, lines ===== */}
        <div className="prlx-l2 absolute inset-0 pointer-events-none">
          {/* Horizontal lines */}
          <div className="absolute top-[20vh] left-[5%] w-[30%] h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
          <div className="absolute top-[70vh] right-[5%] w-[25%] h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          <div className="absolute top-[130vh] left-[10%] w-[40%] h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
          <div className="absolute top-[190vh] right-[8%] w-[35%] h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
          <div className="absolute top-[250vh] left-[15%] w-[30%] h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />

          {/* Diamonds / rotated squares */}
          <div className="absolute top-[25vh] right-[20%] w-12 h-12 rotate-45 border border-emerald-400/15" />
          <div className="absolute top-[55vh] left-[20%] w-8 h-8 rotate-45 border border-cyan-400/20" />
          <div className="absolute top-[90vh] right-[30%] w-16 h-16 rotate-45 border border-zinc-600/15" />
          <div className="absolute top-[120vh] left-[60%] w-10 h-10 rotate-45 bg-emerald-400/5" />
          <div className="absolute top-[155vh] right-[15%] w-14 h-14 rotate-45 border border-emerald-400/10" />
          <div className="absolute top-[210vh] left-[25%] w-8 h-8 rotate-45 border border-cyan-400/15" />
          <div className="absolute top-[240vh] right-[40%] w-12 h-12 rotate-45 bg-zinc-700/10" />

          {/* Small crosses */}
          {[18, 45, 75, 115, 145, 175, 220, 265].map((top, i) => (
            <div key={`cross-${i}`} className="absolute" style={{ top: `${top}vh`, left: `${10 + (i * 11) % 80}%` }}>
              <div className="w-4 h-px bg-zinc-500/20 absolute top-1/2 left-1/2 -translate-x-1/2" />
              <div className="h-4 w-px bg-zinc-500/20 absolute top-1/2 left-1/2 -translate-y-1/2" />
            </div>
          ))}
        </div>

        {/* ===== LAYER 3: Mid-front — text blocks, shapes ===== */}
        <div className="prlx-l3 absolute inset-0 pointer-events-none">
          {/* Large text */}
          <div className="absolute top-[30vh] left-[5%]">
            <h2 className="text-7xl font-bold text-zinc-300/10 tracking-tighter">PARALLAX</h2>
          </div>
          <div className="absolute top-[80vh] right-[5%] text-right">
            <h2 className="text-6xl font-bold text-emerald-400/8 tracking-tighter">DEPTH</h2>
          </div>
          <div className="absolute top-[130vh] left-[10%]">
            <h2 className="text-8xl font-bold text-zinc-300/6 tracking-tighter">MOTION</h2>
          </div>
          <div className="absolute top-[185vh] right-[8%] text-right">
            <h2 className="text-5xl font-bold text-cyan-400/8 tracking-tighter">LAYERS</h2>
          </div>
          <div className="absolute top-[240vh] left-[15%]">
            <h2 className="text-7xl font-bold text-zinc-300/8 tracking-tighter">SCROLL</h2>
          </div>

          {/* Rounded rectangles / cards */}
          <div className="absolute top-[45vh] left-[55%] w-40 h-24 rounded-2xl bg-zinc-800/30 border border-zinc-700/20" />
          <div className="absolute top-[100vh] right-[55%] w-32 h-20 rounded-2xl bg-zinc-800/20 border border-emerald-400/10" />
          <div className="absolute top-[160vh] left-[50%] w-48 h-28 rounded-2xl bg-zinc-800/25 border border-zinc-700/15" />
          <div className="absolute top-[225vh] right-[50%] w-36 h-22 rounded-2xl bg-zinc-800/20 border border-cyan-400/10" />

          {/* Dotted vertical lines */}
          <div className="absolute top-[35vh] left-[40%] w-px h-[20vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(82 82 91 / 0.3) 0px, rgb(82 82 91 / 0.3) 4px, transparent 4px, transparent 12px)" }}
          />
          <div className="absolute top-[105vh] right-[35%] w-px h-[15vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(52 211 153 / 0.15) 0px, rgb(52 211 153 / 0.15) 4px, transparent 4px, transparent 12px)" }}
          />
          <div className="absolute top-[195vh] left-[42%] w-px h-[18vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(82 82 91 / 0.2) 0px, rgb(82 82 91 / 0.2) 4px, transparent 4px, transparent 12px)" }}
          />
        </div>

        {/* ===== LAYER 4: Foreground — fast, bold ===== */}
        <div className="prlx-l4 absolute inset-0 pointer-events-none">
          <div className="absolute top-[50vh] left-[8%]">
            <div className="text-center space-y-2">
              <h2 className="text-9xl font-black text-zinc-100 tracking-tighter">SCROLL</h2>
              <p className="text-lg font-mono text-emerald-400/80">Five layers · Five speeds</p>
            </div>
          </div>

          <div className="absolute top-[120vh] right-[10%]">
            <div className="text-right space-y-2">
              <h2 className="text-6xl font-black text-zinc-200 tracking-tighter">VELOCITY</h2>
              <p className="text-sm font-mono text-cyan-400/60">fastest layer</p>
            </div>
          </div>

          <div className="absolute top-[200vh] left-[12%]">
            <div className="space-y-2">
              <h2 className="text-7xl font-black text-zinc-100 tracking-tighter">INFINITE</h2>
              <p className="text-sm font-mono text-emerald-400/60">keep scrolling</p>
            </div>
          </div>

          {/* Small accent blocks */}
          <div className="absolute top-[65vh] right-[15%] w-3 h-16 bg-emerald-400/30 rounded-full" />
          <div className="absolute top-[140vh] left-[20%] w-3 h-12 bg-cyan-400/25 rounded-full" />
          <div className="absolute top-[215vh] right-[25%] w-3 h-20 bg-emerald-400/20 rounded-full" />
        </div>

        {/* ===== REVERSE LAYER: Moves opposite direction ===== */}
        <div className="prlx-reverse absolute inset-0 pointer-events-none">
          <div className="absolute top-[10vh] right-[5%]">
            <span className="text-xs font-mono text-zinc-600 tracking-widest">↑ REVERSE</span>
          </div>
          <div className="absolute top-[40vh] left-[70%] w-10 h-10 rounded-full border-2 border-dashed border-zinc-600/20" />
          <div className="absolute top-[70vh] right-[60%] w-6 h-6 rounded-full border-2 border-dashed border-emerald-400/15" />
          <div className="absolute top-[100vh] left-[75%]">
            <span className="text-xs font-mono text-zinc-600/40 tracking-widest">COUNTER</span>
          </div>
          <div className="absolute top-[140vh] right-[65%] w-8 h-8 rounded-full border-2 border-dashed border-cyan-400/10" />
        </div>

        {/* ===== HORIZONTAL DRIFT ELEMENTS ===== */}
        <div className="prlx-drift-r absolute inset-0 pointer-events-none">
          <div className="absolute top-[35vh] left-[0%] w-20 h-px bg-gradient-to-r from-emerald-400/30 to-transparent" />
          <div className="absolute top-[95vh] left-[5%] w-16 h-px bg-gradient-to-r from-cyan-400/20 to-transparent" />
          <div className="absolute top-[165vh] left-[0%] w-24 h-px bg-gradient-to-r from-emerald-400/20 to-transparent" />
          <div className="absolute top-[235vh] left-[3%] w-20 h-px bg-gradient-to-r from-zinc-500/20 to-transparent" />
        </div>

        <div className="prlx-drift-l absolute inset-0 pointer-events-none">
          <div className="absolute top-[50vh] right-[0%] w-20 h-px bg-gradient-to-l from-cyan-400/25 to-transparent" />
          <div className="absolute top-[115vh] right-[2%] w-24 h-px bg-gradient-to-l from-emerald-400/20 to-transparent" />
          <div className="absolute top-[180vh] right-[0%] w-16 h-px bg-gradient-to-l from-zinc-500/20 to-transparent" />
          <div className="absolute top-[255vh] right-[5%] w-20 h-px bg-gradient-to-l from-cyan-400/15 to-transparent" />
        </div>

        {/* ===== SPINNING ELEMENTS ===== */}
        <div className="prlx-spin absolute inset-0 pointer-events-none">
          <div className="absolute top-[40vh] left-[45%] w-8 h-8 border border-emerald-400/15" />
          <div className="absolute top-[150vh] right-[40%] w-10 h-10 border border-cyan-400/10" />
          <div className="absolute top-[245vh] left-[50%] w-6 h-6 border border-zinc-500/15" />
        </div>

        <div className="prlx-spin-slow absolute inset-0 pointer-events-none">
          <div className="absolute top-[60vh] right-[45%] w-16 h-16 border border-zinc-600/10 rounded-sm" />
          <div className="absolute top-[170vh] left-[48%] w-12 h-12 border border-emerald-400/8 rounded-sm" />
        </div>

        {/* ===== GROWING/FADING ELEMENT ===== */}
        <div className="prlx-grow absolute inset-0 pointer-events-none flex items-start justify-center">
          <div className="mt-[5vh] w-4 h-4 rounded-full bg-emerald-400/40" />
        </div>

        {/* ===== FIXED DEPTH LABELS ===== */}
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">↓ SCROLL TO EXPLORE DEPTH</p>
        </div>

        <div className="absolute bottom-[5vh] w-full text-center">
          <p className="text-xs font-mono text-zinc-600">
            ◆ End of parallax zone
          </p>
        </div>
      </div>
    </div>
  );
}
