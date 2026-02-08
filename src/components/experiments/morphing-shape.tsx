
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const N = 40; // divisible by 10 (star edges) and 4 (square sides)

// Distribute N points evenly along the edges of a polygon defined by keyPoints
function subdivide(keyPoints: number[][]): number[][] {
  const total = keyPoints.length;
  const perEdge = N / total; // must divide evenly
  const result: number[][] = [];

  for (let e = 0; e < total; e++) {
    const [x1, y1] = keyPoints[e];
    const [x2, y2] = keyPoints[(e + 1) % total];
    for (let i = 0; i < perEdge; i++) {
      const t = i / perEdge;
      result.push([
        Math.round((x1 + (x2 - x1) * t) * 10) / 10,
        Math.round((y1 + (y2 - y1) * t) * 10) / 10,
      ]);
    }
  }

  return result;
}

// Circle — N points on a true circle
function makeCircle(): number[][] {
  return Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [
      Math.round((50 + 48 * Math.cos(angle)) * 10) / 10,
      Math.round((50 + 48 * Math.sin(angle)) * 10) / 10,
    ];
  });
}

// Star — 5 outer, 5 inner key points, subdivided to N
function makeStar(): number[][] {
  const outerR = 48, innerR = 19;
  const keyPoints: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    keyPoints.push([
      Math.round((50 + r * Math.cos(angle)) * 10) / 10,
      Math.round((50 + r * Math.sin(angle)) * 10) / 10,
    ]);
  }
  return subdivide(keyPoints);
}

// Square — 4 corners, subdivided to N
function makeSquare(): number[][] {
  const keyPoints: number[][] = [[5, 5], [95, 5], [95, 95], [5, 95]];
  return subdivide(keyPoints);
}

// Blob — gentle variation on circle
function makeBlob(): number[][] {
  return Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    // Smooth radius variation using sin waves
    const r = 42 + 6 * Math.sin(angle * 3) + 4 * Math.cos(angle * 2 + 1);
    return [
      Math.round((50 + r * Math.cos(angle)) * 10) / 10,
      Math.round((50 + r * Math.sin(angle)) * 10) / 10,
    ];
  });
}

const SHAPES = [makeCircle(), makeStar(), makeSquare(), makeBlob()];
const LABELS = ["Circle", "Star", "Square", "Blob"];

interface Props {
  onReplay: () => void;
}

export function MorphingShape({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shape = shapeRef.current;
      const labelContainer = labelRef.current;
      if (!shape || !labelContainer) return;

      const labels = gsap.utils.toArray<HTMLElement>(".shape-label", labelContainer);

      const points: { x: number; y: number }[] = SHAPES[0].map(([x, y]) => ({ x, y }));

      function buildClipPath() {
        return `polygon(${points.map((p) => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(", ")})`;
      }

      function applyClip() {
        shape!.style.clipPath = buildClipPath();
      }

      gsap.set(shape, { clipPath: buildClipPath(), scale: 0 });

      function setActiveLabel(index: number) {
        labels.forEach((label, i) => {
          gsap.to(label, {
            color: i === index ? "#34d399" : "#52525b",
            borderColor: i === index ? "rgba(52,211,153,0.4)" : "rgba(63,63,70,0.5)",
            duration: 0.3,
          });
        });
      }

      setActiveLabel(0);
      let currentShape = 0;

      function morphToNext() {
        currentShape = (currentShape + 1) % SHAPES.length;
        const target = SHAPES[currentShape];

        setActiveLabel(currentShape);

        const proxy = { t: 0 };
        const startPoints = points.map((p) => ({ x: p.x, y: p.y }));

        gsap.to(proxy, {
          t: 1,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            for (let i = 0; i < N; i++) {
              points[i].x = startPoints[i].x + (target[i][0] - startPoints[i].x) * proxy.t;
              points[i].y = startPoints[i].y + (target[i][1] - startPoints[i].y) * proxy.t;
            }
            applyClip();
          },
        });

        gsap.to(shape, {
          rotation: `+=${45}`,
          duration: 1.2,
          ease: "power2.inOut",
        });

        gsap.delayedCall(2.2, morphToNext);
      }

      gsap.to(shape, {
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3,
        onComplete: () => {
          gsap.delayedCall(0.8, morphToNext);
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-xs font-mono text-zinc-500">
          clip-path polygon · {N}-point morphing · rotation
        </p>

        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full" />

          <div
            ref={shapeRef}
            className="w-56 h-56 bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-80"
            style={{ clipPath: `polygon(${SHAPES[0].map(([x, y]) => `${x}% ${y}%`).join(", ")})` }}
          />
        </div>

        <div ref={labelRef} className="flex gap-4">
          {LABELS.map((name, i) => (
            <span
              key={i}
              className="shape-label text-xs font-mono px-2 py-1 rounded bg-zinc-900 border"
              style={{
                color: i === 0 ? "#34d399" : "#52525b",
                borderColor: i === 0 ? "rgba(52,211,153,0.4)" : "rgba(63,63,70,0.5)",
              }}
            >
              {name}
            </span>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          {N} points · proxy tween · power2.inOut · 1.2s morph
        </p>
      </div>
    </div>
  );
}
