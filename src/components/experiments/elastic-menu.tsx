"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MENU_ITEMS = [
  { label: "Dashboard", icon: "◉" },
  { label: "Analytics", icon: "◈" },
  { label: "Projects", icon: "◆" },
  { label: "Settings", icon: "◎" },
  { label: "Notifications", icon: "◐" },
  { label: "Profile", icon: "◑" },
];

interface Props {
  onReplay: () => void;
}

export function ElasticMenu({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const items = containerRef.current?.querySelectorAll(".menu-item");
      if (!items) return;

      // Entry animation
      gsap.from(items, {
        x: -60,
        opacity: 0,
        stagger: 0.06,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const handleClick = (idx: number) => {
    if (idx === active) return;
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".menu-item");
    const oldItem = items[active] as HTMLElement;
    const newItem = items[idx] as HTMLElement;

    // Deactivate old
    const oldIndicator = oldItem.querySelector(".item-indicator") as HTMLElement;
    gsap.to(oldIndicator, { width: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(oldItem, { backgroundColor: "transparent", duration: 0.3 });

    // Activate new
    const newIndicator = newItem.querySelector(".item-indicator") as HTMLElement;
    gsap.to(newIndicator, { width: 3, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    gsap.to(newItem, { backgroundColor: "rgba(255,255,255,0.04)", duration: 0.3 });

    // Squish the clicked item
    gsap.fromTo(newItem, 
      { scaleX: 1, scaleY: 1 },
      { scaleX: 1.03, scaleY: 0.97, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );

    setActive(idx);
  };

  const handleEnter = (el: HTMLElement, idx: number) => {
    const label = el.querySelector(".item-label") as HTMLElement;
    const icon = el.querySelector(".item-icon") as HTMLElement;

    gsap.to(el, { scaleX: 1.04, scaleY: 0.96, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    gsap.to(label, { x: 8, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    gsap.to(icon, { scale: 1.3, rotation: 15, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  const handleLeave = (el: HTMLElement, idx: number) => {
    const label = el.querySelector(".item-label") as HTMLElement;
    const icon = el.querySelector(".item-icon") as HTMLElement;

    gsap.to(el, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    gsap.to(label, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    gsap.to(icon, { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="w-80">
        <p className="text-sm font-mono text-zinc-500 mb-6 text-center tracking-widest">
          Click to switch active item
        </p>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <div
              key={i}
              className="menu-item relative flex items-center gap-4 px-5 py-4 cursor-pointer border-b border-zinc-800/50 last:border-0 will-change-transform overflow-hidden"
              style={{ backgroundColor: i === 0 ? "rgba(255,255,255,0.04)" : "transparent" }}
              onClick={() => handleClick(i)}
              onMouseEnter={(e) => handleEnter(e.currentTarget, i)}
              onMouseLeave={(e) => handleLeave(e.currentTarget, i)}
            >
              <span
                className="item-indicator absolute left-0 top-0 h-full bg-emerald-400"
                style={{ width: i === 0 ? 3 : 0, opacity: i === 0 ? 1 : 0 }}
              />
              <span className="item-icon text-xl text-zinc-400 will-change-transform">
                {item.icon}
              </span>
              <span className="item-label text-sm font-medium text-zinc-200 will-change-transform">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-600 mt-4 text-center tracking-widest">
          Active indicator + elastic hover
        </p>
      </div>
    </div>
  );
}
