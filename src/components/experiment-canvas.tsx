"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { allExperiments } from "@/lib/experiments";
import { CharacterReveal } from "./experiments/character-reveal";
import { Typewriter } from "./experiments/typewriter";
import { ScrambleText } from "./experiments/scramble-text";
import { StaggerGrid } from "./experiments/stagger-grid";
import { CardFlip } from "./experiments/card-flip";
import { ExpandingCard } from "./experiments/expanding-card";
import { ShuffleGrid } from "./experiments/shuffle-grid";
import { ParallaxLayers } from "./experiments/parallax-layers";
import { PinAndReveal } from "./experiments/pin-and-reveal";
import { ProgressBar } from "./experiments/progress-bar";
import { MagneticButton } from "./experiments/magnetic-button";
import { DraggableCards } from "./experiments/draggable-cards";
import { ElasticMenus } from "./experiments/elastic-menus";
import { BouncingBalls } from "./experiments/bouncing-balls";
import { SvgPathDraw } from "./experiments/svg-path-draw";
import { MorphingShape } from "./experiments/morphing-shape";
import { NumberCounter } from "./experiments/number-counter";
import { SplitScatter } from "./experiments/split-scatter";
import { GlitchText } from "./experiments/glitch-text";
import { RollingText } from "./experiments/rolling-text";
import { TextWave } from "./experiments/text-wave";
import { LetterRollup } from "./experiments/letter-rollup";
import { CylinderText } from "./experiments/cylinder-text";
import { ScrollVelocitySkew } from "./experiments/scroll-velocity-skew";
import { BatchStaggerReveal } from "./experiments/batch-stagger-reveal";
import { SnapSections } from "./experiments/snap-sections";
import { ScrollTextReveal } from "./experiments/scroll-text-reveal";
import { ScrollCharFill } from "./experiments/scroll-char-fill";
import { ScrollParagraphFade } from "./experiments/scroll-paragraph-fade";
import { WipeTransition } from "./experiments/wipe-transition";
import { WipeLR } from "./experiments/wipe-lr";
import { CrossfadePages } from "./experiments/crossfade-pages";
import { SlideTransition } from "./experiments/slide-transition";
import { SkeletonShimmer } from "./experiments/skeleton-shimmer";
import { MarqueeTicker } from "./experiments/marquee-ticker";
import { OrbitAnimation } from "./experiments/orbit-animation";
import { CardTilt3d } from "./experiments/card-tilt-3d";
import { ButtonFeedback } from "./experiments/button-feedback";
import { HoverUnderline } from "./experiments/hover-underline";
import { LiquidButton } from "./experiments/liquid-button";
import { FlipGrid } from "./experiments/flip-grid";
import { FlipExpand } from "./experiments/flip-expand";
import { SvgLineArt } from "./experiments/svg-line-art";
import { ClipPathMorph } from "./experiments/clip-path-morph";
import { GradientShift } from "./experiments/gradient-shift";
import { TimelineScroll } from "./experiments/timeline-scroll";
import { CounterScroll } from "./experiments/counter-scroll";
import { ParallaxImages } from "./experiments/parallax-images";
import { StackingPages } from "./experiments/stacking-pages";
import { StackingPagesFade } from "./experiments/stacking-pages-fade";
import { ParallaxDepthField } from "./experiments/parallax-depth-field";

const experimentComponents: Record<string, React.ComponentType<{ onReplay: () => void }>> = {
  "character-reveal": CharacterReveal,
  "typewriter": Typewriter,
  "scramble-text": ScrambleText,
  "stagger-grid": StaggerGrid,
  "card-flip": CardFlip,
  "expanding-card": ExpandingCard,
  "shuffle-grid": ShuffleGrid,
  "parallax-layers": ParallaxLayers,
  "pin-and-reveal": PinAndReveal,
  "progress-bar": ProgressBar,
  "magnetic-button": MagneticButton,
  "draggable-cards": DraggableCards,
  "elastic-menus": ElasticMenus,
  "bouncing-balls": BouncingBalls,
  "svg-path-draw": SvgPathDraw,
  "morphing-shape": MorphingShape,
  "number-counter": NumberCounter,
  "split-scatter": SplitScatter,
  "glitch-text": GlitchText,
  "rolling-text": RollingText,
  "text-wave": TextWave,
  "letter-rollup": LetterRollup,
  "cylinder-text": CylinderText,
  "scroll-velocity-skew": ScrollVelocitySkew,
  "batch-stagger-reveal": BatchStaggerReveal,
  "snap-sections": SnapSections,
  "scroll-text-reveal": ScrollTextReveal,
  "scroll-char-fill": ScrollCharFill,
  "scroll-paragraph-fade": ScrollParagraphFade,
  "wipe-transition": WipeTransition,
  "wipe-lr": WipeLR,
  "crossfade-pages": CrossfadePages,
  "slide-transition": SlideTransition,
  "skeleton-shimmer": SkeletonShimmer,
  "marquee-ticker": MarqueeTicker,
  "orbit-animation": OrbitAnimation,
  "card-tilt-3d": CardTilt3d,
  "button-feedback": ButtonFeedback,
  "hover-underline": HoverUnderline,
  "liquid-button": LiquidButton,
  "flip-grid": FlipGrid,
  "flip-expand": FlipExpand,
  "svg-line-art": SvgLineArt,
  "clip-path-morph": ClipPathMorph,
  "gradient-shift": GradientShift,
  "timeline-scroll": TimelineScroll,
  "counter-scroll": CounterScroll,
  "parallax-images": ParallaxImages,
  "stacking-pages": StackingPages,
  "stacking-pages-fade": StackingPagesFade,
  "parallax-depth-field": ParallaxDepthField,
};

interface ExperimentCanvasProps {
  activeId: string;
  onReplay: () => void;
}

export function ExperimentCanvas({ activeId }: ExperimentCanvasProps) {
  const [replayKey, setReplayKey] = useState(0);
  const experiment = allExperiments.find((e) => e.id === activeId);
  const Component = experimentComponents[activeId];

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  if (!Component || !experiment) return null;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-950">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            {experiment.name}
          </h2>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            {experiment.category}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReplay}
          className="text-xs font-mono bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          ↻ Replay
        </Button>
      </header>
      <div className="flex-1 overflow-auto relative">
        <div key={replayKey} className="h-full">
          <Component onReplay={handleReplay} />
        </div>
      </div>
    </main>
  );
}
