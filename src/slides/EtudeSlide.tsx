import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { TUNISIA_PATH, TUNISIA_VIEWBOX } from "@/assets/tunisia";

/**
 * Type, lieu et date de l'étude (page 8). Left: the study design as a clinical
 * "fiche" with tagged descriptors and an animated 4-week timeline. Right: a real
 * Tunisia silhouette (Wikimedia outline) whose border draws itself in, with a
 * pulsing pin on Tunis and a callout listing the three hospital sites.
 */

const DESIGN = ["Quantitative", "Transversale", "Descriptive"];
const HOSPITALS = [
  "Hôpital La Rabta",
  "Hôpital Charles Nicolle",
  "Hôpital Wassila Bourguiba",
];
// Tunis, in the map's viewBox coordinate space (calibrated).
const TUNIS = { x: 257, y: 82 };

export default function EtudeSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".etude-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".etude-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".etude-reveal", { y: 22, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.2)
        .from(".tag", { scale: 0, opacity: 0, transformOrigin: "left center", duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, 0.4)
        .from(".timeline-fill", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power2.inOut" }, 0.7)
        .from(".timeline-cap", { scale: 0, transformOrigin: "center", duration: 0.4, stagger: 0.25 }, 0.9)
        // map
        .from(".tn-shape", { drawSVG: "0%", duration: 1.8, ease: "power1.inOut" }, 0.3)
        .to(".tn-fill", { opacity: 1, duration: 1 }, 0.9)
        .from(".tn-pin", { y: -40, opacity: 0, duration: 0.6, ease: "bounce.out" }, 1.5)
        .from(".tn-callout", { x: 20, opacity: 0, duration: 0.6 }, 1.7)
        .from(".tn-leader", { drawSVG: "0%", duration: 0.4 }, 1.7);

      // ripple pulse under the pin, forever
      gsap.fromTo(
        ".tn-ripple",
        { scale: 0, opacity: 0.6, transformOrigin: "center" },
        { scale: 3, opacity: 0, duration: 2, ease: "power1.out", repeat: -1, delay: 2 },
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[1.05fr_0.95fr] items-center gap-12 px-20 py-12">
      {/* Left: study design fiche */}
      <div>
        <p className="etude-kicker mono-label text-clinic">02 · Méthodologie</p>
        <h2 className="etude-title mt-3 max-w-md font-display text-5xl font-light leading-[1.05] text-ink">
          Type, lieu et date de l'étude
        </h2>

        <div className="etude-reveal mt-9 flex flex-wrap gap-2.5">
          {DESIGN.map((d) => (
            <span
              key={d}
              className="tag rounded-full border border-clinic/40 bg-clinic-soft/50 px-5 py-2 text-[15px] font-semibold text-clinic-deep"
            >
              {d}
            </span>
          ))}
        </div>

        <p className="etude-reveal mt-7 max-w-md leading-relaxed text-muted">
          Une enquête menée sur une période de{" "}
          <strong className="font-semibold text-ink">4 semaines</strong>, du
          18 février au 17 mars 2026.
        </p>

        {/* 4-week timeline */}
        <div className="etude-reveal mt-7 max-w-md">
          <div className="relative h-2 rounded-full bg-hair/50">
            <div className="timeline-fill h-full rounded-full bg-gradient-to-r from-clinic to-clinic-deep" />
            <span className="timeline-cap absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-clinic bg-paper" />
            <span className="timeline-cap absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-clinic-deep bg-clinic-deep" />
          </div>
          <div className="mt-2.5 flex justify-between text-xs font-medium text-muted">
            <span>18 février 2026</span>
            <span>17 mars 2026</span>
          </div>
        </div>
      </div>

      {/* Right: Tunisia map */}
      <div className="relative grid h-full place-items-center">
        <svg
          viewBox={TUNISIA_VIEWBOX}
          className="h-[80vh] max-h-[660px] w-auto overflow-visible"
          aria-label="Carte de la Tunisie indiquant le terrain d'étude à Tunis"
        >
          {/* filled body (fades in after border draws) */}
          <path className="tn-fill" d={TUNISIA_PATH} fill="var(--color-clinic-soft)" opacity={0} />
          {/* drawn border */}
          <path
            className="tn-shape"
            d={TUNISIA_PATH}
            fill="none"
            stroke="var(--color-clinic)"
            strokeWidth={3}
            strokeLinejoin="round"
          />

          {/* leader line from pin to callout */}
          <line
            className="tn-leader"
            x1={TUNIS.x}
            y1={TUNIS.y}
            x2={TUNIS.x + 60}
            y2={TUNIS.y - 6}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />

          {/* ripple + pin */}
          <circle className="tn-ripple" cx={TUNIS.x} cy={TUNIS.y} r={8} fill="var(--color-coral)" />
          <g className="tn-pin">
            <path
              d={`M${TUNIS.x} ${TUNIS.y + 4}
                  C ${TUNIS.x - 12} ${TUNIS.y - 14}, ${TUNIS.x - 11} ${TUNIS.y - 30}, ${TUNIS.x} ${TUNIS.y - 30}
                  C ${TUNIS.x + 11} ${TUNIS.y - 30}, ${TUNIS.x + 12} ${TUNIS.y - 14}, ${TUNIS.x} ${TUNIS.y + 4} Z`}
              fill="var(--color-coral)"
              stroke="white"
              strokeWidth={2}
            />
            <circle cx={TUNIS.x} cy={TUNIS.y - 18} r={5} fill="white" />
          </g>
        </svg>

        {/* callout listing the 3 hospitals (HTML overlay for crisp text) */}
        <div className="tn-callout absolute right-2 top-[14%] w-60 rounded-xl border border-hair/60 bg-white/70 px-5 py-4 backdrop-blur-sm">
          <p className="mono-label text-coral">Terrain · Tunis</p>
          <ul className="mt-2.5 space-y-2">
            {HOSPITALS.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm font-medium text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clinic" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
