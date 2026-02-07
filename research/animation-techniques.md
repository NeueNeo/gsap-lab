# GSAP Animation Cookbook
> Practical techniques for React + Tailwind sites. Each recipe: title, description, code, notes.
> 
> **Last updated:** 2025-02-07  
> **Sources:** gsap.com docs, Olivier Larose tutorials, Frontend Horse, CodePen community, Awwwards breakdowns

---

## Table of Contents

1. [Setup & React Integration](#1-setup--react-integration)
2. [Core Animation Patterns](#2-core-animation-patterns)
3. [Easing Reference](#3-easing-reference)
4. [Magnetic Cursor Effects](#4-magnetic-cursor-effects)
5. [Text Animation (Free SplitText Alternatives)](#5-text-animation-free-splittext-alternatives)
6. [Card Hover 3D Tilt](#6-card-hover-3d-tilt)
7. [Page Transitions](#7-page-transitions)
8. [Micro-Interactions](#8-micro-interactions)
9. [Liquid / Elastic Transitions](#9-liquid--elastic-transitions)
10. [SVG Morph Animations](#10-svg-morph-animations)
11. [Flip Plugin (Layout Animations)](#11-flip-plugin-layout-animations)
12. [Loading & Skeleton Animations](#12-loading--skeleton-animations)
13. [Drawer / Modal Choreography](#13-drawer--modal-choreography)
14. [Infinite / Looping Animations](#14-infinite--looping-animations)
15. [Motion Path](#15-motion-path)
16. [Performance Tips](#16-performance-tips)

---

## 1. Setup & React Integration

### Installation

```bash
npm install gsap @gsap/react
```

### useGSAP Hook — The Foundation

`useGSAP` is a drop-in replacement for `useEffect`/`useLayoutEffect` that auto-cleans up all GSAP animations via `gsap.context()`. This is **critical** in React 18's strict mode (which double-fires effects).

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function AnimatedBox() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All selector text is scoped to container
    gsap.to('.box', { x: 200, rotation: 360, duration: 1 });
  }, { scope: container }); // <-- scope!

  return (
    <div ref={container}>
      <div className="box w-16 h-16 bg-cyan-500 rounded-lg" />
    </div>
  );
}
```

**Key points:**
- `scope: container` means `.box` only matches descendants of the container ref
- All animations auto-revert on unmount
- Defaults to empty dependency array `[]` (run once on mount)

### contextSafe — For Event Handlers

Animations created *after* the hook executes (click handlers, timeouts) must be wrapped in `contextSafe` to be tracked for cleanup:

```tsx
function ClickAnimation() {
  const container = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: container });

  // ✅ Wrapped — will be cleaned up
  const handleClick = contextSafe(() => {
    gsap.to('.box', { rotation: '+=90', scale: 1.2, duration: 0.3 });
  });

  return (
    <div ref={container}>
      <div className="box cursor-pointer" onClick={handleClick} />
    </div>
  );
}
```

### Config Object Options

```tsx
useGSAP(() => {
  // animations...
}, {
  dependencies: [someState],   // re-run when deps change
  scope: containerRef,          // scope selector text
  revertOnUpdate: true,         // revert animations when deps change (default: false)
});
```

### gsap.context() (Lower Level)

If you need manual control without the hook:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.box', { x: 100 });
  }, containerRef);

  return () => ctx.revert(); // cleanup
}, []);
```

**Adding to context after creation:**

```tsx
const ctx = gsap.context(() => { /* initial */ }, containerRef);

// Later (event handlers, etc.)
ctx.add(() => {
  gsap.to('.box', { y: 50 }); // gets tracked
});

// Cleanup
ctx.revert();
```

---

## 2. Core Animation Patterns

### Tweens: to, from, fromTo, set

```tsx
// Animate TO a state
gsap.to('.box', { x: 200, opacity: 1, duration: 1 });

// Animate FROM a state (back to current CSS)
gsap.from('.box', { y: -100, opacity: 0, duration: 0.8 });

// Define both start and end
gsap.fromTo('.box', 
  { opacity: 0, y: 50 },   // from
  { opacity: 1, y: 0, duration: 0.6 }  // to
);

// Instant set (zero-duration tween)
gsap.set('.box', { transformOrigin: 'center center' });
```

### Timelines — Sequencing

Timelines are containers for tweens with full playback control:

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'power2.out' }
  });

  tl.from('.hero-title', { y: 100, opacity: 0 })
    .from('.hero-subtitle', { y: 50, opacity: 0 }, '-=0.4')  // overlap by 0.4s
    .from('.hero-cta', { scale: 0, opacity: 0 }, '-=0.2')
    .from('.hero-image', { x: 100, opacity: 0 }, '<');         // start same time as previous
}, { scope: container });
```

### Position Parameter (The Secret Weapon)

Controls *when* tweens fire within a timeline:

| Syntax | Meaning |
|--------|---------|
| `3` | At exactly 3 seconds |
| `"+=1"` | 1 second after end of timeline |
| `"-=0.5"` | Overlap 0.5s with previous |
| `"<"` | Start of most recent tween |
| `">"` | End of most recent tween |
| `"<0.5"` | 0.5s after start of most recent |
| `">-0.2"` | 0.2s before end of most recent |
| `"myLabel"` | At a named label |
| `"myLabel+=1"` | 1s after label |

### Labels

```tsx
const tl = gsap.timeline();

tl.addLabel('intro', 0)
  .to('.box1', { x: 100 }, 'intro')
  .to('.box2', { x: 100 }, 'intro+=0.2')
  .addLabel('reveal', '>')
  .to('.content', { opacity: 1 }, 'reveal')
  .to('.sidebar', { x: 0 }, 'reveal+=0.1');

// Jump to a label
tl.play('reveal');
```

### Staggers

Add cascading delays across multiple elements:

```tsx
// Simple stagger
gsap.from('.card', { 
  y: 60, opacity: 0, duration: 0.6, 
  stagger: 0.15 
});

// Advanced stagger (grid-aware)
gsap.from('.grid-item', {
  scale: 0, opacity: 0,
  duration: 0.5,
  stagger: {
    each: 0.05,         // 0.05s between each
    from: 'center',     // emanate from center ("start", "end", "edges", "random", or index)
    grid: 'auto',       // auto-detect grid layout
    ease: 'power2.out', // easing for stagger distribution (not the tween ease)
  }
});

// Function-based stagger (full control)
gsap.from('.item', {
  y: 80, opacity: 0,
  stagger: (index, target, list) => {
    return index * 0.1 + Math.random() * 0.05; // custom delay logic
  }
});
```

**Grid stagger values for `from`:**
- `"start"` — top-left
- `"center"` — center outward
- `"edges"` — edges inward
- `"end"` — bottom-right
- `"random"` — random order
- `[0.5, 0.5]` — normalized position (center)
- `[1, 0]` — top-right corner

### Keyframes

Animate one target through multiple steps in a single tween:

```tsx
// Array-based (values distributed evenly)
gsap.to('.box', {
  keyframes: {
    x: [0, 100, 100, 0, 0],
    y: [0, 0, 100, 100, 0],
    ease: 'none',
    easeEach: 'power1.inOut'
  },
  duration: 3
});

// Object-based (sequential steps)
gsap.to('.box', {
  keyframes: [
    { x: 100, duration: 0.5, ease: 'power2.out' },
    { y: 100, duration: 0.5 },
    { rotation: 360, duration: 1, ease: 'back.out(1.7)' },
  ]
});

// Percentage-based (CSS-like)
gsap.to('.box', {
  keyframes: {
    '0%':   { x: 0, y: 0 },
    '25%':  { x: 100, y: 0 },
    '50%':  { x: 100, y: 100, ease: 'sine.out' },
    '100%': { x: 0, y: 0 },
    easeEach: 'power1.inOut'
  },
  duration: 2
});
```

### Timeline Nesting (Modular Choreography)

```tsx
function heroIntro() {
  const tl = gsap.timeline();
  tl.from('.hero-bg', { scale: 1.2, opacity: 0, duration: 1.2 })
    .from('.hero-text', { y: 80, opacity: 0 }, '-=0.6');
  return tl;
}

function navReveal() {
  const tl = gsap.timeline();
  tl.from('.nav-item', { y: -20, opacity: 0, stagger: 0.1 });
  return tl;
}

function contentFade() {
  const tl = gsap.timeline();
  tl.from('.content-block', { y: 40, opacity: 0, stagger: 0.2 });
  return tl;
}

// Master timeline
const master = gsap.timeline();
master
  .add(heroIntro())
  .add(navReveal(), '-=0.3')
  .add(contentFade(), '-=0.5');
```

**When to use:** Complex page load sequences, multi-section reveals, anything with 3+ coordinated animations.

### Timeline Defaults

```tsx
const tl = gsap.timeline({
  defaults: { duration: 0.8, ease: 'power3.out' }
});

// Children inherit defaults — override per-tween as needed
tl.from('.a', { x: -100 })
  .from('.b', { y: 50 })
  .from('.c', { scale: 0, ease: 'back.out(2)' }); // override ease
```

### Playback Control

```tsx
const tl = gsap.timeline({ paused: true });
// ... build timeline ...

tl.play();           // play from current position
tl.pause();
tl.reverse();
tl.restart();
tl.seek(1.5);        // jump to 1.5 seconds
tl.progress(0.5);    // jump to 50%
tl.timeScale(2);     // double speed
tl.timeScale(0.5);   // half speed
```

---

## 3. Easing Reference

GSAP's default ease is `"power1.out"`.

### Standard Eases

Each has `.in`, `.out`, `.inOut` variants:

| Ease | Feel | Use For |
|------|------|---------|
| `"none"` / `"linear"` | Constant speed | Continuous rotations, progress bars |
| `"power1"` | Subtle | General UI, subtle transitions |
| `"power2"` | Medium | Most animations, good default |
| `"power3"` | Strong | Dramatic entrances/exits |
| `"power4"` | Very strong | Hero reveals, attention-grabbing |
| `"back(1.7)"` | Overshoots | Playful UI, button presses, modal enters |
| `"elastic(1, 0.3)"` | Springy | Notifications, playful elements |
| `"bounce"` | Bounces at end | Drop-in effects, playful UI |
| `"circ"` | Circular curve | Clean, modern feel |
| `"expo"` | Extreme | Page transitions, cinematic reveals |
| `"sine"` | Gentle | Hover states, subtle motion |

### Direction Modifiers

```
ease: "power2.out"    // fast start, slow end (most common for entrances)
ease: "power2.in"     // slow start, fast end (good for exits)
ease: "power2.inOut"  // slow-fast-slow (good for state transitions)
```

### Custom Ease

```tsx
// Register a reusable custom ease
gsap.registerEase('myEase', (progress) => {
  return 1 - Math.pow(1 - progress, 5); // custom curve
});

// Or use CustomEase plugin (Club member)
// CustomEase.create("myEase", "M0,0 C0.14,0 0.24,0.38 0.36,0.54 ...");
```

### quickTo (High-Performance Repeating Animations)

For things that need to animate repeatedly to new values (like cursor followers):

```tsx
const xTo = gsap.quickTo('.cursor', 'x', { duration: 0.4, ease: 'power3' });
const yTo = gsap.quickTo('.cursor', 'y', { duration: 0.4, ease: 'power3' });

window.addEventListener('mousemove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

**When to use:** Cursor followers, mouse-tracking effects, anything that updates very frequently.

---

## 4. Magnetic Cursor Effects

### Magnetic Button (GSAP + React)

Elements that subtly pull toward the cursor when nearby. Premium feel seen on Awwwards sites.

```tsx
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

function MagneticButton({ children, strength = 0.3, className = '' }) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power3.out',
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  return (
    <button
      ref={ref}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
```

### Magnetic with Distance Threshold

Only activates when cursor is within a radius:

```tsx
function MagneticArea({ children, radius = 150, strength = 0.3 }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          ease: 'power3.out',
        });
      } else {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [radius, strength]);

  return <div ref={ref}>{children}</div>;
}
```

### Smooth Custom Cursor

A cursor follower with blend-mode mixing:

```tsx
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    gsap.to(cursorRef.current, {
      scale: isHovering ? 3 : 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isHovering]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
    />
  );
}
```

**CSS for cursor hiding:**
```css
/* Hide default cursor on desktop */
@media (hover: hover) {
  * { cursor: none !important; }
}
```

**When to use:** Portfolio sites, agency sites, creative/editorial. Skip on mobile.

---

## 5. Text Animation (Free SplitText Alternatives)

SplitText is a paid GSAP plugin. Here are free alternatives:

### Option A: split-type (npm package, free)

```bash
npm install split-type
```

```tsx
import SplitType from 'split-type';

function AnimatedHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const split = new SplitType(ref.current, { types: 'words,chars' });

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      rotateX: -90,
      stagger: 0.03,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });

    // Cleanup: revert split on unmount
    return () => split.revert();
  }, { scope: ref });

  return (
    <h1 ref={ref} className="text-5xl font-bold overflow-hidden">
      {text}
    </h1>
  );
}
```

### Option B: splitting.js (free, CSS-based)

```bash
npm install splitting
```

### Option C: Manual React Split (No Dependencies)

Full control, no external library needed:

```tsx
function SplitText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll('.char');
    if (!chars) return;

    gsap.from(chars, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.03,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em] overflow-hidden">
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className="char inline-block"
              style={{ display: 'inline-block' }} // critical for transforms
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
```

**Important:** Characters MUST be `display: inline-block` for transforms to work.

### Text Reveal (Masked Slide-Up)

The classic "text rising from behind a line" seen everywhere on Awwwards:

```tsx
function TextReveal({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = ref.current?.querySelectorAll('.word');
    gsap.from(words!, {
      yPercent: 100,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power4.out',
    });
  }, { scope: ref });

  return (
    <div ref={ref}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <span className="word inline-block">{word}</span>
        </span>
      ))}
    </div>
  );
}
```

### Cylinder Rotation Effect

Letters appear as if rotating on an invisible cylinder (Pete Barr technique):

```tsx
// After splitting text into chars:
gsap.from(chars, {
  rotationX: -90,
  transformOrigin: 'center center -100px', // <-- key: origin behind the letter in 3D
  opacity: 0,
  stagger: 0.04,
  duration: 0.6,
  ease: 'power2.out',
});
```

Increase `-100px` for a larger rotation radius. Works beautifully for headings.

### Typewriter Effect

```tsx
function Typewriter({ text, speed = 0.05 }: { text: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const chars = ref.current?.querySelectorAll('.char');
    gsap.from(chars!, {
      opacity: 0,
      stagger: speed,
      duration: 0.01,
      ease: 'none',
    });
  }, { scope: ref });

  return (
    <span ref={ref}>
      {text.split('').map((char, i) => (
        <span key={i} className="char">{char}</span>
      ))}
    </span>
  );
}
```

---

## 6. Card Hover 3D Tilt

### Basic 3D Tilt with GSAP

Maps mouse position within the card to rotation values:

```tsx
function TiltCard({ children, maxTilt = 10 }: { children: React.ReactNode; maxTilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.3,
      ease: 'power1.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={ref}
      className="relative rounded-2xl bg-zinc-900 p-6 will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
```

### 3D Tilt with Glare / Light Effect

```tsx
function GlareTiltCard({ children }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    gsap.to(el, {
      rotateX: (y - 0.5) * -20,
      rotateY: (x - 0.5) * 20,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power1.out',
    });

    // Move glare to follow cursor
    gsap.to(glare, {
      opacity: 0.15,
      x: x * 100 + '%',
      y: y * 100 + '%',
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.6, ease: 'elastic.out(1, 0.5)',
    });
    gsap.to(glareRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl bg-zinc-900"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare overlay */}
      <div
        ref={glareRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-white opacity-0 blur-[60px] pointer-events-none"
      />
      <div style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </div>
  );
}
```

### Dynamic Shadow with Tilt

From the CodePen community — shadow direction follows the tilt:

```tsx
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = el.getBoundingClientRect();
  const centerX = (e.clientX - rect.left - rect.width / 2);
  const centerY = (e.clientY - rect.top - rect.height / 2);
  const distance = Math.sqrt(centerX ** 2 + centerY ** 2);

  gsap.to(el, {
    rotateX: centerY / -50,
    rotateY: centerX / 50,
    transformPerspective: 1000,
    boxShadow: `${-centerX / 5}px ${-centerY / 5}px ${distance / 3}px rgba(0,0,0,0.2)`,
    duration: 0.4,
    ease: 'power1.out',
  });
};
```

**When to use:** Product cards, portfolio items, pricing cards. The glare version is premium-tier.

---

## 7. Page Transitions

### Basic Enter/Exit Pattern

```tsx
// Page enter (call on route mount)
function pageEnter(container: HTMLElement) {
  const tl = gsap.timeline();

  tl.set(container, { autoAlpha: 0 })
    .from(container, { autoAlpha: 0, y: 30, duration: 0.6, ease: 'power2.out' })
    .from('.page-title', { y: 80, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.page-content > *', { 
      y: 40, opacity: 0, 
      stagger: 0.1, duration: 0.6 
    }, '-=0.4');

  return tl;
}

// Page exit (call before route change)
function pageExit(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(container, {
      autoAlpha: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}
```

### Wipe Transition (Overlay Slide)

```tsx
function WipeTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const animateOut = () => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });

      tl.to(overlayRef.current, {
        scaleY: 1,
        transformOrigin: 'bottom',
        duration: 0.5,
        ease: 'power3.inOut',
      });
    });
  };

  const animateIn = () => {
    const tl = gsap.timeline();

    tl.set(overlayRef.current, { transformOrigin: 'top' })
      .to(overlayRef.current, {
        scaleY: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.1,
      });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black z-50 origin-bottom scale-y-0 pointer-events-none"
    />
  );
}
```

### Multi-Column Wipe (Staggered Bars)

```tsx
function ColumnWipe({ columns = 5 }) {
  const barsRef = useRef<HTMLDivElement>(null);

  const enter = () => {
    const bars = barsRef.current?.children;
    return gsap.to(bars!, {
      scaleY: 1,
      transformOrigin: 'bottom',
      stagger: 0.05,
      duration: 0.4,
      ease: 'power3.inOut',
    });
  };

  const exit = () => {
    const bars = barsRef.current?.children;
    return gsap.to(bars!, {
      scaleY: 0,
      transformOrigin: 'top',
      stagger: 0.05,
      duration: 0.4,
      ease: 'power3.inOut',
    });
  };

  return (
    <div ref={barsRef} className="fixed inset-0 flex z-50 pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1 bg-black scale-y-0" />
      ))}
    </div>
  );
}
```

**When to use:** Route transitions in SPAs. The wipe and column variants feel cinematic.

---

## 8. Micro-Interactions

### Button Press Feedback

```tsx
function PressButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope: ref });

  const handleMouseDown = contextSafe(() => {
    gsap.to(ref.current, { scale: 0.95, duration: 0.1, ease: 'power2.in' });
  });

  const handleMouseUp = contextSafe(() => {
    gsap.to(ref.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
  });

  return (
    <button
      ref={ref}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </button>
  );
}
```

### Hover Scale + Glow

```tsx
function HoverCard({ children }) {
  const ref = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP();

  const onEnter = contextSafe(() => {
    gsap.to(ref.current, {
      scale: 1.03,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(ref.current, {
      scale: 1,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      duration: 0.4,
      ease: 'power2.out',
    });
  });

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="rounded-xl bg-white p-6 shadow-sm transition-none"
    >
      {children}
    </div>
  );
}
```

### Hamburger Menu Toggle

```tsx
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(midRef.current, { opacity: 0, duration: 0.1 });
      gsap.to(topRef.current, { y: 8, rotation: 45, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(botRef.current, { y: -8, rotation: -45, duration: 0.3, ease: 'power2.inOut' });
    } else {
      gsap.to(midRef.current, { opacity: 1, duration: 0.2, delay: 0.1 });
      gsap.to(topRef.current, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(botRef.current, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2 w-8 cursor-pointer">
      <span ref={topRef} className="h-0.5 w-full bg-white origin-center" />
      <span ref={midRef} className="h-0.5 w-full bg-white" />
      <span ref={botRef} className="h-0.5 w-full bg-white origin-center" />
    </div>
  );
}
```

### Nav Link Hover Underline

```tsx
function NavLink({ text, href }: { text: string; href: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP();

  const onEnter = contextSafe(() => {
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.3, ease: 'power2.out' }
    );
  });

  const onLeave = contextSafe(() => {
    gsap.to(lineRef.current, {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: 0.3,
      ease: 'power2.in',
    });
  });

  return (
    <a href={href} className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {text}
      <span
        ref={lineRef}
        className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0"
      />
    </a>
  );
}
```

---

## 9. Liquid / Elastic Transitions

### Elastic Ease Patterns

The secret to liquid/elastic feel is the right ease:

```tsx
// Snappy elastic
ease: 'elastic.out(1, 0.3)'

// Softer, more liquid
ease: 'elastic.out(0.7, 0.5)'

// Very bouncy
ease: 'elastic.out(1.2, 0.2)'

// Back ease — slight overshoot, more controlled
ease: 'back.out(1.7)'

// Stronger overshoot
ease: 'back.out(3)'
```

### Elastic Container Expansion

```tsx
function ElasticExpand({ children, isExpanded }: { children: React.ReactNode; isExpanded: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      height: isExpanded ? 'auto' : 0,
      duration: 0.6,
      ease: isExpanded ? 'elastic.out(1, 0.5)' : 'power3.inOut',
      overflow: 'hidden',
    });
  }, [isExpanded]);

  return (
    <div ref={ref} className="overflow-hidden">
      {children}
    </div>
  );
}
```

### Blob / Morphing Shape

Using SVG filter for liquid effect:

```tsx
function LiquidButton({ text }: { text: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP();

  const onEnter = contextSafe(() => {
    gsap.to(ref.current, {
      scale: 1.05,
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(ref.current, {
      scale: 1,
      borderRadius: '50%',
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  });

  return (
    <button
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="px-8 py-4 bg-purple-600 text-white rounded-full"
    >
      {text}
    </button>
  );
}
```

### SVG Filter Gooey Effect

Apply to a container for elements that merge when close:

```tsx
function GooeyContainer({ children }: { children: React.ReactNode }) {
  return (
    <>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: 'url(#goo)' }}>
        {children}
      </div>
    </>
  );
}
```

---

## 10. SVG Morph Animations

### MorphSVG Plugin (GSAP Club)

If you have a GSAP membership, MorphSVG is the gold standard:

```tsx
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
gsap.registerPlugin(MorphSVGPlugin);

gsap.to('#circle', {
  morphSVG: '#star',
  duration: 1,
  ease: 'power2.inOut',
});
```

### Free Alternative: CSS clip-path Morphing

GSAP can animate `clipPath` for shape transitions:

```tsx
function MorphShape() {
  const ref = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP();

  const morph = contextSafe(() => {
    gsap.to(ref.current, {
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // diamond
      duration: 0.8,
      ease: 'power2.inOut',
    });
  });

  const reset = contextSafe(() => {
    gsap.to(ref.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // rectangle
      duration: 0.8,
      ease: 'power2.inOut',
    });
  });

  return (
    <div
      ref={ref}
      className="w-64 h-64 bg-gradient-to-br from-cyan-500 to-purple-600"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      onMouseEnter={morph}
      onMouseLeave={reset}
    />
  );
}
```

### Free Alternative: Animating SVG Path Data

You can tween between path strings using `flubber` or manually interpolating simple paths:

```bash
npm install flubber
```

```tsx
import { interpolate } from 'flubber';

function SVGMorph() {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef({ t: 0 });

  const circlePath = 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z';
  const starPath = 'M50,5 L61,40 L98,40 L68,62 L79,97 L50,75 L21,97 L32,62 L2,40 L39,40 Z';

  useGSAP(() => {
    const interpolator = interpolate(circlePath, starPath);

    gsap.to(progressRef.current, {
      t: 1,
      duration: 1.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        if (pathRef.current) {
          pathRef.current.setAttribute('d', interpolator(progressRef.current.t));
        }
      },
    });
  });

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      <path ref={pathRef} d={circlePath} fill="currentColor" />
    </svg>
  );
}
```

---

## 11. Flip Plugin (Layout Animations)

The Flip plugin animates between layout states seamlessly. Think of it as "take a snapshot, make DOM changes, animate the difference."

### Setup

```tsx
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);
```

### Basic Flip: Toggle Layout

```tsx
function FlipGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const toggleLayout = contextSafe(() => {
    // 1. Snapshot current state
    const state = Flip.getState('.card');

    // 2. Make DOM/class changes
    setIsExpanded(!isExpanded);

    // 3. Animate from snapshot to new state
    // (use requestAnimationFrame to ensure React has rendered)
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.05,
        absolute: true, // prevents layout jump during animation
      });
    });
  });

  return (
    <div ref={containerRef}>
      <button onClick={toggleLayout}>Toggle</button>
      <div className={isExpanded ? 'grid grid-cols-1' : 'grid grid-cols-3 gap-4'}>
        {items.map(item => (
          <div key={item.id} className="card">{item.content}</div>
        ))}
      </div>
    </div>
  );
}
```

### Flip with Enter/Leave

```tsx
const toggleItem = contextSafe((id: string) => {
  const state = Flip.getState('.item');

  // Toggle visibility
  setVisibleItems(prev => 
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );

  requestAnimationFrame(() => {
    Flip.from(state, {
      duration: 0.5,
      ease: 'power1.inOut',
      absolute: true,
      onEnter: (elements) => gsap.fromTo(elements, 
        { opacity: 0, scale: 0 }, 
        { opacity: 1, scale: 1, duration: 0.4 }
      ),
      onLeave: (elements) => gsap.to(elements, 
        { opacity: 0, scale: 0, duration: 0.3 }
      ),
    });
  });
});
```

### Flip.fit() — Fit One Element to Another

```tsx
// Make element A fit perfectly over element B
Flip.fit(elementA, elementB, {
  scale: true,       // use scale instead of width/height
  duration: 0.5,
  ease: 'power2.out',
});
```

### Key Flip Options

| Option | Description |
|--------|-------------|
| `absolute: true` | Use position: absolute during flip (fixes flex/grid issues) |
| `scale: true` | Use scaleX/scaleY instead of width/height (better perf) |
| `nested: true` | Compensate for nested parent transforms |
| `fade: true` | Cross-fade between swapped elements (same `data-flip-id`) |
| `spin: true` | Add 360° rotation during flip |
| `prune: true` | Remove non-moving elements from animation |
| `toggleClass: "flipping"` | Add CSS class during animation |

**When to use:** Filter/sort animations, expand/collapse, layout toggle, tab changes, masonry rearrangement. Any time you change DOM positions and want smooth transitions.

---

## 12. Loading & Skeleton Animations

### Shimmer Skeleton (GSAP + Tailwind)

```tsx
function SkeletonLoader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.skeleton-line', 
      { backgroundPosition: '-200% 0' },
      {
        backgroundPosition: '200% 0',
        duration: 1.5,
        stagger: 0.1,
        repeat: -1,
        ease: 'none',
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="skeleton-line h-4 rounded bg-zinc-800"
          style={{
            background: 'linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%)',
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
}
```

### Orchestrated Loading Sequence

```tsx
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete });

    tl.from('.loading-logo', { scale: 0, rotation: -180, duration: 0.8, ease: 'back.out(1.7)' })
      .from('.loading-text', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .to('.loading-bar-fill', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' })
      .to('.loading-screen', { 
        yPercent: -100, 
        duration: 0.6, 
        ease: 'power3.inOut',
        delay: 0.2 
      });
  }, { scope: ref });

  return (
    <div ref={ref} className="loading-screen fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="loading-logo w-16 h-16 bg-cyan-500 rounded-xl" />
      <p className="loading-text mt-4 text-white">Loading...</p>
      <div className="mt-6 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="loading-bar-fill h-full bg-cyan-500 origin-left scale-x-0" />
      </div>
    </div>
  );
}
```

### Dot Spinner

```tsx
function DotSpinner() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to('.dot', {
      y: -15,
      duration: 0.4,
      ease: 'power2.out',
      stagger: {
        each: 0.15,
        repeat: -1,
        yoyo: true,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="flex gap-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="dot w-3 h-3 rounded-full bg-cyan-500" />
      ))}
    </div>
  );
}
```

---

## 13. Drawer / Modal Choreography

### Slide-In Drawer with Staggered Content

```tsx
function Drawer({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    if (isOpen) {
      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 })
        .to(drawerRef.current, { x: 0, duration: 0.5 }, '<')
        .from(contentRef.current?.children ?? [], {
          x: 30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.2');
    } else {
      tl.to(contentRef.current?.children ?? [], {
        x: 30, opacity: 0,
        stagger: 0.03, duration: 0.2,
        ease: 'power2.in',
      })
        .to(drawerRef.current, { x: '100%', duration: 0.4 }, '-=0.1')
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.2');
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 invisible opacity-0"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-80 bg-zinc-900 z-50 translate-x-full"
      >
        <div ref={contentRef} className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </>
  );
}
```

### Modal with Choreographed Enter

```tsx
function Modal({ isOpen, onClose, children }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, duration: 0.3 }
      )
        .fromTo(modalRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
          '-=0.15'
        );
    } else {
      const tl = gsap.timeline();
      tl.to(modalRef.current, { 
        scale: 0.9, opacity: 0, y: 30, 
        duration: 0.25, ease: 'power2.in' 
      })
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full mx-4">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

---

## 14. Infinite / Looping Animations

### Infinite Marquee / Ticker

The classic infinite scroll technique: two identical elements, seamless loop:

```tsx
function Marquee({ text, speed = 50 }: { text: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const width = el.children[0].clientWidth;
    const duration = width / speed;

    gsap.to(el.children, {
      xPercent: -100,
      duration,
      ease: 'none',
      repeat: -1,
    });
  }, { scope: ref });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={ref} className="inline-flex">
        <span className="inline-block px-4 text-4xl font-bold">{text}</span>
        <span className="inline-block px-4 text-4xl font-bold">{text}</span>
      </div>
    </div>
  );
}
```

### Infinite Rotate

```tsx
gsap.to('.spinner', {
  rotation: 360,
  duration: 2,
  ease: 'none',
  repeat: -1,
});
```

### Floating / Bobbing Animation

```tsx
gsap.to('.float-element', {
  y: -15,
  duration: 2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});
```

**Key to infinite loops:**
- Use `ease: 'none'` (linear) for seamless repeats
- Animate until endpoint matches starting point
- Duplicate the content for scroll/marquee effects

---

## 15. Motion Path

### Setup

```tsx
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);
```

### Animate Along an SVG Path

```tsx
gsap.to('.rocket', {
  motionPath: {
    path: '#flight-path',  // SVG path element
    align: '#flight-path',
    alignOrigin: [0.5, 0.5],
    autoRotate: true,      // element faces direction of travel
  },
  duration: 3,
  ease: 'power1.inOut',
});
```

### Animate Along Coordinates

```tsx
gsap.to('.element', {
  motionPath: {
    path: [
      { x: 0, y: 0 },
      { x: 100, y: -50 },
      { x: 200, y: 50 },
      { x: 300, y: 0 },
    ],
    curviness: 1.5,  // 0 = straight lines, higher = smoother curves
    autoRotate: 90,  // offset rotation by 90°
  },
  duration: 2,
});
```

### Orbital Animation

```tsx
gsap.to('.satellite', {
  motionPath: {
    path: 'M0,-100 A100,100 0 1,1 0,100 A100,100 0 1,1 0,-100',
    align: 'self',
    alignOrigin: [0.5, 0.5],
  },
  duration: 4,
  ease: 'none',
  repeat: -1,
  transformOrigin: '50% 50%',
});
```

---

## 16. Performance Tips

### The Golden Rules

1. **Always prefer `transform` and `opacity`** — they don't trigger layout/paint
2. **Avoid animating these:** `width`, `height`, `top`, `left`, `margin`, `padding` (causes reflow)
3. **Use `will-change` sparingly** — hint to browser, remove when not animating

### GSAP-Specific Optimizations

```tsx
// Use autoAlpha instead of opacity (also toggles visibility: hidden when 0)
gsap.to(el, { autoAlpha: 0 }); // visibility: hidden when fully transparent

// Use scale: true in Flip for better perf
Flip.from(state, { scale: true }); // scaleX/Y instead of width/height

// Force GPU acceleration
gsap.set(el, { force3D: true }); // adds translateZ(0)

// Use quickTo for high-frequency updates (cursor, scroll-linked)
const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3' });
```

### React-Specific

```tsx
// 1. Always clean up with useGSAP or gsap.context()
// 2. Use refs instead of selector text when possible for direct element access
// 3. Avoid re-creating animations on every render — use dependency arrays
// 4. Use contextSafe for event-driven animations
// 5. Memoize animation callbacks with useCallback when passed as props

// BAD: animation recreated on every render
function Bad() {
  gsap.to('.box', { x: 100 }); // fires every render!
  return <div className="box" />;
}

// GOOD: animation only on mount
function Good() {
  useGSAP(() => {
    gsap.to('.box', { x: 100 });
  }); // empty deps = mount only
  return <div className="box" />;
}
```

### CSS Helpers (Tailwind)

```css
/* Add to elements that will be animated */
.will-animate {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Remove will-change after animation completes */
```

In Tailwind:
```html
<div className="will-change-transform backface-hidden">
```

### Debug Mode

```tsx
// Slow down all animations globally
gsap.globalTimeline.timeScale(0.2);

// Or add GSDevTools (GSAP Club)
import { GSDevTools } from 'gsap/GSDevTools';
gsap.registerPlugin(GSDevTools);
GSDevTools.create();
```

---

## Quick Reference: Ease Cheat Sheet

| Desired Feel | Ease |
|-------------|------|
| Clean UI default | `power2.out` |
| Dramatic entrance | `power4.out` or `expo.out` |
| Quick exit | `power2.in` |
| Smooth state change | `power2.inOut` |
| Playful / bouncy | `back.out(1.7)` |
| Very bouncy | `elastic.out(1, 0.3)` |
| Drop-in | `bounce.out` |
| Cinematic | `expo.inOut` |
| Constant (looping) | `none` |
| Gentle hover | `sine.out` |

---

## Quick Reference: Common Patterns

| Pattern | Method |
|---------|--------|
| Fade in on mount | `gsap.from(el, { opacity: 0, y: 20 })` |
| Staggered list | `gsap.from('.item', { opacity: 0, y: 30, stagger: 0.1 })` |
| Hover scale | `gsap.to(el, { scale: 1.05, duration: 0.3 })` |
| Click bounce | `gsap.to(el, { scale: 0.95 })` then `gsap.to(el, { scale: 1, ease: 'elastic' })` |
| Page reveal | Timeline with staged `.from()` calls |
| Layout animation | Flip.getState → DOM change → Flip.from |
| Cursor follower | `gsap.quickTo()` for x and y |
| Infinite loop | `repeat: -1, ease: 'none'` |
| Text reveal | Split into spans + overflow:hidden + `from { yPercent: 100 }` |
| 3D tilt | Mouse position → rotateX/rotateY with `transformPerspective` |

---

## Sources & Further Reading

- [GSAP Docs](https://gsap.com/docs/v3/)
- [GSAP React Guide](https://gsap.com/resources/React/)
- [gsap.context() Docs](https://gsap.com/docs/v3/GSAP/gsap.context()/)
- [Flip Plugin Docs](https://gsap.com/docs/v3/Plugins/Flip/)
- [Ease Visualizer](https://gsap.com/docs/v3/Eases/)
- [Keyframes Guide](https://gsap.com/resources/keyframes/)
- [Staggers Guide](https://gsap.com/resources/getting-started/Staggers/)
- [Timeline Docs](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Olivier Larose — Magnetic Button](https://blog.olivierlarose.com/tutorials/magnetic-button)
- [Frontend Horse — GSAP Techniques](https://frontend.horse/articles/amazing-animation-techniques-with-gsap/)
- [SplitType (free SplitText alt)](https://github.com/lukePeavey/SplitType)
- [Flubber (SVG morph)](https://github.com/veltman/flubber)
- [Awwwards GSAP Showcase](https://www.awwwards.com/websites/gsap/)
- [Made With GSAP](https://madewithgsap.com/)
- [freefrontend.com GSAP Collection](https://freefrontend.com/gsap-js/)
