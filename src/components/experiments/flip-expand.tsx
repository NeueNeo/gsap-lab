"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Flip);

interface Props {
  onReplay: () => void;
}

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Neural Engine",
    subtitle: "AI / ML",
    description:
      "Accelerated machine learning inference on-device. Processes billions of operations per second with efficiency that transforms what's possible.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    icon: "◇",
  },
  {
    id: 2,
    title: "Quantum Core",
    subtitle: "Computing",
    description:
      "Next-generation processing architecture designed for massively parallel workloads. Redefining computational boundaries.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    icon: "◆",
  },
  {
    id: 3,
    title: "Secure Enclave",
    subtitle: "Security",
    description:
      "Hardware-isolated cryptographic engine with dedicated AES hardware. Your keys never leave the secure subsystem.",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10",
    borderColor: "border-violet-400/20",
    icon: "◈",
  },
  {
    id: 4,
    title: "Vision Pro",
    subtitle: "Display",
    description:
      "Micro-OLED technology delivering 23 million pixels across dual displays. HDR brilliance at 5000 nits peak.",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    icon: "◉",
  },
];

export function FlipExpand({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entry animation
  useGSAP(
    () => {
      gsap.from(".flip-card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleCardClick = contextSafe((id: number) => {
    const isCollapsing = expandedId === id;

    // 1. Snapshot current state
    const state = Flip.getState(".flip-card, .flip-detail", {
      props: "opacity",
    });

    // 2. Toggle expansion
    setExpandedId(isCollapsing ? null : id);

    // 3. Animate from snapshot
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, delay: 0.2 }
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, duration: 0.2 }),
      });

      // Animate detail content
      if (!isCollapsing) {
        gsap.from(".detail-content", {
          y: 20,
          opacity: 0,
          duration: 0.4,
          delay: 0.3,
          ease: "power2.out",
        });
      }
    });
  });

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
        <p className="text-sm font-mono text-zinc-500">
          click a card to FLIP-expand · click again to collapse
        </p>

        {expandedId ? (
          /* Expanded view */
          <div className="w-full">
            {CARDS.filter((c) => c.id === expandedId).map((card) => (
              <div
                key={card.id}
                data-flip-id={`card-${card.id}`}
                onClick={() => handleCardClick(card.id)}
                className={`flip-card rounded-2xl ${card.bgColor} border ${card.borderColor} p-8 cursor-pointer w-full`}
              >
                <div className="detail-content flex flex-col gap-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl border ${card.borderColor} flex items-center justify-center`}
                      >
                        <span className={`text-3xl ${card.color}`}>
                          {card.icon}
                        </span>
                      </div>
                      <div>
                        <h2 className={`text-2xl font-bold ${card.color}`}>
                          {card.title}
                        </h2>
                        <p className="text-xs font-mono text-zinc-500">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-600 mt-2">
                      ✕ close
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                    {card.description}
                  </p>

                  <div className="flex gap-3">
                    {["Overview", "Specs", "Benchmark"].map((tab) => (
                      <span
                        key={tab}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg ${card.bgColor} border ${card.borderColor} ${card.color}`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>

                  {/* Fake detail chart */}
                  <div className="flex gap-1 items-end h-16">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${card.bgColor} border ${card.borderColor}`}
                        style={{
                          height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Collapsed siblings */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {CARDS.filter((c) => c.id !== expandedId).map((card) => (
                <div
                  key={card.id}
                  data-flip-id={`card-${card.id}`}
                  onClick={() => handleCardClick(card.id)}
                  className={`flip-card rounded-xl ${card.bgColor} border ${card.borderColor} p-3 cursor-pointer flex items-center gap-2 opacity-50 hover:opacity-80`}
                >
                  <span className={`text-lg ${card.color}`}>{card.icon}</span>
                  <span className={`text-xs font-mono ${card.color}`}>
                    {card.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 gap-4 w-full">
            {CARDS.map((card) => (
              <div
                key={card.id}
                data-flip-id={`card-${card.id}`}
                onClick={() => handleCardClick(card.id)}
                className={`flip-card rounded-2xl ${card.bgColor} border ${card.borderColor} p-6 cursor-pointer hover:bg-opacity-20 transition-none`}
              >
                <div className="flex flex-col gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl border ${card.borderColor} flex items-center justify-center`}
                  >
                    <span className={`text-xl ${card.color}`}>{card.icon}</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${card.color}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs font-mono text-zinc-600">
          Flip.getState → DOM change → Flip.from · seamless layout transition
        </p>
      </div>
    </div>
  );
}
