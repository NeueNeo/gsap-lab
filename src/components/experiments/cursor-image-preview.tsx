
import { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

const ITEMS = [
  { name: "Aurora Borealis", gradient: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { name: "Sunset Coast", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { name: "Deep Nebula", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { name: "Ocean Floor", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { name: "Emerald Forest", gradient: "linear-gradient(135deg, #22c55e, #14b8a6)" },
];

export function CursorImagePreview({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardNameRef = useRef<HTMLSpanElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const [activeGradient, setActiveGradient] = useState(ITEMS[0].gradient);

  useGSAP(
    () => {
      gsap.from(".preview-list-item", {
        x: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3,
      });

      const card = cardRef.current;
      if (!card) return;

      quickX.current = gsap.quickTo(card, "x", { duration: 0.4, ease: "power3" });
      quickY.current = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3" });
    },
    { scope: containerRef }
  );

  const handleItemEnter = useCallback((item: typeof ITEMS[0]) => {
    setActiveGradient(item.gradient);
    if (cardNameRef.current) cardNameRef.current.textContent = item.name;
    gsap.to(cardRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleItemLeave = useCallback(() => {
    gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left + 20;
    const y = e.clientY - rect.top + 20;

    quickX.current?.(x);
    quickY.current?.(y);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-6"
      onMouseMove={handleMouseMove}
    >
      <p className="text-xs font-mono text-zinc-500">
        gsap.quickTo() · cursor-following preview card · mouseenter / mouseleave per item
      </p>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col gap-1">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="preview-list-item group flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-zinc-800/50"
              onMouseEnter={() => handleItemEnter(item)}
              onMouseLeave={handleItemLeave}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: item.gradient }}
              />
              <span className="text-base font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                {item.name}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        {/* Floating preview card */}
        <div
          ref={cardRef}
          className="absolute top-0 left-0 pointer-events-none will-change-transform z-10"
          style={{ opacity: 0, transform: "scale(0.9)" }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-2xl shadow-black/50"
            style={{ width: 200, height: 150 }}
          >
            <div
              className="w-full h-full flex items-end p-3"
              style={{ background: activeGradient }}
            >
              <span
                ref={cardNameRef}
                className="text-sm font-semibold text-white/90 drop-shadow-md"
              >
                {ITEMS[0].name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-600">
        hover list items · preview follows cursor with 20px offset · quickTo smooth tracking
      </p>
    </div>
  );
}
