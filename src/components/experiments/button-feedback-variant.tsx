import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Variant = "press-scale" | "ripple" | "magnetic-pull" | "success-check" | "jelly-bounce";

interface Props {
  onReplay: () => void;
  variant: Variant;
}

const LABELS: Record<Variant, { label: string; detail: string; color: string; border: string; bg: string }> = {
  "press-scale": { label: "Press Scale", detail: "scale 0.92 → elastic back", color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10" },
  ripple: { label: "Ripple Effect", detail: "click position ripple", color: "text-cyan-400", border: "border-cyan-400/30", bg: "bg-cyan-400/10" },
  "magnetic-pull": { label: "Magnetic Pull", detail: "follows cursor + elastic snap", color: "text-violet-400", border: "border-violet-400/30", bg: "bg-violet-400/10" },
  "success-check": { label: "Submit →", detail: "label → checkmark morph", color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/10" },
  "jelly-bounce": { label: "Jelly Bounce", detail: "squash & stretch sequence", color: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/10" },
};

function PressScale({ config }: { config: typeof LABELS["press-scale"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleDown = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 0.92, duration: 0.1, ease: "power2.in" });
  });
  const handleUp = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
  });

  return (
    <div ref={ref}>
      <button
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        className={`px-10 py-5 rounded-2xl ${config.bg} border ${config.border} ${config.color} text-2xl font-medium cursor-pointer transition-none`}
      >
        Press Me
      </button>
    </div>
  );
}

function Ripple({ config }: { config: typeof LABELS["ripple"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleClick = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "absolute rounded-full bg-white/30 pointer-events-none";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.transform = "translate(-50%, -50%)";
    btn.appendChild(ripple);
    gsap.to(ripple, { width: 300, height: 300, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => ripple.remove() });
  });

  return (
    <div ref={ref}>
      <button
        onClick={handleClick}
        className={`relative overflow-hidden px-10 py-5 rounded-2xl ${config.bg} border ${config.border} ${config.color} text-2xl font-medium cursor-pointer transition-none`}
      >
        Click Me
      </button>
    </div>
  );
}

function MagneticPull({ config }: { config: typeof LABELS["magnetic-pull"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleMove = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    gsap.to(btn, { x: dx * 30, y: dy * 30, duration: 0.3, ease: "power2.out" });
  });
  const handleLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  });

  return (
    <div ref={ref}>
      <button
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`px-10 py-5 rounded-2xl ${config.bg} border ${config.border} ${config.color} text-2xl font-medium cursor-pointer transition-none`}
      >
        Hover Me
      </button>
    </div>
  );
}

function SuccessCheck({ config }: { config: typeof LABELS["success-check"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleClick = contextSafe((e: React.MouseEvent) => {
    if (done) return;
    const btn = e.currentTarget as HTMLElement;
    const label = btn.querySelector(".btn-label") as HTMLElement;
    const check = btn.querySelector(".btn-check") as HTMLElement;
    setDone(true);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(1.5, () => {
          gsap.to(check, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, delay: 0.2 });
          setDone(false);
        });
      },
    });
    tl.to(label, { opacity: 0, scale: 0.8, duration: 0.15 })
      .to(btn, { scale: 0.9, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" })
      .fromTo(check, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.2");
  });

  return (
    <div ref={ref}>
      <button
        onClick={handleClick}
        className={`relative px-10 py-5 rounded-2xl ${config.bg} border ${config.border} ${config.color} text-2xl font-medium cursor-pointer transition-none overflow-hidden`}
      >
        <span className="btn-label">Submit →</span>
        <span className="btn-check absolute inset-0 flex items-center justify-center text-emerald-400 opacity-0 scale-0 text-3xl">✓</span>
      </button>
    </div>
  );
}

function JellyBounce({ config }: { config: typeof LABELS["jelly-bounce"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleClick = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget;
    gsap.timeline()
      .to(btn, { scaleX: 1.15, scaleY: 0.85, duration: 0.1 })
      .to(btn, { scaleX: 0.9, scaleY: 1.1, duration: 0.1 })
      .to(btn, { scaleX: 1.05, scaleY: 0.95, duration: 0.1 })
      .to(btn, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
  });

  return (
    <div ref={ref}>
      <button
        onClick={handleClick}
        className={`px-10 py-5 rounded-2xl ${config.bg} border ${config.border} ${config.color} text-2xl font-medium cursor-pointer transition-none`}
      >
        Bounce Me
      </button>
    </div>
  );
}

const COMPONENTS: Record<Variant, React.ComponentType<{ config: typeof LABELS["press-scale"] }>> = {
  "press-scale": PressScale,
  ripple: Ripple,
  "magnetic-pull": MagneticPull,
  "success-check": SuccessCheck,
  "jelly-bounce": JellyBounce,
};

export function ButtonFeedbackVariant({ onReplay, variant }: Props) {
  void onReplay;
  const config = LABELS[variant];
  const Component = COMPONENTS[variant];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 gap-6">
      <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
        Button Feedback · {config.label}
      </p>
      <p className="text-[10px] font-mono text-zinc-600 mb-4">{config.detail}</p>
      <Component config={config} />
    </div>
  );
}
