import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const PARAGRAPH = `Design is not just what it looks like and feels like. Design is how it works. Every detail matters. Every pixel serves a purpose. The best interfaces disappear — they become invisible conduits between intention and action. We build systems that respect the user's time, handle every edge case, and feel intentional from the first interaction to the last. Typography sets the tone. Spacing creates rhythm. Color guides attention. Motion provides feedback. Together they form a language — one that speaks without words, guides without instruction, and delights without distraction.`;

interface Props {
  onReplay: () => void;
}

export function ScrollTextReveal({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);

  // Reset scroll and wait one frame for layout
  useEffect(() => {
    const scroller = containerRef.current;
    if (scroller) scroller.scrollTop = 0;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      const scroller = containerRef.current;
      const wrapper = wrapperRef.current;
      const sticky = stickyRef.current;
      const textEl = textRef.current;
      if (!scroller || !wrapper || !sticky || !textEl) return;

      const scrollerH = scroller.clientHeight;
      if (!scrollerH) return;

      // Set heights
      const scrollRange = scrollerH * 2.5;
      wrapper.style.height = `${scrollerH + scrollRange}px`;
      sticky.style.height = `${scrollerH}px`;

      // Split text
      const split = new SplitText(textEl, {
        type: "words",
        wordsClass: "word",
      });

      // Force layout recalc
      void wrapper.offsetHeight;

      // Reset scroll to top so nothing is pre-revealed
      scroller.scrollTop = 0;

      // Timeline + ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          scroller: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.set(
        split.words,
        { opacity: 1, stagger: { each: 1 / split.words.length } },
        0
      );
      tl.set({}, {}, "+=0.01");

      return () => {
        split.revert();
        wrapper.style.height = "";
        sticky.style.height = "";
      };
    },
    { scope: containerRef, dependencies: [ready] }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-zinc-950">
      {/* Top spacer */}
      <div className="h-[80vh] flex items-center justify-center">
        <p className="text-xs font-mono text-zinc-600 tracking-widest uppercase">
          ↓ Scroll to reveal
        </p>
      </div>

      {/* Wrapper */}
      <div ref={wrapperRef} style={{ height: "300vh" }}>
        <div
          ref={stickyRef}
          className="sticky top-0 flex items-center justify-center px-4 sm:px-6 md:px-8"
          style={{ height: "100vh" }}
        >
          <p
            ref={textRef}
            className="max-w-3xl lg:max-w-5xl text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug sm:leading-relaxed tracking-tight text-zinc-100 [&>.word]:opacity-[0.15]"
          >
            {PARAGRAPH}
          </p>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-[80vh]" />
    </div>
  );
}
