
import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/* ── Data ── */
const MENU_ITEMS = [
  { label: "Dashboard", icon: "◉" },
  { label: "Analytics", icon: "◈" },
  { label: "Projects", icon: "◆" },
  { label: "Settings", icon: "◎" },
  { label: "Notifications", icon: "◐" },
  { label: "Profile", icon: "◑" },
];

const DROPDOWN_ITEMS = [
  { label: "Products", icon: "◆", children: ["Analytics", "Monitoring", "Logs", "Alerts"] },
  { label: "Solutions", icon: "◈", children: ["Enterprise", "Startups", "Agencies"] },
  { label: "Resources", icon: "◉", children: ["Documentation", "Guides", "API Reference", "Changelog", "Status"] },
  { label: "Company", icon: "◎", children: ["About", "Careers", "Blog"] },
];

interface Props {
  onReplay: () => void;
}

/* ── Active Menu (left) ── */
function ActiveMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const items = menuRef.current?.querySelectorAll(".am-item");
    if (!items) return;
    gsap.from(items, { x: -60, opacity: 0, stagger: 0.06, duration: 0.8, ease: "elastic.out(1, 0.5)", delay: 0.3 });
  }, { scope: menuRef });

  const handleClick = (idx: number) => {
    if (idx === active) return;
    const container = menuRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".am-item");
    const oldItem = items[active] as HTMLElement;
    const newItem = items[idx] as HTMLElement;

    gsap.to(oldItem.querySelector(".am-indicator"), { width: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(oldItem, { backgroundColor: "transparent", duration: 0.3 });

    gsap.to(newItem.querySelector(".am-indicator"), { width: 3, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    gsap.to(newItem, { backgroundColor: "rgba(255,255,255,0.04)", duration: 0.3 });
    gsap.fromTo(newItem, { scaleX: 1, scaleY: 1 }, { scaleX: 1.03, scaleY: 0.97, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });

    setActive(idx);
  };

  return (
    <div ref={menuRef} className="w-72">
      <p className="text-[10px] font-mono text-zinc-600 mb-3 text-center tracking-widest uppercase">Active Menu</p>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {MENU_ITEMS.map((item, i) => (
          <div
            key={i}
            className="am-item relative flex items-center gap-4 px-5 py-3.5 cursor-pointer border-b border-zinc-800/50 last:border-0 will-change-transform overflow-hidden"
            style={{ backgroundColor: i === 0 ? "rgba(255,255,255,0.04)" : "transparent" }}
            onClick={() => handleClick(i)}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { scaleX: 1.04, scaleY: 0.96, duration: 0.4, ease: "elastic.out(1, 0.4)" });
              gsap.to(e.currentTarget.querySelector(".am-icon"), { scale: 1.3, rotation: 15, duration: 0.5, ease: "elastic.out(1, 0.3)" });
              gsap.to(e.currentTarget.querySelector(".am-label"), { x: 8, duration: 0.4, ease: "elastic.out(1, 0.4)" });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
              gsap.to(e.currentTarget.querySelector(".am-icon"), { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
              gsap.to(e.currentTarget.querySelector(".am-label"), { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            }}
          >
            <span className="am-indicator absolute left-0 top-0 h-full bg-emerald-400" style={{ width: i === 0 ? 3 : 0, opacity: i === 0 ? 1 : 0 }} />
            <span className="am-icon text-lg text-zinc-400 will-change-transform">{item.icon}</span>
            <span className="am-label text-sm font-medium text-zinc-200 will-change-transform">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dropdown Menu (right) ── */
function DropdownMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(() => {
    const items = menuRef.current?.querySelectorAll(".dd-item");
    if (!items) return;
    gsap.from(items, { x: -40, opacity: 0, stagger: 0.08, duration: 0.7, ease: "elastic.out(1, 0.5)", delay: 0.4 });
  }, { scope: menuRef });

  const toggle = useCallback((idx: number) => {
    const container = menuRef.current;
    if (!container) return;
    const wasOpen = open === idx;
    setOpen(wasOpen ? null : idx);

    if (wasOpen) {
      const children = container.querySelectorAll(`.ddc-${idx} .dd-child`);
      const wrapper = container.querySelector(`.ddc-${idx}`) as HTMLElement;
      gsap.to(children, { x: -20, opacity: 0, stagger: 0.03, duration: 0.2, ease: "power2.in", onComplete: () => { gsap.set(wrapper, { height: 0, overflow: "hidden" }); } });
      gsap.to(container.querySelector(`.ddch-${idx}`), { rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    } else {
      // Close others
      DROPDOWN_ITEMS.forEach((_, i) => {
        if (i !== idx) {
          const w = container.querySelector(`.ddc-${i}`) as HTMLElement;
          if (w) gsap.set(w, { height: 0, overflow: "hidden" });
          gsap.to(container.querySelector(`.ddch-${i}`), { rotation: 0, duration: 0.3 });
        }
      });

      const wrapper = container.querySelector(`.ddc-${idx}`) as HTMLElement;
      if (!wrapper) return;
      gsap.set(wrapper, { height: "auto", overflow: "visible" });
      gsap.from(wrapper, { height: 0, duration: 0.4, ease: "power3.out" });

      const children = wrapper.querySelectorAll(".dd-child");
      gsap.fromTo(children, { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "elastic.out(1, 0.5)", delay: 0.1 });
      gsap.to(container.querySelector(`.ddch-${idx}`), { rotation: 90, duration: 0.4, ease: "elastic.out(1, 0.4)" });

      const parentItem = container.querySelectorAll(".dd-item")[idx];
      gsap.fromTo(parentItem, { scaleX: 1, scaleY: 1 }, { scaleX: 1.02, scaleY: 0.97, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <div ref={menuRef} className="w-72">
      <p className="text-[10px] font-mono text-zinc-600 mb-3 text-center tracking-widest uppercase">Dropdown Menu</p>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {DROPDOWN_ITEMS.map((item, i) => (
          <div key={i}>
            <div
              className="dd-item flex items-center gap-3 px-5 py-3.5 cursor-pointer border-b border-zinc-800/50 last:border-0 will-change-transform select-none"
              onClick={() => toggle(i)}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scaleX: 1.03, scaleY: 0.97, duration: 0.4, ease: "elastic.out(1, 0.4)" })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" })}
            >
              <span className="text-lg text-zinc-500">{item.icon}</span>
              <span className="text-sm font-medium text-zinc-200 flex-1">{item.label}</span>
              <span className="text-zinc-600 text-xs font-mono">{item.children.length}</span>
              <span className={`ddch-${i} text-zinc-500 text-sm inline-block`}>›</span>
            </div>
            <div className={`ddc-${i} overflow-hidden`} style={{ height: open === i ? "auto" : 0 }}>
              {item.children.map((child, j) => (
                <div
                  key={j}
                  className="dd-child flex items-center gap-3 pl-12 pr-5 py-2.5 cursor-pointer will-change-transform"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { x: 6, scaleX: 1.02, duration: 0.4, ease: "elastic.out(1, 0.4)" });
                    gsap.to(e.currentTarget.querySelector(".dd-dot"), { scale: 1.5, opacity: 1, duration: 0.3, ease: "back.out(2)" });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { x: 0, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                    gsap.to(e.currentTarget.querySelector(".dd-dot"), { scale: 1, opacity: 0.4, duration: 0.3 });
                  }}
                >
                  <span className="dd-dot w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-40" />
                  <span className="text-sm text-zinc-400">{child}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Combined Page ── */
export function ElasticMenus({ onReplay }: Props) {
  void onReplay;
  return (
    <div className="flex items-center justify-center h-full p-8 gap-8">
      <ActiveMenu />
      <DropdownMenu />
    </div>
  );
}
