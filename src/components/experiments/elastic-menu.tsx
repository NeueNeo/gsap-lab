"use client";

import { useRef } from "react";
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

      items.forEach((item) => {
        const el = item as HTMLElement;
        const label = el.querySelector(".item-label") as HTMLElement;
        const icon = el.querySelector(".item-icon") as HTMLElement;
        const indicator = el.querySelector(".item-indicator") as HTMLElement;

        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            scaleX: 1.04,
            scaleY: 0.96,
            duration: 0.4,
            ease: "elastic.out(1, 0.4)",
          });
          gsap.to(label, {
            x: 8,
            duration: 0.4,
            ease: "elastic.out(1, 0.4)",
          });
          gsap.to(icon, {
            scale: 1.3,
            rotation: 15,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
          gsap.to(indicator, {
            width: 4,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
          gsap.to(label, {
            x: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
          gsap.to(indicator, {
            width: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="w-80">
        <p className="text-sm font-mono text-zinc-500 mb-6 text-center">
          Hover over menu items
        </p>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <div
              key={i}
              className="menu-item flex items-center gap-4 px-5 py-4 cursor-pointer border-b border-zinc-800/50 last:border-0 relative will-change-transform"
            >
              <span className="item-indicator absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0 bg-emerald-400 rounded-r-sm opacity-0" />
              <span className="item-icon text-xl text-zinc-400 will-change-transform">
                {item.icon}
              </span>
              <span className="item-label text-sm font-medium text-zinc-200 will-change-transform">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-600 mt-4 text-center">
          elastic.out easing on hover
        </p>
      </div>
    </div>
  );
}
