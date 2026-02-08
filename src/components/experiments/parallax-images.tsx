
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  onReplay: () => void;
}

interface PhotoBlock {
  id: string;
  top: string;
  left?: string;
  right?: string;
  width: string;
  aspectRatio: string;
  gradient: string;
  caption: string;
  border?: boolean;
  shadow?: boolean;
  orientation: "landscape" | "portrait" | "square";
}

const photos: PhotoBlock[] = [
  // Top zone
  { id: "p1", top: "4vh", left: "8%", width: "220px", aspectRatio: "16/9", gradient: "linear-gradient(135deg, rgb(39 39 42) 0%, rgb(24 24 27) 100%)", caption: "DSC_0847.RAW", border: true, shadow: true, orientation: "landscape" },
  { id: "p2", top: "12vh", right: "10%", width: "140px", aspectRatio: "3/4", gradient: "linear-gradient(180deg, rgb(39 39 42) 0%, rgb(6 78 59 / 0.15) 100%)", caption: "portrait_03.tiff", border: true, orientation: "portrait" },
  { id: "p3", top: "28vh", left: "35%", width: "160px", aspectRatio: "1/1", gradient: "linear-gradient(225deg, rgb(24 24 27) 0%, rgb(8 145 178 / 0.08) 100%)", caption: "scan_001.png", shadow: true, orientation: "square" },
  { id: "p4", top: "22vh", left: "65%", width: "180px", aspectRatio: "4/3", gradient: "linear-gradient(135deg, rgb(39 39 42) 0%, rgb(24 24 27) 60%, rgb(52 211 153 / 0.06) 100%)", caption: "untitled_film.cr2", border: true, orientation: "landscape" },

  // Mid-upper zone
  { id: "p5", top: "48vh", left: "5%", width: "200px", aspectRatio: "4/3", gradient: "linear-gradient(180deg, rgb(39 39 42) 0%, rgb(24 24 27) 100%)", caption: "roll_17_frame_08.jpg", shadow: true, orientation: "landscape" },
  { id: "p6", top: "55vh", right: "15%", width: "130px", aspectRatio: "2/3", gradient: "linear-gradient(135deg, rgb(24 24 27) 0%, rgb(52 211 153 / 0.1) 100%)", caption: "35mm_verde.tiff", border: true, shadow: true, orientation: "portrait" },
  { id: "p7", top: "70vh", left: "40%", width: "240px", aspectRatio: "16/9", gradient: "linear-gradient(to right, rgb(39 39 42) 0%, rgb(24 24 27) 50%, rgb(8 145 178 / 0.06) 100%)", caption: "panoramic_dusk.raw", border: true, orientation: "landscape" },

  // Mid zone
  { id: "p8", top: "90vh", left: "10%", width: "150px", aspectRatio: "1/1", gradient: "linear-gradient(315deg, rgb(39 39 42) 0%, rgb(24 24 27) 100%)", caption: "contact_sheet_04.png", orientation: "square" },
  { id: "p9", top: "100vh", right: "8%", width: "190px", aspectRatio: "16/9", gradient: "linear-gradient(135deg, rgb(24 24 27) 0%, rgb(52 211 153 / 0.08) 50%, rgb(24 24 27) 100%)", caption: "highway_overpass.dng", border: true, shadow: true, orientation: "landscape" },
  { id: "p10", top: "115vh", left: "50%", width: "120px", aspectRatio: "3/4", gradient: "linear-gradient(180deg, rgb(39 39 42) 0%, rgb(8 145 178 / 0.1) 100%)", caption: "neon_sign_ii.jpg", shadow: true, orientation: "portrait" },

  // Mid-lower zone
  { id: "p11", top: "135vh", left: "15%", width: "260px", aspectRatio: "16/9", gradient: "linear-gradient(135deg, rgb(39 39 42) 0%, rgb(24 24 27) 70%, rgb(52 211 153 / 0.05) 100%)", caption: "wide_angle_003.raw", border: true, orientation: "landscape" },
  { id: "p12", top: "145vh", right: "12%", width: "140px", aspectRatio: "1/1", gradient: "linear-gradient(225deg, rgb(24 24 27) 0%, rgb(39 39 42) 100%)", caption: "abstract_01.tiff", border: true, shadow: true, orientation: "square" },
  { id: "p13", top: "165vh", left: "55%", width: "130px", aspectRatio: "2/3", gradient: "linear-gradient(180deg, rgb(39 39 42) 0%, rgb(52 211 153 / 0.12) 100%)", caption: "figure_study.cr2", orientation: "portrait" },

  // Lower zone
  { id: "p14", top: "185vh", left: "5%", width: "170px", aspectRatio: "4/3", gradient: "linear-gradient(135deg, rgb(24 24 27) 0%, rgb(8 145 178 / 0.08) 100%)", caption: "reflected_light.dng", shadow: true, orientation: "landscape" },
  { id: "p15", top: "200vh", right: "20%", width: "200px", aspectRatio: "16/9", gradient: "linear-gradient(to bottom, rgb(39 39 42) 0%, rgb(24 24 27) 100%)", caption: "street_tokyo_09.raw", border: true, shadow: true, orientation: "landscape" },
  { id: "p16", top: "215vh", left: "30%", width: "110px", aspectRatio: "3/4", gradient: "linear-gradient(180deg, rgb(24 24 27) 0%, rgb(52 211 153 / 0.06) 100%)", caption: "exit_sign.jpg", orientation: "portrait" },

  // Bottom zone
  { id: "p17", top: "235vh", right: "10%", width: "180px", aspectRatio: "4/3", gradient: "linear-gradient(315deg, rgb(39 39 42) 0%, rgb(8 145 178 / 0.1) 100%)", caption: "last_frame.tiff", border: true, orientation: "landscape" },
  { id: "p18", top: "250vh", left: "12%", width: "150px", aspectRatio: "1/1", gradient: "linear-gradient(135deg, rgb(39 39 42) 0%, rgb(24 24 27) 100%)", caption: "polaroid_faded.png", shadow: true, orientation: "square" },
  { id: "p19", top: "265vh", left: "50%", width: "220px", aspectRatio: "16/9", gradient: "linear-gradient(135deg, rgb(24 24 27) 0%, rgb(52 211 153 / 0.08) 60%, rgb(24 24 27) 100%)", caption: "final_edit_v3.raw", border: true, shadow: true, orientation: "landscape" },
];

function PhotoCard({ photo }: { photo: PhotoBlock }) {
  return (
    <div
      className="absolute"
      style={{
        top: photo.top,
        ...(photo.left ? { left: photo.left } : {}),
        ...(photo.right ? { right: photo.right } : {}),
      }}
    >
      <div
        className={`rounded-lg overflow-hidden ${photo.border ? "border border-zinc-700/30" : ""}`}
        style={{
          width: photo.width,
          aspectRatio: photo.aspectRatio,
          background: photo.gradient,
          ...(photo.shadow
            ? { boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)" }
            : {}),
        }}
      >
        {/* Inner details to make it feel like a photo */}
        <div className="w-full h-full relative">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
            }}
          />
        </div>
      </div>
      <p className="mt-1.5 text-[10px] font-mono text-zinc-600 tracking-wide">{photo.caption}</p>
    </div>
  );
}

export function ParallaxImages({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current;
      if (!scroller) return;

      const triggerConfig = {
        trigger: ".pi-content",
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      };

      // Layer 0 — background grid
      gsap.to(".pi-grid", { y: -80, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Layer 1 — slow background photos
      gsap.to(".pi-slow", { y: -200, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Layer 2 — medium speed photos
      gsap.to(".pi-medium", { y: -450, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Layer 3 — fast foreground photos
      gsap.to(".pi-fast", { y: -750, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Layer 4 — fastest foreground labels
      gsap.to(".pi-fastest", { y: -900, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Horizontal drifters
      gsap.to(".pi-drift-r", { x: 150, ease: "none", scrollTrigger: { ...triggerConfig } });
      gsap.to(".pi-drift-l", { x: -150, ease: "none", scrollTrigger: { ...triggerConfig } });

      // Reverse layer
      gsap.to(".pi-reverse", { y: 250, ease: "none", scrollTrigger: { ...triggerConfig } });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="pi-content relative" style={{ height: "300vh" }}>

        {/* Grid base */}
        <div className="pi-grid absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* ===== GALLERY LABELS & CATEGORY TAGS ===== */}
        <div className="pi-fastest absolute inset-0 pointer-events-none">
          {/* Gallery title */}
          <div className="absolute top-[6vh] left-[8%]">
            <p className="text-xs font-mono text-emerald-400/70 tracking-widest uppercase">Gallery 01 — Landscapes</p>
          </div>
          <div className="absolute top-[48vh] right-[8%]">
            <p className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">Gallery 02 — Portraits</p>
          </div>
          <div className="absolute top-[95vh] left-[10%]">
            <p className="text-xs font-mono text-emerald-400/60 tracking-widest uppercase">Gallery 03 — Street</p>
          </div>
          <div className="absolute top-[140vh] right-[12%]">
            <p className="text-xs font-mono text-zinc-500/60 tracking-widest uppercase">Gallery 04 — Abstract</p>
          </div>
          <div className="absolute top-[190vh] left-[5%]">
            <p className="text-xs font-mono text-cyan-400/50 tracking-widest uppercase">Gallery 05 — Architecture</p>
          </div>
          <div className="absolute top-[240vh] right-[10%]">
            <p className="text-xs font-mono text-emerald-400/50 tracking-widest uppercase">Gallery 06 — Final Selects</p>
          </div>

          {/* Category tags */}
          <div className="absolute top-[18vh] left-[60%] flex gap-2">
            <span className="text-[9px] font-mono text-emerald-400/50 border border-emerald-400/20 rounded px-1.5 py-0.5">35mm</span>
            <span className="text-[9px] font-mono text-zinc-500/50 border border-zinc-600/20 rounded px-1.5 py-0.5">color</span>
          </div>
          <div className="absolute top-[72vh] left-[8%] flex gap-2">
            <span className="text-[9px] font-mono text-cyan-400/50 border border-cyan-400/20 rounded px-1.5 py-0.5">digital</span>
            <span className="text-[9px] font-mono text-zinc-500/50 border border-zinc-600/20 rounded px-1.5 py-0.5">b&w</span>
          </div>
          <div className="absolute top-[125vh] right-[35%] flex gap-2">
            <span className="text-[9px] font-mono text-emerald-400/40 border border-emerald-400/15 rounded px-1.5 py-0.5">medium format</span>
            <span className="text-[9px] font-mono text-zinc-500/40 border border-zinc-600/15 rounded px-1.5 py-0.5">night</span>
          </div>
          <div className="absolute top-[175vh] left-[42%] flex gap-2">
            <span className="text-[9px] font-mono text-cyan-400/40 border border-cyan-400/15 rounded px-1.5 py-0.5">expired film</span>
          </div>
          <div className="absolute top-[230vh] left-[55%] flex gap-2">
            <span className="text-[9px] font-mono text-emerald-400/40 border border-emerald-400/15 rounded px-1.5 py-0.5">editorial</span>
            <span className="text-[9px] font-mono text-zinc-500/40 border border-zinc-600/15 rounded px-1.5 py-0.5">selected</span>
          </div>

          {/* Bold foreground text */}
          <div className="absolute top-[35vh] left-[8%]">
            <h2 className="text-8xl font-black text-zinc-100 tracking-tighter">IMAGES</h2>
            <p className="text-sm font-mono text-emerald-400/70 mt-1">19 frames · scattered depth</p>
          </div>
          <div className="absolute top-[155vh] right-[10%] text-right">
            <h2 className="text-6xl font-black text-zinc-200 tracking-tighter">GALLERY</h2>
            <p className="text-sm font-mono text-cyan-400/50 mt-1">multi-plane composition</p>
          </div>
          <div className="absolute top-[260vh] left-[12%]">
            <h2 className="text-7xl font-black text-zinc-100 tracking-tighter">ARCHIVE</h2>
            <p className="text-xs font-mono text-zinc-500 mt-1">◆ end of collection</p>
          </div>
        </div>

        {/* ===== LAYER 1: Slow background photos ===== */}
        <div className="pi-slow absolute inset-0 pointer-events-none">
          <PhotoCard photo={photos[0]} />
          <PhotoCard photo={photos[4]} />
          <PhotoCard photo={photos[7]} />
          <PhotoCard photo={photos[10]} />
          <PhotoCard photo={photos[14]} />
          <PhotoCard photo={photos[17]} />
        </div>

        {/* ===== LAYER 2: Medium speed photos ===== */}
        <div className="pi-medium absolute inset-0 pointer-events-none">
          <PhotoCard photo={photos[1]} />
          <PhotoCard photo={photos[3]} />
          <PhotoCard photo={photos[5]} />
          <PhotoCard photo={photos[8]} />
          <PhotoCard photo={photos[11]} />
          <PhotoCard photo={photos[13]} />
          <PhotoCard photo={photos[15]} />
          <PhotoCard photo={photos[18]} />
        </div>

        {/* ===== LAYER 3: Fast foreground photos ===== */}
        <div className="pi-fast absolute inset-0 pointer-events-none">
          <PhotoCard photo={photos[2]} />
          <PhotoCard photo={photos[6]} />
          <PhotoCard photo={photos[9]} />
          <PhotoCard photo={photos[12]} />
          <PhotoCard photo={photos[16]} />
        </div>

        {/* ===== HORIZONTAL DRIFTING PHOTOS ===== */}
        <div className="pi-drift-r absolute inset-0 pointer-events-none">
          <div className="absolute top-[42vh] left-[0%] w-16 h-px bg-gradient-to-r from-emerald-400/25 to-transparent" />
          <div className="absolute top-[108vh] left-[3%] w-20 h-px bg-gradient-to-r from-cyan-400/20 to-transparent" />
          <div className="absolute top-[178vh] left-[0%] w-24 h-px bg-gradient-to-r from-emerald-400/15 to-transparent" />
          <div className="absolute top-[248vh] left-[2%] w-16 h-px bg-gradient-to-r from-zinc-500/20 to-transparent" />
        </div>

        <div className="pi-drift-l absolute inset-0 pointer-events-none">
          <div className="absolute top-[62vh] right-[0%] w-20 h-px bg-gradient-to-l from-cyan-400/20 to-transparent" />
          <div className="absolute top-[128vh] right-[2%] w-24 h-px bg-gradient-to-l from-emerald-400/15 to-transparent" />
          <div className="absolute top-[198vh] right-[0%] w-16 h-px bg-gradient-to-l from-zinc-500/15 to-transparent" />
          <div className="absolute top-[268vh] right-[3%] w-20 h-px bg-gradient-to-l from-cyan-400/15 to-transparent" />
        </div>

        {/* ===== REVERSE LAYER ===== */}
        <div className="pi-reverse absolute inset-0 pointer-events-none">
          <div className="absolute top-[15vh] right-[5%]">
            <span className="text-[10px] font-mono text-zinc-600 tracking-widest">↑ COUNTER-SCROLL</span>
          </div>
          <div className="absolute top-[50vh] left-[72%] w-8 h-8 rounded-full border-2 border-dashed border-zinc-600/15" />
          <div className="absolute top-[85vh] right-[68%] w-6 h-6 rounded-full border-2 border-dashed border-emerald-400/10" />
          <div className="absolute top-[120vh] left-[70%]">
            <span className="text-[10px] font-mono text-zinc-600/30 tracking-widest">REVERSE</span>
          </div>
          <div className="absolute top-[160vh] right-[65%] w-10 h-10 rounded-full border-2 border-dashed border-cyan-400/10" />
        </div>

        {/* ===== GHOST TEXT ===== */}
        <div className="pi-slow absolute inset-0 pointer-events-none">
          <div className="absolute top-[60vh] right-[5%]">
            <h2 className="text-7xl font-bold text-zinc-300/8 tracking-tighter">FILM</h2>
          </div>
          <div className="absolute top-[110vh] left-[5%]">
            <h2 className="text-8xl font-bold text-emerald-400/6 tracking-tighter">FOCUS</h2>
          </div>
          <div className="absolute top-[170vh] right-[8%]">
            <h2 className="text-6xl font-bold text-cyan-400/6 tracking-tighter">GRAIN</h2>
          </div>
          <div className="absolute top-[225vh] left-[10%]">
            <h2 className="text-7xl font-bold text-zinc-300/6 tracking-tighter">LIGHT</h2>
          </div>
        </div>

        {/* Fixed label */}
        <div className="absolute top-4 left-4 z-10">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">↓ SCROLL TO BROWSE</p>
        </div>

        <div className="absolute bottom-[5vh] w-full text-center">
          <p className="text-xs font-mono text-zinc-600">◆ End of gallery</p>
        </div>
      </div>
    </div>
  );
}
