"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

// Cyberpunk color palettes as HSL values (H, S%, L%)
const PALETTES = [
  { name: "Cyber Cyan", a: "165, 82%, 55%", b: "200, 90%, 60%", c: "250, 70%, 65%" },
  { name: "Neon Violet", a: "270, 80%, 65%", b: "300, 75%, 55%", c: "330, 85%, 60%" },
  { name: "Matrix Green", a: "150, 80%, 50%", b: "120, 70%, 45%", c: "90, 85%, 55%" },
  { name: "Amber Glow", a: "35, 90%, 55%", b: "15, 85%, 50%", c: "350, 80%, 55%" },
];

export function GradientShift({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = gradientRef.current;
      const label = labelRef.current;
      if (!el || !label) return;

      let paletteIdx = 0;

      // Set initial CSS custom properties
      gsap.set(el, {
        "--stop-a": `hsl(${PALETTES[0].a})`,
        "--stop-b": `hsl(${PALETTES[0].b})`,
        "--stop-c": `hsl(${PALETTES[0].c})`,
        "--angle": "135deg",
      });

      // Entry animation
      gsap.from(el, {
        scale: 0.8,
        opacity: 0,
        borderRadius: "50%",
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      // Animate the angle rotation continuously
      const angleProxy = { value: 135 };
      gsap.to(angleProxy, {
        value: 495, // 135 + 360
        duration: 20,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          el.style.setProperty("--angle", `${angleProxy.value}deg`);
        },
      });

      // Cycle through palettes
      function shiftPalette() {
        paletteIdx = (paletteIdx + 1) % PALETTES.length;
        const next = PALETTES[paletteIdx];

        // Animate CSS properties through a proxy object
        const colorProxy = {
          aH: parseFloat(PALETTES[(paletteIdx - 1 + PALETTES.length) % PALETTES.length].a),
          bH: parseFloat(PALETTES[(paletteIdx - 1 + PALETTES.length) % PALETTES.length].b),
          cH: parseFloat(PALETTES[(paletteIdx - 1 + PALETTES.length) % PALETTES.length].c),
        };

        const targetAH = parseFloat(next.a);
        const targetBH = parseFloat(next.b);
        const targetCH = parseFloat(next.c);

        gsap.to(colorProxy, {
          aH: targetAH,
          bH: targetBH,
          cH: targetCH,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            // Reconstruct HSL with same S and L from target palette
            const aS = next.a.split(",")[1]?.trim();
            const aL = next.a.split(",")[2]?.trim();
            const bS = next.b.split(",")[1]?.trim();
            const bL = next.b.split(",")[2]?.trim();
            const cS = next.c.split(",")[1]?.trim();
            const cL = next.c.split(",")[2]?.trim();

            el!.style.setProperty("--stop-a", `hsl(${colorProxy.aH}, ${aS} ${aL})`);
            el!.style.setProperty("--stop-b", `hsl(${colorProxy.bH}, ${bS} ${bL})`);
            el!.style.setProperty("--stop-c", `hsl(${colorProxy.cH}, ${cS} ${cL})`);
          },
        });

        // Update label
        gsap.to(label!, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          onComplete: () => {
            if (label) label.textContent = next.name;
            gsap.to(label!, {
              opacity: 1,
              y: 0,
              duration: 0.3,
            });
          },
        });

        gsap.delayedCall(3, shiftPalette);
      }

      gsap.delayedCall(2, shiftPalette);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm font-mono text-zinc-500">
          CSS custom property animation · rotating gradient angle
        </p>

        {/* Gradient display */}
        <div
          ref={gradientRef}
          className="w-80 h-56 rounded-2xl border border-zinc-800 overflow-hidden"
          style={{
            background:
              "linear-gradient(var(--angle, 135deg), var(--stop-a, hsl(165, 82%, 55%)), var(--stop-b, hsl(200, 90%, 60%)), var(--stop-c, hsl(250, 70%, 65%)))",
          }}
        >
          {/* Overlay text */}
          <div className="h-full flex items-center justify-center">
            <p className="text-white/20 text-6xl font-black tracking-tighter">
              GSAP
            </p>
          </div>
        </div>

        {/* Palette label */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-600">palette:</span>
          <span
            ref={labelRef}
            className="text-sm font-mono text-zinc-100 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            {PALETTES[0].name}
          </span>
        </div>

        {/* Palette preview */}
        <div className="flex gap-4">
          {PALETTES.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-zinc-700"
                  style={{ backgroundColor: `hsl(${p.a})` }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-zinc-700"
                  style={{ backgroundColor: `hsl(${p.b})` }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-zinc-700"
                  style={{ backgroundColor: `hsl(${p.c})` }}
                />
              </div>
              <span className="text-[9px] font-mono text-zinc-600">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          --stop-a, --stop-b, --stop-c + --angle animated via proxy objects
        </p>
      </div>
    </div>
  );
}
