
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STACK_A = [
  { title: "React", bg: "bg-cyan-600", text: "text-white" },
  { title: "Vue", bg: "bg-emerald-600", text: "text-white" },
  { title: "Svelte", bg: "bg-orange-600", text: "text-white" },
  { title: "Angular", bg: "bg-red-600", text: "text-white" },
  { title: "Solid", bg: "bg-blue-600", text: "text-white" },
];

const STACK_B = [
  { title: "Figma", bg: "bg-zinc-100", text: "text-zinc-900", accent: "border-violet-500" },
  { title: "Sketch", bg: "bg-zinc-100", text: "text-zinc-900", accent: "border-amber-500" },
  { title: "Framer", bg: "bg-zinc-100", text: "text-zinc-900", accent: "border-cyan-500" },
  { title: "Webflow", bg: "bg-zinc-100", text: "text-zinc-900", accent: "border-blue-500" },
  { title: "Spline", bg: "bg-zinc-100", text: "text-zinc-900", accent: "border-emerald-500" },
];

interface Props {
  onReplay: () => void;
}

function useDragStack(containerRef: React.RefObject<HTMLDivElement | null>, selector: string) {
  return () => {
    const container = containerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray<HTMLElement>(selector, container);

    cards.forEach((card, i) => {
      gsap.set(card, {
        rotation: (i - 2) * 5,
        y: i * -4,
        scale: 1 - i * 0.02,
      });
    });

    gsap.from(cards, {
      opacity: 0,
      y: 100,
      rotation: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.3,
    });

    cards.forEach((el) => {
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        startX = e.clientX - (gsap.getProperty(el, "x") as number);
        startY = e.clientY - (gsap.getProperty(el, "y") as number);
        el.setPointerCapture(e.pointerId);
        gsap.to(el, { scale: 1.05, zIndex: 100, duration: 0.2 });
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        gsap.set(el, { x, y, rotation: x * 0.05 });
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        el.releasePointerCapture(e.pointerId);

        const x = gsap.getProperty(el, "x") as number;
        if (Math.abs(x) > 150) {
          gsap.to(el, {
            x: x > 0 ? 800 : -800,
            y: -200,
            rotation: x > 0 ? 45 : -45,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        } else {
          const idx = cards.indexOf(el);
          gsap.to(el, {
            x: 0,
            y: idx * -4,
            rotation: (idx - 2) * 5,
            scale: 1 - idx * 0.02,
            zIndex: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        }
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
    });
  };
}

export function DraggableCards({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  const initA = useDragStack(containerRef, ".stack-a .drag-card");
  const initB = useDragStack(containerRef, ".stack-b .drag-card");

  useGSAP(
    () => {
      initA();
      initB();
    },
    { scope: containerRef }
  );

  const resetStack = useCallback((selector: string) => {
    const cards = containerRef.current?.querySelectorAll(selector);
    if (!cards) return;
    cards.forEach((card, i) => {
      gsap.to(card, {
        x: 0,
        y: i * -4,
        rotation: (i - 2) * 5,
        scale: 1 - i * 0.02,
        opacity: 1,
        zIndex: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        delay: i * 0.05,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8 gap-8"
    >
      <p className="text-sm font-mono text-zinc-500">
        Drag cards to throw them · Soft throw snaps back
      </p>

      <div className="flex gap-24 items-center">
        {/* Stack A — Solid colored */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
            Solid
          </p>
          <div className="stack-a relative w-64 h-40">
            {STACK_A.map((card, i) => (
              <div
                key={i}
                className={`drag-card absolute inset-0 rounded-2xl ${card.bg} shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none`}
              >
                <span className={`text-2xl font-bold ${card.text} pointer-events-none`}>
                  {card.title}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => resetStack(".stack-a .drag-card")}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Stack B — Light cards with colored left border */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
            Bordered
          </p>
          <div className="stack-b relative w-64 h-40">
            {STACK_B.map((card, i) => (
              <div
                key={i}
                className={`drag-card absolute inset-0 rounded-2xl ${card.bg} border-l-4 ${card.accent} shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none`}
              >
                <span className={`text-2xl font-bold ${card.text} pointer-events-none`}>
                  {card.title}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => resetStack(".stack-b .drag-card")}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
