import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Plan de travail: the soutenance roadmap (page 2 of the Canva deck) rebuilt as
 * a single SVG: five icon nodes strung along a self-drawing connector that waves
 * above/below a centre line, with a coral pulse travelling the route on loop
 * (the deck's ECG/vital-sign motif). All motion is GSAP, gated on `active`.
 */

const VB = { w: 1200, h: 540 };
const R = 50; // node radius

interface Step {
  n: string;
  /** Label split into manual lines (SVG text doesn't wrap). */
  lines: string[];
  icon: "search" | "clipboard" | "chart" | "thumb" | "chat" | "scale" | "shield";
  /** Per-label font size override; defaults to 25. Used to fit wide labels
   *  (e.g. "Recommandations") within the gap between the flanking arcs. */
  labelSize?: number;
  x: number;
  y: number;
}

// Roadmap steps in order. Number and position are derived below so the row
// stays evenly spaced and correctly numbered however many steps there are.
const PLAN: Pick<Step, "lines" | "icon" | "labelSize">[] = [
  { lines: ["Introduction"], icon: "search" },
  { lines: ["Méthodologie"], icon: "clipboard" },
  { lines: ["Résultat et", "discussion"], icon: "chart" },
  { lines: ["Recommandations"], icon: "thumb" },
  { lines: ["Conclusion"], icon: "shield" },
];

// Evenly spaced across the viewBox, alternating above/below the centre line.
const STEPS: Step[] = PLAN.map((s, i) => ({
  ...s,
  n: String(i + 1).padStart(2, "0"),
  x: 100 + (i * (VB.w - 200)) / (PLAN.length - 1),
  y: i % 2 === 0 ? 190 : 330,
}));

// Smooth cubic wave threaded through every node centre.
const ROAD_D = (() => {
  let d = `M${STEPS[0].x} ${STEPS[0].y}`;
  for (let i = 1; i < STEPS.length; i++) {
    const a = STEPS[i - 1];
    const b = STEPS[i];
    const cx = (b.x - a.x) / 2;
    d += ` C${a.x + cx} ${a.y} ${b.x - cx} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
})();

export default function PlanSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".plan-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".plan-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(
          ".road-path",
          { drawSVG: "0%", duration: 1.7, ease: "power1.inOut" },
          0.3,
        )
        .from(
          ".road-node",
          {
            scale: 0,
            opacity: 0,
            transformOrigin: "center",
            duration: 0.6,
            ease: "back.out(1.8)",
            stagger: 0.18,
          },
          0.55,
        )
        .from(
          ".road-icon",
          { opacity: 0, scale: 0.4, transformOrigin: "center", duration: 0.4, stagger: 0.18 },
          0.75,
        )
        .from(".road-num", { opacity: 0, y: 8, duration: 0.4, stagger: 0.18 }, 0.8)
        .from(
          ".road-label",
          { opacity: 0, y: 12, duration: 0.5, stagger: 0.18 },
          0.9,
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="flex h-full flex-col px-20 py-14">
      <div className="text-center">
        <p className="plan-kicker mono-label text-clinic">Sommaire</p>
        <h2 className="plan-title mt-3 font-display text-6xl font-light text-ink">
          Plan de travail
        </h2>
      </div>

      <div className="grid flex-1 place-items-center">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="w-full max-w-6xl overflow-visible"
        >
          {/* Connector road */}
          <path
            className="road-path"
            d={ROAD_D}
            fill="none"
            stroke="var(--color-clinic)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 9"
            opacity={0.55}
          />
          <path
            className="road-path"
            d={ROAD_D}
            fill="none"
            stroke="var(--color-clinic)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {STEPS.map((s) => {
            const numY = s.y > 260 ? s.y - 70 : s.y - 72;
            const labelY = s.y + R + 36;
            return (
              <g key={s.n}>
                {/* node disc + icon (scales as a unit) */}
                <g className="road-node" transform={`translate(${s.x} ${s.y})`}>
                  <circle
                    r={R}
                    fill="var(--color-paper)"
                    stroke="var(--color-clinic)"
                    strokeWidth={2}
                  />
                  <circle
                    r={R - 7}
                    fill="none"
                    stroke="var(--color-clinic-soft)"
                    strokeWidth={1}
                  />
                  <g
                    className="road-icon"
                    transform="translate(-19 -19) scale(1.58)"
                    fill="none"
                    stroke="var(--color-clinic-deep)"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  >
                    <Icon name={s.icon} />
                  </g>
                </g>

                <text
                  className="road-num"
                  x={s.x}
                  y={numY}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={700}
                  letterSpacing="0.18em"
                  fill="var(--color-clinic)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {s.n}
                </text>

                <text
                  className="road-label"
                  x={s.x}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={s.labelSize ?? 25}
                  fontWeight={600}
                  fill="var(--color-ink)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {s.lines.map((ln, i) => (
                    <tspan key={ln} x={s.x} dy={i === 0 ? 0 : 29}>
                      {ln}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function Icon({ name }: { name: Step["icon"] }) {
  switch (name) {
    case "search":
      return (
        <>
          <circle cx={11} cy={11} r={7} />
          <line x1={16.5} y1={16.5} x2={22} y2={22} />
        </>
      );
    case "clipboard":
      return (
        <>
          <rect x={8} y={2} width={8} height={4} rx={1} />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <line x1={8} y1={11} x2={16} y2={11} />
          <line x1={8} y1={15} x2={14} y2={15} />
        </>
      );
    case "chart":
      return (
        <>
          <line x1={3} y1={21} x2={21} y2={21} />
          <line x1={6} y1={21} x2={6} y2={13} />
          <line x1={12} y1={21} x2={12} y2={4} />
          <line x1={18} y1={21} x2={18} y2={9} />
        </>
      );
    case "thumb":
      return (
        <>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </>
      );
    case "chat":
      return (
        <>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
          <line x1={8.5} y1={11.5} x2={8.5} y2={11.5} />
          <line x1={12} y1={11.5} x2={12} y2={11.5} />
          <line x1={15.5} y1={11.5} x2={15.5} y2={11.5} />
        </>
      );
    case "scale":
      return (
        <>
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </>
      );
  }
}
