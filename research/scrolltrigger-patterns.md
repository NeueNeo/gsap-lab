# GSAP ScrollTrigger — Advanced Patterns Reference

> Compiled 2026-02-07 from GSAP docs, community forums, CodePen, Stack Overflow, and tutorials.  
> All patterns assume GSAP 3.12+ with `@gsap/react` for React/Next.js integration.

---

## Table of Contents

1. [React/Next.js Setup & Cleanup](#1-reactnextjs-setup--cleanup)
2. [Pinning & Scrubbing Basics](#2-pinning--scrubbing-basics)
3. [Snap Scrolling (Full-Page & Section Snap)](#3-snap-scrolling)
4. [Horizontal Scroll Sections (Pin + Horizontal)](#4-horizontal-scroll-sections)
5. [containerAnimation — Nested ScrollTriggers](#5-containeranimation--nested-scrolltriggers)
6. [ScrollTrigger.batch() — Staggered Scroll Reveals](#6-scrolltriggerbatch--staggered-scroll-reveals)
7. [Parallax Depth Effects (Scale, Opacity, Blur)](#7-parallax-depth-effects)
8. [Scroll-Driven SVG Animations](#8-scroll-driven-svg-animations)
9. [SplitText + Scroll Reveals (Line-by-Line)](#9-splittext--scroll-reveals)
10. [Scroll Velocity Effects (Skew, Stretch)](#10-scroll-velocity-effects)
11. [Useful Utilities & Static Methods](#11-useful-utilities--static-methods)
12. [Common Pitfalls & Fixes](#12-common-pitfalls--fixes)

---

## 1. React/Next.js Setup & Cleanup

### Core Pattern: `useGSAP` hook

The `@gsap/react` package provides `useGSAP()` — a drop-in replacement for `useEffect`/`useLayoutEffect` with automatic GSAP cleanup via `gsap.context()`.

```bash
npm install gsap @gsap/react
```

```tsx
'use client'; // Required for Next.js App Router

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AnimatedSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Everything here is automatically cleaned up on unmount
    gsap.to('.box', {
      x: 500,
      scrollTrigger: {
        trigger: '.box',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: true, // dev only
      },
    });
  }, { scope: container }); // scope selector text to this container

  return (
    <div ref={container}>
      <div className="box">Animated</div>
    </div>
  );
}
```

### Context-Safe Event Handlers

Animations created *after* `useGSAP` executes (click handlers, timeouts) must be wrapped in `contextSafe`:

```tsx
const { contextSafe } = useGSAP({ scope: container });

const handleClick = contextSafe(() => {
  gsap.to('.box', { rotation: 360, duration: 1 });
});
```

### SSR Safety

`useGSAP` implements the isomorphic layout effect pattern — prefers `useLayoutEffect` but falls back to `useEffect` when `window` is undefined. Safe for Next.js SSR out of the box.

### State-Reactive Animations

```tsx
useGSAP(() => {
  gsap.to('.box', { x: endX });
}, { dependencies: [endX], scope: container, revertOnUpdate: true });
```

With `revertOnUpdate: true`, the entire context is reverted and re-created when dependencies change.

---

## 2. Pinning & Scrubbing Basics

### Pin + Scrub Timeline

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.panel',
      pin: true,                  // pin the trigger element
      start: 'top top',           // when top of panel hits top of viewport
      end: '+=500',               // pin for 500px of scrolling
      scrub: 1,                   // smooth 1s catch-up to scroll position
      anticipatePin: 1,           // prevent flash of unpinned content on fast scroll
    },
  });

  tl.from('.panel h2', { y: 50, autoAlpha: 0 })
    .from('.panel p', { y: 30, autoAlpha: 0 }, '-=0.3')
    .from('.panel img', { scale: 0.8, autoAlpha: 0 }, '-=0.2');
}, { scope: container });
```

### Key Config Notes

| Property | Purpose |
|----------|---------|
| `scrub: true` | Direct 1:1 link to scroll position |
| `scrub: 0.5` | 0.5s smoothing lag behind scroll |
| `pin: true` | Pin the trigger element |
| `pin: '.other'` | Pin a different element |
| `pinSpacing: false` | Don't add padding (use for `display: flex` parents) |
| `pinReparent: true` | Reparent to `<body>` to escape `transform` ancestors |
| `anticipatePin: 1` | Apply pin slightly early to prevent content flash |

### toggleActions (Non-Scrub)

For enter/leave triggered animations without scrub:

```ts
scrollTrigger: {
  trigger: '.section',
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play reverse play reverse',
  // Format: onEnter onLeave onEnterBack onLeaveBack
  // Values: play, pause, resume, restart, reverse, complete, reset, none
}
```

---

## 3. Snap Scrolling

### Section Snap (fullpage-style)

```tsx
useGSAP(() => {
  const panels = gsap.utils.toArray<HTMLElement>('.panel');

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });
  });

  // Snap to nearest section
  ScrollTrigger.create({
    snap: 1 / (panels.length - 1), // evenly spaced snap points
  });
}, { scope: container });
```

### Snap to Timeline Labels

```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    pin: true,
    start: 'top top',
    end: '+=3000',
    scrub: 1,
    snap: {
      snapTo: 'labels',            // snap to closest label
      duration: { min: 0.2, max: 3 }, // clamp snap duration
      delay: 0.2,                  // wait after last scroll event
      ease: 'power1.inOut',
    },
  },
});

tl.addLabel('intro')
  .from('.hero-text', { autoAlpha: 0, y: 50 })
  .addLabel('features')
  .from('.features', { autoAlpha: 0 })
  .addLabel('cta')
  .from('.cta', { scale: 0.9, autoAlpha: 0 })
  .addLabel('end');
```

### Directional Snap (v3.8+)

Default behavior: snapping goes in the direction the user last scrolled. Use `"labelsDirectional"` for even more intuitive feel:

```ts
snap: 'labelsDirectional'
```

### Full-Page Snap with ScrollTo

```tsx
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

useGSAP(() => {
  const sections = gsap.utils.toArray<HTMLElement>('.panel');

  function goToSection(i: number) {
    gsap.to(window, {
      scrollTo: { y: i * innerHeight, autoKill: false },
      duration: 0.85,
      ease: 'power3.inOut',
    });
  }

  sections.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      onEnter: () => goToSection(i),
    });
    ScrollTrigger.create({
      trigger: panel,
      start: 'bottom bottom',
      onEnterBack: () => goToSection(i),
    });
  });
}, { scope: container });
```

---

## 4. Horizontal Scroll Sections

### Pattern A: Pin Container + xPercent (Most Reliable in React)

```tsx
export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.h-panel');

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => '+=' + wrapperRef.current!.offsetWidth,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div ref={wrapperRef} className="flex overflow-hidden w-screen h-screen">
        {['#f00', '#0f0', '#00f', '#ff0'].map((color, i) => (
          <div
            key={i}
            className="h-panel flex-shrink-0 w-screen h-screen flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <h2 className="text-4xl text-white">Section {i + 1}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Pattern B: Wrapper Translation (Responsive)

Better for non-full-width panels:

```tsx
useGSAP(() => {
  const wrapper = document.querySelector('.h-wrapper') as HTMLElement;
  const slides = gsap.utils.toArray<HTMLElement>('.h-slide');

  // Calculate total scrollable distance
  const getScrollAmount = () => -(wrapper.scrollWidth - window.innerWidth);

  gsap.to(wrapper, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: '.h-section',
      start: 'top top',
      end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true, // recalculate on resize
    },
  });
}, { scope: container });
```

```css
.h-section { overflow: hidden; }
.h-wrapper {
  display: flex;
  width: max-content;
}
.h-slide {
  width: 50vw;     /* or any responsive width */
  height: 100vh;
  flex-shrink: 0;
}
```

### React Gotchas for Horizontal Scroll

1. **Always use `invalidateOnRefresh: true`** — recalculates widths on resize
2. **Don't animate the pinned element itself** — animate children or the inner wrapper
3. **Use `useGSAP`** with scope — ensures proper cleanup of pin spacers
4. **End value as function** — `end: () => '+=' + el.scrollWidth` for dynamic widths

---

## 5. containerAnimation — Nested ScrollTriggers

Trigger animations *inside* a horizontally-scrolling section based on when elements enter the fake-scroll viewport.

```tsx
useGSAP(() => {
  const sections = gsap.utils.toArray<HTMLElement>('.h-section');

  // Step 1: Create the horizontal scroll tween — KEEP A REFERENCE
  const scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none', // ← MUST be linear
    scrollTrigger: {
      trigger: '.h-container',
      pin: true,
      scrub: 0.1,
      end: '+=3000',
    },
  });

  // Step 2: Create ScrollTriggers INSIDE the horizontal sections
  // using containerAnimation to reference the horizontal tween
  gsap.from('.box-1', {
    y: -130,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.box-1',
      containerAnimation: scrollTween, // ← THE KEY
      start: 'left center',           // Note: use left/right for horizontal
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.box-2', {
    scale: 0.5,
    rotation: 360,
    scrollTrigger: {
      trigger: '.box-2',
      containerAnimation: scrollTween,
      start: 'left center',
      end: 'left 20%',
      scrub: true,
    },
  });
}, { scope: container });
```

### containerAnimation Rules

- The container's animation **must** use `ease: "none"` (linear)
- **No pinning** on containerAnimation-based ScrollTriggers
- **No snapping** on containerAnimation-based ScrollTriggers
- Use `left`/`right` keywords instead of `top`/`bottom` for start/end
- Avoid animating the trigger element horizontally (or offset start/end to compensate)

---

## 6. ScrollTrigger.batch() — Staggered Scroll Reveals

### Basic Card Grid Reveal

```tsx
useGSAP(() => {
  // Set initial state
  gsap.set('.card', { y: 100, autoAlpha: 0 });

  ScrollTrigger.batch('.card', {
    onEnter: (elements) => {
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        overwrite: true,
      });
    },
    onLeave: (elements) => {
      gsap.set(elements, { autoAlpha: 0, y: -100, overwrite: true });
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        overwrite: true,
      });
    },
    onLeaveBack: (elements) => {
      gsap.set(elements, { autoAlpha: 0, y: 100, overwrite: true });
    },
    start: '20px bottom',
    end: 'top top',
  });

  // Reset y=0 during refresh so positioning calculations are correct
  ScrollTrigger.addEventListener('refreshInit', () =>
    gsap.set('.card', { y: 0 })
  );
}, { scope: container });
```

### Advanced: Grid Stagger with batchMax

```tsx
ScrollTrigger.batch('.grid-item', {
  interval: 0.1,    // 100ms window to collect batch
  batchMax: 3,      // max 3 items per batch
  onEnter: (batch) =>
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: { each: 0.15, grid: [1, 3] },
      overwrite: true,
    }),
  onLeave: (batch) =>
    gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
  onEnterBack: (batch) =>
    gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
  onLeaveBack: (batch) =>
    gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
  start: '20px bottom',
});
```

### Responsive batchMax

```tsx
ScrollTrigger.batch('.grid-item', {
  batchMax: () => {
    // Return columns count based on viewport
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  },
  // ...
});
```

### One-Time Reveal (No Repeat)

```tsx
ScrollTrigger.batch('.reveal', {
  once: true,  // kill after first trigger
  onEnter: (elements) => {
    gsap.from(elements, {
      autoAlpha: 0,
      y: 60,
      stagger: 0.15,
    });
  },
});
```

---

## 7. Parallax Depth Effects

### Multi-Layer Parallax (Y-offset, Scale, Opacity, Blur)

```tsx
useGSAP(() => {
  // Layer configuration — different speeds = depth perception
  const layers = [
    { selector: '.parallax-bg',    yPercent: -50, scale: 1.2, opacity: 0.3, blur: 4 },
    { selector: '.parallax-mid',   yPercent: -30, scale: 1.1, opacity: 0.6, blur: 2 },
    { selector: '.parallax-front', yPercent: -10, scale: 1.0, opacity: 1.0, blur: 0 },
  ];

  layers.forEach(({ selector, yPercent, scale, opacity, blur }) => {
    gsap.to(selector, {
      yPercent,
      scale,
      opacity,
      filter: `blur(${blur}px)`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}, { scope: container });
```

### Image Parallax Inside Container (Lenis + GSAP)

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('.img-container').forEach((el) => {
    const img = el.querySelector('img')!;

    gsap.fromTo(img,
      { yPercent: -20 },
      {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          scrub: true,
        },
      }
    );
  });
}, { scope: container });
```

```css
.img-container {
  overflow: hidden;
  height: 400px;
}
.img-container img {
  width: 100%;
  height: 140%; /* Extra height for parallax travel */
  object-fit: cover;
}
```

### Depth-of-Field Parallax (Hero Section)

```tsx
useGSAP(() => {
  const hero = '.hero-section';

  // Background: slow, blurry, fading
  gsap.to('.hero-bg', {
    y: '40%',
    scale: 1.15,
    filter: 'blur(6px)',
    opacity: 0.4,
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });

  // Midground: medium speed
  gsap.to('.hero-elements', {
    y: '20%',
    scale: 1.05,
    filter: 'blur(2px)',
    opacity: 0.7,
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });

  // Foreground text: fastest, stays sharp
  gsap.to('.hero-title', {
    y: '60%',
    opacity: 0,
    scrollTrigger: { trigger: hero, start: 'top top', end: '50% top', scrub: true },
  });
}, { scope: container });
```

### Data-Attribute Driven Parallax (Reusable)

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '-100');
    gsap.to(el, {
      y: speed,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  });
}, { scope: container });
```

```html
<div data-parallax="-200">Fast layer</div>
<div data-parallax="-50">Slow layer</div>
```

---

## 8. Scroll-Driven SVG Animations

### SVG Path Draw on Scroll (stroke-dashoffset)

```tsx
useGSAP(() => {
  const path = document.querySelector('.draw-path') as SVGPathElement;
  const length = path.getTotalLength();

  // Set initial state: fully hidden
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.svg-container',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    },
  });
}, { scope: container });
```

### SVG Timeline on Scroll (Multiple Paths + Elements)

```tsx
useGSAP(() => {
  const paths = gsap.utils.toArray<SVGPathElement>('.timeline-path');
  const dots = gsap.utils.toArray<SVGCircleElement>('.timeline-dot');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.svg-timeline',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      pin: true,
    },
  });

  // Draw each path sequentially
  paths.forEach((path, i) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    tl.to(path, { strokeDashoffset: 0, duration: 1 })
      .from(dots[i], { scale: 0, autoAlpha: 0, duration: 0.3 }, '-=0.2');
  });
}, { scope: container });
```

### SVG Morph on Scroll (with MorphSVG plugin)

```tsx
// Requires GSAP Club membership for MorphSVG
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
gsap.registerPlugin(MorphSVGPlugin);

useGSAP(() => {
  gsap.to('#shape1', {
    morphSVG: '#shape2',
    ease: 'none',
    scrollTrigger: {
      trigger: '.morph-section',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
  });
}, { scope: container });
```

### Scroll-Controlled SVG with Scrub + Color Changes

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.infographic',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5,
    },
  });

  // Draw the path
  const mainPath = document.querySelector('.main-line') as SVGPathElement;
  const len = mainPath.getTotalLength();
  gsap.set(mainPath, { strokeDasharray: len, strokeDashoffset: len });
  tl.to(mainPath, { strokeDashoffset: 0, duration: 2 });

  // Reveal data points along the path
  gsap.utils.toArray<SVGElement>('.data-point').forEach((point, i) => {
    tl.from(point, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'center center',
      duration: 0.3,
    }, i * 0.4); // stagger along timeline
  });

  // Color shift
  tl.to('.main-line', {
    stroke: '#00ff88',
    duration: 2,
  }, 0);
}, { scope: container });
```

---

## 9. SplitText + Scroll Reveals

### Line-by-Line Reveal with Mask (v3.13+)

```tsx
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

useGSAP(() => {
  // New v3.13+ pattern with autoSplit and mask
  SplitText.create('.reveal-text', {
    type: 'lines, words',
    mask: 'lines',       // adds clip wrapper for reveal effect
    autoSplit: true,      // re-splits on font load / resize
    onSplit(self) {
      // Return the animation so SplitText can manage it across re-splits
      return gsap.from(self.lines, {
        y: '100%',        // slides up from behind the mask
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: self.elements[0], // the split element
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
  });
}, { scope: container });
```

### Character-by-Character Reveal on Scroll

```tsx
useGSAP(() => {
  SplitText.create('.char-reveal', {
    type: 'chars',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        autoAlpha: 0,
        y: 40,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: self.elements[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
  });
}, { scope: container });
```

### Scrubbed Text Reveal (Tied to Scroll Position)

```tsx
useGSAP(() => {
  SplitText.create('.scrub-text', {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.words, {
        autoAlpha: 0.15,  // start dim, not invisible
        stagger: 0.1,
        scrollTrigger: {
          trigger: self.elements[0],
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      });
    },
  });
}, { scope: container });
```

### Word-by-Word Color Highlight on Scroll

```tsx
useGSAP(() => {
  SplitText.create('.highlight-text', {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      return gsap.to(self.words, {
        color: '#00ff88',
        stagger: 0.05,
        scrollTrigger: {
          trigger: self.elements[0],
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: true,
        },
      });
    },
  });
}, { scope: container });
```

### Without SplitText (CSS-only Split)

If you don't have SplitText (Club plugin), you can split manually:

```tsx
// Manual line splitting for scroll reveals
function SplitLines({ text, className }: { text: string; className?: string }) {
  const lines = text.split('\n');
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <div className="reveal-line">{line}</div>
        </div>
      ))}
    </div>
  );
}

// Then in your component:
useGSAP(() => {
  gsap.from('.reveal-line', {
    y: '100%',
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.text-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}, { scope: container });
```

---

## 10. Scroll Velocity Effects

### Skew on Scroll (from GreenSock official demo)

Elements skew based on how fast the user scrolls — faster = more skew, snaps back when scroll stops.

```tsx
useGSAP(() => {
  const proxy = { skew: 0 };
  const skewSetter = gsap.quickSetter('.skew-elem', 'skewY', 'deg');
  const clamp = gsap.utils.clamp(-20, 20); // max ±20 degrees

  ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -300);

      // Only update if the skew is noticeably different
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });

  // Set transform origin for natural-feeling skew
  gsap.set('.skew-elem', { transformOrigin: 'right center', force3D: true });
}, { scope: container });
```

### Scale/Stretch on Fast Scroll

```tsx
useGSAP(() => {
  const proxy = { scaleY: 1 };
  const clamp = gsap.utils.clamp(0.95, 1.15);

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      const scaleY = clamp(1 + Math.abs(velocity) / 10000);

      if (scaleY > proxy.scaleY) {
        proxy.scaleY = scaleY;
        gsap.to(proxy, {
          scaleY: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          overwrite: true,
          onUpdate: () => {
            gsap.set('.stretch-elem', { scaleY: proxy.scaleY });
          },
        });
      }
    },
  });
}, { scope: container });
```

### Rotation Based on Scroll Direction

```tsx
useGSAP(() => {
  const proxy = { rotation: 0 };

  ScrollTrigger.create({
    onUpdate: (self) => {
      const rotation = gsap.utils.clamp(-15, 15, self.getVelocity() / -200);
      proxy.rotation = rotation;

      gsap.to('.rotate-on-scroll', {
        rotation: proxy.rotation,
        duration: 0.5,
        ease: 'power2',
        overwrite: true,
      });

      // Snap back to 0
      gsap.to('.rotate-on-scroll', {
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)',
        delay: 0.1,
      });
    },
  });
}, { scope: container });
```

### Combined Velocity Effect (Production Pattern)

```tsx
useGSAP(() => {
  const items = gsap.utils.toArray<HTMLElement>('.velocity-item');

  items.forEach((item) => {
    const proxy = { skew: 0, scaleX: 1 };

    ScrollTrigger.create({
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        const skew = gsap.utils.clamp(-12, 12, v / -400);
        const scaleX = gsap.utils.clamp(0.98, 1.04, 1 + Math.abs(v) / 20000);

        proxy.skew = skew;
        proxy.scaleX = scaleX;

        gsap.to(proxy, {
          skew: 0,
          scaleX: 1,
          duration: 0.8,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => {
            gsap.set(item, {
              skewY: proxy.skew,
              scaleX: proxy.scaleX,
            });
          },
        });
      },
    });
  });
}, { scope: container });
```

---

## 11. Useful Utilities & Static Methods

### preventOverlaps & fastScrollEnd

Avoid lingering animations when scrolling fast:

```ts
scrollTrigger: {
  trigger: '.section',
  fastScrollEnd: true,       // force completion if leaving fast (>2500px/s)
  preventOverlaps: true,     // force preceding ST animations to end state
  // or use groups:
  preventOverlaps: 'group1', // only affects others with same string
}
```

### isInViewport / positionInViewport

```ts
// Check if element is in viewport
if (ScrollTrigger.isInViewport('#element')) { /* visible */ }
if (ScrollTrigger.isInViewport('#element', 0.2)) { /* 20%+ visible */ }
if (ScrollTrigger.isInViewport('#element', 0.2, true)) { /* horizontal check */ }

// Get normalized position (0=top, 0.5=center, 1=bottom)
const pos = ScrollTrigger.positionInViewport('#element', 'center'); // 0-1
```

### matchMedia for Responsive ScrollTriggers

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    // Desktop: horizontal scroll
    gsap.to('.panels', {
      xPercent: -300,
      scrollTrigger: { trigger: '.wrapper', pin: true, scrub: 1 },
    });
  });

  mm.add('(max-width: 767px)', () => {
    // Mobile: simple vertical reveals
    gsap.utils.toArray('.panel').forEach((panel) => {
      gsap.from(panel as HTMLElement, {
        y: 50,
        autoAlpha: 0,
        scrollTrigger: { trigger: panel as HTMLElement, start: 'top 80%' },
      });
    });
  });
}, { scope: container });
```

### ScrollTrigger.refresh()

Force recalculation of all ScrollTrigger positions:

```ts
// After dynamic content loads
ScrollTrigger.refresh();

// After images load
window.addEventListener('load', () => ScrollTrigger.refresh());

// After fonts load
document.fonts.ready.then(() => ScrollTrigger.refresh());
```

---

## 12. Common Pitfalls & Fixes

### ❌ Animating the Pinned Element

```ts
// BAD — don't animate the pinned element itself
gsap.to('.pinned', { x: 100, scrollTrigger: { trigger: '.pinned', pin: true } });

// GOOD — animate children inside the pinned element
gsap.to('.pinned .content', { x: 100, scrollTrigger: { trigger: '.pinned', pin: true } });
```

### ❌ Missing Cleanup in React

```tsx
// BAD — raw useEffect without cleanup
useEffect(() => {
  gsap.to('.box', { x: 100, scrollTrigger: { trigger: '.box' } });
}, []);

// GOOD — useGSAP handles cleanup automatically
useGSAP(() => {
  gsap.to('.box', { x: 100, scrollTrigger: { trigger: '.box' } });
}, { scope: container });
```

### ❌ Ancestor `transform` Breaking Pin

If a parent has `transform` or `will-change: transform`, `position: fixed` breaks:

```ts
scrollTrigger: {
  pin: true,
  pinReparent: true, // reparent to <body> to escape
}
```

### ❌ Wrong Order = Wrong Calculations

Create ScrollTriggers in document-flow order (top to bottom). If you can't:

```ts
scrollTrigger: {
  refreshPriority: 1, // higher = refreshed earlier
}
```

### ❌ Flash of Content on Fast Scroll Past Pin

```ts
scrollTrigger: {
  pin: true,
  anticipatePin: 1, // predict and apply pin slightly early
}
```

### ❌ Nested Pins

Nested pinning isn't supported. If a trigger is inside a pinned container:

```ts
scrollTrigger: {
  trigger: '.inner-element',
  pinnedContainer: '.outer-pinned', // tell ST about the parent pin
}
```

### ❌ `end` Clamp for Bottom-of-Page Elements

Elements near the page bottom can have partially-scrubbed animations:

```ts
scrollTrigger: {
  end: 'clamp(bottom top)', // clamp to max scroll position
}
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  SCROLLTRIGGER CHEAT SHEET                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  START/END SYNTAX                                       │
│    "top center"       trigger-point scroller-point      │
│    "bottom 80%"       keywords: top center bottom       │
│    "top bottom-=100px"  relative offsets                │
│    "+=500"            relative to start                 │
│    "clamp(bottom top)" prevent overshoot                │
│                                                         │
│  SCRUB VALUES                                           │
│    true    → direct 1:1                                 │
│    0.5     → 0.5s smoothing                             │
│    1       → 1s smoothing (most common)                 │
│                                                         │
│  SNAP VALUES                                            │
│    0.25    → every 25%                                  │
│    [0,0.5,1] → specific points                         │
│    "labels" → timeline labels                           │
│    (v)=>fn  → custom function                           │
│                                                         │
│  TOGGLE ACTIONS                                         │
│    "play pause resume reset"                            │
│    onEnter onLeave onEnterBack onLeaveBack              │
│                                                         │
│  CALLBACKS                                              │
│    onEnter, onLeave, onEnterBack, onLeaveBack           │
│    onUpdate(self) → self.progress, self.direction,      │
│                     self.getVelocity()                  │
│    onToggle, onRefresh, onScrubComplete                 │
│    onSnapComplete                                       │
│                                                         │
│  REACT ESSENTIALS                                       │
│    useGSAP() + scope                                    │
│    contextSafe() for event handlers                     │
│    'use client' for Next.js App Router                  │
│    gsap.registerPlugin(useGSAP, ScrollTrigger)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Sources

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP React Guide](https://gsap.com/resources/React/)
- [ScrollTrigger.batch() Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()/)
- [containerAnimation (v3.8)](https://gsap.com/blog/3-8/#containeranimation)
- [SplitText Docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [GreenSock Community Forums](https://gsap.com/community/)
- [Skew on Scroll Velocity — CodePen](https://codepen.io/GreenSock/pen/eYpGLYL)
- [Horizontal Scroll Tutorials — Envato Tuts+](https://webdesign.tutsplus.com/create-horizontal-scroll-animations-with-gsap-scrolltrigger--cms-108881t)
- [Stack Overflow: Horizontal Scroll in React](https://stackoverflow.com/questions/71182330)
