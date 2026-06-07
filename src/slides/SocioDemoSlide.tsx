import { useRef } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import {
  Pie,
  PieChart,
  Sector,
  type PieSectorShapeProps,
} from "recharts";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const AGE_DATA = [
  { label: "20-25", value: 64 },
  { label: "30-39", value: 28 },
  { label: "40-49", value: 8 },
];

const SEX_DATA = [
  { label: "Féminin", value: 70, color: "var(--color-clinic)" },
  { label: "Masculin", value: 30, color: "var(--color-coral)" },
];

const STATUS_DATA = [
  { label: "En exercice", value: 80, color: "var(--color-clinic)" },
  { label: "Autres statuts", value: 20, color: "var(--color-hair)" },
];

const AGE_CHART = {
  width: 660,
  height: 250,
  margin: { top: 30, right: 14, bottom: 42, left: 42 },
};

const ageX = scaleBand<string>()
  .domain(AGE_DATA.map((d) => d.label))
  .range([AGE_CHART.margin.left, AGE_CHART.width - AGE_CHART.margin.right])
  .padding(0.46);

const ageY = scaleLinear()
  .domain([0, 70])
  .range([AGE_CHART.height - AGE_CHART.margin.bottom, AGE_CHART.margin.top]);

/** Rectangle with only its top two corners rounded — a clean bar cap. */
function barPath(x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
}

const PIE_SIZE = 184;
const PIE_STROKE = 26;

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChart {
  title: string;
  value: number;
  label: string;
  note: string;
  data: DonutDatum[];
  legend: DonutDatum[];
}

const DONUTS = [
  {
    title: "Répartition selon le sexe",
    value: 70,
    label: "féminin",
    note: "Forte prédominance féminine dans l'échantillon.",
    data: SEX_DATA,
    legend: SEX_DATA,
  },
  {
    title: "Statut professionnel",
    value: 80,
    label: "en exercice",
    note: "Une majorité de professionnels en exercice.",
    data: STATUS_DATA,
    legend: STATUS_DATA,
  },
];

function donutSector(data: DonutDatum[]) {
  return (props: PieSectorShapeProps, index: number) => (
    <Sector
      {...props}
      className="sd-pie"
      fill={data[index % data.length]?.color ?? "var(--color-clinic)"}
    />
  );
}

export default function SocioDemoSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".sd-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".sd-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".sd-sub", { y: 18, opacity: 0, duration: 0.5 }, 0.18)
        .from(".sd-chart-shell", { y: 34, opacity: 0, duration: 0.65 }, 0.28)
        .from(".sd-grid", { scaleX: 0, transformOrigin: "left", opacity: 0, duration: 0.5, stagger: 0.05 }, 0.42)
        .from(".sd-age-bar", { scaleY: 0, transformOrigin: "bottom", duration: 0.82, stagger: 0.1, ease: "power2.out" }, 0.5)
        .from(".sd-age-val", { y: 14, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.74)
        .from(".sd-divider", { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0.8)
        .from(".sd-donut-card", { y: 24, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.9)
        .from(".sd-legend", { y: 8, opacity: 0, duration: 0.35, stagger: 0.05 }, 1.1);

      root.current?.querySelectorAll<HTMLElement>(".sd-count").forEach((node) => {
        const target = Number(node.dataset.to);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 0.95,
            ease: "power1.out",
            snap: { v: 1 },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
          },
          0.74,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.76fr_1.24fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="sd-kicker mono-label text-clinic">Résultats · Échantillon</p>
        <h2 className="sd-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Caractéristiques sociodémographiques
        </h2>
        <p className="sd-sub mt-6 max-w-lg text-xl leading-relaxed text-muted">
          L'analyse révèle un profil majoritairement jeune, une forte
          prédominance féminine et une majorité de professionnels en exercice.
        </p>
      </section>

      <section className="sd-chart-shell relative flex min-h-[610px] flex-col rounded-2xl border border-hair/50 bg-white/65 px-9 py-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="mono-label text-clinic">Échantillon</p>
            <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
              Un profil jeune et majoritairement féminin
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-6xl font-light leading-none text-ink">50</p>
            <p className="mono-label mt-1 text-clinic">répondants</p>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-baseline justify-between">
            <p className="mono-label text-clinic">Répartition par âge</p>
            <p className="text-sm text-muted">Le groupe 20-25 ans domine</p>
          </div>

          <svg viewBox={`0 0 ${AGE_CHART.width} ${AGE_CHART.height}`} className="mt-1 w-full" aria-label="Répartition par âge des répondants">
            <defs>
              <linearGradient id="sdBarGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-clinic)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--color-clinic)" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {[0, 20, 40, 60].map((tick) => (
              <g key={tick}>
                <line
                  className="sd-grid"
                  x1={AGE_CHART.margin.left}
                  x2={AGE_CHART.width - AGE_CHART.margin.right}
                  y1={ageY(tick)}
                  y2={ageY(tick)}
                  stroke="var(--color-hair)"
                  strokeDasharray={tick === 0 ? undefined : "2 7"}
                  strokeOpacity={tick === 0 ? 0.7 : 0.45}
                />
                <text x={AGE_CHART.margin.left - 12} y={ageY(tick) + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">
                  {tick}%
                </text>
              </g>
            ))}

            {AGE_DATA.map((item) => {
              const x = ageX(item.label)!;
              const barWidth = ageX.bandwidth();
              const y = ageY(item.value);
              const height = ageY(0) - y;

              return (
                <g key={item.label}>
                  <path className="sd-age-bar" d={barPath(x, y, barWidth, height, 10)} fill="url(#sdBarGradient)" />
                  <text className="sd-age-val" x={x + barWidth / 2} y={y - 13} textAnchor="middle" fontSize="20" fontWeight={700} fill="var(--color-clinic-deep)">
                    <tspan className="sd-count" data-to={item.value}>0</tspan>%
                  </text>
                  <text x={x + barWidth / 2} y={AGE_CHART.height - 14} textAnchor="middle" fontSize="14" fontWeight={700} fill="var(--color-ink)">
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="sd-divider mt-6 h-px w-full bg-hair/60" />

        <div className="mt-6 grid grid-cols-2 gap-x-10">
          {DONUTS.map((chart: DonutChart) => (
            <article key={chart.title} className="sd-donut-card flex flex-col items-center text-center">
              <p className="mono-label text-clinic">{chart.title}</p>

              <div
                className="relative mt-3"
                style={{ width: PIE_SIZE, height: PIE_SIZE }}
                role="img"
                aria-label={chart.title}
              >
                {active ? (
                  <PieChart width={PIE_SIZE} height={PIE_SIZE}>
                    <Pie
                      data={chart.data}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={PIE_SIZE / 2 - PIE_STROKE}
                      outerRadius={PIE_SIZE / 2}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      stroke="var(--color-paper)"
                      strokeWidth={4}
                      isAnimationActive
                      animationDuration={850}
                      shape={donutSector(chart.data)}
                    />
                  </PieChart>
                ) : null}
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div>
                    <p className="font-display text-[40px] font-light leading-none text-ink">
                      <span className="sd-count" data-to={chart.value}>0</span>%
                    </p>
                    <p className="mt-2 text-xs font-bold text-muted">{chart.label}</p>
                  </div>
                </div>
              </div>

              <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-muted">{chart.note}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                {chart.legend.map((item) => (
                  <div key={item.label} className="sd-legend flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                    <span className="text-muted">{item.value}%</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
