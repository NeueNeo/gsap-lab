# GSAP Lab — Rules & Fix Log

**READ THIS BEFORE WRITING ANY CODE IN THIS PROJECT.**
**Then read the knowledge vault:** `~/Desktop/NeueBot/knowledge/tech/gsap/`

---

## Golden Rules

1. **All GSAP animation setup inside `useGSAP()` callback.** No `useEffect` for animations. Ever.
2. **`contextSafe` for any animation triggered after mount** — click handlers, mousemove, delayed callbacks.
3. **`gsap.delayedCall()` instead of `setTimeout`/`setInterval`** — context tracks it, auto-cleanup.
4. **`scope: containerRef`** on every `useGSAP` call — scopes selector text to component.
5. **Diagnose → explain → get approval → code.** No blind rewrites.
6. **Don't delete experiments without Overseer approval.**
7. **Don't modify `experiments.ts`, `experiment-canvas.tsx`, or `sidebar.tsx` from sub-agents.**

---

## Fix Log

Each entry: what was broken, why, and the correct pattern.

---

### `blur-scale-transition.tsx`
**Bug:** Pages didn't transition. Multiple `useGSAP` hooks fighting each other — one set initial state, another ran the timeline. Strict mode double-invocation caused them to step on each other.
**Root cause:** Split animation logic across multiple hooks. `useGSAP` uses `useLayoutEffect` internally — each hook creates its own `gsap.context()`. Two contexts both tweening the same elements = race condition.
**Fix:** Single `gsap.timeline({ repeat: -1 })` inside ONE `useGSAP()`. Use `tl.set()` at time 0 to force page 1 visible. Inline CSS fallback on JSX so first paint looks correct before JS runs.
**Rule:** One `useGSAP` per animation system. If things need to coordinate, use one timeline.

---

### `morphing-icons.tsx` (check/cross morph)
**Bug:** Tiny dots appeared at path start during draw-on animation. Shapes invisible at start.
**Root cause 1:** `strokeLinecap="round"` creates a visible dot even at `strokeDashoffset` = full length (zero visible stroke). Round cap has radius = half stroke width.
**Root cause 2:** SVG elements had `opacity="0"` as HTML attributes. GSAP was animating opacity but the attribute-level zero was overriding.
**Fix:** `strokeLinecap="butt"` for dash animations. Remove `opacity="0"` from SVG attributes — use `gsap.set()` to control initial opacity. Toggle opacity 0→1 via `tl.set()` right before the draw-on, 1→0 after draw-off.
**Rule:** Never use round linecap with dash animations. Never set initial SVG opacity as an HTML attribute if GSAP will control it.

---

### `card-tilt-3d.tsx`
**Bug:** No 3D tilt effect. Card appeared flat.
**Root cause:** `perspective: 800px` was on the card itself (the element being rotated), not on its parent container. CSS `perspective` must be on the parent to create a 3D viewing context for children.
**Fix:** Wrapper div gets `perspective: 800px`. Card inside gets `rotateX`/`rotateY` transforms. Mouse events on wrapper (larger hit area), not card. `overwrite: "auto"` on all competing tweens. Event listeners added inside `useGSAP` with contextSafe, removed in cleanup.
**Rule:** Perspective on parent. Transforms on child. Always.

---

### `cursor-trail.tsx`
**Bug:** Dots didn't follow cursor. Visible at top-left corner on mount.
**Root cause:** `quickTo` functions created in bare `useEffect` — not tracked by context, not cleaned up. Dots positioned at `top: 0, left: 0` with `opacity: 1` from the start.
**Fix:** Everything inside `useGSAP`. `gsap.set(dots, { opacity: 0 })` on mount. On `mouseenter`: snap all dots to entry point via `gsap.set({ x, y })`, then show. `quickTo` created inside hook. Event listeners with cleanup return.
**Rule:** Hide cursor elements until first mouseenter. Create quickTo inside useGSAP.

---

### `velocity-cursor.tsx`
**Bug:** Same as cursor-trail — cursor elements visible at origin, tracking broken.
**Root cause:** Same pattern — `useEffect` instead of `useGSAP`, no initial hide.
**Fix:** Same pattern — everything in `useGSAP`, `opacity: 0` + snap on enter, contextSafe handlers, cleanup return.
**Rule:** Same as cursor-trail. This is a pattern, not a one-off.

---

### `flip-add-to-cart.tsx`
**Bug:** Cards just faded opacity, no visible flying animation to cart.
**Root cause 1:** Clone created with `position: absolute` + `left`/`top` relative to container, then GSAP `x`/`y` delta calculated wrong — double-subtracted the offset.
**Root cause 2:** `flyToCart` stored in `useRef` (not contextSafe) — animations inside it not tracked.
**Root cause 3:** Auto-demo loop used `setTimeout` in `useEffect` — not cleaned up by context.
**Fix:** Flying dot uses `position: fixed` with viewport coords from `getBoundingClientRect()`. Delta is simply `cartCenter - dotCenter`. `flyToCart` wrapped in `contextSafe`. Loop uses `gsap.delayedCall`. All inside one `useGSAP`.
**Rule:** Fixed positioning + viewport coords for flying elements. delayedCall for loops. contextSafe for anything creating animations.

---

### `flip-grid.tsx` (DELETED)
**Why deleted:** Duplicate of flip-filter-sort. Flip plugin + React DOM removal = fundamentally broken. React removes filtered elements from DOM; Flip needs them to persist.
**Lesson:** Flip plugin requires all elements to stay mounted. In React, toggle visibility (`display: none`) instead of conditional rendering.

---

### `flip-filter-sort.tsx` (DELETED)
**Why deleted:** Manual FLIP math was wrong — cards flew offscreen. Same React+FLIP incompatibility as flip-grid. Overseer saw it and confirmed.
**Lesson:** Same as flip-grid. If building a filter grid, keep all items mounted and use `display: none` + Flip, or don't use Flip at all.

---

### `flip-page-transition.tsx` (DELETED)
**Why deleted:** Broken, nonfunctional.

---

### `clip-path-iris.tsx` (DELETED)
**Why deleted:** Bland placeholder pages, no purpose.

---

### `motion-path-orbit.tsx` (DELETED)
**Why deleted:** Duplicate of existing `orbit-animation` but worse — used cos/sin instead of MotionPathPlugin.

---

### `liquid-button.tsx` (DELETED)
**Why deleted:** Ugly. Overseer call.

---

### `inertia-dot-grid.tsx`
**Bug:** quickTo and breathing animations created in bare `useEffect` — not tracked by context. Duplicate animations on strict mode. rAF loop cleanup fragile. Origins calculated before entry animation finished (wrong positions). Grid was only 10×10.
**Root cause:** Two `useEffect` hooks doing GSAP work instead of `useGSAP`. No contextSafe on event handlers.
**Fix:** Everything in one `useGSAP`. quickTo + breathing created in `onComplete` of entry animation (so origins are correct). Event listeners via contextSafe, removed in cleanup. rAF managed inside the hook with `cancelAnimationFrame` in cleanup return. Grid scaled to 24×24 (576 dots), dot size reduced to 4px, gap to 6px.
**Rule:** For rAF physics loops — start and cancel inside `useGSAP` cleanup. Calculate element positions AFTER entry animations complete.

**Additional lessons from tuning:**
- **`gsap.to()` in rAF = death.** Creating a new tween per dot per frame (576 × 60fps) kills performance. Use `gsap.set()` for instant updates inside rAF. Only use `gsap.to()` on state transitions (e.g., dot exits push radius → elastic snapback fires once).
- **Track per-element state with a `pushed` boolean.** Prevents firing return tweens every frame for already-resting dots.
- **box-shadow with blur on 300+ elements = GPU meltdown.** Just use backgroundColor. No bloom at scale.
- **Scaled-up small elements look blurry.** `will-change-transform` rasterizes at current size. Fix: render at max expected size (e.g., 14px), CSS `transform: scale(0.36)` for display size. Push effect scales toward native — always crisp, never upscaling a raster.
- **Set initial CSS transform in JSX inline styles** to match GSAP's expected base. Otherwise elements flash at full native size before `useGSAP` (layoutEffect) runs.
- **Use refs for settings that rAF reads.** React state captures stale in closures. Pair `useState` (for UI) with `useRef` (for rAF loop) — update both in the same handler.
- **Mouse events: track position on container, activate on grid.** `mousemove` on wider container so edge dots react. `mouseenter`/`mouseleave` on the actual grid card to gate the effect.

---

### `morphing-shape.tsx`
**Bug:** Shapes never formed correctly — snapped between states instead of smooth morphing.
**Root cause:** GSAP cannot interpolate `clip-path: polygon(...)` strings. It has no parser for complex CSS function strings. It just snaps from one to the next.
**Fix:** Store polygon points as plain `{ x, y }` objects. Tween each point's x and y independently with `gsap.to(points[i], { x, y })`. Rebuild the `polygon()` string on every `onUpdate` frame via `shape.style.clipPath = buildClipPath()`. All shapes must have the same number of points for smooth interpolation.
**Rule:** GSAP can't animate complex CSS strings (clip-path, d attribute). Break them into numeric values, tween those, rebuild the string in onUpdate.

---

## Known Broken (Not Yet Fixed)

- `masked-line-reveal` — text not showing
- `svg-mask-text-reveal` — no text visible
- `double-helix-text` — broken nested 3D transforms
- `spotlight-reveal` — separate useEffect for animation
- `cursor-ripple` — contextSafe likely missing

## Suspect (Need Visual Check)

- `variable-font-wave`
- `physics-dots-loader`
- `inertia-dot-grid`
- `scroll-3d-tube`
- `cylinder-gallery`

---

*Every fix adds an entry. Read before writing.*
