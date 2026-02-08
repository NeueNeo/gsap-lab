
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

// Shapes defined as clip-path polygons (all with 12 points for smooth morphing)
const SHAPES: { name: string; path: string; color: string }[] = [
  {
    name: "Circle",
    path: "50% 0%, 79% 10%, 97% 35%, 97% 65%, 79% 90%, 50% 100%, 21% 90%, 3% 65%, 3% 35%, 21% 10%, 35% 3%, 65% 3%",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Triangle",
    path: "50% 0%, 60% 15%, 75% 30%, 90% 55%, 100% 85%, 85% 100%, 50% 100%, 15% 100%, 0% 85%, 10% 55%, 25% 30%, 40% 15%",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "Hexagon",
    path: "50% 0%, 75% 3%, 100% 25%, 100% 50%, 100% 75%, 75% 100%, 50% 100%, 25% 100%, 0% 75%, 0% 50%, 0% 25%, 25% 0%",
    color: "from-violet-400 to-violet-600",
  },
  {
    name: "Star",
    path: "50% 0%, 63% 30%, 100% 35%, 72% 58%, 80% 100%, 50% 75%, 20% 100%, 28% 58%, 0% 35%, 37% 30%, 42% 12%, 58% 12%",
    color: "from-amber-400 to-amber-600",
  },
  {
    name: "Diamond",
    path: "50% 0%, 62% 12%, 80% 20%, 100% 50%, 80% 80%, 62% 88%, 50% 100%, 38% 88%, 20% 80%, 0% 50%, 20% 20%, 38% 12%",
    color: "from-rose-400 to-rose-600",
  },
];

export function ClipPathMorph({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const shape = shapeRef.current;
      const label = labelRef.current;
      if (!shape || !label) return;

      let currentIdx = 0;

      // Set initial shape
      gsap.set(shape, {
        clipPath: `polygon(${SHAPES[0].path})`,
        scale: 0,
      });

      // Entry animation
      gsap.to(shape, {
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      function morphToNext() {
        currentIdx = (currentIdx + 1) % SHAPES.length;
        const next = SHAPES[currentIdx];

        // Morph the clip-path
        gsap.to(shape, {
          clipPath: `polygon(${next.path})`,
          duration: 1.2,
          ease: "power3.inOut",
        });

        // Rotate
        gsap.to(shape, {
          rotation: `+=${60}`,
          duration: 1.2,
          ease: "power3.inOut",
        });

        // Update label with fade
        if (label) {
          gsap.to(label, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              if (label) label.textContent = next.name;
              gsap.to(label, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            },
          });
        }

        gsap.delayedCall(2, morphToNext);
      }

      gsap.delayedCall(1.2, morphToNext);
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
          clip-path polygon morphing · circle → triangle → hexagon → star →
          diamond
        </p>

        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/5 to-violet-400/10 blur-3xl rounded-full" />

          {/* Shape */}
          <div
            ref={shapeRef}
            className="w-52 h-52 bg-gradient-to-br from-emerald-400 to-cyan-400"
            style={{
              clipPath: `polygon(${SHAPES[0].path})`,
            }}
          />
        </div>

        {/* Active shape label */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-600">current:</span>
          <span
            ref={labelRef}
            className="text-sm font-mono text-zinc-100 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            {SHAPES[0].name}
          </span>
        </div>

        {/* Shape progression */}
        <div className="flex gap-2">
          {SHAPES.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-600">
                {s.name}
              </span>
              {i < SHAPES.length - 1 && (
                <span className="text-zinc-700">→</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          12-point polygons for smooth interpolation · power3.inOut ease
        </p>
      </div>
    </div>
  );
}
