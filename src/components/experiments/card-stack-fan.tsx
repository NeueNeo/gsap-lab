"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

interface CardData {
  id: number;
  label: string;
  number: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CARDS: CardData[] = [
  { id: 1, label: "Spade", number: "A♠", color: "text-emerald-400", bgColor: "bg-emerald-500/15", borderColor: "border-emerald-500/30" },
  { id: 2, label: "Heart", number: "K♥", color: "text-cyan-400", bgColor: "bg-cyan-500/15", borderColor: "border-cyan-500/30" },
  { id: 3, label: "Diamond", number: "Q♦", color: "text-violet-400", bgColor: "bg-violet-500/15", borderColor: "border-violet-500/30" },
  { id: 4, label: "Club", number: "J♣", color: "text-amber-400", bgColor: "bg-amber-500/15", borderColor: "border-amber-500/30" },
  { id: 5, label: "Joker", number: "★", color: "text-rose-400", bgColor: "bg-rose-500/15", borderColor: "border-rose-500/30" },
];

export function CardStackFan({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".fan-card", containerRef.current!);
      const totalCards = cards.length;
      const midIndex = (totalCards - 1) / 2;

      // Initial stack state: slight rotation offsets visible at edges
      const setStack = () => {
        cards.forEach((card, i) => {
          gsap.set(card, {
            rotation: (i - midIndex) * 2,
            x: (i - midIndex) * 3,
            y: i * -2,
            scale: 1 - (totalCards - 1 - i) * 0.015,
            zIndex: i,
            transformOrigin: "bottom center",
          });
        });
      };

      // Fan out state: arc like a hand of cards
      const fanOut = () => {
        const tl = gsap.timeline();

        cards.forEach((card, i) => {
          const angle = (i - midIndex) * 18; // spread angle
          const xOffset = (i - midIndex) * 55; // horizontal spread
          const yOffset = -Math.abs(i - midIndex) * 12; // arc curve (higher at edges)

          tl.to(
            card,
            {
              rotation: angle,
              x: xOffset,
              y: yOffset,
              scale: 1,
              zIndex: i,
              duration: 0.5,
              ease: "back.out(1.4)",
            },
            i * 0.08
          );
        });

        return tl;
      };

      // Collapse back to stack
      const collapse = () => {
        const tl = gsap.timeline();

        // Reverse order for collapse (outer cards first)
        const reversedCards = [...cards].reverse();
        reversedCards.forEach((card, i) => {
          const origIndex = totalCards - 1 - i;
          tl.to(
            card,
            {
              rotation: (origIndex - midIndex) * 2,
              x: (origIndex - midIndex) * 3,
              y: origIndex * -2,
              scale: 1 - (totalCards - 1 - origIndex) * 0.015,
              duration: 0.4,
              ease: "power3.inOut",
            },
            i * 0.06
          );
        });

        return tl;
      };

      // Entry animation
      gsap.from(cards, {
        y: 100,
        opacity: 0,
        rotation: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          setStack();

          // Main loop: fan out → hold → collapse → hold → repeat
          const mainLoop = () => {
            const master = gsap.timeline({
              onComplete: () => {
                setTimeout(mainLoop, 1200);
              },
            });

            master
              .add(fanOut(), "+=0.6")
              .add(collapse(), "+=1.5");
          };

          setTimeout(mainLoop, 800);
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-12">
        <p className="text-xs font-mono text-zinc-500">
          stacked cards · fan out arc · stagger + rotation · auto-loop
        </p>

        {/* Card stack container */}
        <div className="relative w-48 h-72 flex items-center justify-center">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`fan-card absolute w-36 h-52 rounded-2xl ${card.bgColor} border ${card.borderColor} flex flex-col items-center justify-between p-4 select-none will-change-transform`}
              style={{ transformOrigin: "bottom center" }}
            >
              {/* Top corner */}
              <div className="w-full flex justify-between items-start">
                <span className={`text-xl font-bold ${card.color}`}>
                  {card.number}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  {String(card.id).padStart(2, "0")}
                </span>
              </div>

              {/* Center symbol */}
              <div
                className={`w-12 h-12 rounded-xl border ${card.borderColor} flex items-center justify-center`}
              >
                <span className={`text-2xl ${card.color}`}>
                  {card.number.slice(-1)}
                </span>
              </div>

              {/* Bottom label */}
              <span className={`text-[10px] font-mono ${card.color} tracking-widest uppercase`}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          5 cards · transformOrigin: bottom center · 18° spread · arc curve
        </p>
      </div>
    </div>
  );
}
