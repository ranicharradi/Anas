import { useRef } from "react";
import { ringPath } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const RING_SIZE = 158;
const RING_STROKE = 14;

type IconKind = "virus" | "scan";

interface Card {
  value: number;
  eyebrow: string;
  title: string;
  caption: string;
  copy: string;
  accent: string;
  tags: string[];
  icon: IconKind;
}

const CARDS: Card[] = [
  {
    value: 76,
    eyebrow: "Virus · Oncologie",
    title: "HPV et cancer du col",
    caption: "des infirmiers interrogés",
    copy: "76 % des participants l'associent correctement au cancer du col de l'utérus. Ce résultat traduit un niveau de connaissance satisfaisant sur cette infection et ses complications.",
    accent: "var(--color-coral)",
    tags: ["HPV", "col de l'utérus", "vaccination"],
    icon: "virus",
  },
  {
    value: 86,
    eyebrow: "Détection précoce",
    title: "Dépistage des IST",
    caption: "jugent le dépistage nécessaire",
    copy: "86 % des répondants considèrent que le dépistage des IST doit être systématique chez les personnes à risque. Ce résultat est encourageant puisqu'il montre une bonne compréhension de l'importance du dépistage précoce dans la prévention des complications.",
    accent: "var(--color-clinic)",
    tags: ["OMS", "personnes à risque", "prévention"],
    icon: "scan",
  },
];

function CardIcon({ kind }: { kind: IconKind }) {
  if (kind === "virus") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
        <circle cx="24" cy="24" r="11" fill="currentColor" opacity="0.18" />
        <circle cx="24" cy="24" r="7.5" fill="currentColor" />
        <circle cx="24" cy="24" r="2.6" fill="var(--color-paper)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const r = (deg * Math.PI) / 180;
          const x1 = 24 + Math.cos(r) * 11;
          const y1 = 24 + Math.sin(r) * 11;
          const x2 = 24 + Math.cos(r) * 18;
          const y2 = 24 + Math.sin(r) * 18;
          return (
            <g key={deg} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              <circle cx={x2} cy={y2} r="2.4" fill="currentColor" stroke="none" />
            </g>
          );
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
      <circle cx="21" cy="21" r="13" fill="currentColor" opacity="0.18" />
      <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="3" />
      <path d="M30.5 30.5l9 9" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M15 21l4.5 4.5L28 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HpvDepistageSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".hpv-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hpv-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".hpv-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(
          ".hpv-card",
          { y: 44, opacity: 0, duration: 0.66, stagger: 0.14, ease: "power3.out" },
          0.34,
        )
        .from(
          ".hpv-icon",
          { scale: 0, rotate: -40, opacity: 0, transformOrigin: "center", duration: 0.6, stagger: 0.14, ease: "back.out(1.8)" },
          0.5,
        )
        .from(".hpv-eyebrow", { x: -10, opacity: 0, duration: 0.5, stagger: 0.14 }, 0.56);

      root.current?.querySelectorAll<HTMLElement>(".hpv-card").forEach((card) => {
        const arc = card.querySelector<SVGPathElement>(".hpv-arc");
        const count = card.querySelector<HTMLElement>(".hpv-count");
        const target = Number(card.dataset.value);
        const proxy = { v: 0 };
        tl.to(
          proxy,
          {
            v: target,
            duration: 1.15,
            ease: "power2.out",
            onUpdate: () => {
              if (count) count.textContent = String(Math.round(proxy.v));
              if (arc) arc.setAttribute("d", ringPath({ value: proxy.v, size: RING_SIZE, stroke: RING_STROKE }));
            },
          },
          0.62,
        );
      });

      tl.from(
        ".hpv-pill",
        { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.42, stagger: 0.07, ease: "back.out(2)" },
        1.1,
      );

      gsap.to(".hpv-icon", {
        y: -5,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  const trackPath = ringPath({ value: 100, size: RING_SIZE, stroke: RING_STROKE });

  return (
    <div ref={root} className="flex h-full flex-col px-20 py-10">
      <header className="shrink-0">
        <p className="hpv-kicker mono-label text-clinic">Résultats · Connaissances</p>
        <h2 className="hpv-title mt-3 font-display text-5xl font-light leading-[1.04] text-ink">
          HPV et indications du dépistage
        </h2>
        <p className="hpv-sub mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Deux repères ressortent fortement : les complications du HPV et la
          nécessité du dépistage chez les personnes à risque.
        </p>
      </header>

      <div className="mt-7 grid min-h-0 flex-1 grid-cols-2 gap-7">
        {CARDS.map((card) => (
          <article
            key={card.title}
            data-value={card.value}
            className="hpv-card relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-hair/60 bg-white/70 px-8 pb-7 pt-8 text-center shadow-[0_28px_80px_rgba(27,29,36,0.12)] backdrop-blur-sm"
          >
            {/* top accent rail */}
            <span
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
            />
            {/* accent wash */}
            <span
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: `color-mix(in srgb, ${card.accent} 22%, transparent)` }}
            />

            <div className="relative z-10 flex h-full w-full flex-col items-center">
              <div className="flex items-center gap-3">
                <span
                  className="hpv-icon grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: `color-mix(in srgb, ${card.accent} 15%, transparent)`, color: card.accent }}
                >
                  <CardIcon kind={card.icon} />
                </span>
                <span className="hpv-eyebrow mono-label" style={{ color: card.accent }}>
                  {card.eyebrow}
                </span>
              </div>

              <div className="relative mt-6 grid place-items-center">
                <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="-rotate-90">
                  <g transform={`translate(${RING_SIZE / 2} ${RING_SIZE / 2})`}>
                    <path d={trackPath} fill="var(--color-hair)" opacity="0.4" />
                    <path className="hpv-arc" d="" fill={card.accent} />
                  </g>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <p className="font-display text-5xl font-light leading-none text-ink">
                    <span className="hpv-count" data-to={card.value}>0</span>
                    <span style={{ color: card.accent }}>%</span>
                  </p>
                  <p className="mono-label mt-1.5 text-muted">{card.caption}</p>
                </div>
              </div>

              <h3 className="mt-6 font-display text-3xl font-normal leading-tight text-ink">{card.title}</h3>
              <p className="mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-muted">{card.copy}</p>

              <div className="mt-auto w-full pt-6">
                <div className="h-px w-full bg-hair/50" />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="hpv-pill rounded-full border px-3 py-1.5 text-sm font-semibold"
                      style={{
                        borderColor: `color-mix(in srgb, ${card.accent} 35%, transparent)`,
                        color: card.accent,
                        background: `color-mix(in srgb, ${card.accent} 7%, transparent)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
