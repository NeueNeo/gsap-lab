import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const ORBITS = [
  {
    radius: 80,
    duration: 4,
    items: [
      { color: "bg-emerald-400", size: 12 },
      { color: "bg-emerald-400/50", size: 8 },
    ],
  },
  {
    radius: 140,
    duration: 7,
    items: [
      { color: "bg-cyan-400", size: 16 },
      { color: "bg-cyan-400/60", size: 10 },
      { color: "bg-cyan-400/30", size: 8 },
    ],
  },
  {
    radius: 210,
    duration: 11,
    items: [
      { color: "bg-violet-400", size: 14 },
      { color: "bg-violet-400/40", size: 8 },
      { color: "bg-violet-400/60", size: 12 },
      { color: "bg-violet-400/20", size: 6 },
    ],
  },
];

export function OrbitAnimation({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      ORBITS.forEach((orbit, oi) => {
        orbit.items.forEach((_, ii) => {
          const el = container.querySelector(`.orbit-${oi}-item-${ii}`) as HTMLElement;
          if (!el) return;

          const startAngle = (ii / orbit.items.length) * Math.PI * 2;
          const proxy = { angle: startAngle };

          // Set initial position
          gsap.set(el, {
            x: Math.cos(startAngle) * orbit.radius,
            y: Math.sin(startAngle) * orbit.radius,
          });

          gsap.to(proxy, {
            angle: startAngle + Math.PI * 2,
            duration: orbit.duration,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
              gsap.set(el, {
                x: Math.cos(proxy.angle) * orbit.radius,
                y: Math.sin(proxy.angle) * orbit.radius,
              });
            },
          });
        });
      });

      // Pulse the center
      gsap.to(".orbit-center", {
        scale: 1.15,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Subtle glow pulse
      gsap.to(".orbit-glow", {
        opacity: 0.15,
        scale: 1.3,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full bg-zinc-950 flex flex-col items-center justify-center relative">
      <div className="absolute top-6 left-6">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Orbit</h2>
        <p className="text-xs font-mono text-zinc-500 mt-1">Circular motion · 3 rings</p>
      </div>

      <div className="relative" style={{ width: 480, height: 480 }}>
        {/* Ring guides */}
        {ORBITS.map((orbit, oi) => (
          <div
            key={`ring-${oi}`}
            className="absolute rounded-full border border-zinc-800/40"
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Center glow */}
        <div
          className="orbit-glow absolute rounded-full bg-emerald-400/10 blur-xl"
          style={{ width: 80, height: 80, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        {/* Center point */}
        <div
          className="orbit-center absolute w-6 h-6 rounded-full bg-zinc-100 shadow-lg shadow-zinc-100/20"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        {/* Orbiting items — all start at center, GSAP positions them */}
        {ORBITS.map((orbit, oi) =>
          orbit.items.map((item, ii) => (
            <div
              key={`${oi}-${ii}`}
              className={`orbit-${oi}-item-${ii} absolute rounded-full ${item.color}`}
              style={{
                width: item.size,
                height: item.size,
                top: "50%",
                left: "50%",
                marginTop: -item.size / 2,
                marginLeft: -item.size / 2,
              }}
            />
          ))
        )}
      </div>

      <div className="absolute bottom-6 left-6 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-zinc-600">Inner · 4s</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-600">Mid · 7s</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-xs font-mono text-zinc-600">Outer · 11s</span>
        </div>
      </div>
    </div>
  );
}
