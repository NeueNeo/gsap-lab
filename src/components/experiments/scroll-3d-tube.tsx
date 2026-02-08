
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

const RING_COUNT = 12;

const ACCENT_COLORS = [
  "#34d399", // emerald-400
  "#22d3ee", // cyan-400
  "#a78bfa", // violet-400
  "#fbbf24", // amber-400
];

export function Scroll3dTube({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollerH, setScrollerH] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setScrollerH(containerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const totalScrollDistance = 4000;
  const wrapperHeight = totalScrollDistance + (scrollerH || 0);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller || !scrollerH) return;

      const rings = gsap.utils.toArray<HTMLElement>(".tube-ring", scroller);

      // Initial state: rings positioned at increasing depth (negative Z)
      rings.forEach((ring, i) => {
        const zStart = -200 - i * 150; // stagger them deep into the screen
        gsap.set(ring, {
          z: zStart,
          opacity: 1 - i * 0.06,
          scale: 1,
        });
      });

      // Master timeline driven by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".tube-pin-wrapper",
          scroller,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Animate each ring toward the camera, then past it
      rings.forEach((ring, i) => {
        const zStart = -200 - i * 150;
        const zEnd = 800; // fly past the camera
        const delay = i * 0.02; // staggered start

        tl.to(
          ring,
          {
            z: zEnd,
            scale: 3.5,
            opacity: 0,
            duration: 1,
            ease: "none",
            onUpdate() {
              const currentZ = gsap.getProperty(ring, "z") as number;
              // Rings far away are dimmer
              if (currentZ < 0) {
                gsap.set(ring, { opacity: gsap.utils.mapRange(-2000, 0, 0.1, 1, currentZ) });
              } else if (currentZ > 400) {
                // Fade out as it passes the camera
                gsap.set(ring, { opacity: gsap.utils.mapRange(400, 800, 1, 0, currentZ) });
              } else {
                gsap.set(ring, { opacity: 1 });
              }
            },
          },
          delay
        );
      });

      // Add a second pass: rings recycle from the back after they pass the camera
      // This creates the continuous tunnel illusion
      rings.forEach((ring, i) => {
        const delay = i * 0.02;
        const recycleStart = delay + 1; // after first pass

        tl.fromTo(
          ring,
          { z: -2000, scale: 0.5, opacity: 0 },
          {
            z: 600,
            scale: 3,
            opacity: 0,
            duration: 1,
            ease: "none",
            onUpdate() {
              const currentZ = gsap.getProperty(ring, "z") as number;
              if (currentZ < -500) {
                gsap.set(ring, { opacity: gsap.utils.clamp(0, 1, gsap.utils.mapRange(-2000, -500, 0, 0.6, currentZ)) });
              } else if (currentZ < 200) {
                gsap.set(ring, { opacity: gsap.utils.clamp(0, 1, gsap.utils.mapRange(-500, 200, 0.6, 1, currentZ)) });
              } else {
                gsap.set(ring, { opacity: gsap.utils.clamp(0, 1, gsap.utils.mapRange(200, 600, 1, 0, currentZ)) });
              }
            },
          },
          recycleStart
        );
      });
    },
    { scope: containerRef, dependencies: [scrollerH] }
  );

  if (!scrollerH) {
    return <div ref={containerRef} className="h-full overflow-y-auto" />;
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Label */}
      <div className="sticky top-0 z-20 px-6 py-3">
        <p className="text-xs font-mono text-zinc-500">
          scroll-3d-tube · scroll-driven tunnel flythrough · perspective + translateZ
        </p>
      </div>

      {/* Top spacer */}
      <div
        className="flex items-center justify-center"
        style={{ height: scrollerH * 0.4 }}
      >
        <p className="text-sm font-mono text-zinc-600 tracking-widest">
          ↓ SCROLL TO FLY THROUGH
        </p>
      </div>

      {/* Pinned wrapper */}
      <div className="tube-pin-wrapper relative" style={{ height: wrapperHeight }}>
        <div
          className="sticky top-0 flex items-center justify-center overflow-hidden"
          style={{ height: scrollerH, perspective: 600 }}
        >
          {/* Tunnel container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: RING_COUNT }).map((_, i) => {
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const size = 120 + i * 10;
              const isCircle = i % 3 === 0;
              const rotation = (i % 2 === 0 ? 0 : 45) + i * 5;

              return (
                <div
                  key={i}
                  className="tube-ring absolute"
                  style={{
                    width: size,
                    height: size,
                    border: `2px solid ${color}`,
                    borderRadius: isCircle ? "50%" : "8px",
                    transform: `translateZ(${-200 - i * 150}px) rotate(${rotation}deg)`,
                    boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}10`,
                    willChange: "transform, opacity",
                  }}
                />
              );
            })}

            {/* Center dot for depth reference */}
            <div
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{ transform: "translateZ(-2000px)" }}
            />
          </div>

          {/* Radial vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, rgb(9 9 11) 80%)",
            }}
          />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-[20vh] flex items-center justify-center">
        <p className="text-xs font-mono text-zinc-600">
          ◆ {RING_COUNT} rings · ScrollTrigger scrub · neon tunnel
        </p>
      </div>
    </div>
  );
}
