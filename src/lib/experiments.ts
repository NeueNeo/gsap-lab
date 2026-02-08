export interface Experiment {
  id: string;
  name: string;
  category: string;
}

export interface Category {
  name: string;
  experiments: Experiment[];
}

export const categories: Category[] = [
  {
    name: "Text",
    experiments: [
      { id: "character-reveal", name: "Character Reveal", category: "Text" },
      { id: "typewriter", name: "Typewriter", category: "Text" },
      { id: "scramble-text", name: "Scramble Text", category: "Text" },
      { id: "split-scatter", name: "Split & Scatter", category: "Text" },
      { id: "glitch-text", name: "Glitch Text", category: "Text" },
      { id: "rolling-text", name: "Rolling Text", category: "Text" },
      { id: "text-wave", name: "Text Wave", category: "Text" },
      { id: "letter-rollup", name: "Letter Rollup", category: "Text" },
      { id: "number-counter", name: "Number Counter", category: "Text" },
      { id: "cylinder-text", name: "Cylinder Text", category: "Text" },
      { id: "zipper-text-reveal", name: "Zipper Text Reveal", category: "Text" },
      { id: "variable-font-wave", name: "Variable Font Wave", category: "Text" },
      { id: "elastic-drag-text", name: "Elastic Drag Text", category: "Text" },
      { id: "masked-line-reveal", name: "Masked Line Reveal", category: "Text" },
    ],
  },
  {
    name: "Scroll",
    experiments: [
      { id: "scroll-text-reveal", name: "Text Reveal", category: "Scroll" },
      { id: "scroll-char-fill", name: "Char Fill", category: "Scroll" },
      { id: "scroll-paragraph-fade", name: "Paragraph Fade", category: "Scroll" },
      { id: "scroll-velocity-skew", name: "Velocity Skew", category: "Scroll" },
      { id: "batch-stagger-reveal", name: "Batch Stagger", category: "Scroll" },
      { id: "snap-sections", name: "Snap Sections", category: "Scroll" },
      { id: "progress-bar", name: "Progress Bar", category: "Scroll" },
      { id: "timeline-scroll", name: "Timeline Scroll", category: "Scroll" },
      { id: "counter-scroll", name: "Counter Scroll", category: "Scroll" },
      { id: "horizontal-scroll-panels", name: "Horizontal Scroll Panels", category: "Scroll" },
      { id: "scroll-direction-reveal", name: "Scroll Direction Reveal", category: "Scroll" },
      { id: "pin-multi-step", name: "Pin Multi-Step", category: "Scroll" },
    ],
  },
  {
    name: "Parallax",
    experiments: [
      { id: "parallax-layers", name: "Parallax Layers", category: "Parallax" },
      { id: "parallax-images", name: "Parallax Images", category: "Parallax" },
      { id: "parallax-depth-field", name: "Depth Field", category: "Parallax" },
      { id: "stacking-pages", name: "Stacking Pages", category: "Parallax" },
      { id: "stacking-pages-fade", name: "Stacking Pages (Fade)", category: "Parallax" },
      { id: "parallax-hover", name: "Parallax Hover", category: "Parallax" },
    ],
  },
  {
    name: "Page Transitions",
    experiments: [
      { id: "wipe-transition", name: "Wipe (Bars)", category: "Page Transitions" },
      { id: "wipe-lr", name: "Wipe (L→R)", category: "Page Transitions" },
      { id: "crossfade-pages", name: "Crossfade", category: "Page Transitions" },
      { id: "slide-transition", name: "Slide", category: "Page Transitions" },
      { id: "stagger-bars-wipe", name: "Stagger Bars Wipe", category: "Page Transitions" },
      { id: "blur-scale-transition", name: "Blur Scale Transition", category: "Page Transitions" },
    ],
  },
  {
    name: "Buttons & Hover",
    experiments: [
      { id: "magnetic-button", name: "Magnetic Buttons", category: "Buttons & Hover" },
      { id: "button-feedback", name: "Button Feedback", category: "Buttons & Hover" },
      { id: "hover-underline", name: "Hover Underline", category: "Buttons & Hover" },
      { id: "card-tilt-3d", name: "3D Card Tilt", category: "Buttons & Hover" },
      { id: "drawsvg-scribble-underline", name: "DrawSVG Scribble Underline", category: "Buttons & Hover" },
      { id: "cursor-trail", name: "Cursor Trail", category: "Buttons & Hover" },
      { id: "velocity-cursor", name: "Velocity Cursor", category: "Buttons & Hover" },
    ],
  },
  {
    name: "Cards & Layout",
    experiments: [
      { id: "stagger-grid", name: "Stagger Grid", category: "Cards & Layout" },
      { id: "card-flip", name: "Card Flip", category: "Cards & Layout" },
      { id: "expanding-card", name: "Expanding Card", category: "Cards & Layout" },
      { id: "shuffle-grid", name: "Shuffle Grid", category: "Cards & Layout" },
      { id: "flip-expand", name: "Flip Expand", category: "Cards & Layout" },
      { id: "draggable-cards", name: "Draggable Cards", category: "Cards & Layout" },
      { id: "elastic-menus", name: "Elastic Menus", category: "Cards & Layout" },
      { id: "flip-add-to-cart", name: "Flip Add to Cart", category: "Cards & Layout" },
      { id: "inertia-dot-grid", name: "Inertia Dot Grid", category: "Cards & Layout" },
      { id: "card-stack-fan", name: "Card Stack Fan", category: "Cards & Layout" },
    ],
  },
  {
    name: "SVG & Shape",
    experiments: [
      { id: "svg-path-draw", name: "Path Draw", category: "SVG & Shape" },
      { id: "svg-line-art", name: "Line Art", category: "SVG & Shape" },
      { id: "morphing-shape", name: "Morphing Shape", category: "SVG & Shape" },
      { id: "clip-path-morph", name: "Clip Path Morph", category: "SVG & Shape" },
      { id: "gradient-shift", name: "Gradient Shift", category: "SVG & Shape" },
      { id: "svg-mask-text-reveal", name: "SVG Mask Text Reveal", category: "SVG & Shape" },
      { id: "morphing-icons", name: "Morphing Icons", category: "SVG & Shape" },
      { id: "drawsvg-signature", name: "DrawSVG Signature", category: "SVG & Shape" },
    ],
  },
  {
    name: "Loops & Loading",
    experiments: [
      { id: "skeleton-shimmer", name: "Skeleton Shimmer", category: "Loops & Loading" },
      { id: "marquee-ticker", name: "Marquee Ticker", category: "Loops & Loading" },
      { id: "orbit-animation", name: "Orbit Animation", category: "Loops & Loading" },
      { id: "bouncing-balls", name: "Bouncing Balls", category: "Loops & Loading" },
      { id: "scroll-direction-marquee", name: "Scroll Direction Marquee", category: "Loops & Loading" },
      { id: "draggable-marquee", name: "Draggable Marquee", category: "Loops & Loading" },
      { id: "preloader-sequence", name: "Preloader Sequence", category: "Loops & Loading" },
      { id: "infinite-card-slider", name: "Infinite Card Slider", category: "Loops & Loading" },
      { id: "physics-dots-loader", name: "Physics Dots Loader", category: "Loops & Loading" },
    ],
  },
  {
    name: "Cursor & Mouse",
    experiments: [
      { id: "cursor-image-preview", name: "Cursor Image Preview", category: "Cursor & Mouse" },
      { id: "macos-dock-effect", name: "macOS Dock Effect", category: "Cursor & Mouse" },
      { id: "spotlight-reveal", name: "Spotlight Reveal", category: "Cursor & Mouse" },
      { id: "cursor-ripple", name: "Cursor Ripple", category: "Cursor & Mouse" },
    ],
  },
  {
    name: "3D & Perspective",
    experiments: [
      { id: "scroll-3d-tube", name: "Scroll 3D Tube", category: "3D & Perspective" },
      { id: "cylinder-gallery", name: "Cylinder Gallery", category: "3D & Perspective" },
      { id: "perspective-card-stack", name: "Perspective Card Stack", category: "3D & Perspective" },
      { id: "double-helix-text", name: "Double Helix Text", category: "3D & Perspective" },
    ],
  },
];

export const allExperiments = categories.flatMap((c) => c.experiments);
