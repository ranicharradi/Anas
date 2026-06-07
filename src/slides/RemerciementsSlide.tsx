import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Remerciements — the deck's final slide. A full-bleed deep-teal page (the act-
 * divider "teal" treatment) with the closing "Merci" centred over a faint
 * clinical pulse. Registered tone:"dark" so the deck chrome (slide counter,
 * progress bar, nav) switches to a light palette and stays legible here.
 */
export default function RemerciementsSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".rem-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".rem-ring", { scale: 0, opacity: 0, transformOrigin: "center", duration: 1, stagger: 0.1, ease: "power2.out" })
        .from(".rem-kicker", { y: 14, opacity: 0, duration: 0.5 }, 0.2)
        .from(split.words, { yPercent: 120, duration: 0.85, stagger: 0.06 }, 0.25)
        .from(".rem-rule", { scaleX: 0, transformOrigin: "center", duration: 0.7 }, 0.62)
        .from(".rem-line", { y: 18, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.72);

      // Perpetual sonar pulse: rings expand from the centre and fade, forever.
      gsap.fromTo(
        ".rem-ping",
        { scale: 0.16, opacity: 0.4, transformOrigin: "center" },
        { scale: 1, opacity: 0, transformOrigin: "center", duration: 3.6, ease: "sine.out", repeat: -1, stagger: 1.8 },
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-clinic-deep px-20 text-center text-paper"
    >
      <Decor />

      <div className="relative z-10 flex flex-col items-center">
        <p className="rem-kicker mono-label text-clinic-soft">Remerciements</p>
        <h2 className="rem-title mt-6 font-display text-[9rem] font-light leading-none text-paper">
          Merci.
        </h2>
        <div className="rem-rule mt-8 h-[3px] w-28 bg-coral" />
        <div className="mt-9 space-y-2">
          <p className="rem-line text-2xl leading-relaxed text-paper/85">
            Aux membres du jury, merci de votre attention.
          </p>
          <p className="rem-line text-2xl leading-relaxed text-paper/65">
            Nous restons à votre disposition pour vos questions.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Faint clinical backdrop on the teal field: tiled white crosses, centred
 *  concentric rings, and two perpetual sonar pings radiating outward. */
function Decor() {
  const rings = [180, 340, 520, 700];
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="rem-cross" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M24 18v12M18 24h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#rem-cross)" opacity="0.05" />

      {[0, 1].map((i) => (
        <circle key={`ping-${i}`} className="rem-ping" cx="800" cy="450" r="700" fill="none" stroke="white" strokeWidth="1.5" />
      ))}

      {rings.map((r, i) => (
        <circle
          key={r}
          className="rem-ring"
          cx="800"
          cy="450"
          r={r}
          fill="none"
          stroke={i === 1 ? "var(--color-coral)" : "white"}
          strokeWidth="1.5"
          strokeOpacity={i === 1 ? 0.22 : 0.1}
        />
      ))}
    </svg>
  );
}
