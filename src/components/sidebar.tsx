"use client";

import { categories } from "@/lib/experiments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ activeId, onSelect }: SidebarProps) {
  return (
    <aside className="w-[280px] min-w-[280px] h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="px-5 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
          GSAP Lab
        </h1>
        <p className="text-xs font-mono text-zinc-500 mt-1">
          18 animation experiments
        </p>
      </div>
      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="py-3">
          {categories.map((cat) => (
            <div key={cat.name} className="mb-2">
              <div className="px-5 py-2">
                <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-500">
                  {cat.name}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-2 text-[10px] px-1.5 py-0 h-4 bg-zinc-800 text-zinc-500 border-0"
                >
                  {cat.experiments.length}
                </Badge>
              </div>
              {cat.experiments.map((exp) => {
                const isActive = exp.id === activeId;
                return (
                  <button
                    key={exp.id}
                    onClick={() => onSelect(exp.id)}
                    className={`w-full text-left px-5 py-2 text-sm transition-colors duration-150 relative group ${
                      isActive
                        ? "bg-zinc-800/70 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-sm" />
                    )}
                    <span className="pl-1">{exp.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
          <div className="h-6" aria-hidden="true" />
        </nav>
      </ScrollArea>
      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-[11px] font-mono text-zinc-600">
          Built with GSAP + Next.js
        </p>
      </div>
    </aside>
  );
}
