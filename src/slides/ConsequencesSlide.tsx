import { useRef } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { gsap, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

// Real study values from the Canva deck (page "Conséquences des IST non traitées").
interface Bar {
  label: string[];
  value: number;
  grad: string;
  solid: string;
}

const BARS: Bar[] = [
  { label: ["Infertilité"], value: 48, grad: "url(#cs-g-clinic)", solid: "var(--color-clinic)" },
  { label: ["Complications", "chroniques"], value: 18, grad: "url(#cs-g-deep)", solid: "var(--color-clinic-deep)" },
  { label: ["Transmission", "au partenaire"], value: 80, grad: "url(#cs-g-coral)", solid: "var(--color-coral)" },
];

// Bar-chart geometry.
const BW = 720;
const BH = 470;
const BM = { top: 76, right: 28, bottom: 104, left: 28 };
const bx = scaleBand<string>()
  .domain(BARS.map((b) => b.label.join(" ")))
  .range([BM.left, BW - BM.right])
  .padding(0.42);
const by = scaleLinear().domain([0, 100]).range([BH - BM.bottom, BM.top]);
const BASELINE = by(0);
const BTICKS = [25, 50, 75, 100];

// Gauge geometry (semicircular speedometer for the 80% figure).
const GW = 440;
const GH = 280;
const GCX = GW / 2;
const GCY = 224;
const GR = 168;
const GAUGE_VALUE = 80;

const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [GCX + r * Math.cos(rad), GCY - r * Math.sin(rad)];
};
const gaugeArc = (fromFrac: number, toFrac: number, r: number) => {
  const a0 = 180 - fromFrac * 180;
  const a1 = 180 - toFrac * 180;
  const [x0, y0] = polar(a0, r);
  const [x1, y1] = polar(a1, r);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
};

const GAUGE_TRACK = gaugeArc(0, 1, GR);
const GAUGE_FILL = gaugeArc(0, GAUGE_VALUE / 100, GR);
const GAUGE_SPAN = (GAUGE_VALUE / 100) * 180;
const NEEDLE_TIP = polar(180 - GAUGE_SPAN, GR - 34);

export default function ConsequencesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cs-card", { y: 34, opacity: 0, duration: 0.7, stagger: 0.16 })
        .from(".cs-head", { y: 14, opacity: 0, duration: 0.5, stagger: 0.12 }, 0.15)
        .from(".cs-gridline", { scaleX: 0, transformOrigin: "left", opacity: 0, duration: 0.5, stagger: 0.05 }, 0.35)
        .from(".cs-baseline", { drawSVG: "0%", duration: 0.6, ease: "power2.inOut" }, 0.35)
        .from(".cs-bar", { scaleY: 0, transformOrigin: "bottom", duration: 0.85, stagger: 0.1, ease: "back.out(1.4)" }, 0.5)
        .from(".cs-barlabel", { opacity: 0, y: 10, duration: 0.45, stagger: 0.1 }, 0.7)
        .from(".cs-gauge-track", { opacity: 0, duration: 0.4 }, 0.4)
        .from(".cs-gauge-fill", { drawSVG: "0%", duration: 1.1, ease: "power2.inOut" }, 0.5)
        .from(".cs-needle", { rotation: -GAUGE_SPAN, transformOrigin: `${GCX}px ${GCY}px`, duration: 1.1, ease: "power2.inOut" }, 0.5)
        .from(".cs-cap", { opacity: 0, y: 12, duration: 0.5, stagger: 0.12 }, 0.85);

      root.current?.querySelectorAll<SVGTextElement>(".cs-count").forEach((node) => {
        const target = Number(node.dataset.to);
        const suffix = node.dataset.suffix ?? "";
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 0.9,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              node.textContent = `${Math.round(counter.v)}${suffix}`;
            },
          },
          0.6,
        );
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full place-items-center px-16 py-12">
      <section className="grid w-full max-w-[1480px] grid-cols-[1.18fr_1fr] gap-8">
        {/* ── Bar chart ── */}
        <article className="cs-card relative overflow-hidden rounded-2xl border border-hair/60 bg-white/60 p-9 shadow-[0_30px_90px_rgba(8,81,95,0.14)] backdrop-blur-sm">
          <div className="cs-head">
            <p className="mono-label text-coral">Résultats · gravité clinique</p>
            <h3 className="mt-2 font-display text-4xl font-light leading-tight text-ink">
              Conséquences d'une IST non prise en charge
            </h3>
          </div>

          <svg viewBox={`0 0 ${BW} ${BH}`} className="mt-4 w-full">
            <defs>
              <linearGradient id="cs-g-clinic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a93ac" />
                <stop offset="1" stopColor="var(--color-clinic)" />
              </linearGradient>
              <linearGradient id="cs-g-deep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d6e85" />
                <stop offset="1" stopColor="var(--color-clinic-deep)" />
              </linearGradient>
              <linearGradient id="cs-g-coral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e07c70" />
                <stop offset="1" stopColor="var(--color-coral)" />
              </linearGradient>
              <filter id="cs-bar-shadow" x="-40%" y="-20%" width="180%" height="150%">
                <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#08515f" floodOpacity="0.2" />
              </filter>
            </defs>

            {BTICKS.map((t) => (
              <g key={t}>
                <line
                  className="cs-gridline"
                  x1={BM.left}
                  x2={BW - BM.right}
                  y1={by(t)}
                  y2={by(t)}
                  stroke="var(--color-hair)"
                  strokeOpacity={0.5}
                  strokeDasharray="2 7"
                />
                <text x={BM.left} y={by(t) - 7} fontSize={12} className="mono-label" fill="var(--color-muted)">
                  {t}
                </text>
              </g>
            ))}

            <line className="cs-baseline" x1={BM.left} x2={BW - BM.right} y1={BASELINE} y2={BASELINE} stroke="var(--color-ink)" strokeWidth={1.5} />

            {BARS.map((b) => {
              const key = b.label.join(" ");
              const x = bx(key)!;
              const w = bx.bandwidth();
              const top = by(b.value);
              const h = BASELINE - top;
              const highlight = b.solid === "var(--color-coral)";
              return (
                <g key={key}>
                  <rect
                    className="cs-bar"
                    x={x}
                    y={top}
                    width={w}
                    height={h}
                    rx={12}
                    fill={b.grad}
                    filter="url(#cs-bar-shadow)"
                    opacity={highlight ? 1 : 0.94}
                  />
                  {highlight && (
                    <rect className="cs-bar" x={x} y={top} width={w} height={6} rx={3} fill="var(--color-paper)" opacity={0.5} />
                  )}
                  <text
                    className="cs-count"
                    data-to={b.value}
                    data-suffix="%"
                    x={x + w / 2}
                    y={top - 18}
                    textAnchor="middle"
                    fontSize={42}
                    fontWeight={500}
                    fill={b.solid}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    0%
                  </text>
                  <text
                    className="cs-barlabel"
                    x={x + w / 2}
                    y={BASELINE + 36}
                    textAnchor="middle"
                    fontSize={20}
                    fontWeight={600}
                    fill="var(--color-ink)"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {b.label.map((ln, i) => (
                      <tspan key={ln} x={x + w / 2} dy={i === 0 ? 0 : 24}>
                        {ln}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="cs-cap mt-1 max-w-[46ch] text-[19px] leading-relaxed text-muted">
            80 % identifient la transmission au partenaire comme une conséquence
            majeure des IST non traitées. Ces résultats mettent en évidence la
            conscience des professionnels face aux conséquences individuelles et
            collectives des IST.
          </p>
        </article>

        {/* ── Gauge ── */}
        <article className="cs-card relative flex flex-col overflow-hidden rounded-2xl border border-hair/60 bg-white/60 p-9 shadow-[0_30px_90px_rgba(8,81,95,0.14)] backdrop-blur-sm">
          <div className="cs-head">
            <p className="mono-label text-clinic">Résultats · connaissances</p>
            <h3 className="mt-2 font-display text-4xl font-light leading-tight text-ink">
              Transmission mère-enfant reconnue par les infirmiers
            </h3>
          </div>

          <div className="grid flex-1 place-items-center">
            <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full max-w-[420px]">
              <defs>
                <linearGradient id="cs-gauge-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--color-clinic)" />
                  <stop offset="0.6" stopColor="#7a9a6f" />
                  <stop offset="1" stopColor="var(--color-coral)" />
                </linearGradient>
                <filter id="cs-needle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#08515f" floodOpacity="0.3" />
                </filter>
              </defs>

              <path className="cs-gauge-track" d={GAUGE_TRACK} fill="none" stroke="var(--color-clinic-soft)" strokeWidth={26} strokeLinecap="round" />
              <path className="cs-gauge-fill" d={GAUGE_FILL} fill="none" stroke="url(#cs-gauge-grad)" strokeWidth={26} strokeLinecap="round" />

              {/* end-point labels */}
              <text x={polar(180, GR)[0]} y={GCY + 26} textAnchor="middle" fontSize={13} className="mono-label" fill="var(--color-muted)">0%</text>
              <text x={polar(0, GR)[0]} y={GCY + 26} textAnchor="middle" fontSize={13} className="mono-label" fill="var(--color-muted)">100%</text>

              {/* needle */}
              <g className="cs-needle" filter="url(#cs-needle-shadow)">
                <line x1={GCX} y1={GCY} x2={NEEDLE_TIP[0]} y2={NEEDLE_TIP[1]} stroke="var(--color-ink)" strokeWidth={5} strokeLinecap="round" />
                <circle cx={GCX} cy={GCY} r={11} fill="var(--color-ink)" />
                <circle cx={GCX} cy={GCY} r={4} fill="var(--color-paper)" />
              </g>

              {/* value readout */}
              <text className="cs-count" data-to={GAUGE_VALUE} data-suffix="%" x={GCX} y={GCY - 56} textAnchor="middle" fontSize={68} fontWeight={500} fill="var(--color-ink)" style={{ fontFamily: "var(--font-display)" }}>0%</text>
            </svg>
          </div>

          <p className="cs-cap text-[19px] leading-relaxed text-muted">
            80 % des participants reconnaissent cette voie de transmission. Cela
            démontre un bon niveau de connaissance sur les risques des IST pendant
            la grossesse.
          </p>
        </article>
      </section>
    </div>
  );
}
