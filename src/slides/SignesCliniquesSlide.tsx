import { useRef } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

// Concrete hex mirrors of the @theme tokens in index.css. Recharts writes these
// as SVG presentation attributes, where CSS custom properties don't resolve.
const COLORS = {
  ink: "#1b1d24",
  clinic: "#0d6e85",
  muted: "#6c7079",
  hair: "#c8c2b2",
};

interface ClinicalSign {
  axis: string; // short label on the radar spoke
  label: string; // full label in the legend
  value: number; // share of respondents citing the sign
  display: string;
}

// Six signs from question 9 of the questionnaire (% of respondents identifying
// each clinical sign), ordered as in the source bar chart.
const SIGNS: ClinicalSign[] = [
  { axis: "Écoulement", label: "Écoulement anormal", value: 82, display: "82 %" },
  { axis: "Brûlure", label: "Brûlure à la miction", value: 54, display: "54 %" },
  { axis: "Démangeaisons", label: "Démangeaisons génitales", value: 60, display: "60 %" },
  { axis: "Plaies/boutons", label: "Plaies/boutons génitaux", value: 68, display: "68 %" },
  { axis: "Douleurs abdo.", label: "Douleurs abdominales", value: 34, display: "34 %" },
  { axis: "Fièvre", label: "Fièvre", value: 66, display: "66 %" },
];

export default function SignesCliniquesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".sc-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".sc-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.74, stagger: 0.045 }, 0)
        .from(".sc-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".sc-chart-card", { y: 34, opacity: 0, duration: 0.7 }, 0.3)
        .from(".sc-chart-head", { y: 14, opacity: 0, duration: 0.5 }, 0.42)
        .from(".sc-legend-item", { y: 14, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.72);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.72fr_1.28fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="sc-kicker mono-label text-clinic">Connaissances relatives aux IST</p>
        <h2 className="sc-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.02] text-ink">
          Identification des signes cliniques des IST
        </h2>
        <p className="sc-sub mt-6 max-w-lg text-lg leading-relaxed text-muted">
          L'écoulement anormal est le signe le plus fréquemment identifié, tandis
          que les douleurs abdominales restent les moins citées.
        </p>
      </section>

      <section className="sc-chart-card relative flex min-h-[600px] flex-col rounded-2xl border border-hair/50 bg-white/65 px-9 py-7 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div className="sc-chart-head flex items-baseline justify-between gap-6">
          <div>
            <p className="mono-label text-clinic">Reconnaissance des signes</p>
            <h3 className="mt-1 font-display text-3xl font-light leading-none text-ink">
              Signes cliniques cités
            </h3>
          </div>
          <p className="mono-label text-muted">part des répondants</p>
        </div>

        <div
          className="relative mt-3 h-[360px] w-full"
          role="img"
          aria-label="Diagramme radar de la part des répondants citant chaque signe clinique des IST"
        >
          <ResponsiveContainer key={active ? "on" : "off"} width="100%" height="100%">
            <RadarChart data={SIGNS} outerRadius="72%" margin={{ top: 24, right: 38, bottom: 16, left: 38 }}>
              <PolarGrid stroke={COLORS.hair} strokeOpacity={0.7} />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: COLORS.ink, fontSize: 13, fontFamily: "Inter Variable, sans-serif", fontWeight: 600 }}
              />
              <PolarRadiusAxis domain={[0, 90]} tickCount={4} tick={false} axisLine={false} stroke={COLORS.hair} />
              <Radar
                name="Part des répondants"
                dataKey="value"
                stroke={COLORS.clinic}
                strokeWidth={2.5}
                fill={COLORS.clinic}
                fillOpacity={0.28}
                dot={{ r: 4, fill: COLORS.clinic, strokeWidth: 0 }}
                isAnimationActive={active}
                animationBegin={300}
                animationDuration={950}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-10 gap-y-3 border-t border-hair/60 pt-5">
          {SIGNS.map((sign) => (
            <div key={sign.label} className="sc-legend-item flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-clinic" />
              <span className="min-w-0 flex-1 truncate text-sm text-muted">{sign.label}</span>
              <span className="shrink-0 font-display text-lg leading-none text-ink">{sign.display}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
