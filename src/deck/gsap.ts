import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

// Register once, app-wide. useGSAP handles scoped selection + automatic cleanup
// (gsap.context) so React StrictMode double-invokes don't stack animations.
// - SplitText: word/char-staggered heading reveals.
// - DrawSVGPlugin: stroke-draw for the vital-sign hairline + stat rings.
// - ScrollTrigger: ready for any scroll-driven slide you add later.
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
