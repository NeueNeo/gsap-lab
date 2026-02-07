"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

export function ButtonFeedback({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [successDone, setSuccessDone] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entry animation
  useGSAP(
    () => {
      gsap.from(".btn-demo", {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  // 1. Press Scale
  const handlePressDown = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 0.92,
      duration: 0.1,
      ease: "power2.in",
    });
  });

  const handlePressUp = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.3)",
    });
  });

  // 2. Ripple Effect
  const handleRipple = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className =
      "absolute rounded-full bg-white/30 pointer-events-none";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.transform = "translate(-50%, -50%)";
    btn.appendChild(ripple);

    gsap.to(ripple, {
      width: 200,
      height: 200,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    });
  });

  // 3. Magnetic Pull
  const handleMagneticMove = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    gsap.to(btn, {
      x: dx * 25,
      y: dy * 25,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMagneticLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  });

  // 4. Success Checkmark
  const handleSuccess = contextSafe((e: React.MouseEvent) => {
    if (successDone) return;
    const btn = e.currentTarget as HTMLElement;
    const label = btn.querySelector(".btn-label") as HTMLElement;
    const check = btn.querySelector(".btn-check") as HTMLElement;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(1.5, () => {
          gsap.to(check, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(label, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.2,
          });
          gsap.to(btn, {
            backgroundColor: "",
            duration: 0.3,
            delay: 0.2,
          });
          setSuccessDone(false);
        });
      },
    });

    setSuccessDone(true);

    tl.to(label, { opacity: 0, scale: 0.8, duration: 0.15 })
      .to(btn, { scale: 0.9, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" })
      .fromTo(
        check,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.2"
      );
  });

  // 5. Bounce Jelly
  const handleJelly = contextSafe((e: React.MouseEvent) => {
    const btn = e.currentTarget;
    gsap
      .timeline()
      .to(btn, { scaleX: 1.15, scaleY: 0.85, duration: 0.1 })
      .to(btn, { scaleX: 0.9, scaleY: 1.1, duration: 0.1 })
      .to(btn, { scaleX: 1.05, scaleY: 0.95, duration: 0.1 })
      .to(btn, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
  });

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-10">
        <p className="text-sm font-mono text-zinc-500">
          5 micro-interaction patterns for buttons
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Press Scale */}
          <div className="btn-demo flex flex-col items-center gap-3">
            <button
              onMouseDown={handlePressDown}
              onMouseUp={handlePressUp}
              onMouseLeave={handlePressUp}
              className="px-6 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-medium cursor-pointer transition-none"
            >
              Press Scale
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              scale 0.92 → elastic back
            </span>
          </div>

          {/* 2. Ripple */}
          <div className="btn-demo flex flex-col items-center gap-3">
            <button
              onClick={handleRipple}
              className="relative overflow-hidden px-6 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-medium cursor-pointer transition-none"
            >
              Ripple Effect
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              click position ripple
            </span>
          </div>

          {/* 3. Magnetic Pull */}
          <div className="btn-demo flex flex-col items-center gap-3">
            <button
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="px-6 py-3 rounded-xl bg-violet-400/10 border border-violet-400/30 text-violet-400 font-medium cursor-pointer transition-none"
            >
              Magnetic Pull
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              follows cursor + elastic snap
            </span>
          </div>

          {/* 4. Success Checkmark */}
          <div className="btn-demo flex flex-col items-center gap-3">
            <button
              onClick={handleSuccess}
              className="relative px-6 py-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-medium cursor-pointer transition-none overflow-hidden"
            >
              <span className="btn-label">Submit →</span>
              <span className="btn-check absolute inset-0 flex items-center justify-center text-emerald-400 opacity-0 scale-0">
                ✓
              </span>
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              label → checkmark morph
            </span>
          </div>

          {/* 5. Jelly Bounce */}
          <div className="btn-demo flex flex-col items-center gap-3">
            <button
              onClick={handleJelly}
              className="px-6 py-3 rounded-xl bg-rose-400/10 border border-rose-400/30 text-rose-400 font-medium cursor-pointer transition-none"
            >
              Jelly Bounce
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              squash & stretch sequence
            </span>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-600">
          contextSafe for event-driven animations · elastic & back eases
        </p>
      </div>
    </div>
  );
}
