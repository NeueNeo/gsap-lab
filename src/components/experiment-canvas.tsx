
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { allExperiments } from "@/lib/experiments";
import { CharacterReveal } from "./experiments/character-reveal";
import { CharacterRevealVariant } from "./experiments/character-reveal-variant";
import { LetterRollupVariant } from "./experiments/letter-rollup-variant";
import { HoverUnderlineVariant } from "./experiments/hover-underline-variant";
import { ButtonFeedbackVariant } from "./experiments/button-feedback-variant";
import { Typewriter } from "./experiments/typewriter";
import { ScrambleText } from "./experiments/scramble-text";
import { StaggerGrid } from "./experiments/stagger-grid";
import { CardFlip } from "./experiments/card-flip";
import { ExpandingCard } from "./experiments/expanding-card";
import { ShuffleGrid } from "./experiments/shuffle-grid";
import { ParallaxLayers } from "./experiments/parallax-layers";
import { ProgressBar } from "./experiments/progress-bar";
import { MagneticButton } from "./experiments/magnetic-button";
import { DraggableCards } from "./experiments/draggable-cards";
import { ElasticMenus } from "./experiments/elastic-menus";
import { SvgPathDraw } from "./experiments/svg-path-draw";
import { MorphingShape } from "./experiments/morphing-shape";
import { NumberCounter } from "./experiments/number-counter";
import { GlitchText } from "./experiments/glitch-text";
import { RollingText } from "./experiments/rolling-text";
import { WaveMotion } from "./experiments/wave-motion";
import { RippleEffect } from "./experiments/ripple-effect";
import { LetterRollup } from "./experiments/letter-rollup";
import { CylinderText } from "./experiments/cylinder-text";
import { CylinderTextVariant } from "./experiments/cylinder-text-variant";
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
import { FlipExpand } from "./experiments/flip-expand";
import { SvgLineArt } from "./experiments/svg-line-art";
import { GradientShift } from "./experiments/gradient-shift";
import { TimelineScroll } from "./experiments/timeline-scroll";
import { CounterScroll } from "./experiments/counter-scroll";
import { ParallaxImages } from "./experiments/parallax-images";
import { StackingPages } from "./experiments/stacking-pages";
import { StackingPagesFade } from "./experiments/stacking-pages-fade";
import { ParallaxDepthField } from "./experiments/parallax-depth-field";
import { ParallaxHover } from "./experiments/parallax-hover";
import { VariableFontWave } from "./experiments/variable-font-wave";
import { ElasticDragText } from "./experiments/elastic-drag-text";
import { MaskedLineReveal } from "./experiments/masked-line-reveal";
import { HorizontalScrollPanels } from "./experiments/horizontal-scroll-panels";
import { ScrollDirectionReveal } from "./experiments/scroll-direction-reveal";
import { PinMultiStep } from "./experiments/pin-multi-step";
import { StaggerBarsWipe } from "./experiments/stagger-bars-wipe";
import { BlurScaleTransition } from "./experiments/blur-scale-transition";
import { DrawSvgScribbleUnderline } from "./experiments/drawsvg-scribble-underline";
import { CursorTrail } from "./experiments/cursor-trail";
import { VelocityCursor } from "./experiments/velocity-cursor";
import { FlipAddToCart } from "./experiments/flip-add-to-cart";
import { InertiaDotGrid } from "./experiments/inertia-dot-grid";
import { CardStackFan } from "./experiments/card-stack-fan";
import { SvgMaskTextReveal } from "./experiments/svg-mask-text-reveal";
import { MorphingIcons } from "./experiments/morphing-icons";
import { DrawSvgSignature } from "./experiments/drawsvg-signature";
import { DraggableMarquee } from "./experiments/draggable-marquee";
import { PreloaderSequence } from "./experiments/preloader-sequence";
import { InfiniteCardSlider } from "./experiments/infinite-card-slider";
import { PhysicsDotsLoader } from "./experiments/physics-dots-loader";
import { CursorImagePreview } from "./experiments/cursor-image-preview";
import { MacosDockEffect } from "./experiments/macos-dock-effect";
import { SpotlightReveal } from "./experiments/spotlight-reveal";
import { CursorRipple } from "./experiments/cursor-ripple";
import { CardCarousel } from "./experiments/card-carousel";
import { ScrollHighlightReveal } from "./experiments/scroll-highlight-reveal";
import { LetterRollupSnap } from "./experiments/letter-rollup-snap";

/* eslint-disable react/display-name */
const crVariant = (v: "slide-up" | "scale-pop" | "blur-in" | "slide-right" | "flip-in" | "word-scale") =>
  (props: { onReplay: () => void }) => <CharacterRevealVariant {...props} variant={v} />;

const experimentComponents: Record<string, React.ComponentType<{ onReplay: () => void }>> = {
  "character-reveal": CharacterReveal,
  "character-reveal--slide-up": crVariant("slide-up"),
  "character-reveal--scale-pop": crVariant("scale-pop"),
  "character-reveal--blur-in": crVariant("blur-in"),
  "character-reveal--slide-right": crVariant("slide-right"),
  "character-reveal--flip-in": crVariant("flip-in"),
  "character-reveal--word-scale": crVariant("word-scale"),
  "letter-rollup--sequential": (p: { onReplay: () => void }) => <LetterRollupVariant {...p} variant="sequential" />,
  "letter-rollup--random": (p: { onReplay: () => void }) => <LetterRollupVariant {...p} variant="random" />,
  "letter-rollup--from-center": (p: { onReplay: () => void }) => <LetterRollupVariant {...p} variant="from-center" />,
  "letter-rollup--from-edges": (p: { onReplay: () => void }) => <LetterRollupVariant {...p} variant="from-edges" />,
  "hover-underline--wipe": (p: { onReplay: () => void }) => <HoverUnderlineVariant {...p} variant="wipe" />,
  "hover-underline--center": (p: { onReplay: () => void }) => <HoverUnderlineVariant {...p} variant="center" />,
  "hover-underline--elastic": (p: { onReplay: () => void }) => <HoverUnderlineVariant {...p} variant="elastic" />,
  "hover-underline--morph": (p: { onReplay: () => void }) => <HoverUnderlineVariant {...p} variant="morph" />,
  "hover-underline--slide": (p: { onReplay: () => void }) => <HoverUnderlineVariant {...p} variant="slide" />,
  "button-feedback--press-scale": (p: { onReplay: () => void }) => <ButtonFeedbackVariant {...p} variant="press-scale" />,
  "button-feedback--ripple": (p: { onReplay: () => void }) => <ButtonFeedbackVariant {...p} variant="ripple" />,
  "button-feedback--magnetic-pull": (p: { onReplay: () => void }) => <ButtonFeedbackVariant {...p} variant="magnetic-pull" />,
  "button-feedback--success-check": (p: { onReplay: () => void }) => <ButtonFeedbackVariant {...p} variant="success-check" />,
  "button-feedback--jelly-bounce": (p: { onReplay: () => void }) => <ButtonFeedbackVariant {...p} variant="jelly-bounce" />,
  "typewriter": Typewriter,
  "scramble-text": ScrambleText,
  "stagger-grid": StaggerGrid,
  "card-flip": CardFlip,
  "expanding-card": ExpandingCard,
  "shuffle-grid": ShuffleGrid,
  "parallax-layers": ParallaxLayers,
  "progress-bar": ProgressBar,
  "magnetic-button": MagneticButton,
  "draggable-cards": DraggableCards,
  "elastic-menus": ElasticMenus,
  "svg-path-draw": SvgPathDraw,
  "morphing-shape": MorphingShape,
  "number-counter": NumberCounter,
  "glitch-text": GlitchText,
  "rolling-text": RollingText,
  "wave-motion": WaveMotion,
  "ripple-effect": RippleEffect,
  "letter-rollup": LetterRollup,
  "cylinder-text": CylinderText,
  "cylinder-text--drum": (p: { onReplay: () => void }) => <CylinderTextVariant {...p} variant="drum" />,
  "cylinder-text--ring": (p: { onReplay: () => void }) => <CylinderTextVariant {...p} variant="ring" />,
  "cylinder-text--tilted-orbit": (p: { onReplay: () => void }) => <CylinderTextVariant {...p} variant="tilted-orbit" />,
  "cylinder-text--double-helix": (p: { onReplay: () => void }) => <CylinderTextVariant {...p} variant="double-helix" />,
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
  "flip-expand": FlipExpand,
  "svg-line-art": SvgLineArt,
  "gradient-shift": GradientShift,
  "timeline-scroll": TimelineScroll,
  "counter-scroll": CounterScroll,
  "parallax-images": ParallaxImages,
  "stacking-pages": StackingPages,
  "stacking-pages-fade": StackingPagesFade,
  "parallax-depth-field": ParallaxDepthField,
  "parallax-hover": ParallaxHover,
  "variable-font-wave": VariableFontWave,
  "elastic-drag-text": ElasticDragText,
  "masked-line-reveal": MaskedLineReveal,
  "horizontal-scroll-panels": HorizontalScrollPanels,
  "scroll-direction-reveal": ScrollDirectionReveal,
  "pin-multi-step": PinMultiStep,
  "stagger-bars-wipe": StaggerBarsWipe,
  "blur-scale-transition": BlurScaleTransition,
  "drawsvg-scribble-underline": DrawSvgScribbleUnderline,
  "cursor-trail": CursorTrail,
  "velocity-cursor": VelocityCursor,
  "flip-add-to-cart": FlipAddToCart,
  "inertia-dot-grid": InertiaDotGrid,
  "card-stack-fan": CardStackFan,
  "svg-mask-text-reveal": SvgMaskTextReveal,
  "morphing-icons": MorphingIcons,
  "drawsvg-signature": DrawSvgSignature,
  "draggable-marquee": DraggableMarquee,
  "preloader-sequence": PreloaderSequence,
  "infinite-card-slider": InfiniteCardSlider,
  "physics-dots-loader": PhysicsDotsLoader,
  "cursor-image-preview": CursorImagePreview,
  "macos-dock-effect": MacosDockEffect,
  "spotlight-reveal": SpotlightReveal,
  "cursor-ripple": CursorRipple,
  "scroll-highlight-reveal": ScrollHighlightReveal,
  "card-carousel": CardCarousel,
};

interface ExperimentCanvasProps {
  activeId: string;
  onReplay: () => void;
}

export function ExperimentCanvas({ activeId }: ExperimentCanvasProps) {
  const { toggleSidebar } = useSidebar();
  const [replayKey, setReplayKey] = useState(0);
  const experiment = allExperiments.find((e) => e.id === activeId);
  const Component = experimentComponents[activeId];

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  if (!Component || !experiment) return null;

  return (
    <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden bg-zinc-950">
      <header className="flex items-center justify-between pl-3 pr-4 lg:px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400 hover:text-zinc-100" onClick={() => toggleSidebar()}>
            <Menu className="size-5" />
          </Button>
          <div>
            <p className="text-xs font-mono font-medium text-zinc-500">
              {experiment.category}
            </p>
            <h2 className="text-base font-semibold text-zinc-100">
              {experiment.name}
            </h2>
          </div>
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
      <div className="flex-1 overflow-hidden relative pt-4">
        <div key={replayKey} className="h-full">
          <Component onReplay={handleReplay} />
        </div>
      </div>
    </main>
  );
}
