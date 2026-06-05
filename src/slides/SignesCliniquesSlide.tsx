import { useRef } from "react";
import { ringPath } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const HEADLINE_VALUE = 86;
const RING_SIZE = 220;
const RING_STROKE = 20;

const trackPath = ringPath({ value: 100, size: RING_SIZE, stroke: RING_STROKE });
const fullArcPath = ringPath({ value: HEADLINE_VALUE, size: RING_SIZE, stroke: RING_STROKE });

const SIGNES = [
  {
    label: "Brûlure à la miction",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0C17 7 12 2 12 2z" />
        <path d="M12 12v3" />
        <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Écoulement anormal",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 C10 8 7 10 7 14a5 5 0 0 0 10 0c0-4-3-6-5-11z" />
        <path d="M9 16 Q12 19 15 16" />
      </svg>
    ),
  },
  {
    label: "Fièvre",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 14.5V4a2 2 0 0 0-4 0v10.5" />
        <path d="M12 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        <line x1="16" y1="4" x2="18" y2="4" />
        <line x1="16" y1="7" x2="18" y2="7" />
        <line x1="16" y1="10" x2="18" y2="10" />
      </svg>
    ),
  },
  {
    label: "Douleurs abdominales",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="13" rx="7" ry="5" />
        <path d="M9 10 Q12 7 15 10" />
        <path d="M8 15 Q12 18 16 15" />
      </svg>
    ),
  },
  {
    label: "Démangeaisons génitales",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 9 Q8 6 12 6 Q16 6 17 9" />
        <path d="M6 13 Q7 10 12 10 Q17 10 18 13" />
        <path d="M8 17 Q9.5 14 12 14 Q14.5 14 16 17" />
      </svg>
    ),
  },
  {
    label: "Plaies ou boutons génitaux",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="9" r="2.5" />
        <circle cx="16" cy="13" r="1.8" />
        <circle cx="11" cy="16" r="1.4" />
        <path d="M9 11.5 Q7 14 8 17" strokeDasharray="2 2" />
      </svg>
    ),
  },
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

      const arcEl = root.current?.querySelector<SVGPathElement>(".sc-ring-arc");
      if (arcEl) arcEl.setAttribute("d", ringPath({ value: 0, size: RING_SIZE, stroke: RING_STROKE }));

      const numberNode = root.current?.querySelector<HTMLElement>(".sc-count");
      const counter = { v: 0 };

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".sc-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".sc-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".sc-ring-shell", { y: 30, opacity: 0, duration: 0.6 }, 0.3)
        .from(".sc-ring-track", { opacity: 0, duration: 0.4 }, 0.44)
        .from(".sc-chart-shell", { y: 34, opacity: 0, duration: 0.65 }, 0.36)
        .from(".sc-card", { y: 22, opacity: 0, scale: 0.92, transformOrigin: "center", duration: 0.55, stagger: 0.08, ease: "back.out(1.5)" }, 0.58)
        .from(".sc-divider", { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0.9)
        .from(".sc-note", { y: 16, opacity: 0, duration: 0.48 }, 0.96);

      tl.to(
        counter,
        {
          v: HEADLINE_VALUE,
          duration: 1.1,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            if (numberNode) numberNode.textContent = String(Math.round(counter.v));
            arcEl?.setAttribute("d", ringPath({ value: counter.v, size: RING_SIZE, stroke: RING_STROKE }));
          },
        },
        0.5,
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  const cx = RING_SIZE / 2;

  return (
    <div ref={root} className="grid h-full grid-cols-[0.76fr_1.24fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="sc-kicker mono-label text-clinic">Connaissances relatives aux IST</p>
        <h2 className="sc-title mt-4 max-w-xl font-display text-5xl font-light leading-[1.04] text-ink">
          Identification des signes cliniques des IST
        </h2>
        <p className="sc-sub mt-5 max-w-lg text-lg leading-relaxed text-muted">
          La grande majorité des infirmiers interrogés reconnaissent correctement
          les principaux signes cliniques permettant de suspecter une IST.
        </p>

        <div className="sc-ring-shell mt-8 flex flex-col items-center rounded-2xl border border-hair/50 bg-white/60 px-6 py-6 shadow-[0_22px_70px_rgba(27,29,36,0.1)]">
          <p className="mono-label text-clinic">Taux d'identification correcte</p>
          <div className="relative mt-4 grid place-items-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              className="-rotate-90"
              aria-label="86 % des répondants identifient correctement les signes cliniques des IST"
            >
              <g transform={`translate(${cx} ${cx})`}>
                <path className="sc-ring-track" d={trackPath} fill="var(--color-clinic-soft)" />
                <path className="sc-ring-arc" d={fullArcPath} fill="var(--color-clinic)" />
              </g>
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-[4.2rem] leading-none text-ink">
                  <span className="sc-count">0</span>
                  <span className="text-clinic">%</span>
                </p>
                <p className="mono-label mt-2 text-muted">des répondants</p>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-[18ch] text-center text-sm leading-relaxed text-muted">
            identifient correctement les principaux signes cliniques des IST.
          </p>
        </div>
      </section>

      <section className="sc-chart-shell relative flex min-h-[610px] flex-col rounded-2xl border border-hair/50 bg-white/65 px-9 py-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div>
          <p className="mono-label text-clinic">Signes reconnus par les infirmiers</p>
          <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
            Six signes cliniques principaux identifiés
          </h3>
        </div>

        <div className="mt-7 grid flex-1 grid-cols-2 gap-4">
          {SIGNES.map((signe) => (
            <article
              key={signe.label}
              className="sc-card flex items-center gap-3 rounded-xl border border-hair/40 bg-clinic-soft/25 px-4 py-4"
            >
              <span className="shrink-0 text-clinic">{signe.icon}</span>
              <p className="text-sm font-semibold leading-snug text-ink">{signe.label}</p>
            </article>
          ))}
        </div>

        <div className="sc-divider mt-6 h-px w-full bg-hair/60" />

        <div className="sc-note mt-5 flex gap-4">
          <span className="mt-1 w-1 shrink-0 rounded-full bg-coral" />
          <p className="text-base leading-relaxed text-muted">
            Résultat conforme aux données du CDC : les professionnels de santé
            reconnaissent plus facilement les signes évidents que les symptômes
            atypiques.
          </p>
        </div>
      </section>
    </div>
  );
}
