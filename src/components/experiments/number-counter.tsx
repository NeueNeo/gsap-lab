
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const COUNTERS = [
  { label: "Users", target: 2847593, prefix: "", suffix: "" },
  { label: "Revenue", target: 12450000, prefix: "$", suffix: "" },
  { label: "Uptime", target: 99.99, prefix: "", suffix: "%" },
  { label: "Deploys", target: 847291, prefix: "", suffix: "" },
];

function formatNumber(value: number, isDecimal: boolean): string {
  if (isDecimal) {
    return value.toFixed(2);
  }
  return Math.round(value).toLocaleString("en-US");
}

interface Props {
  onReplay: () => void;
}

export function NumberCounter({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<number[]>(COUNTERS.map(() => 0));

  useGSAP(
    () => {
      COUNTERS.forEach((counter, i) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: counter.target,
          duration: 2.5,
          ease: "power2.out",
          delay: 0.3 + i * 0.15,
          onUpdate: () => {
            setValues((prev) => {
              const next = [...prev];
              next[i] = obj.val;
              return next;
            });
          },
        });
      });

      // Card entry animation
      const cards = containerRef.current?.querySelectorAll(".counter-card");
      if (cards) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
        {COUNTERS.map((counter, i) => {
          const isDecimal = counter.target % 1 !== 0;
          return (
            <div
              key={i}
              className="counter-card rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-8 text-center"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                {counter.label}
              </span>
              <span className="text-4xl font-bold font-mono text-zinc-100 tracking-tight">
                {counter.prefix}
                {formatNumber(values[i], isDecimal)}
                {counter.suffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
