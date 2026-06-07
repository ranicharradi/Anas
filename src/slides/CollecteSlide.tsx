import { useRef } from "react";
import { donutPaths } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Méthode de collecte des données (page 10). The questionnaire's four volets,
 * visualised as a segmented donut (each arc proportional to its question count)
 * beside four volet cards with counting-up totals and fill bars. The centre of
 * the donut counts up to the 34-question total. Built on the deck's tokens.
 */

interface Volet {
  n: string;
  label: string;
  q: number;
  color: string;
}

const VOLETS: Volet[] = [
  { n: "01", label: "Identification de l'infirmier", q: 6, color: "var(--color-clinic)" },
  { n: "02", label: "Connaissances sur les IST", q: 13, color: "var(--color-clinic-deep)" },
  { n: "03", label: "Attitudes professionnelles", q: 8, color: "var(--color-coral)" },
  { n: "04", label: "Pratiques éducatives", q: 7, color: "#d8a23a" },
];

const TOTAL = VOLETS.reduce((s, v) => s + v.q, 0); // 34

const SIZE = 320;
const STROKE = 40;
const SEGMENTS = donutPaths({
  data: VOLETS.map((v) => ({ label: v.label, value: v.q, color: v.color })),
  size: SIZE,
  stroke: STROKE,
});

export default function CollecteSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".col-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".col-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".col-sub", { y: 16, opacity: 0, duration: 0.5 }, 0.2)
        .from(
          ".donut-seg",
          {
            scale: 0,
            rotate: -16,
            opacity: 0,
            transformOrigin: "center",
            duration: 0.75,
            ease: "back.out(1.55)",
            stagger: 0.15,
          },
          0.35,
        )
        .from(
          ".volet-card",
          { x: 30, opacity: 0, duration: 0.6, stagger: 0.12 },
          0.5,
        )
        .from(".volet-bar", { scaleX: 0, transformOrigin: "left", duration: 0.7, stagger: 0.12, ease: "power2.out" }, 0.7);

      // centre total + per-card counts
      const counters = root.current?.querySelectorAll<HTMLElement>(".count-up");
      counters?.forEach((node) => {
        const to = Number(node.dataset.to);
        const c = { v: 0 };
        tl.to(
          c,
          {
            v: to,
            duration: 1.1,
            ease: "power1.out",
            snap: { v: 1 },
            onUpdate: () => (node.textContent = String(Math.round(c.v))),
          },
          0.5,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-16 px-20 py-12">
      {/* Left: heading + donut */}
      <div className="flex flex-col">
        <p className="col-kicker mono-label text-clinic">02 · Méthodologie</p>
        <h2 className="col-title mt-3 max-w-md font-display text-6xl font-light leading-[1.04] text-ink">
          Méthode de collecte des données
        </h2>
        <p className="col-sub mt-4 max-w-md text-xl leading-relaxed text-muted">
          Un questionnaire structuré en quatre volets, administré aux infirmiers
          des services ciblés.
        </p>

        <div className="relative mt-9 grid place-items-center self-start">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={(SIZE - STROKE) / 2} fill="none" stroke="var(--color-hair)" strokeOpacity={0.3} strokeWidth={STROKE} />
            {SEGMENTS.map((s) => (
              <path key={s.label} className="donut-seg" d={s.path} fill={s.color} transform={`translate(${SIZE / 2} ${SIZE / 2})`} />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-6xl font-light leading-none text-ink">
                <span className="count-up" data-to={TOTAL}>0</span>
              </p>
              <p className="mono-label mt-2 text-muted">questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: volet cards */}
      <div className="flex flex-col gap-4">
        {VOLETS.map((v) => (
          <div
            key={v.n}
            className="volet-card flex items-center gap-5 rounded-2xl border border-hair/60 bg-white/55 px-6 py-4 backdrop-blur-sm"
          >
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-xl font-light text-white"
              style={{ background: v.color }}
            >
              {v.n}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <p className="truncate text-[20px] font-semibold text-ink">{v.label}</p>
                <p className="shrink-0 text-base font-medium text-muted">
                  <span className="count-up tabular-nums" data-to={v.q}>0</span> questions
                </p>
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-hair/40">
                <div
                  className="volet-bar h-full rounded-full"
                  style={{ width: `${(v.q / 13) * 100}%`, background: v.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
