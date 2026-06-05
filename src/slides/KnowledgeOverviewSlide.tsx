import { useRef } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { arc, type DefaultArcObject } from "d3-shape";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const GLOBAL_KNOWLEDGE = {
  label: "Niveau global de connaissances sur les IST",
  value: 60,
};

const TRANSMISSION_MODES = [
  { label: "Rapports sexuels", value: 90 },
  { label: "Contact sanguin", value: 66 },
  { label: "Mère-enfant", value: 68 },
  { label: "Contact indirect", value: 4.5 },
];

const BAR_CHART = {
  width: 680,
  height: 355,
  margin: { top: 40, right: 24, bottom: 78, left: 44 },
};

const modeX = scaleBand<string>()
  .domain(TRANSMISSION_MODES.map((d) => d.label))
  .range([BAR_CHART.margin.left, BAR_CHART.width - BAR_CHART.margin.right])
  .padding(0.42);

const modeY = scaleLinear()
  .domain([0, 100])
  .range([BAR_CHART.height - BAR_CHART.margin.bottom, BAR_CHART.margin.top]);

/** Rectangle with only its top two corners rounded — a clean bar cap. */
function barPath(x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
}

const GAUGE = {
  width: 252,
  pad: 8,
  outerRadius: 106,
  innerRadius: 72,
};
const GAUGE_CX = GAUGE.width / 2;
const GAUGE_CY = GAUGE.pad + GAUGE.outerRadius;
const GAUGE_HEIGHT = GAUGE_CY + GAUGE.pad;

const gaugeArc = arc<DefaultArcObject>()
  .innerRadius(GAUGE.innerRadius)
  .outerRadius(GAUGE.outerRadius)
  .cornerRadius(20);

function gaugePath(value: number) {
  const bounded = Math.max(0, Math.min(value, 100));

  return (
    gaugeArc({
      innerRadius: GAUGE.innerRadius,
      outerRadius: GAUGE.outerRadius,
      startAngle: -Math.PI / 2,
      endAngle: -Math.PI / 2 + (bounded / 100) * Math.PI,
    }) ?? ""
  );
}

const GAUGE_TRACK_PATH = gaugePath(100);
const GAUGE_VALUE_PATH = gaugePath(GLOBAL_KNOWLEDGE.value);

export default function KnowledgeOverviewSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".ko-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".ko-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".ko-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".ko-gauge-shell", { y: 30, opacity: 0, duration: 0.65 }, 0.28)
        .from(".ko-gauge-track", { opacity: 0, duration: 0.45 }, 0.42)
        .from(".ko-chart-shell", { y: 34, opacity: 0, duration: 0.65 }, 0.34)
        .from(".ko-grid", { scaleX: 0, transformOrigin: "left", opacity: 0, duration: 0.5, stagger: 0.05 }, 0.48)
        .from(".ko-mode-bar", { scaleY: 0, transformOrigin: "bottom", duration: 0.86, stagger: 0.1, ease: "power2.out" }, 0.62)
        .from(".ko-mode-value", { y: 16, opacity: 0, duration: 0.42, stagger: 0.08 }, 0.8)
        .from(".ko-divider", { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0.92)
        .from(".ko-note", { y: 18, opacity: 0, duration: 0.48 }, 0.98);

      const numberNode = root.current?.querySelector<HTMLElement>(".ko-count");
      const valueNode = root.current?.querySelector<SVGPathElement>(".ko-gauge-value");
      valueNode?.setAttribute("d", gaugePath(0));

      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: GLOBAL_KNOWLEDGE.value,
          duration: 1,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            if (numberNode) numberNode.textContent = String(Math.round(counter.v));
            valueNode?.setAttribute("d", gaugePath(counter.v));
          },
        },
        0.52,
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="ko-kicker mono-label text-clinic">2. Connaissances relatives aux IST</p>
        <h2 className="ko-title mt-4 max-w-xl font-display text-5xl font-light leading-[1.04] text-ink">
          Connaissance des modes de transmission des IST
        </h2>
        <p className="ko-sub mt-5 max-w-lg text-lg leading-relaxed text-muted">
          Le niveau global reste moyen, avec une bonne identification des
          rapports sexuels et une forte méconnaissance du contact indirect.
        </p>

        <div className="ko-gauge-shell mt-7 rounded-2xl border border-hair/50 bg-white/60 px-6 py-5 shadow-[0_22px_70px_rgba(27,29,36,0.1)]">
          <p className="mono-label text-clinic">{GLOBAL_KNOWLEDGE.label}</p>
          <svg viewBox={`0 0 ${GAUGE.width} ${GAUGE_HEIGHT}`} className="mt-2 w-full" aria-label="Niveau global de connaissances sur les IST">
            <g transform={`translate(${GAUGE_CX} ${GAUGE_CY})`}>
              <path className="ko-gauge-track" d={GAUGE_TRACK_PATH} fill="var(--color-hair)" opacity="0.42" />
              <path className="ko-gauge-value" d={GAUGE_VALUE_PATH} fill="var(--color-clinic)" />
            </g>
            <text x={GAUGE_CX} y={GAUGE_CY - 14} textAnchor="middle" className="font-display" fontSize="50" fontWeight="300" fill="var(--color-ink)">
              <tspan className="ko-count">0</tspan>%
            </text>
          </svg>
        </div>
      </section>

      <section className="ko-chart-shell relative flex min-h-[610px] flex-col rounded-2xl border border-hair/50 bg-white/65 px-9 py-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div>
          <p className="mono-label text-clinic">Connaissance par mode de transmission</p>
          <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
            Les rapports sexuels bien reconnus, le contact indirect ignoré
          </h3>
        </div>

        <svg viewBox={`0 0 ${BAR_CHART.width} ${BAR_CHART.height}`} className="mt-6 w-full" aria-label="Scores de connaissance des modes de transmission des IST">
          <defs>
            <linearGradient id="koBarGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-clinic)" stopOpacity="0.96" />
              <stop offset="100%" stopColor="var(--color-clinic)" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="koAccentGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-coral)" stopOpacity="0.96" />
              <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                className="ko-grid"
                x1={BAR_CHART.margin.left}
                x2={BAR_CHART.width - BAR_CHART.margin.right}
                y1={modeY(tick)}
                y2={modeY(tick)}
                stroke="var(--color-hair)"
                strokeDasharray={tick === 0 ? undefined : "2 7"}
                strokeOpacity={tick === 0 ? 0.7 : 0.45}
              />
              <text x={BAR_CHART.margin.left - 12} y={modeY(tick) + 5} textAnchor="end" fontSize="12" fill="var(--color-muted)">
                {tick}%
              </text>
            </g>
          ))}

          {TRANSMISSION_MODES.map((item) => {
            const x = modeX(item.label)!;
            const barWidth = modeX.bandwidth();
            const y = modeY(item.value);
            const height = modeY(0) - y;
            const isAccent = item.value < 10;
            const fill = isAccent ? "url(#koAccentGradient)" : "url(#koBarGradient)";
            const valueColor = isAccent ? "var(--color-coral)" : "var(--color-clinic-deep)";
            const formatted = item.value % 1 === 0 ? `${item.value}%` : `${String(item.value).replace(".", ",")}%`;

            return (
              <g key={item.label}>
                <path className="ko-mode-bar" d={barPath(x, y, barWidth, height, 10)} fill={fill} />
                <text className="ko-mode-value" x={x + barWidth / 2} y={Math.max(y - 13, 22)} textAnchor="middle" fontSize="18" fontWeight={700} fill={valueColor}>
                  {formatted}
                </text>
                <text x={x + barWidth / 2} y={BAR_CHART.height - 48} textAnchor="middle" fontSize="13" fontWeight={700} fill="var(--color-ink)">
                  {item.label.split(" ").map((part, partIndex) => (
                    <tspan key={part} x={x + barWidth / 2} dy={partIndex === 0 ? 0 : 16}>
                      {part}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="ko-divider mt-auto h-px w-full bg-hair/60" />

        <div className="ko-note mt-5 flex gap-4">
          <span className="mt-1 w-1 shrink-0 rounded-full bg-coral" />
          <p className="text-base leading-relaxed text-muted">
            Constat discuté : les risques liés aux rapports sexuels sont bien
            reconnus, alors que le contact indirect reste très peu identifié
            comme mode de transmission.
          </p>
        </div>
      </section>
    </div>
  );
}
