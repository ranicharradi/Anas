import { useRef } from "react";
import { ringPath } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const RING_SIZE = 200;
const RING_STROKE = 18;

const RINGS = [
  {
    id: "competences",
    value: 94,
    color: "var(--color-clinic)",
    trackColor: "var(--color-clinic-soft)",
    label: "souhaitent renforcer leurs compétences",
    note: "Volonté d'améliorer leurs pratiques en éducation aux IST et prise de conscience de leurs limites.",
  },
  {
    id: "role",
    value: 84,
    color: "var(--color-coral)",
    trackColor: "var(--color-hair)",
    label: "perçoivent l'éducation à la sexualité comme partie de leur rôle",
    note: "Implication dans la promotion de la santé sexuelle, conforme aux recommandations de l'OMS.",
  },
] as const;

export default function MotivationSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".mot-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".mot-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".mot-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".mot-panel", { y: 34, opacity: 0, duration: 0.65 }, 0.28)
        .from(".mot-ring-shell", { y: 28, opacity: 0, duration: 0.6, stagger: 0.12, ease: "back.out(1.4)" }, 0.44)
        .from(".mot-caption", { y: 14, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.72)
        .from(".mot-note", { y: 12, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.86);

      RINGS.forEach((ring, i) => {
        const arcEl = root.current?.querySelector<SVGPathElement>(`.mot-arc-${ring.id}`);
        if (arcEl) arcEl.setAttribute("d", ringPath({ value: 0, size: RING_SIZE, stroke: RING_STROKE }));

        const numberNode = root.current?.querySelector<HTMLElement>(`.mot-count-${ring.id}`);
        const counter = { v: 0 };

        tl.to(
          counter,
          {
            v: ring.value,
            duration: 1.1,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              if (numberNode) numberNode.textContent = String(Math.round(counter.v));
              arcEl?.setAttribute("d", ringPath({ value: counter.v, size: RING_SIZE, stroke: RING_STROKE }));
            },
          },
          0.5 + i * 0.1,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  const cx = RING_SIZE / 2;
  const trackPath = ringPath({ value: 100, size: RING_SIZE, stroke: RING_STROKE });

  return (
    <div ref={root} className="grid h-full grid-cols-[0.76fr_1.24fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="mot-kicker mono-label text-clinic">Attitudes des professionnels</p>
        <h2 className="mot-title mt-4 max-w-xl font-display text-5xl font-light leading-[1.04] text-ink">
          Motivation et perception du rôle
        </h2>
        <p className="mot-sub mt-5 max-w-lg text-lg leading-relaxed text-muted">
          Les infirmiers se montrent impliqués dans la santé sexuelle des adolescents
          et conscients de leurs limites actuelles.
        </p>
      </section>

      <section className="mot-panel relative flex min-h-[560px] flex-col justify-center rounded-2xl border border-hair/50 bg-white/65 px-9 py-10 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <p className="mono-label text-clinic">Attitudes mesurées sur 80 répondants</p>
        <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
          Engagement et conscience professionnelle
        </h3>

        <div className="mt-10 grid grid-cols-2 gap-10">
          {RINGS.map((ring) => (
            <div key={ring.id} className="mot-ring-shell flex flex-col items-center gap-4">
              <div
                className="relative grid place-items-center"
                style={{ width: RING_SIZE, height: RING_SIZE }}
              >
                <svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  className="-rotate-90"
                  aria-label={`${ring.value} % : ${ring.label}`}
                >
                  <g transform={`translate(${cx} ${cx})`}>
                    <path d={trackPath} fill={ring.trackColor} opacity={0.35} />
                    <path
                      className={`mot-arc-${ring.id}`}
                      d={ringPath({ value: ring.value, size: RING_SIZE, stroke: RING_STROKE })}
                      fill={ring.color}
                    />
                  </g>
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="font-display text-[3.6rem] leading-none text-ink">
                      <span className={`mot-count-${ring.id}`}>0</span>
                      <span style={{ color: ring.color }}>%</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="mot-caption max-w-[16ch] text-center text-sm font-semibold leading-snug text-ink">
                {ring.label}
              </p>
              <p className="mot-note max-w-[18ch] text-center text-xs leading-relaxed text-muted">
                {ring.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
