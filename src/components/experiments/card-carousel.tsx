import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const CARDS = [
  { title: "Kinetic", subtitle: "Motion system", accent: "#34d399", icon: "◆" },
  { title: "Elastic", subtitle: "Spring physics", accent: "#22d3ee", icon: "●" },
  { title: "Orbital", subtitle: "Path animation", accent: "#a78bfa", icon: "✦" },
  { title: "Fluid", subtitle: "Organic flow", accent: "#fbbf24", icon: "◈" },
];

export function CardCarousel({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isAnimating = useRef(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const goTo = contextSafe((index: number, dir?: number) => {
    if (isAnimating.current) return;
    if (index === active) return;
    isAnimating.current = true;

    const container = containerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray<HTMLElement>(".cc-card", container);
    const direction = dir ?? (index > active ? 1 : -1);

    // Outgoing card
    gsap.to(cards[active], {
      x: -direction * 400,
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: "power2.in",
    });

    // Set incoming card to starting position
    gsap.set(cards[index], { x: direction * 400, opacity: 0, scale: 0.85 });

    // Animate incoming card to center
    gsap.to(cards[index], {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.15,
      onComplete: () => {
        isAnimating.current = false;
        setActive(index);
      },
    });
  });

  // Initialize: hide all cards except active
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const cards = gsap.utils.toArray<HTMLElement>(".cc-card", container);
      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: i === active ? 1 : 0,
          scale: i === active ? 1 : 0.85,
          x: 0,
        });
      });
    },
    { scope: containerRef, dependencies: [active] }
  );

  const prev = () => goTo((active - 1 + CARDS.length) % CARDS.length, -1);
  const next = () => goTo((active + 1) % CARDS.length, 1);

  return (
    <div ref={containerRef} className="h-full bg-zinc-950 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Card Carousel
        </p>
        <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">
          Centered Carousel
        </h2>
      </div>

      <div className="flex items-center gap-8">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shrink-0"
        >
          ←
        </button>

        {/* Card area */}
        <div className="relative w-[360px] h-[320px]">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="cc-card absolute inset-0 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-8 flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${card.accent}15`, border: `1px solid ${card.accent}30` }}
                >
                  <span className="text-2xl" style={{ color: card.accent }}>{card.icon}</span>
                </div>
                <span
                  className="text-xs font-mono tracking-widest uppercase"
                  style={{ color: card.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-3xl font-bold text-zinc-100 mt-1">{card.title}</h3>
                <p className="text-sm font-mono text-zinc-500 mt-2">{card.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.accent }} />
                <div className="flex-1 h-1 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full opacity-50"
                    style={{ backgroundColor: card.accent, width: `${50 + i * 15}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shrink-0"
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {CARDS.map((card, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-2 h-2 rounded-full transition-colors"
            style={{ backgroundColor: i === active ? card.accent : "#3f3f46" }}
          />
        ))}
      </div>

      <p className="text-xs font-mono text-zinc-700 mt-8">
        {CARDS.length} cards · arrow navigation · dot indicators
      </p>
    </div>
  );
}
