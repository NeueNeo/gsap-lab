
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const links = [
  {
    label: "Creative Direction",
    color: "#34d399", // emerald-400
    path: "M0,8 Q15,2 30,9 Q50,16 70,6 Q90,0 110,8 Q130,15 150,7 Q170,1 190,9 Q210,14 230,8",
  },
  {
    label: "Motion Design",
    color: "#22d3ee", // cyan-400
    path: "M0,7 Q20,14 35,5 Q55,0 75,10 Q95,16 115,6 Q135,1 155,10 Q175,15 195,7",
  },
  {
    label: "Interaction Lab",
    color: "#a78bfa", // violet-400
    path: "M0,9 Q18,1 40,10 Q58,17 78,5 Q98,0 118,11 Q138,16 158,6 Q178,1 198,9",
  },
  {
    label: "Type Systems",
    color: "#fbbf24", // amber-400
    path: "M0,6 Q22,14 42,4 Q62,0 82,12 Q102,16 122,5 Q142,0 162,8",
  },
];

function ScribbleLink({
  label,
  color,
  pathData,
  contextSafe,
}: {
  label: string;
  color: string;
  pathData: string;
  contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const onEnter = useCallback(
    contextSafe(() => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();

      if (tweenRef.current) tweenRef.current.kill();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      tweenRef.current = gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }),
    [contextSafe]
  );

  const onLeave = useCallback(
    contextSafe(() => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();

      if (tweenRef.current) tweenRef.current.kill();

      tweenRef.current = gsap.to(path, {
        strokeDashoffset: -length,
        duration: 0.4,
        ease: "power2.in",
      });
    }),
    [contextSafe]
  );

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="scribble-link relative inline-block cursor-pointer group"
    >
      <span
        className="text-3xl md:text-4xl font-bold tracking-tight transition-opacity duration-200"
        style={{ color }}
      >
        {label}
      </span>
      <svg
        className="absolute -bottom-2 left-0 w-full overflow-visible"
        viewBox="0 0 240 18"
        preserveAspectRatio="none"
        fill="none"
        style={{ height: 12 }}
      >
        <path
          ref={pathRef}
          d={pathData}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
        />
      </svg>
    </a>
  );
}

export function DrawSvgScribbleUnderline({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(
    () => {
      gsap.from(".scribble-link", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-xs font-mono text-zinc-500">
          strokeDasharray / strokeDashoffset · hand-drawn SVG paths · hover to
          draw
        </p>

        <nav className="flex flex-col gap-7">
          {links.map((link, i) => (
            <ScribbleLink
              key={i}
              label={link.label}
              color={link.color}
              pathData={link.path}
              contextSafe={contextSafe}
            />
          ))}
        </nav>

        <p className="text-[10px] font-mono text-zinc-600 mt-2">
          simulated DrawSVG via dash offset · staggered entrance · wavy Q-curve
          paths
        </p>
      </div>
    </div>
  );
}
