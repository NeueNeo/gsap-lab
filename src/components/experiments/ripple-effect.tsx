import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXT = "RIPPLE EFFECT";

interface Props {
  onReplay: () => void;
}

export function RippleEffect({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = container.querySelectorAll(".ripple-char");

      gsap.set(chars, { opacity: 0, y: 20 });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        delay: 0.2,
        ease: "power2.out",
      });

      // Sinusoidal wave — opposite phase
      chars.forEach((char, i) => {
        gsap.to(char, {
          y: 20,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08 + 0.3,
        });
      });

      // Scale pulse ripple
      chars.forEach((char, i) => {
        gsap.to(char, {
          scale: 1.2,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full p-8"
    >
      <div className="flex flex-wrap justify-center">
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            className="ripple-char inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black tracking-tight text-zinc-100"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
