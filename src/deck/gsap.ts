import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Register once, app-wide. useGSAP handles scoped selection + automatic cleanup
// (gsap.context) so React StrictMode double-invokes don't stack animations.
// - SplitText: word/char-staggered heading reveals.
// - DrawSVGPlugin: stroke-draw for the vital-sign hairline + stat rings.
// - MotionPathPlugin: send a pulse travelling along an SVG path (roadmap slide).
// - ScrollTrigger: ready for any scroll-driven slide you add later.
gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
  useGSAP,
);

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
  useGSAP,
};
