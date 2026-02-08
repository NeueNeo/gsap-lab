import { useRef, useState } from "react";
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
  const [active, setActive] = useState(0);

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

      gsap.from(".preview-card", {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        delay: 0.5,
      });
    },
    { scope: containerRef }
  );

  const handleHover = (idx: number) => {
    if (idx === active) return;
    setActive(idx);

    const card = cardRef.current;
    if (!card) return;

    // Quick crossfade
    gsap.fromTo(
      card,
      { opacity: 0.5, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8 gap-12"
    >
      {/* List */}
      <div className="flex flex-col gap-1 w-64">
        <p className="text-[10px] font-mono text-zinc-600 mb-3 tracking-widest uppercase">
          Hover to preview
        </p>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="preview-list-item group flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: i === active ? "rgba(255,255,255,0.05)" : "transparent" }}
            onMouseEnter={() => handleHover(i)}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: item.gradient }}
            />
            <span
              className="text-base font-medium transition-colors"
              style={{ color: i === active ? "#e4e4e7" : "#a1a1aa" }}
            >
              {item.name}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition-colors">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* Preview card — fixed position, changes on hover */}
      <div
        ref={cardRef}
        className="preview-card rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-zinc-800"
        style={{ width: 280, height: 200 }}
      >
        <div
          className="w-full h-full flex flex-col justify-end p-5 transition-all duration-300"
          style={{ background: ITEMS[active].gradient }}
        >
          <span className="text-xs font-mono text-white/50 mb-1">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-xl font-bold text-white drop-shadow-md">
            {ITEMS[active].name}
          </span>
        </div>
      </div>
    </div>
  );
}
