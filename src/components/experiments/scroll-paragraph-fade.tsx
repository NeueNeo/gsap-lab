
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PARAGRAPHS = [
  {
    label: "PRINCIPLE 01",
    text: "Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects, and the products are not burdened with non-essentials.",
  },
  {
    label: "PRINCIPLE 02",
    text: "Good design makes a product useful. A product is bought to be used. It has to satisfy functional, psychological and aesthetic criteria.",
  },
  {
    label: "PRINCIPLE 03",
    text: "Good design is long-lasting. It avoids being fashionable and therefore never appears antiquated. Unlike fashionable design, it lasts many years.",
  },
  {
    label: "PRINCIPLE 04",
    text: "Good design is thorough down to the last detail. Nothing must be arbitrary or left to chance. Care and accuracy in the design process show respect towards the user.",
  },
];

interface Props {
  onReplay: () => void;
}

export function ScrollParagraphFade({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const blocks = gsap.utils.toArray<HTMLElement>(".para-block", scroller);

      blocks.forEach((block) => {
        const label = block.querySelector(".para-label");
        const line = block.querySelector(".para-line");
        const words = gsap.utils.toArray<HTMLElement>(".para-word", block);

        // Label slides in
        if (label) {
          gsap.fromTo(
            label,
            { x: -20, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                scroller: scroller,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Line draws in
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                scroller: scroller,
                start: "top 70%",
                end: "bottom 40%",
                scrub: 1,
              },
            }
          );
        }

        // Words fade and rise — scrubbed
        gsap.fromTo(
          words,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: block,
              scroller: scroller,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 1,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      <div className="max-w-2xl mx-auto px-8">
        <div className="h-[40vh] flex items-end justify-center pb-24">
          <p className="text-xs font-mono text-zinc-600 tracking-widest">↓ SCROLL TO READ</p>
        </div>

        <div className="h-32" />

        <div className="space-y-24 py-16">
          {PARAGRAPHS.map((para, i) => (
            <div key={i} className="para-block">
              <span className="para-label block text-xs font-mono text-emerald-400/70 tracking-widest mb-3">
                {para.label}
              </span>
              <div className="para-line h-px bg-zinc-700/50 origin-left mb-6" />
              <p className="text-xl sm:text-2xl font-medium leading-snug sm:leading-relaxed tracking-tight">
                {para.text.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className="para-word inline-block mr-[0.3em] text-zinc-100"
                    style={{ opacity: 0 }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className="py-8 border-t border-zinc-800/50">
          <p className="text-xs font-mono text-zinc-600">
            Per-paragraph reveal · label + line + word fade-rise
          </p>
        </div>

        <div className="h-[70vh] flex items-center justify-center">
          <p className="text-xs font-mono text-zinc-700">◆</p>
        </div>
      </div>
    </div>
  );
}
