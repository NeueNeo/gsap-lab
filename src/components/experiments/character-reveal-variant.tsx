import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINES = [
  "The art of animation",
  "lies in the details",
  "that nobody notices",
];

type Variant = "slide-up" | "scale-pop" | "blur-in" | "slide-right" | "flip-in" | "word-scale";

interface Props {
  onReplay: () => void;
  variant: Variant;
}

const VARIANT_LABELS: Record<Variant, string> = {
  "slide-up": "Slide Up",
  "scale-pop": "Scale Pop",
  "blur-in": "Blur In",
  "slide-right": "Slide Right",
  "flip-in": "Flip In",
  "word-scale": "Word Scale",
};

function TextBlock() {
  return (
    <div className="space-y-4">
      {LINES.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <div className="flex flex-wrap">
            {line.split("").map((char, ci) => (
              <span
                key={`${li}-${ci}`}
                className="char inline-block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-100"
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
    <div className="space-y-4">
      {LINES.map((line, li) => (
        <div key={li} className="flex flex-wrap gap-x-3">
          {line.split(" ").map((word, wi) => (
            <span
              key={`${li}-${wi}`}
              className="word inline-block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-100"
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function animateSlideUp(container: HTMLElement) {
  const chars = container.querySelectorAll(".char");
  gsap.fromTo(
    chars,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: "power3.out", delay: 0.3 }
  );
}

function animateScalePop(container: HTMLElement) {
  const chars = container.querySelectorAll(".char");
  chars.forEach((char) => {
    gsap.set(char, { scale: 0, opacity: 0, rotation: gsap.utils.random(-25, 25) });
  });
  gsap.to(chars, {
    scale: 1,
    opacity: 1,
    rotation: 0,
    duration: 0.5,
    stagger: 0.03,
    ease: "back.out(1.7)",
    delay: 0.3,
  });
}

function animateBlurIn(container: HTMLElement) {
  const chars = container.querySelectorAll(".char");
  gsap.fromTo(
    chars,
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
}

function animateSlideRight(container: HTMLElement) {
  const chars = container.querySelectorAll(".char");
  gsap.fromTo(
    chars,
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out", delay: 0.3 }
  );
}

function animateFlipIn(container: HTMLElement) {
  const chars = container.querySelectorAll(".char");
  gsap.fromTo(
    chars,
    { rotationX: -90, opacity: 0, transformPerspective: 600 },
    { rotationX: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: "power3.out", delay: 0.3 }
  );
}

function animateWordScale(container: HTMLElement) {
  const words = container.querySelectorAll(".word");
  gsap.fromTo(words, { scale: 0.6 }, { scale: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 });
  gsap.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power1.out", delay: 0.3 });
}

const ANIMATORS: Record<Variant, (container: HTMLElement) => void> = {
  "slide-up": animateSlideUp,
  "scale-pop": animateScalePop,
  "blur-in": animateBlurIn,
  "slide-right": animateSlideRight,
  "flip-in": animateFlipIn,
  "word-scale": animateWordScale,
};

export function CharacterRevealVariant({ onReplay, variant }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      ANIMATORS[variant](container);
    },
    { scope: containerRef }
  );

  const usesWords = variant === "word-scale";

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8"
    >
      {usesWords ? <WordBlock /> : <TextBlock />}
    </div>
  );
}
