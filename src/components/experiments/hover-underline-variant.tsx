import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Variant = "wipe" | "center" | "elastic" | "morph" | "slide";

interface Props {
  onReplay: () => void;
  variant: Variant;
}

interface StyleConfig {
  label: string;
  description: string;
  color: string;
  lineColor: string;
  words: string[];
  onEnter: (line: HTMLElement) => void;
  onLeave: (line: HTMLElement) => void;
}

const CONFIGS: Record<Variant, StyleConfig> = {
  wipe: {
    label: "Left to Right Wipe",
    description: "scaleX from left origin → right origin on leave",
    color: "text-emerald-400",
    lineColor: "bg-emerald-400",
    words: ["Navigation", "Portfolio", "About Us", "Contact"],
    onEnter: (line) => {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    },
    onLeave: (line) => {
      gsap.to(line, { scaleX: 0, transformOrigin: "right center", duration: 0.35, ease: "power2.in" });
    },
  },
  center: {
    label: "Center Expand",
    description: "scaleX from center origin",
    color: "text-cyan-400",
    lineColor: "bg-cyan-400",
    words: ["Dashboard", "Settings", "Profile", "Messages"],
    onEnter: (line) => {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "center center" }, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    },
    onLeave: (line) => {
      gsap.to(line, { scaleX: 0, transformOrigin: "center center", duration: 0.3, ease: "power2.in" });
    },
  },
  elastic: {
    label: "Elastic Bounce",
    description: "elastic.out ease for springy feel",
    color: "text-violet-400",
    lineColor: "bg-violet-400",
    words: ["Explore", "Discover", "Create", "Share"],
    onEnter: (line) => {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    },
    onLeave: (line) => {
      gsap.to(line, { scaleX: 0, transformOrigin: "left center", duration: 0.3, ease: "power3.in" });
    },
  },
  morph: {
    label: "Thick to Thin Morph",
    description: "height shrinks from 4px → 1px on hover",
    color: "text-amber-400",
    lineColor: "bg-amber-400",
    words: ["Products", "Features", "Pricing", "Support"],
    onEnter: (line) => {
      gsap.fromTo(line, { scaleX: 0, height: 4, transformOrigin: "left center" }, { scaleX: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(line, { height: 1, duration: 0.4, delay: 0.2, ease: "power2.inOut" });
    },
    onLeave: (line) => {
      gsap.to(line, { scaleX: 0, transformOrigin: "right center", duration: 0.3, ease: "power2.in" });
      gsap.set(line, { height: 4, delay: 0.3 });
    },
  },
  slide: {
    label: "Slide Through",
    description: "line slides from left to right across, then resets",
    color: "text-rose-400",
    lineColor: "bg-rose-400",
    words: ["Archives", "Gallery", "Journal", "Library"],
    onEnter: (line) => {
      gsap.set(line, { transformOrigin: "left center" });
      gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out" });
    },
    onLeave: (line) => {
      gsap.to(line, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => { gsap.set(line, { transformOrigin: "left center" }); },
      });
    },
  },
};

export function HoverUnderlineVariant({ onReplay, variant }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const config = CONFIGS[variant];

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(
    () => {
      gsap.from(".link-item", {
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleEnter = contextSafe((e: React.MouseEvent) => {
    const line = (e.currentTarget as HTMLElement).querySelector(".underline-el") as HTMLElement;
    if (line) { config.onEnter(line); }
  });

  const handleLeave = contextSafe((e: React.MouseEvent) => {
    const line = (e.currentTarget as HTMLElement).querySelector(".underline-el") as HTMLElement;
    if (line) { config.onLeave(line); }
  });

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
        Hover Underline · {config.label}
      </p>
      <p className="text-[10px] font-mono text-zinc-600 mb-12">{config.description}</p>

      <nav className="flex flex-col gap-8">
        {config.words.map((word, i) => (
          <a
            key={i}
            href="#"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={`link-item relative text-4xl font-semibold ${config.color} cursor-pointer`}
          >
            {word}
            <span className={`underline-el absolute bottom-0 left-0 w-full h-[2px] ${config.lineColor} scale-x-0`} />
          </a>
        ))}
      </nav>
    </div>
  );
}
