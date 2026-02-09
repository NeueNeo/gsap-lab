
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINES = [
  "The art of animation",
  "lies in the details",
  "that nobody notices",
];

interface Props {
  onReplay: () => void;
}

function TextBlock() {
  return (
    <div className="space-y-3">
      {LINES.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <div className="flex flex-wrap">
            {line.split("").map((char, ci) => (
              <span
                key={`${li}-${ci}`}
                className="char inline-block text-3xl sm:text-2xl md:text-3xl lg:text-3xl font-bold tracking-tight text-zinc-100"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WordBlock() {
  return (
    <div className="space-y-3">
      {LINES.map((line, li) => (
        <div key={li} className="flex flex-wrap gap-x-2">
          {line.split(" ").map((word, wi) => (
            <span
              key={`${li}-${wi}`}
              className="word inline-block text-3xl sm:text-2xl md:text-3xl lg:text-3xl font-bold tracking-tight text-zinc-100"
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const VARIANTS = [
  { id: "slide-up", label: "Slide Up", component: TextBlock },
  { id: "scale-pop", label: "Scale Pop", component: TextBlock },
  { id: "blur-in", label: "Blur In", component: TextBlock },
  { id: "slide-right", label: "Slide Right", component: TextBlock },
  { id: "flip-in", label: "Flip In", component: TextBlock },
  { id: "word-scale", label: "Word Scale", component: WordBlock },
] as const;

export function CharacterReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Slide Up
      const slideUp = container.querySelectorAll('[data-variant="slide-up"] .char');
      gsap.fromTo(
        slideUp,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: "power3.out", delay: 0.3 }
      );

      // Scale Pop
      const scalePop = container.querySelectorAll('[data-variant="scale-pop"] .char');
      scalePop.forEach((char) => {
        gsap.set(char, { scale: 0, opacity: 0, rotation: gsap.utils.random(-25, 25) });
      });
      gsap.to(scalePop, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Blur In
      const blurIn = container.querySelectorAll('[data-variant="blur-in"] .char');
      gsap.fromTo(
        blurIn,
        { opacity: 0, filter: "blur(12px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: { amount: 1.2, from: "start" },
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Slide Right
      const slideRight = container.querySelectorAll('[data-variant="slide-right"] .char');
      gsap.fromTo(
        slideRight,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out", delay: 0.3 }
      );

      // Flip In
      const flipIn = container.querySelectorAll('[data-variant="flip-in"] .char');
      gsap.fromTo(
        flipIn,
        { rotationX: -90, opacity: 0, transformPerspective: 600 },
        { rotationX: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: "power3.out", delay: 0.3 }
      );

      // Word Scale
      const wordScale = container.querySelectorAll('[data-variant="word-scale"] .word');
      gsap.fromTo(
        wordScale,
        { scale: 0.6 },
        { scale: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        wordScale,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power1.out", delay: 0.3 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-full p-4 sm:p-6 lg:p-8 gap-8 overflow-y-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 w-full max-w-6xl">
        {VARIANTS.map(({ id, label, component: Block }) => (
          <div key={id} data-variant={id} className="min-w-0">
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-4">
              {label}
            </p>
            <Block />
          </div>
        ))}
      </div>
    </div>
  );
}
