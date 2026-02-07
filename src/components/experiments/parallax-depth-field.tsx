"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

export function ParallaxDepthField({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const triggerConfig = {
        trigger: ".pdf-content",
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      };

      // Far background — heavily blurred, very slow
      gsap.to(".pdf-far", { y: -100, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Mid-far
      gsap.to(".pdf-midfar", { y: -250, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Mid-ground — slight blur, medium speed
      gsap.to(".pdf-mid", { y: -450, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Mid-near
      gsap.to(".pdf-midnear", { y: -650, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Foreground — sharp, fast
      gsap.to(".pdf-near", { y: -900, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Grid
      gsap.to(".pdf-grid", { y: -60, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Reverse
      gsap.to(".pdf-reverse", { y: 250, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Horizontal drift
      gsap.to(".pdf-drift-r", { x: 180, ease: "none", scrollTrigger: { ...triggerConfig } });
      gsap.to(".pdf-drift-l", { x: -180, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Elements that transition blur as they scroll
      gsap.to(".pdf-blur-shift-1", {
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });
      gsap.to(".pdf-blur-shift-2", {
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: { ...triggerConfig },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="pdf-content relative" style={{ height: "300vh" }}>

        {/* Background grid */}
        <div className="pdf-grid absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* ===== FAR BACKGROUND — blur(8px), very slow ===== */}
        <div className="pdf-far absolute inset-0 pointer-events-none" style={{ filter: "blur(8px)" }}>
          {/* Large soft circles */}
          <div className="absolute top-[5vh] left-[10%] w-48 h-48 rounded-full bg-emerald-400/5" />
          <div className="absolute top-[15vh] right-[15%] w-64 h-64 rounded-full border border-zinc-600/10" />
          <div className="absolute top-[40vh] left-[50%] w-40 h-40 rounded-full bg-cyan-400/4" />
          <div className="absolute top-[65vh] left-[5%] w-56 h-56 rounded-full border border-emerald-400/8" />
          <div className="absolute top-[90vh] right-[10%] w-36 h-36 rounded-full bg-zinc-700/10" />
          <div className="absolute top-[115vh] left-[30%] w-48 h-48 rounded-full bg-emerald-400/4" />
          <div className="absolute top-[140vh] right-[25%] w-60 h-60 rounded-full border border-zinc-600/8" />
          <div className="absolute top-[170vh] left-[15%] w-44 h-44 rounded-full bg-cyan-400/5" />
          <div className="absolute top-[200vh] right-[20%] w-52 h-52 rounded-full bg-emerald-400/3" />
          <div className="absolute top-[230vh] left-[40%] w-40 h-40 rounded-full border border-cyan-400/6" />
          <div className="absolute top-[260vh] left-[8%] w-56 h-56 rounded-full bg-zinc-700/8" />

          {/* Far background text — barely readable through blur */}
          <div className="absolute top-[25vh] left-[20%]">
            <h2 className="text-9xl font-black text-zinc-400/8 tracking-tighter">VOID</h2>
          </div>
          <div className="absolute top-[110vh] right-[15%]">
            <h2 className="text-8xl font-black text-emerald-400/6 tracking-tighter">DEEP</h2>
          </div>
          <div className="absolute top-[195vh] left-[10%]">
            <h2 className="text-9xl font-black text-cyan-400/5 tracking-tighter">HAZE</h2>
          </div>

          {/* Large gradient washes */}
          <div className="absolute top-[55vh] left-[0%] w-[50%] h-[30vh] bg-gradient-to-r from-emerald-400/3 via-transparent to-transparent rounded-full" />
          <div className="absolute top-[150vh] right-[0%] w-[40%] h-[25vh] bg-gradient-to-l from-cyan-400/3 via-transparent to-transparent rounded-full" />
        </div>

        {/* ===== MID-FAR — blur(5px) ===== */}
        <div className="pdf-midfar absolute inset-0 pointer-events-none" style={{ filter: "blur(5px)" }}>
          {/* Horizontal gradient lines */}
          <div className="absolute top-[12vh] left-[5%] w-[40%] h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
          <div className="absolute top-[50vh] right-[5%] w-[35%] h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
          <div className="absolute top-[85vh] left-[10%] w-[30%] h-px bg-gradient-to-r from-transparent via-zinc-500/15 to-transparent" />
          <div className="absolute top-[125vh] right-[8%] w-[45%] h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
          <div className="absolute top-[165vh] left-[5%] w-[35%] h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
          <div className="absolute top-[210vh] right-[10%] w-[30%] h-px bg-gradient-to-r from-transparent via-zinc-500/12 to-transparent" />
          <div className="absolute top-[250vh] left-[15%] w-[40%] h-px bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />

          {/* Mid-far shapes */}
          <div className="absolute top-[20vh] right-[25%] w-20 h-20 rotate-45 border border-emerald-400/12" />
          <div className="absolute top-[60vh] left-[20%] w-16 h-16 rounded-full bg-zinc-700/15" />
          <div className="absolute top-[100vh] right-[30%] w-24 h-24 rotate-45 border border-cyan-400/10" />
          <div className="absolute top-[145vh] left-[15%] w-14 h-14 rounded-full border border-emerald-400/10" />
          <div className="absolute top-[185vh] right-[18%] w-20 h-20 rotate-45 bg-zinc-700/8" />
          <div className="absolute top-[225vh] left-[30%] w-16 h-16 rounded-full border border-cyan-400/8" />
          <div className="absolute top-[260vh] right-[22%] w-18 h-18 rotate-45 border border-zinc-600/10" />

          {/* Floating text */}
          <div className="absolute top-[70vh] left-[55%]">
            <h2 className="text-5xl font-bold text-zinc-400/10 tracking-tighter">DISTANCE</h2>
          </div>
          <div className="absolute top-[160vh] right-[50%]">
            <h2 className="text-4xl font-bold text-emerald-400/8 tracking-tighter">APERTURE</h2>
          </div>
        </div>

        {/* ===== MID-GROUND — blur(2px) ===== */}
        <div className="pdf-mid absolute inset-0 pointer-events-none" style={{ filter: "blur(2px)" }}>
          {/* Decorative card shapes */}
          <div className="absolute top-[18vh] left-[8%] w-32 h-20 rounded-2xl bg-zinc-800/30 border border-zinc-700/20" />
          <div className="absolute top-[45vh] right-[12%] w-28 h-28 rounded-2xl bg-zinc-800/25 border border-emerald-400/10" />
          <div className="absolute top-[78vh] left-[55%] w-36 h-22 rounded-2xl bg-zinc-800/20 border border-zinc-700/15" />
          <div className="absolute top-[108vh] left-[10%] w-24 h-24 rounded-2xl bg-zinc-800/25 border border-cyan-400/10" />
          <div className="absolute top-[140vh] right-[15%] w-40 h-24 rounded-2xl bg-zinc-800/20 border border-zinc-700/15" />
          <div className="absolute top-[175vh] left-[40%] w-30 h-20 rounded-2xl bg-zinc-800/25 border border-emerald-400/8" />
          <div className="absolute top-[205vh] right-[10%] w-32 h-32 rounded-2xl bg-zinc-800/20 border border-zinc-700/12" />
          <div className="absolute top-[240vh] left-[15%] w-36 h-22 rounded-2xl bg-zinc-800/25 border border-cyan-400/8" />

          {/* Vertical dotted lines */}
          <div className="absolute top-[30vh] left-[35%] w-px h-[18vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(82 82 91 / 0.25) 0px, rgb(82 82 91 / 0.25) 4px, transparent 4px, transparent 12px)" }}
          />
          <div className="absolute top-[90vh] right-[30%] w-px h-[15vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(52 211 153 / 0.15) 0px, rgb(52 211 153 / 0.15) 4px, transparent 4px, transparent 12px)" }}
          />
          <div className="absolute top-[155vh] left-[45%] w-px h-[20vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(82 82 91 / 0.2) 0px, rgb(82 82 91 / 0.2) 4px, transparent 4px, transparent 12px)" }}
          />
          <div className="absolute top-[220vh] right-[35%] w-px h-[15vh]"
            style={{ backgroundImage: "repeating-linear-gradient(180deg, rgb(8 145 178 / 0.15) 0px, rgb(8 145 178 / 0.15) 4px, transparent 4px, transparent 12px)" }}
          />

          {/* Mid-ground text */}
          <div className="absolute top-[55vh] left-[5%]">
            <h2 className="text-6xl font-bold text-zinc-300/12 tracking-tighter">BOKEH</h2>
          </div>
          <div className="absolute top-[130vh] right-[8%]">
            <h2 className="text-5xl font-bold text-emerald-400/10 tracking-tighter">f/1.4</h2>
          </div>
          <div className="absolute top-[215vh] left-[8%]">
            <h2 className="text-6xl font-bold text-zinc-300/10 tracking-tighter">RENDER</h2>
          </div>

          {/* Crosses */}
          {[25, 68, 95, 135, 180, 235, 270].map((top, i) => (
            <div key={`cross-${i}`} className="absolute" style={{ top: `${top}vh`, left: `${12 + (i * 13) % 76}%` }}>
              <div className="w-5 h-px bg-zinc-500/20 absolute top-1/2 left-1/2 -translate-x-1/2" />
              <div className="h-5 w-px bg-zinc-500/20 absolute top-1/2 left-1/2 -translate-y-1/2" />
            </div>
          ))}
        </div>

        {/* ===== MID-NEAR — blur(0.5px) ===== */}
        <div className="pdf-midnear absolute inset-0 pointer-events-none" style={{ filter: "blur(0.5px)" }}>
          {/* Accent bars */}
          <div className="absolute top-[30vh] right-[12%] w-3 h-14 bg-emerald-400/25 rounded-full" />
          <div className="absolute top-[75vh] left-[18%] w-3 h-18 bg-cyan-400/20 rounded-full" />
          <div className="absolute top-[120vh] right-[22%] w-3 h-12 bg-emerald-400/20 rounded-full" />
          <div className="absolute top-[170vh] left-[25%] w-3 h-16 bg-cyan-400/18 rounded-full" />
          <div className="absolute top-[220vh] right-[15%] w-3 h-14 bg-emerald-400/22 rounded-full" />
          <div className="absolute top-[265vh] left-[20%] w-3 h-12 bg-cyan-400/15 rounded-full" />

          {/* Semi-sharp text */}
          <div className="absolute top-[42vh] right-[10%] text-right">
            <h2 className="text-4xl font-black text-zinc-200/60 tracking-tighter">FIELD</h2>
            <p className="text-xs font-mono text-zinc-500/40 mt-1">transitioning focus</p>
          </div>
          <div className="absolute top-[150vh] left-[10%]">
            <h2 className="text-3xl font-black text-zinc-200/50 tracking-tighter">PLANE</h2>
            <p className="text-xs font-mono text-emerald-400/30 mt-1">mid-near layer</p>
          </div>

          {/* Diamonds */}
          <div className="absolute top-[55vh] left-[65%] w-10 h-10 rotate-45 border border-emerald-400/20" />
          <div className="absolute top-[105vh] right-[60%] w-8 h-8 rotate-45 border border-cyan-400/15" />
          <div className="absolute top-[195vh] left-[55%] w-12 h-12 rotate-45 border border-emerald-400/15" />
          <div className="absolute top-[250vh] right-[55%] w-8 h-8 rotate-45 bg-zinc-700/15" />
        </div>

        {/* ===== FOREGROUND — sharp (no blur), fast, neon glows ===== */}
        <div className="pdf-near absolute inset-0 pointer-events-none">
          <div className="absolute top-[35vh] left-[8%]">
            <div className="space-y-2">
              <h2 className="text-8xl font-black text-zinc-100 tracking-tighter"
                style={{ textShadow: "0 0 40px rgba(52,211,153,0.15), 0 0 80px rgba(52,211,153,0.05)" }}>
                DEPTH
              </h2>
              <p className="text-sm font-mono text-emerald-400/80">blur(0px) · fastest layer</p>
            </div>
          </div>

          <div className="absolute top-[100vh] right-[10%]">
            <div className="text-right space-y-2">
              <h2 className="text-6xl font-black text-zinc-100 tracking-tighter"
                style={{ textShadow: "0 0 30px rgba(8,145,178,0.15), 0 0 60px rgba(8,145,178,0.05)" }}>
                FOCUS
              </h2>
              <p className="text-sm font-mono text-cyan-400/70">sharp foreground</p>
            </div>
          </div>

          <div className="absolute top-[165vh] left-[12%]">
            <div className="space-y-2">
              <h2 className="text-7xl font-black text-zinc-100 tracking-tighter"
                style={{ textShadow: "0 0 40px rgba(52,211,153,0.12), 0 0 80px rgba(52,211,153,0.04)" }}>
                SHARP
              </h2>
              <p className="text-xs font-mono text-emerald-400/60">crisp · defined · near</p>
            </div>
          </div>

          <div className="absolute top-[235vh] right-[12%]">
            <div className="text-right space-y-2">
              <h2 className="text-5xl font-black text-zinc-200 tracking-tighter"
                style={{ textShadow: "0 0 25px rgba(8,145,178,0.15)" }}>
                LENS
              </h2>
              <p className="text-xs font-mono text-cyan-400/50">camera simulation</p>
            </div>
          </div>

          {/* Neon-glow accent shapes */}
          <div className="absolute top-[60vh] right-[15%] w-4 h-20 bg-emerald-400/40 rounded-full"
            style={{ boxShadow: "0 0 12px rgba(52,211,153,0.3), 0 0 24px rgba(52,211,153,0.1)" }} />
          <div className="absolute top-[130vh] left-[20%] w-4 h-16 bg-cyan-400/35 rounded-full"
            style={{ boxShadow: "0 0 12px rgba(8,145,178,0.3), 0 0 24px rgba(8,145,178,0.1)" }} />
          <div className="absolute top-[200vh] right-[25%] w-4 h-18 bg-emerald-400/30 rounded-full"
            style={{ boxShadow: "0 0 10px rgba(52,211,153,0.25), 0 0 20px rgba(52,211,153,0.08)" }} />
          <div className="absolute top-[260vh] left-[15%] w-4 h-14 bg-cyan-400/30 rounded-full"
            style={{ boxShadow: "0 0 10px rgba(8,145,178,0.25), 0 0 20px rgba(8,145,178,0.08)" }} />

          {/* Neon-glow small circles */}
          <div className="absolute top-[80vh] left-[60%] w-6 h-6 rounded-full bg-emerald-400/30"
            style={{ boxShadow: "0 0 8px rgba(52,211,153,0.4), 0 0 20px rgba(52,211,153,0.15)" }} />
          <div className="absolute top-[145vh] right-[55%] w-5 h-5 rounded-full bg-cyan-400/30"
            style={{ boxShadow: "0 0 8px rgba(8,145,178,0.4), 0 0 20px rgba(8,145,178,0.15)" }} />
          <div className="absolute top-[215vh] left-[55%] w-6 h-6 rounded-full bg-emerald-400/25"
            style={{ boxShadow: "0 0 8px rgba(52,211,153,0.3), 0 0 16px rgba(52,211,153,0.1)" }} />
        </div>

        {/* ===== BLUR TRANSITION ELEMENTS ===== */}
        {/* Starts blurry, becomes sharp */}
        <div className="pdf-blur-shift-1 absolute inset-0 pointer-events-none" style={{ filter: "blur(6px)" }}>
          <div className="absolute top-[48vh] left-[45%]">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-400/25"
              style={{ boxShadow: "0 0 15px rgba(52,211,153,0.15)" }} />
          </div>
          <div className="absolute top-[155vh] right-[40%]">
            <h2 className="text-4xl font-black text-cyan-400/30 tracking-tighter">SHIFT</h2>
          </div>
        </div>

        {/* Starts sharp, becomes blurry */}
        <div className="pdf-blur-shift-2 absolute inset-0 pointer-events-none" style={{ filter: "blur(0px)" }}>
          <div className="absolute top-[88vh] right-[40%]">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-400/30"
              style={{ boxShadow: "0 0 12px rgba(8,145,178,0.2)" }} />
          </div>
          <div className="absolute top-[188vh] left-[45%]">
            <h2 className="text-3xl font-black text-emerald-400/35 tracking-tighter">FADE</h2>
          </div>
        </div>

        {/* ===== HORIZONTAL DRIFT ===== */}
        <div className="pdf-drift-r absolute inset-0 pointer-events-none">
          <div className="absolute top-[38vh] left-[0%] w-20 h-px bg-gradient-to-r from-emerald-400/25 to-transparent" />
          <div className="absolute top-[98vh] left-[3%] w-16 h-px bg-gradient-to-r from-cyan-400/20 to-transparent" />
          <div className="absolute top-[158vh] left-[0%] w-24 h-px bg-gradient-to-r from-emerald-400/15 to-transparent" />
          <div className="absolute top-[228vh] left-[2%] w-18 h-px bg-gradient-to-r from-zinc-500/15 to-transparent" />
        </div>

        <div className="pdf-drift-l absolute inset-0 pointer-events-none">
          <div className="absolute top-[55vh] right-[0%] w-20 h-px bg-gradient-to-l from-cyan-400/20 to-transparent" />
          <div className="absolute top-[118vh] right-[2%] w-24 h-px bg-gradient-to-l from-emerald-400/18 to-transparent" />
          <div className="absolute top-[185vh] right-[0%] w-16 h-px bg-gradient-to-l from-zinc-500/15 to-transparent" />
          <div className="absolute top-[255vh] right-[3%] w-20 h-px bg-gradient-to-l from-cyan-400/12 to-transparent" />
        </div>

        {/* ===== REVERSE LAYER ===== */}
        <div className="pdf-reverse absolute inset-0 pointer-events-none">
          <div className="absolute top-[12vh] right-[5%]">
            <span className="text-[10px] font-mono text-zinc-600 tracking-widest">↑ REVERSE</span>
          </div>
          <div className="absolute top-[45vh] left-[72%] w-8 h-8 rounded-full border-2 border-dashed border-zinc-600/15" />
          <div className="absolute top-[80vh] right-[68%] w-6 h-6 rounded-full border-2 border-dashed border-emerald-400/10" />
          <div className="absolute top-[115vh] left-[75%]">
            <span className="text-[10px] font-mono text-zinc-600/30 tracking-widest">COUNTER</span>
          </div>
          <div className="absolute top-[160vh] right-[70%] w-10 h-10 rounded-full border-2 border-dashed border-cyan-400/10" />
        </div>

        {/* Fixed labels */}
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">↓ SCROLL TO SHIFT FOCUS</p>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-mono text-zinc-700 tracking-widest">FAR · blur(8px)</p>
            <p className="text-[9px] font-mono text-zinc-600 tracking-widest">MID · blur(2px)</p>
            <p className="text-[9px] font-mono text-zinc-400 tracking-widest">NEAR · blur(0px)</p>
          </div>
        </div>

        <div className="absolute bottom-[5vh] w-full text-center">
          <p className="text-xs font-mono text-zinc-600">◆ End of depth field</p>
        </div>
      </div>
    </div>
  );
}
