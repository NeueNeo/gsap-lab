import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
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

const CULLED_WORDS = [
  "Neural", "Drift", "Signal", "Pulse",
  "Phase", "Static", "Cipher", "Bloom", "Glitch",
];

const TILT_WORDS = [
  "Zenith", "Warp", "Apex", "Core",
  "Rift", "Echo", "Shift", "Void", "Drift",
];

const HELIX_A = ["Alpha", "Gamma", "Sigma", "Omega", "Delta", "Theta", "Kappa", "Zeta"];
const HELIX_B = ["Bind", "Splice", "Weave", "Fuse", "Merge", "Link", "Chain", "Knot"];

const DRUM_RADIUS = 180;
const DRUM_ANGLE = 360 / DRUM_WORDS.length;
const RING_RADIUS = 200;
const RING_ANGLE = 360 / RING_WORDS.length;
const CULLED_RADIUS = 200;
const CULLED_ANGLE = 360 / CULLED_WORDS.length;
const TILT_RADIUS = 200;
const TILT_ANGLE = 360 / TILT_WORDS.length;
const HELIX_RADIUS = 180;
const HELIX_COUNT = HELIX_A.length;
const HELIX_ANGLE = 360 / HELIX_COUNT;
const HELIX_SPREAD = 24;

export function CylinderText({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const culledRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const helixARef = useRef<HTMLDivElement>(null);
  const helixBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (drumRef.current) {
        gsap.to(drumRef.current, { rotateX: -360, duration: 8, ease: "none", repeat: -1 });
      }

      if (ringRef.current) {
        const items = ringRef.current.querySelectorAll(".ring-word");
        const count = items.length;
        const step = 360 / count;
        gsap.to(ringRef.current, {
          rotateY: 360, duration: 10, ease: "none", repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(ringRef.current!, "rotateY") as number;
            items.forEach((el, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos < 0 ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      if (culledRef.current) {
        const items = culledRef.current.querySelectorAll(".culled-word");
        const count = items.length;
        const step = 360 / count;
        gsap.to(culledRef.current, {
          rotateY: 360, duration: 12, ease: "none", repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(culledRef.current!, "rotateY") as number;
            items.forEach((el, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos > 0 ? 0.2 + 0.8 * cos : 0;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      if (tiltRef.current) {
        const items = tiltRef.current.querySelectorAll(".tilt-word");
        const count = items.length;
        const step = 360 / count;
        gsap.to(tiltRef.current, {
          rotateY: 360, duration: 9, ease: "none", repeat: -1,
          onUpdate() {
            const rot = gsap.getProperty(tiltRef.current!, "rotateY") as number;
            items.forEach((el, i) => {
              const angle = ((rot + i * step) % 360 + 360) % 360;
              const cos = Math.cos((angle * Math.PI) / 180);
              const opacity = cos < 0 ? 0.15 + 0.05 * (1 + cos) : 0.2 + 0.8 * cos;
              gsap.set(el, { opacity });
            });
          },
        });
      }

      if (helixARef.current) {
        gsap.to(helixARef.current, { rotateY: 360, duration: 10, ease: "none", repeat: -1 });
      }
      if (helixBRef.current) {
        gsap.to(helixBRef.current, { rotateY: -360, duration: 10, ease: "none", repeat: -1 });
      }
    },
    { scope: containerRef }
  );

  const VARIANTS = [
    {
      label: "Drum",
      render: () => (
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ perspective: 1000, height: 280 }}
        >
          <div ref={drumRef} style={{ transformStyle: "preserve-3d" }}>
            {DRUM_WORDS.map((word, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl" style={{ lineHeight: 1, transform: `rotateX(${i * DRUM_ANGLE}deg) translateZ(${DRUM_RADIUS}px)`, backfaceVisibility: "hidden" }}>{word}</div>
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
        </div>
      ),
    },
    {
      label: "Ring · Opacity Fade",
      render: () => (
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ perspective: 1000, height: 280 }}
        >
          <div ref={ringRef} style={{ transformStyle: "preserve-3d" }}>
            {RING_WORDS.map((word, i) => (
              <div key={i} className="ring-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl" style={{ lineHeight: 1, transform: `rotateY(${i * RING_ANGLE}deg) translateZ(${RING_RADIUS}px)` }}>{word}</div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
        </div>
      ),
    },
    {
      label: "Ring · Backface Hidden",
      render: () => (
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ perspective: 1000, height: 280 }}
        >
          <div ref={culledRef} style={{ transformStyle: "preserve-3d" }}>
            {CULLED_WORDS.map((word, i) => (
              <div key={i} className="culled-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl" style={{ lineHeight: 1, transform: `rotateY(${i * CULLED_ANGLE}deg) translateZ(${CULLED_RADIUS}px)`, backfaceVisibility: "hidden" }}>{word}</div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
        </div>
      ),
    },
    {
      label: "Tilted Orbit",
      render: () => (
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ perspective: 1000, height: 280 }}
        >
          <div ref={tiltRef} style={{ transformStyle: "preserve-3d", transform: "rotateX(25deg)" }}>
            {TILT_WORDS.map((word, i) => (
              <div key={i} className="tilt-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold tracking-tight text-zinc-100 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl" style={{ lineHeight: 1, transform: `rotateY(${i * TILT_ANGLE}deg) translateZ(${TILT_RADIUS}px)` }}>{word}</div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgb(9 9 11) 0%, transparent 100%)" }} />
        </div>
      ),
    },
    {
      label: "Double Helix",
      render: () => (
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ perspective: 1000, height: 280 }}
        >
          <div ref={helixARef} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            {HELIX_A.map((word, i) => (
              <div key={i} className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-emerald-400 whitespace-nowrap text-2xl sm:text-3xl md:text-4xl" style={{ lineHeight: 1, top: (i - HELIX_COUNT / 2) * HELIX_SPREAD, transform: `rotateY(${i * HELIX_ANGLE}deg) translateZ(${HELIX_RADIUS}px)`, backfaceVisibility: "hidden" }}>{word}</div>
            ))}
          </div>
          <div ref={helixBRef} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            {HELIX_B.map((word, i) => (
              <div key={i} className="absolute left-1/2 -translate-x-1/2 text-center font-bold tracking-tight text-violet-400 whitespace-nowrap text-2xl sm:text-3xl md:text-4xl" style={{ lineHeight: 1, top: (i - HELIX_COUNT / 2) * HELIX_SPREAD, transform: `rotateY(${i * HELIX_ANGLE + 180}deg) translateZ(${HELIX_RADIUS}px)`, backfaceVisibility: "hidden" }}>{word}</div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to right, rgb(9 9 11) 0%, transparent 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10" style={{ background: "linear-gradient(to left, rgb(9 9 11) 0%, transparent 100%)" }} />
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="h-full overflow-auto p-6">
      <div className="flex flex-col items-center gap-16 max-w-3xl mx-auto">
        {VARIANTS.map(({ label, render }) => (
          <div key={label} className="w-full flex flex-col items-center gap-3">
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">{label}</p>
            {render()}
          </div>
        ))}
      </div>
    </div>
  );
}
