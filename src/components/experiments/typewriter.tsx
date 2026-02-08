
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TEXTS = [
  "Hello, World.",
  "This is GSAP.",
  "Animation is art.",
  "Type. Erase. Repeat.",
];

interface Props {
  onReplay: () => void;
}

export function Typewriter({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Blinking cursor
      gsap.to(
        {},
        {
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          onRepeat: () => setShowCursor((prev) => !prev),
        }
      );

      let currentIndex = 0;

      function typeText(text: string) {
        const obj = { length: 0 };
        tl.to(obj, {
          length: text.length,
          duration: text.length * 0.06,
          ease: "none",
          onUpdate: () => {
            setDisplayText(text.slice(0, Math.round(obj.length)));
          },
        });
        tl.to({}, { duration: 1.2 }); // Pause
      }

      function eraseText(text: string) {
        const obj = { length: text.length };
        tl.to(obj, {
          length: 0,
          duration: text.length * 0.03,
          ease: "none",
          onUpdate: () => {
            setDisplayText(text.slice(0, Math.round(obj.length)));
          },
        });
        tl.to({}, { duration: 0.3 }); // Short pause
      }

      function addAllTexts() {
        for (let i = 0; i < TEXTS.length; i++) {
          typeText(TEXTS[i]);
          if (i < TEXTS.length - 1) {
            eraseText(TEXTS[i]);
          }
        }
        currentIndex = TEXTS.length - 1;
      }

      void currentIndex;
      addAllTexts();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="text-center">
        <span className="text-5xl font-bold tracking-tight text-zinc-100 font-mono">
          {displayText}
          <span
            className={`inline-block w-[3px] h-12 ml-1 bg-emerald-400 align-middle transition-opacity duration-100 ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
        <div className="mt-8 text-sm font-mono text-zinc-500">
          gsap.to() with onUpdate
        </div>
      </div>
    </div>
  );
}
