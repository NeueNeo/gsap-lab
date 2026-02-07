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
    name: "Text Animations",
    experiments: [
      { id: "character-reveal", name: "Character Reveal", category: "Text Animations" },
      { id: "typewriter", name: "Typewriter", category: "Text Animations" },
      { id: "scramble-text", name: "Scramble Text", category: "Text Animations" },
      { id: "split-scatter", name: "Split & Scatter", category: "Text Animations" },
      { id: "glitch-text", name: "Glitch Text", category: "Text Animations" },
      { id: "rolling-text", name: "Rolling Text", category: "Text Animations" },
      { id: "text-wave", name: "Text Wave", category: "Text Animations" },
    ],
  },
  {
    name: "Card & Layout",
    experiments: [
      { id: "stagger-grid", name: "Stagger Grid", category: "Card & Layout" },
      { id: "card-flip", name: "Card Flip", category: "Card & Layout" },
      { id: "expanding-card", name: "Expanding Card", category: "Card & Layout" },
      { id: "shuffle-grid", name: "Shuffle Grid", category: "Card & Layout" },
    ],
  },
  {
    name: "Scroll & Parallax",
    experiments: [
      { id: "parallax-layers", name: "Parallax Layers", category: "Scroll & Parallax" },
      { id: "pin-and-reveal", name: "Pin & Reveal", category: "Scroll & Parallax" },
      { id: "progress-bar", name: "Progress Bar", category: "Scroll & Parallax" },
      { id: "scroll-velocity-skew", name: "Scroll Velocity Skew", category: "Scroll & Parallax" },
      { id: "batch-stagger-reveal", name: "Batch Stagger Reveal", category: "Scroll & Parallax" },
      { id: "snap-sections", name: "Snap Sections", category: "Scroll & Parallax" },
      { id: "scroll-text-reveal", name: "Scroll Text Reveal", category: "Scroll & Parallax" },
      { id: "scroll-highlight-reveal", name: "Scroll Highlight", category: "Scroll & Parallax" },
      { id: "scroll-char-fill", name: "Scroll Char Fill", category: "Scroll & Parallax" },
      { id: "scroll-paragraph-fade", name: "Scroll Paragraph", category: "Scroll & Parallax" },
      { id: "parallax-images", name: "Parallax Images", category: "Scroll & Parallax" },
      { id: "parallax-depth-field", name: "Parallax Depth Field", category: "Scroll & Parallax" },
      { id: "stacking-pages", name: "Stacking Pages (Default)", category: "Scroll & Parallax" },
      { id: "stacking-pages-fade", name: "Stacking Pages (Fade)", category: "Scroll & Parallax" },
    ],
  },
  {
    name: "Motion & Physics",
    experiments: [
      { id: "magnetic-button", name: "Magnetic Button", category: "Motion & Physics" },
      { id: "draggable-cards", name: "Draggable Cards", category: "Motion & Physics" },
      { id: "elastic-menu", name: "Elastic Menu", category: "Motion & Physics" },
      { id: "bouncing-balls", name: "Bouncing Balls", category: "Motion & Physics" },
    ],
  },
  {
    name: "SVG & Creative",
    experiments: [
      { id: "svg-path-draw", name: "SVG Path Draw", category: "SVG & Creative" },
      { id: "morphing-shape", name: "Morphing Shape", category: "SVG & Creative" },
      { id: "number-counter", name: "Number Counter", category: "SVG & Creative" },
      { id: "svg-line-art", name: "SVG Line Art", category: "SVG & Creative" },
      { id: "clip-path-morph", name: "Clip Path Morph", category: "SVG & Creative" },
      { id: "gradient-shift", name: "Gradient Shift", category: "SVG & Creative" },
    ],
  },
  {
    name: "Page Transitions",
    experiments: [
      { id: "wipe-transition", name: "Wipe Transition", category: "Page Transitions" },
      { id: "crossfade-pages", name: "Crossfade Pages", category: "Page Transitions" },
      { id: "slide-transition", name: "Slide Transition", category: "Page Transitions" },
    ],
  },
  {
    name: "Loading & Loops",
    experiments: [
      { id: "skeleton-shimmer", name: "Skeleton Shimmer", category: "Loading & Loops" },
      { id: "marquee-ticker", name: "Marquee Ticker", category: "Loading & Loops" },
      { id: "orbit-animation", name: "Orbit Animation", category: "Loading & Loops" },
    ],
  },
  {
    name: "Hover & Micro",
    experiments: [
      { id: "card-tilt-3d", name: "3D Card Tilt", category: "Hover & Micro" },
      { id: "button-feedback", name: "Button Feedback", category: "Hover & Micro" },
      { id: "hover-underline", name: "Hover Underline", category: "Hover & Micro" },
      { id: "liquid-button", name: "Liquid Button", category: "Hover & Micro" },
    ],
  },
  {
    name: "Flip & Layout",
    experiments: [
      { id: "flip-grid", name: "Flip Grid", category: "Flip & Layout" },
      { id: "flip-expand", name: "Flip Expand", category: "Flip & Layout" },
    ],
  },
  {
    name: "Scroll Storytelling",
    experiments: [
      { id: "timeline-scroll", name: "Timeline Scroll", category: "Scroll Storytelling" },
      { id: "counter-scroll", name: "Counter Scroll", category: "Scroll Storytelling" },
    ],
  },
];

export const allExperiments = categories.flatMap((c) => c.experiments);
