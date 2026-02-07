# GSAP + React + Tailwind Ecosystem Reference

> Compiled: 2026-02-07 | GSAP is now **100% free** (including all plugins) thanks to Webflow's support (April 2025)

---

## Table of Contents

1. [GSAP + Tailwind Integration Patterns](#1-gsap--tailwind-integration-patterns)
2. [Notable GSAP Showcase Sites](#2-notable-gsap-showcase-sites)
3. [GSAP Ecosystem & Plugins](#3-gsap-ecosystem--plugins)
4. [Open Source GSAP + React Projects](#4-open-source-gsap--react-projects)
5. [Common Pitfalls in React (with Fixes)](#5-common-gsap-pitfalls-in-react)

---

## 1. GSAP + Tailwind Integration Patterns

### The Core Philosophy: Separation of Concerns

The golden rule: **Tailwind handles layout and static styling. GSAP handles animation logic.** They complement each other perfectly when you respect their domains.

```
Tailwind → Structure, spacing, colors, typography, responsive layout
GSAP     → Motion, timing, sequencing, scroll-linked animation, interactivity
```

### Known Conflict: Tailwind `transition-*` Classes vs GSAP

**The Problem:** Tailwind's `transition` utility applies CSS transitions to `transform`, `opacity`, `box-shadow`, and more. GSAP also manipulates these properties via inline styles. The CSS transition fights GSAP's interpolation, causing janky or invisible animations.

The culprit (from Tailwind's `transition` class):
```css
transition-property: background-color, border-color, color, fill, stroke,
                     opacity, box-shadow, transform, filter, backdrop-filter;
```

**The Fixes:**
1. **Remove Tailwind transition classes** from GSAP-animated elements — don't use `transition`, `transition-all`, `transition-transform`, etc. on anything GSAP controls
2. **Wrap in a parent div** — animate the wrapper with GSAP, keep Tailwind transitions on the inner element for hover states etc.
3. **Use `transition-none`** on elements GSAP animates: `className="transition-none"`
4. **Set initial transforms with GSAP, not Tailwind** — GSAP caches transforms for performance. If Tailwind sets `translate-x-4`, GSAP reads the computed matrix (lossy). Always use `gsap.set()` for initial animated values.

### Tailwind `hidden` vs GSAP `autoAlpha`

**The Problem:** Tailwind's `hidden` class applies `display: none`, which overrides GSAP's `autoAlpha` (visibility + opacity). GSAP's inline `opacity: 1` won't matter if the element is `display: none`.

**The Fix:** Don't use `hidden`. Instead use `invisible opacity-0` (or just let GSAP handle visibility with `autoAlpha: 0` via `gsap.set()`).

### Decision Framework: When to Use Which

| Scenario | Use Tailwind | Use GSAP |
|----------|:---:|:---:|
| Hover states (color, scale, shadow) | ✅ | |
| Focus/active states | ✅ | |
| Simple opacity fade on state change | ✅ | |
| Entrance animations on mount | | ✅ |
| Scroll-linked animations | | ✅ |
| Staggered animations (multiple elements) | | ✅ |
| Complex sequenced timelines | | ✅ |
| Page transitions | | ✅ |
| Physics-based / spring animations | | ✅ |
| SVG path animation | | ✅ |
| Layout transitions (FLIP) | | ✅ |
| Responsive animation differences | | ✅ |
| Simple CSS keyframe loops (pulse, spin) | ✅ | |
| Draggable interactions | | ✅ |
| Parallax effects | | ✅ |

**Rule of thumb:** If it's a simple state-triggered CSS property change, Tailwind is fine. If it involves **timing, sequencing, scroll-linking, or complex motion**, reach for GSAP.

### CSS Custom Properties Bridge

You can use CSS custom properties (variables) as a bridge between Tailwind's theme system and GSAP animations:

```jsx
// Tailwind config defines CSS variables via theme
// e.g., --color-primary, --spacing-lg

// GSAP can animate CSS variables directly
gsap.to(element, {
  "--progress": 1,        // animate a custom property
  "--hue": 200,           // animate color hue
  duration: 1.5
});
```

In your Tailwind classes, reference the variable:
```html
<div 
  class="bg-[hsl(var(--hue),80%,50%)]" 
  style="--hue: 0; --progress: 0"
>
```

This approach lets you:
- Keep Tailwind's utility-first approach for styling
- Let GSAP animate the underlying values
- Avoid GSAP writing to style properties that conflict with Tailwind classes

### Responsive Animation with `gsap.matchMedia()`

`gsap.matchMedia()` (added v3.11) is the **correct** way to handle responsive animations. It pairs perfectly with Tailwind's breakpoint system.

```jsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function HeroSection() {
  const container = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      // Match Tailwind's default breakpoints
      isDesktop: "(min-width: 1024px)",   // lg
      isTablet: "(min-width: 768px) and (max-width: 1023px)", // md
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { isDesktop, isMobile, reduceMotion } = context.conditions;

      gsap.from(".hero-title", {
        y: isDesktop ? 100 : 50,
        opacity: 0,
        duration: reduceMotion ? 0 : 1.2,
        ease: "power3.out"
      });

      if (isDesktop) {
        // Parallax only on desktop
        gsap.to(".hero-image", {
          yPercent: -20,
          scrollTrigger: {
            trigger: container.current,
            scrub: true
          }
        });
      }
    });
  }, { scope: container });

  return <section ref={container}>...</section>;
}
```

**Key benefits:**
- Automatically reverts animations when the query stops matching
- Supports `prefers-reduced-motion` for accessibility
- Re-runs setup when breakpoints change (resize)
- Integrates with `useGSAP` for automatic React cleanup

---

## 2. Notable GSAP Showcase Sites

### Tier 1: Legendary Showcase Pieces

#### 1. Dennis Snellenberg — Portfolio
- **URL:** https://dennissnellenberg.com
- **Techniques:** Custom cursor, smooth scrolling (Lenis), text reveal animations, magnetic buttons, page transitions (Barba.js + GSAP), parallax images, staggered list animations
- **Stack:** Webflow, GSAP, Barba.js, Lottie
- **Why it's impressive:** The quintessential GSAP portfolio. Won Awwwards SOTD. Every interaction feels intentional — magnetic hover effects, fluid page transitions, typographic animations. Widely recreated as a learning exercise.

#### 2. Lusion — EXP Interactive Experience
- **URL:** https://exp.lusion.co
- **Techniques:** WebGL + Three.js + GSAP orchestration, 3D scene transitions, scroll-driven 3D camera movement, particle effects, immersive full-screen takeover
- **Why it's impressive:** Pushes the boundary of what's possible in-browser. GSAP orchestrates the timeline while Three.js handles rendering.

#### 3. Basement Studio — BSMNT Scrollytelling Demo
- **URL:** https://scrollytelling.basement.studio
- **Techniques:** Scroll-driven storytelling, pinned sections, scrub animations, parallax, morph transforms
- **Stack:** Next.js, GSAP ScrollTrigger, @bsmnt/scrollytelling
- **Why it's impressive:** Built by one of the best GSAP + Next.js studios. They open-sourced the library powering it.

#### 4. Immersive Garden — Gleec / Hatom
- **URL:** https://gleec.com / https://hatom.com
- **Techniques:** WebGL canvas backgrounds, scroll-linked 3D morphing, SVG path animations, smooth section transitions, custom scroll physics
- **Why it's impressive:** Immersive Garden is an elite French studio. Their sites feel like interactive films — every scroll position triggers perfectly timed visual changes.

#### 5. Britive (by Buzzworthy Studio)
- **URL:** https://britive.com
- **Techniques:** Scroll-triggered section reveals, animated data visualizations, parallax depth layers, staggered content entrances, SVG line drawing
- **Why it's impressive:** Enterprise site that feels alive. Proves GSAP isn't just for experimental portfolios — it elevates B2B marketing sites.

### Tier 2: Excellent Craft

#### 6. STR8FIRE (by Dennis Snellenberg)
- **URL:** https://str8fire.com
- **Techniques:** Custom cursor, horizontal scroll sections, text scramble effects, smooth page transitions, WebGL integration
- **Why it's impressive:** Web3 site with Web2 quality. Combines GSAP with Three.js for immersive hero sections.

#### 7. Repeat (by Studio Freight / Darkroom)
- **URL:** https://getrepeat.io
- **Techniques:** Smooth scroll (Lenis — they created it), scroll-velocity text marquees, magnetic interactions, staggered grid reveals
- **Stack:** Next.js, GSAP, Lenis, React
- **Why it's impressive:** Studio Freight (now Darkroom) built Lenis smooth scroll. This site is a masterclass in combining smooth scroll with GSAP ScrollTrigger.

#### 8. Keikku Next-Gen Stethoscope (by Bürocratik)
- **URL:** https://keikku.com
- **Techniques:** Product storytelling via scroll, 3D product rotation, parallax depth, animated typography, section pinning
- **Why it's impressive:** Medical device marketing that feels like an Apple product launch. Scroll-driven narrative with perfectly paced reveals.

#### 9. Cosmos Studio — Agency Portfolio
- **URL:** https://cosmosstudio.design
- **Techniques:** Custom loader, staggered text reveals, smooth page transitions, hover-driven image previews, scroll-triggered counters
- **Why it's impressive:** Ukrainian agency showing how GSAP + strong design thinking creates memorable first impressions.

#### 10. Chain-Labs (by Visual Identity)
- **URL:** https://chainlabs.in
- **Techniques:** Animated gradient backgrounds, scroll-based section morphing, SVG animations, text split animations, custom easing
- **Why it's impressive:** Blockchain design studio site with fluid animations that never feel overdone.

### Tier 3: Learning Resources & Collections

#### 11. Stable Studio
- **URL:** https://stablestudio.org
- **Context:** Reddit success story (r/webdev, 162 upvotes). First GSAP site by a Next.js dev.
- **Why it matters:** Real-world example of a developer transitioning from React to GSAP — shows achievable quality for intermediate devs.

#### 12. GSAP Official Showcase
- **URL:** https://gsap.com/showcase/
- **What it is:** Curated gallery of the best GSAP sites, submitted by developers and agencies. Updated regularly.

#### 13. Made With GSAP
- **URL:** https://madewithgsap.com
- **What it is:** Collection of 50+ premium JS effects built with GSAP. Includes scroll, drag, mouse-move, and infinite animation patterns.

#### 14. Awwwards GSAP Collection
- **URL:** https://www.awwwards.com/websites/gsap/
- **What it is:** All Awwwards-recognized sites tagged with GSAP. Filterable by category and year.

---

## 3. GSAP Ecosystem & Plugins

> **Major update (April 2025):** ALL GSAP plugins are now free, including previously paid "Club" plugins like SplitText, MorphSVG, DrawSVG, etc. No license restrictions for commercial use.

### Core Library

| Feature | Description |
|---------|-------------|
| `gsap.to()` | Animate from current state to target state |
| `gsap.from()` | Animate from defined state to current state |
| `gsap.fromTo()` | Define both start and end states explicitly |
| `gsap.set()` | Instantly set properties (no animation) |
| `gsap.timeline()` | Sequence multiple animations with precise timing |
| `gsap.matchMedia()` | Responsive animation setup with auto-revert (v3.11+) |
| `gsap.context()` | Scope animations for easy cleanup (crucial for React) |
| `gsap.quickTo()` | Optimized for frequently-updated values (mouse follow, etc.) |

### Free Plugins (All Now Free)

#### ScrollTrigger
**What:** Links animations to scroll position. Pin elements, scrub through timelines, trigger on enter/leave.
**When to use:** Any scroll-linked animation. Parallax, reveal-on-scroll, pinned sections, progress indicators.
```jsx
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",
    end: "top 20%",
    scrub: true,    // links animation progress to scroll position
    pin: true,      // pins the trigger element during animation
    markers: true   // debug markers (remove in production)
  }
});
```

#### Flip
**What:** Animates layout changes seamlessly. Records state → change DOM → animate from old to new position.
**When to use:** Grid reflows, tab changes, filtering/sorting, shared element transitions, expand/collapse.
```jsx
const state = Flip.getState(".items");  // snapshot current positions
// ... make DOM changes (reorder, reparent, resize) ...
Flip.from(state, {
  duration: 0.8,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true  // uses position:absolute during flip (good for flex/grid)
});
```

#### Observer
**What:** Unified input detection — wheel, touch, pointer, scroll — with velocity tracking and direction callbacks.
**When to use:** Scroll hijacking (full-page section transitions), custom scroll behaviors, gesture-driven animations, swipe detection.
```jsx
Observer.create({
  type: "wheel,touch,pointer",
  onUp: () => goToNextSection(),
  onDown: () => goToPreviousSection(),
  tolerance: 10,
  preventDefault: true
});
```
**Key difference from ScrollTrigger:** Observer doesn't link to native scroll position. It listens to input gestures directly — ideal for section-snapping UIs where you don't want native scrolling.

#### ScrollToPlugin
**What:** Smooth scroll to a target (element, position, or label in a timeline).
**When to use:** Scroll-to-section navigation, back-to-top buttons, programmatic scroll positioning.
```jsx
gsap.to(window, { duration: 1, scrollTo: "#section3", ease: "power2.inOut" });
```

#### MotionPathPlugin
**What:** Animate elements along SVG paths or custom coordinate arrays.
**When to use:** Elements following curved paths, orbit animations, animated illustrations, game-like movement.
```jsx
gsap.to(".rocket", {
  motionPath: {
    path: "#flightPath",
    align: "#flightPath",
    autoRotate: true
  },
  duration: 5
});
```

#### Draggable
**What:** Makes elements draggable with inertia, bounds, snap, and axis locking.
**When to use:** Carousels, sliders, sortable lists, interactive UIs, before/after comparisons.
```jsx
Draggable.create(".slider", {
  type: "x",
  bounds: ".container",
  inertia: true,          // momentum after release
  snap: { x: snapPoints } // snap to grid
});
```

#### SplitText (Previously Paid — Now Free)
**What:** Splits text into characters, words, or lines for individual animation.
**When to use:** Text reveal animations, character-by-character typing effects, kinetic typography.
```jsx
const split = new SplitText(".headline", { type: "chars,words,lines" });
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.02,
  duration: 0.8,
  ease: "power3.out"
});
```

#### Other Notable (Now Free) Plugins
| Plugin | Purpose |
|--------|---------|
| **MorphSVG** | Morph one SVG shape into another |
| **DrawSVG** | Animate SVG stroke drawing |
| **ScrollSmoother** | Smooth scroll wrapper (alternative to Lenis) |
| **CustomEase** | Create custom easing curves visually |
| **PixiPlugin** | Animate PixiJS objects |
| **TextPlugin** | Typewriter / text replacement effects |
| **ScrambleTextPlugin** | Random character scramble → reveal |
| **InertiaPlugin** | Physics-based momentum after interaction |

### `@gsap/react` Package

The official React integration hook:

```bash
npm install gsap @gsap/react
```

```jsx
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
```

**What it provides:**
- `useGSAP()` — drop-in replacement for `useEffect`/`useLayoutEffect`
- Automatic cleanup via `gsap.context()` 
- `contextSafe()` wrapper for event handler animations
- `scope` parameter for scoped selectors
- SSR-safe (uses `useIsomorphicLayoutEffect` internally)

---

## 4. Open Source GSAP + React Projects

### Libraries & Tools

#### @bsmnt/scrollytelling — by Basement Studio
- **GitHub:** https://github.com/basementstudio/scrollytelling
- **What:** Declarative scroll animation components for React, powered by GSAP ScrollTrigger
- **Features:** `<Scrollytelling.Root>`, `<Scrollytelling.Animation>`, `<Scrollytelling.Waypoint>` components
- **Why it matters:** Built by one of the top GSAP + Next.js agencies. Abstracts ScrollTrigger into React-friendly components. Great for teams where not everyone knows GSAP.

#### PaceUI — Animated React Components
- **URL:** https://ui.paceui.com
- **What:** GSAP-powered animated component library for React/Next.js, styled with Tailwind CSS
- **Features:** Copy-paste components (shadcn-style), CLI integration, smooth transitions by default
- **Stack:** GSAP + Tailwind + shadcn conventions
- **Why it matters:** The closest thing to "shadcn but with GSAP animations." Drop-in animated components that follow Tailwind conventions.

#### react-gsap — by Bitworking
- **GitHub:** https://github.com/bitworking/react-gsap
- **What:** Declarative React components for GSAP (`<Tween>`, `<Timeline>`, `<ScrollTrigger>`)
- **Note:** Less maintained; the official `@gsap/react` hook is now preferred for most use cases.

### Templates & Portfolio Starters

#### Folio — by Ayush (1k+ stars)
- **GitHub:** https://github.com/ayush013/folio
- **What:** Interactive portfolio with Next.js, GSAP, Tailwind, and React
- **Features:** SVG timeline section, optimized layer management, scroll-triggered reveals
- **Forks:** Vue.js version by sjtuli, variant by shubh73 (devfolio)

#### GSAP Cocktails — by Adrian Hajdin (JS Mastery)
- **GitHub:** https://github.com/adrianhajdin/gsap_cocktails
- **What:** Modern cocktail site with React + Tailwind + GSAP
- **Features:** SplitText reveals, scroll-triggered effects, parallax scrolling, custom carousel
- **Good for:** Learning GSAP patterns in a real project context

#### Dennis Snellenberg Clone — by Ali Bagheri
- **GitHub:** https://github.com/AliBagheri2079/dennis-snellenberg-portfolio
- **Stack:** Next.js, Framer Motion, GSAP, Lenis, Tailwind, PostCSS
- **Good for:** Studying how GSAP and Framer Motion can coexist

### GitHub Topic Pages
- `gsap-animation`: https://github.com/topics/gsap-animation
- `gsap-react`: https://github.com/topics/gsap-react
- `gsap-scrolltrigger`: https://github.com/topics/gsap-scrolltrigger
- `gsap` (main): https://github.com/topics/gsap

---

## 5. Common GSAP Pitfalls in React

### Pitfall 1: Memory Leaks — No Animation Cleanup

**Problem:** GSAP animations and ScrollTriggers persist after component unmount, causing memory leaks and ghost animations.

**Fix:** Always use `useGSAP()` from `@gsap/react`:
```jsx
import { useGSAP } from '@gsap/react';

function MyComponent() {
  const container = useRef();
  
  useGSAP(() => {
    // All animations here are automatically reverted on unmount
    gsap.to(".box", { x: 100 });
    ScrollTrigger.create({ /* ... */ });
  }, { scope: container });

  return <div ref={container}>...</div>;
}
```

**If you can't use `useGSAP()`**, manual cleanup:
```jsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, containerRef);
  
  return () => ctx.revert(); // kills all animations in this context
}, []);
```

### Pitfall 2: React 18 Strict Mode Double-Execution

**Problem:** In development, React 18's Strict Mode runs effects twice. Without proper cleanup, you get duplicate overlapping animations.

**Fix:** `useGSAP()` handles this automatically. It reverts the first execution's animations before re-running. If using manual `useEffect`, make sure your cleanup function calls `ctx.revert()`.

### Pitfall 3: Event Handler Animations Not Cleaned Up

**Problem:** Animations created in onClick/onHover handlers aren't tracked by `useGSAP`'s context because they execute after the hook.

**Fix:** Use `contextSafe()`:
```jsx
const { contextSafe } = useGSAP({ scope: container });

// ✅ This animation will be tracked and cleaned up
const handleClick = contextSafe(() => {
  gsap.to(".box", { rotation: 360 });
});
```

### Pitfall 4: SSR/Next.js — `window is not defined`

**Problem:** GSAP accesses the DOM (`window`, `document`). Server-side rendering (Next.js) fails because these don't exist on the server.

**Fixes:**
1. **Use `useGSAP()`** — it uses `useIsomorphicLayoutEffect` internally (falls back to `useEffect` when `window` is undefined)
2. **Add `"use client"` directive** at top of component files that use GSAP (required for Next.js App Router)
3. **Dynamic import** for plugins that access the DOM on import:
   ```jsx
   // For Draggable or other plugins that touch the DOM at import time
   useEffect(() => {
     const initGSAP = async () => {
       const { Draggable } = await import('gsap/Draggable');
       gsap.registerPlugin(Draggable);
       // ... setup
     };
     initGSAP();
   }, []);
   ```

### Pitfall 5: FOUC (Flash of Unstyled Content) on Load Animations

**Problem:** Elements flash at full opacity before GSAP hides them for the entrance animation.

**Fix:** Hide elements with CSS initially, then animate with GSAP:
```css
/* Hide initially */
.hero-content { visibility: hidden; }
```
```jsx
useGSAP(() => {
  gsap.from(".hero-content", { 
    autoAlpha: 0, // handles both opacity AND visibility
    y: 50,
    duration: 1 
  });
});
```
```html
<!-- For no-JS fallback -->
<noscript>
  <style>.hero-content { visibility: visible !important; }</style>
</noscript>
```

### Pitfall 6: Using `from()` with Incorrect Assumptions

**Problem:** `from()` tweens use `immediateRender: true` by default, which can conflict with other animations on the same properties.

**Fixes:**
- Use `fromTo()` when you need predictable start AND end states
- Set `immediateRender: false` on `from()` tweens in timelines after other tweens targeting the same element
- Pre-create animations and use control methods (`.play()`, `.reverse()`) instead of recreating on each interaction

### Pitfall 7: Not Setting Transforms with GSAP

**Problem:** Setting initial transforms via CSS (or Tailwind's `translate-x-*`, `scale-*`, `rotate-*`) then animating with GSAP. The browser reports computed values as a matrix, which GSAP can't accurately decompose.

**Fix:** Set ALL animated transform values with GSAP:
```jsx
// ❌ Don't mix Tailwind transforms with GSAP
<div className="translate-x-10 rotate-45">...</div>

// ✅ Set initial values with GSAP
useGSAP(() => {
  gsap.set(".box", { x: 40, rotation: 45 });
  gsap.to(".box", { x: 200, rotation: 360 });
});
```

### Pitfall 8: `x: "50%"` vs `xPercent: 50`

**Problem:** Using percentage strings in `x`/`y` can conflict with later `xPercent`/`yPercent` usage, stacking unexpectedly.

**Fix:** Always use `xPercent` / `yPercent` for percentage-based transforms:
```jsx
// ❌ Avoid
gsap.to(".box", { x: "50%", y: "50%" });

// ✅ Use dedicated percentage properties
gsap.to(".box", { xPercent: 50, yPercent: 50 });
```

### Pitfall 9: ScrollTrigger Pin Issues in React

**Problem:** Pinned elements jump or have wrong positioning, especially with dynamic content or Tailwind layout classes.

**Fix:**
- Call `ScrollTrigger.refresh()` after dynamic content loads
- Use `gsap.context()` to ensure proper cleanup
- Avoid padding/margin on the pin target itself — wrap it in a container
- Add `pinSpacing: true` (default) or `pinSpacing: false` depending on layout needs

### Pitfall 10: Recreating Animations on Every Render

**Problem:** Creating new GSAP animations inside render functions or on every state change instead of controlling pre-built ones.

**Fix:** Create animations once, then control them:
```jsx
const tlRef = useRef();

useGSAP(() => {
  tlRef.current = gsap.timeline({ paused: true })
    .to(".drawer", { x: 0, duration: 0.5 })
    .from(".drawer-content", { opacity: 0, delay: 0.1 });
});

// Control the pre-built timeline
const toggleDrawer = () => {
  isOpen ? tlRef.current.reverse() : tlRef.current.play();
};
```

---

## Quick Setup Reference

### Install

```bash
npm install gsap @gsap/react
```

### Centralized GSAP Config (The Basement Studio Way)

Create `lib/gsap/index.ts`:
```tsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, Flip, Observer, SplitText, useGSAP);

// Project-wide defaults
const DURATION = 0.8;
const EASE = "power3.out";

gsap.defaults({
  duration: DURATION,
  ease: EASE,
});

gsap.config({
  nullTargetWarn: false, // suppress warnings for missing targets
});

export { gsap, ScrollTrigger, Flip, Observer, SplitText, useGSAP };
export { DURATION, EASE };
```

Then import from your central file everywhere:
```tsx
import { gsap, ScrollTrigger, useGSAP } from "~/lib/gsap";
```

---

## Key Resources

| Resource | URL |
|----------|-----|
| GSAP Docs | https://gsap.com/docs/v3/ |
| GSAP + React Guide | https://gsap.com/resources/React/ |
| GSAP Common Mistakes | https://gsap.com/resources/mistakes/ |
| GSAP Forums | https://gsap.com/community/ |
| GSAP Showcase | https://gsap.com/showcase/ |
| GSAP Cheatsheet | https://gsap.com/cheatsheet/ |
| Awwwards GSAP Sites | https://www.awwwards.com/websites/gsap/ |
| Made With GSAP | https://madewithgsap.com |
| PaceUI (GSAP + Tailwind Components) | https://ui.paceui.com |
| BSMNT Scrollytelling | https://scrollytelling.basement.studio |
| Basement Studio Blog | https://basement.studio/blog |
| Marmelab GSAP Pitfalls | https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html |

---

*Last updated: 2026-02-07*
