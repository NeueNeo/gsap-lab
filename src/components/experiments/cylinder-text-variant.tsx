import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Variant = "drum" | "ring" | "tilted-orbit" | "double-helix";

interface Props {
  onReplay: () => void;
  variant: Variant;
}

const DRUM_WORDS = [
  "Magnetic", "Kinetics", "Radiating", "Converge",
  "Synthesize", "Dissolving", "Fragments", "Construct",
  "Threshold", "Resonance",
];

const RING_WORDS = [
  "Neural", "Drift", "Signal", "Pulse",
  "Phase", "Static", "Cipher", "Bloom", "Glitch",
];

const TILT_WORDS = [
  "Zenith", "Warp", "Apex", "Core",
  "Rift", "Echo", "Shift", "Void", "Drift",
];

const HELIX_A = ["Alpha", "Gamma", "Sigma", "Omega", "Delta", "Theta", "Kappa", "Zeta"];
const HELIX_B = ["Bind", "Splice", "Weave", "Fuse", "Merge", "Link", "Chain", "Knot"];

const DRUM_RADIUS = 200;
const DRUM_ANGLE = 360 / DRUM_WORDS.length;
const RING_RADIUS = 240;
const RING_ANGLE = 360 / RING_WORDS.length;
const TILT_RADIUS = 260;
const TILT_ANGLE = 360 / TILT_WORDS.length;
const HELIX_RADIUS = 220;
const HELIX_COUNT = HELIX_A.length;
const HELIX_ANGLE = 360 / HELIX_COUNT;
const HELIX_SPREAD = 28;

export function CylinderTextVariant({ onReplay, variant }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const helixBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = animRef.current;
      if (!el) return;

      if (variant === "drum") {
        gsap.to(el, { rotateX: -360, duration: 8, ease: "none", repeat: -1 });
      }

      if (variant === "ring") {
        const items = el.querySelectorAll(".ring-word");
        const count = items.length;
        const step = 360 / count;
        gsap.to(el, {
          rotateY: 360, duration: 10, ease: "none", repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(el, "rotateY") as number;
            items.forEach((item, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos < 0 ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(item, { opacity });
            });
          },
        });
      }

      if (variant === "tilted-orbit") {
        const items = el.querySelectorAll(".tilt-word");
        const count = items.length;
        const step = 360 / count;
        gsap.to(el, {
          rotateY: 360, duration: 9, ease: "none", repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(el, "rotateY") as number;
            items.forEach((item, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos < 0 ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(item, { opacity });
            });
          },
        });
      }

      if (variant === "double-helix") {
        gsap.to(el, { rotateY: 360, duration: 10, ease: "none", repeat: -1 });
        if (helixBRef.current) {
          gsap.to(helixBRef.current, { rotateY: -360, duration: 10, ease: "none", repeat: -1 });
        }
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full p-8">
      <div
        className="relative flex items-center justify-center overflow-hidden w-full max-w-3xl"
        style={{ perspective: 1000, height: 400 }}
      >
        {variant === "drum" && (
          <>
            <div ref={animRef} style={{ transformStyle: "preserve-3d" }}>
              {DRUM_WORDS.map((word, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-5xl sm:text-6xl md:text-7xl"
                  style={{
                    lineHeight: 1,
                    transform: `rotateX(${i * DRUM_ANGLE}deg) translateZ(${DRUM_RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
          </>
        )}

        {variant === "ring" && (
          <>
            <div ref={animRef} style={{ transformStyle: "preserve-3d" }}>
              {RING_WORDS.map((word, i) => (
                <div
                  key={i}
                  className="ring-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-4xl sm:text-5xl md:text-6xl"
                  style={{
                    lineHeight: 1,
                    transform: `rotateY(${i * RING_ANGLE}deg) translateZ(${RING_RADIUS}px)`,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
          </>
        )}

        {variant === "tilted-orbit" && (
          <>
            <div
              ref={animRef}
              style={{ transformStyle: "preserve-3d", transform: "rotateX(25deg)" }}
            >
              {TILT_WORDS.map((word, i) => (
                <div
                  key={i}
                  className="tilt-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-4xl sm:text-5xl md:text-6xl"
                  style={{
                    lineHeight: 1,
                    transform: `rotateY(${i * TILT_ANGLE}deg) translateZ(${TILT_RADIUS}px)`,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
          </>
        )}

        {variant === "double-helix" && (
          <>
            <div ref={animRef} className="absolute" style={{ transformStyle: "preserve-3d" }}>
              {HELIX_A.map((word, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-emerald-400 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl"
                  style={{
                    lineHeight: 1,
                    top: (i - HELIX_COUNT / 2) * HELIX_SPREAD,
                    transform: `rotateY(${i * HELIX_ANGLE}deg) translateZ(${HELIX_RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div ref={helixBRef} className="absolute" style={{ transformStyle: "preserve-3d" }}>
              {HELIX_B.map((word, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-violet-400 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl"
                  style={{
                    lineHeight: 1,
                    top: (i - HELIX_COUNT / 2) * HELIX_SPREAD,
                    transform: `rotateY(${i * HELIX_ANGLE + 180}deg) translateZ(${HELIX_RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
            <div className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
          </>
        )}
      </div>
    </div>
  );
}
