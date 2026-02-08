
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MENU = [
  {
    label: "Products",
    icon: "◆",
    children: ["Analytics", "Monitoring", "Logs", "Alerts"],
  },
  {
    label: "Solutions",
    icon: "◈",
    children: ["Enterprise", "Startups", "Agencies"],
  },
  {
    label: "Resources",
    icon: "◉",
    children: ["Documentation", "Guides", "API Reference", "Changelog", "Status"],
  },
  {
    label: "Company",
    icon: "◎",
    children: ["About", "Careers", "Blog"],
  },
];

interface Props {
  onReplay: () => void;
}

export function ElasticDropdown({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      gsap.from(".dd-item", {
        x: -40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const toggle = (idx: number) => {
    const wasOpen = open === idx;
    setOpen(wasOpen ? null : idx);

    const container = containerRef.current;
    if (!container) return;

    if (wasOpen) {
      // Closing
      const children = container.querySelectorAll(`.dd-children-${idx} .dd-child`);
      const wrapper = container.querySelector(`.dd-children-${idx}`) as HTMLElement;
      gsap.to(children, {
        x: -20,
        opacity: 0,
        stagger: 0.03,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(wrapper, { height: 0, overflow: "hidden" });
        },
      });
      // Chevron rotate back
      const chevron = container.querySelector(`.dd-chevron-${idx}`);
      gsap.to(chevron, { rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    } else {
      // Open this one, close others
      MENU.forEach((_, i) => {
        if (i !== idx) {
          const otherWrapper = container.querySelector(`.dd-children-${i}`) as HTMLElement;
          const otherChevron = container.querySelector(`.dd-chevron-${i}`);
          if (otherWrapper) gsap.set(otherWrapper, { height: 0, overflow: "hidden" });
          if (otherChevron) gsap.to(otherChevron, { rotation: 0, duration: 0.3 });
        }
      });

      // Opening
      const wrapper = container.querySelector(`.dd-children-${idx}`) as HTMLElement;
      if (!wrapper) return;

      // Measure natural height
      gsap.set(wrapper, { height: "auto", overflow: "visible" });
      const naturalH = wrapper.offsetHeight;
      gsap.from(wrapper, { height: 0, duration: 0.4, ease: "power3.out" });

      const children = wrapper.querySelectorAll(".dd-child");
      gsap.fromTo(
        children,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
          delay: 0.1,
        }
      );

      // Chevron rotate
      const chevron = container.querySelector(`.dd-chevron-${idx}`);
      gsap.to(chevron, { rotation: 90, duration: 0.4, ease: "elastic.out(1, 0.4)" });

      // Parent item squish
      const parentItem = container.querySelectorAll(".dd-item")[idx];
      gsap.fromTo(
        parentItem,
        { scaleX: 1, scaleY: 1 },
        { scaleX: 1.02, scaleY: 0.97, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    }
  };

  const handleChildHover = (el: HTMLElement, entering: boolean) => {
    if (entering) {
      gsap.to(el, { x: 6, scaleX: 1.02, duration: 0.4, ease: "elastic.out(1, 0.4)" });
      const dot = el.querySelector(".dd-dot");
      if (dot) gsap.to(dot, { scale: 1.5, opacity: 1, duration: 0.3, ease: "back.out(2)" });
    } else {
      gsap.to(el, { x: 0, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      const dot = el.querySelector(".dd-dot");
      if (dot) gsap.to(dot, { scale: 1, opacity: 0.4, duration: 0.3 });
    }
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full p-8">
      <div className="w-72">
        <p className="text-sm font-mono text-zinc-500 mb-6 text-center tracking-widest">
          Click to expand
        </p>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {MENU.map((item, i) => (
            <div key={i}>
              <div
                className="dd-item flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-zinc-800/50 last:border-0 will-change-transform select-none"
                onClick={() => toggle(i)}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  gsap.to(el, { scaleX: 1.03, scaleY: 0.97, duration: 0.4, ease: "elastic.out(1, 0.4)" });
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  gsap.to(el, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                }}
              >
                <span className="text-lg text-zinc-500">{item.icon}</span>
                <span className="text-sm font-medium text-zinc-200 flex-1">{item.label}</span>
                <span className="text-zinc-600 text-xs font-mono">{item.children.length}</span>
                <span className={`dd-chevron-${i} text-zinc-500 text-sm inline-block`}>›</span>
              </div>

              <div
                className={`dd-children-${i} overflow-hidden`}
                style={{ height: open === i ? "auto" : 0 }}
              >
                {item.children.map((child, j) => (
                  <div
                    key={j}
                    className="dd-child flex items-center gap-3 pl-12 pr-5 py-2.5 cursor-pointer will-change-transform"
                    onMouseEnter={(e) => handleChildHover(e.currentTarget, true)}
                    onMouseLeave={(e) => handleChildHover(e.currentTarget, false)}
                  >
                    <span className="dd-dot w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-40" />
                    <span className="text-sm text-zinc-400">{child}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-600 mt-4 text-center tracking-widest">
          Elastic expand · staggered children
        </p>
      </div>
    </div>
  );
}
