# GSAP Lab — Rules

**READ THIS BEFORE WRITING ANY CODE IN THIS PROJECT.**
**Then read the knowledge vault:** `~/Desktop/NeueBot/knowledge/tech/gsap/`

---

## Process

1. **Diagnose → explain → get approval → code.** No blind rewrites.
2. **Don't delete experiments without Overseer approval.**
3. **Don't modify `experiments.ts`, `experiment-canvas.tsx`, or `sidebar.tsx` from sub-agents.**
4. **Quality over quantity.** Don't ship broken work. 5 working experiments > 30 broken ones.
5. **"Commit" = local only. "Push" = commit + push to remote.**

---

## GSAP + React Patterns

1. **All animation setup inside `useGSAP()`.** No `useEffect` for animations. Ever.
2. **One `useGSAP` per animation system.** If things coordinate, use one timeline.
3. **`contextSafe` for event-driven animations** — click, mousemove, delayed callbacks.
4. **`gsap.delayedCall()` instead of `setTimeout`/`setInterval`** — context tracks it, auto-cleanup.
5. **`scope: containerRef`** on every `useGSAP` call.

---

## Layout & Positioning

6. **Perspective on parent, transforms on child.** Always.
7. **`position: fixed` + viewport coords for flying elements.** Not absolute + container offsets.
8. **Explicit width on relative containers** that hold absolutely-positioned children in flex layouts.
9. **Set initial CSS transforms in JSX inline styles** to match GSAP's expected base — prevents flash before useGSAP runs.

---

## Animation Patterns

10. **Looping animations: end state must match start state.** Otherwise you get a visible jump on repeat.
11. **Never use `strokeLinecap="round"` with dash animations.** Creates visible dots at zero length.
12. **Don't set SVG opacity as HTML attributes if GSAP controls it.** Use `gsap.set()`.
13. **GSAP can't animate complex CSS strings** (clip-path, d attribute). Break into numeric values, tween those, rebuild in `onUpdate`.
14. **`gsap.to()` in rAF = death at scale.** Use `gsap.set()` for instant per-frame updates. `gsap.to()` only for state transitions.
15. **Carousel wrap-around: pass explicit direction.** Don't infer from index math — it breaks on wrap.

---

## Cursor & Interactive

16. **Hide cursor elements until first `mouseenter`.** `gsap.set(dots, { opacity: 0 })` on mount.
17. **Create `quickTo` inside `useGSAP`.** Not in bare useEffect.
18. **Calculate element positions AFTER entry animations complete** — use `onComplete` callback.
19. **Use refs for settings that rAF reads.** React state captures stale in closures.

---

## What Not To Do

- Don't use Flip plugin with React conditional rendering — elements must stay mounted.
- Don't use MotionPath for simple circular orbits — cos/sin math is simpler and works.
- Don't use `box-shadow` with blur on 300+ elements — use `backgroundColor`.
- Don't scale up small elements — render at max size, CSS scale down.

---

## Page Layout

- **No titles on experiment pages** — the top bar already shows experiment name + category.
- **Bottom help text is OK** if it conveys useful info (interaction hints, technique description).
- If a page has a title with explainer text, move the explainer to the bottom.
- **Responsive typography:** Step fonts down on mobile to fit, step up on larger screens when there's room. Use layout restructuring (fewer cols, stacking) over text wrapping.

---

## Architecture

- **Variant sub-pages:** `Experiment.children` in data model, variant components accept a `variant` prop
- **Component map:** factory functions `(p) => <VariantComponent {...p} variant="x" />`
- **Sidebar:** shadcn Sidebar + Collapsible for expandable experiments
- **Raw source:** `import.meta.glob` with `?raw` for export feature (planned)

---

## Known Issues

- `variable-font-wave` — needs visual check
- `inertia-dot-grid` — needs visual check

## Fixed (2026-02-08)

- `masked-line-reveal` — timeline didn't loop (`repeat: -1` added, removed manual reset-reveal hack). Added responsive font scaling.
- `svg-mask-text-reveal` — GSAP can't interpolate SVG `transform` attribute strings. Switched to GSAP's native SVG transform properties (x/y/scale with svgOrigin). Removed inline transform/opacity from markup.
- `spotlight-reveal` — bare `useEffect` moved into `useGSAP`. quickTo + ticker loop now context-tracked. Event handlers wrapped with `contextSafe`.

---

*Detailed fix history: `~/Desktop/NeueBot/memory/entries/2026-02-08/gsap-fix-log.md`*
