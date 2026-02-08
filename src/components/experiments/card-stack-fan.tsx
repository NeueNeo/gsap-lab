
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
  { id: 1, label: "Spade", number: "A♠", color: "text-emerald-300", bgColor: "bg-emerald-950", borderColor: "border-emerald-700/60" },
  { id: 2, label: "Heart", number: "K♥", color: "text-cyan-300", bgColor: "bg-cyan-950", borderColor: "border-cyan-700/60" },
  { id: 3, label: "Diamond", number: "Q♦", color: "text-violet-300", bgColor: "bg-violet-950", borderColor: "border-violet-700/60" },
  { id: 4, label: "Club", number: "J♣", color: "text-amber-300", bgColor: "bg-amber-950", borderColor: "border-amber-700/60" },
  { id: 5, label: "Joker", number: "★", color: "text-rose-300", bgColor: "bg-rose-950", borderColor: "border-rose-700/60" },
];

export function CardStackFan({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const stack = stackRef.current;
      if (!stack) return;

      const cards = gsap.utils.toArray<HTMLElement>(".fan-card", stack);
      const totalCards = cards.length;
      const midIndex = (totalCards - 1) / 2;

      // Set initial stacked state
      function setStack() {
        cards.forEach((card, i) => {
          gsap.set(card, {
            rotation: (i - midIndex) * 2,
            x: (i - midIndex) * 3,
            y: i * -2,
            scale: 1 - (totalCards - 1 - i) * 0.015,
            zIndex: i,
          });
        });
      }

      // Entry animation
      gsap.from(cards, {
        y: 100,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
        onComplete: setStack,
      });

      // Fan out on hover
      const handleEnter = contextSafe!(() => {
        cards.forEach((card, i) => {
          const angle = (i - midIndex) * 18;
          const xOffset = (i - midIndex) * 55;
          const yOffset = -Math.abs(i - midIndex) * 12;

          gsap.to(card, {
            rotation: angle,
            x: xOffset,
            y: yOffset,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.4)",
            delay: i * 0.05,
            overwrite: "auto",
          });
        });
      });

      // Collapse on leave
      const handleLeave = contextSafe!(() => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            rotation: (i - midIndex) * 2,
            x: (i - midIndex) * 3,
            y: i * -2,
            scale: 1 - (totalCards - 1 - i) * 0.015,
            duration: 0.35,
            ease: "power3.inOut",
            delay: (totalCards - 1 - i) * 0.04,
            overwrite: "auto",
          });
        });
      });

      stack.addEventListener("mouseenter", handleEnter);
      stack.addEventListener("mouseleave", handleLeave);

      return () => {
        stack.removeEventListener("mouseenter", handleEnter);
        stack.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-12">
        <p className="text-xs font-mono text-zinc-500">
          hover to fan · stagger + rotation · arc curve
        </p>

        <div
          ref={stackRef}
          className="relative w-64 h-72 flex items-center justify-center cursor-pointer"
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`fan-card absolute w-36 h-52 rounded-2xl ${card.bgColor} border ${card.borderColor} flex flex-col items-center justify-between p-4 select-none will-change-transform`}
              style={{ transformOrigin: "bottom center" }}
            >
              <div className="w-full flex justify-between items-start">
                <span className={`text-xl font-bold ${card.color}`}>
                  {card.number}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {String(card.id).padStart(2, "0")}
                </span>
              </div>

              <div
                className={`w-12 h-12 rounded-xl border ${card.borderColor} flex items-center justify-center`}
              >
                <span className={`text-2xl ${card.color}`}>
                  {card.number.slice(-1)}
                </span>
              </div>

              <span className={`text-[10px] font-mono ${card.color} tracking-widest uppercase`}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          5 cards · transformOrigin: bottom center · 18° spread · hover interaction
        </p>
      </div>
    </div>
  );
}
