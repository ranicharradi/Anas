import { useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  Sector,
  XAxis,
  YAxis,
  type PieSectorShapeProps,
} from "recharts";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const SERVICE_DATA = [
  { label: "Urgences", value: 8 },
  { label: "Santé scolaire", value: 8 },
  { label: "Urologie", value: 14 },
  { label: "Gynécologie", value: 28 },
  { label: "CSB", value: 42 },
];

const AWARENESS_DATA = [
  { label: "Oui", value: 54, color: "var(--color-clinic)" },
  { label: "Non", value: 46, color: "var(--color-coral)" },
];

function percentLabel(value: unknown) {
  return `${value}%`;
}

function awarenessSector(props: PieSectorShapeProps, index: number) {
  return (
    <Sector
      {...props}
      fill={AWARENESS_DATA[index % AWARENESS_DATA.length]?.color ?? "var(--color-clinic)"}
    />
  );
}

export default function ProgrammeIstSidaSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".pis-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".pis-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".pis-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".pis-stat", { y: 26, opacity: 0, duration: 0.58, stagger: 0.12 }, 0.3)
        .from(".pis-panel", { y: 34, opacity: 0, duration: 0.65 }, 0.32)
        .from(".pis-chart", { y: 18, opacity: 0, duration: 0.58, stagger: 0.12 }, 0.48)
        .from(".pis-divider", { scaleX: 0, transformOrigin: "left", duration: 0.55 }, 0.86)
        .from(".pis-note", { y: 16, opacity: 0, duration: 0.48, stagger: 0.1 }, 1.02);

      root.current?.querySelectorAll<HTMLElement>(".pis-count").forEach((node) => {
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
          0.78,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="pis-kicker mono-label text-clinic">Résultats · Milieu d'exercice</p>
        <h2 className="pis-title mt-4 max-w-xl font-display text-5xl font-light leading-[1.04] text-ink">
          Milieu d'exercice et programme national IST-Sida
        </h2>
        <p className="pis-sub mt-6 max-w-lg text-xl leading-relaxed text-muted">
          Concernant le milieu d'exercice des participants, notre échantillon
          est majoritairement représenté par les professionnels des{" "}
          <strong className="font-semibold text-ink">CSB (42&nbsp;%)</strong> et
          de la{" "}
          <strong className="font-semibold text-ink">gynécologie (28&nbsp;%)</strong>,
          ce qui souligne l'importance de ces structures dans les activités de
          prévention et d'éducation aux IST auprès des adolescents.
        </p>
      </section>

      <section className="pis-panel relative flex min-h-[610px] flex-col rounded-2xl border border-hair/50 bg-white/65 px-9 py-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div>
          <p className="mono-label text-clinic">Milieu d'exercice</p>
          <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
            Des répondants répartis entre soins primaires et services spécialisés
          </h3>
        </div>

        <div className="pis-chart mt-5 h-[290px] w-full" role="img" aria-label="Répartition des répondants selon le milieu d'exercice">
          {active ? (
            <BarChart
              width={690}
              height={290}
              data={SERVICE_DATA}
              layout="vertical"
              margin={{ top: 18, right: 54, bottom: 18, left: 12 }}
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="pisBarGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="var(--color-clinic)" stopOpacity="0.52" />
                  <stop offset="100%" stopColor="var(--color-clinic)" stopOpacity="0.96" />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal={false}
                stroke="var(--color-hair)"
                strokeDasharray="2 7"
                strokeOpacity={0.48}
              />
              <XAxis
                type="number"
                domain={[0, 60]}
                ticks={[0, 20, 40, 60]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={132}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted)", fontSize: 15, fontWeight: 700 }}
              />
              <Bar
                dataKey="value"
                barSize={24}
                radius={[0, 9, 9, 0]}
                fill="url(#pisBarGradient)"
                isAnimationActive
                animationDuration={900}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={percentLabel}
                  fill="var(--color-clinic-deep)"
                  fontSize={14}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          ) : null}
        </div>

        <div className="pis-divider mt-4 h-px w-full bg-hair/60" />

        <div className="mt-6 grid flex-1 grid-cols-[0.86fr_1.14fr] items-center gap-8">
          <div className="pis-note flex flex-col items-center text-center">
            <p className="mono-label text-clinic">Connaissance du programme</p>
            <div className="pis-chart relative mt-4 h-[230px] w-[230px]" role="img" aria-label="Connaissance du programme national IST-Sida">
              {active ? (
                <PieChart width={230} height={230}>
                  <Pie
                    data={AWARENESS_DATA}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={106}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                    stroke="var(--color-paper)"
                    strokeWidth={6}
                    isAnimationActive
                    animationDuration={900}
                    shape={awarenessSector}
                  />
                </PieChart>
              ) : null}
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div>
                  <p className="font-display text-5xl font-light leading-none text-ink">
                    <span className="pis-count" data-to="54">0</span>%
                  </p>
                  <p className="mt-2 text-xs font-bold text-muted">oui</p>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {AWARENESS_DATA.map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label} <span className="text-muted">{item.value}%</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pis-note rounded-lg border border-hair/60 bg-paper/70 p-6">
            <p className="text-lg leading-relaxed text-muted">
              La connaissance du programme national IST-Sida,{" "}
              <strong className="font-semibold text-ink">seulement 54&nbsp;%</strong>{" "}
              des participants déclarent le connaître. Ce résultat est
              préoccupant car ce programme constitue un outil essentiel dans la
              prévention et la prise en charge des IST. Cela peut s'expliquer par
              un manque de diffusion de l'information ou par une insuffisance de
              formation continue. Ces résultats montrent donc la nécessité de
              renforcer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
