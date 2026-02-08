
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

interface StatConfig {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  decimals: number;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
}

const STATS: StatConfig[] = [
  {
    label: "Active Users",
    value: 10247,
    suffix: "+",
    prefix: "",
    decimals: 0,
    color: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
    description: "developers worldwide",
  },
  {
    label: "Downloads",
    value: 524800,
    suffix: "+",
    prefix: "",
    decimals: 0,
    color: "text-cyan-400",
    borderColor: "border-cyan-400/20",
    bgColor: "bg-cyan-400/5",
    description: "total package installs",
  },
  {
    label: "Uptime",
    value: 99.97,
    suffix: "%",
    prefix: "",
    decimals: 2,
    color: "text-violet-400",
    borderColor: "border-violet-400/20",
    bgColor: "bg-violet-400/5",
    description: "system reliability",
  },
  {
    label: "Revenue",
    value: 2.4,
    suffix: "M",
    prefix: "$",
    decimals: 1,
    color: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-400/5",
    description: "annual recurring",
  },
  {
    label: "Countries",
    value: 142,
    suffix: "",
    prefix: "",
    decimals: 0,
    color: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
    description: "global reach",
  },
  {
    label: "Latency",
    value: 12,
    suffix: "ms",
    prefix: "<",
    decimals: 0,
    color: "text-cyan-400",
    borderColor: "border-cyan-400/20",
    bgColor: "bg-cyan-400/5",
    description: "p99 response time",
  },
];

function formatNumber(value: number, decimals: number): string {
  if (value >= 1000 && decimals === 0) {
    return value.toLocaleString("en-US");
  }
  return value.toFixed(decimals);
}

export function CounterScroll({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      // Animate each stat card
      const statCards = scroller.querySelectorAll(".stat-card");
      statCards.forEach((card, i) => {
        // Card entrance
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            scroller,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        });

        // Counter animation
        const valueEl = card.querySelector(".stat-value") as HTMLElement;
        const barEl = card.querySelector(".stat-bar-fill") as HTMLElement;
        if (!valueEl) return;

        const targetValue = parseFloat(valueEl.dataset.value || "0");
        const decimals = parseInt(valueEl.dataset.decimals || "0");
        const prefix = valueEl.dataset.prefix || "";
        const suffix = valueEl.dataset.suffix || "";
        const proxy = { value: 0 };

        gsap.to(proxy, {
          value: targetValue,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15,
          onUpdate: () => {
            valueEl.textContent = `${prefix}${formatNumber(proxy.value, decimals)}${suffix}`;
          },
        });

        // Progress bar fill
        if (barEl) {
          gsap.from(barEl, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.15 + 0.3,
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="py-20 px-4">
        {/* Spacer to enable scroll */}
        <div className="h-[70vh] flex items-center justify-center">
          <p className="text-sm font-mono text-zinc-500 tracking-widest">
            ↓ SCROLL TO COUNT UP
          </p>
        </div>

        {/* Stats section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-100">
              By the Numbers
            </h2>
            <p className="text-sm font-mono text-zinc-500 mt-2">
              counters trigger on scroll into view
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`stat-card rounded-xl ${stat.bgColor} border ${stat.borderColor} p-6 flex flex-col gap-3`}
              >
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                  {stat.label}
                </span>

                <span
                  className={`stat-value text-3xl font-bold ${stat.color} tabular-nums`}
                  data-value={stat.value}
                  data-decimals={stat.decimals}
                  data-prefix={stat.prefix}
                  data-suffix={stat.suffix}
                >
                  {stat.prefix}0{stat.suffix}
                </span>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`stat-bar-fill h-full rounded-full ${stat.bgColor.replace("/5", "")} opacity-60`}
                    style={{ width: "100%" }}
                  />
                </div>

                <span className="text-[10px] font-mono text-zinc-600">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-xs font-mono text-zinc-600">
            ScrollTrigger · staggered counter start · proxy object animation
          </p>
        </div>
      </div>
    </div>
  );
}
