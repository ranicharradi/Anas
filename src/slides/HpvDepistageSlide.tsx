import { useRef } from "react";
import { ringPath } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const FACTS = [
  {
    value: 76,
    title: "HPV et cancer du col",
    copy: "Les participants associent correctement le HPV au cancer du col de l'utérus.",
    color: "var(--color-coral)",
  },
  {
    value: 86,
    title: "Dépistage des IST",
    copy: "Les répondants considèrent le dépistage systématique nécessaire pour les personnes à risque.",
    color: "var(--color-clinic)",
  },
];

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
        .from(".hpv-art", { opacity: 0, scale: 0.85, transformOrigin: "center", duration: 0.75, stagger: 0.16, ease: "back.out(1.5)" }, 0.28)
        .from(".hpv-card", { y: 38, opacity: 0, duration: 0.62, stagger: 0.16 }, 0.5)
        .from(
          ".hpv-arc",
          {
            opacity: 0,
            rotate: -38,
            scale: 0.9,
            transformOrigin: "center",
            duration: 0.95,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.72,
        )
        .from(".hpv-pill", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.45, stagger: 0.08, ease: "back.out(2)" }, 0.9);

      root.current?.querySelectorAll<HTMLElement>(".hpv-count").forEach((node) => {
        const target = Number(node.dataset.to);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 1,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
          },
          0.75,
        );
      });

      gsap.to(".hpv-art", {
        y: -12,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="hpv-kicker mono-label text-clinic">Résultats · Connaissances</p>
        <h2 className="hpv-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          HPV et indications du dépistage
        </h2>
        <p className="hpv-sub mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Deux repères ressortent fortement : les complications du HPV et la
          nécessité du dépistage chez les personnes à risque.
        </p>
      </section>

      <section className="relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <svg className="pointer-events-none absolute left-4 top-8 h-[540px] w-[230px] overflow-visible" viewBox="0 0 224 520" aria-hidden>
          {/* Prévention: shield with a check mark */}
          <g className="hpv-art">
            <path d="M112 28l66 25v78c0 52-35 89-66 103-31-14-66-51-66-103V53z" fill="var(--color-clinic)" />
            <path d="M86 132l19 21 35-41" fill="none" stroke="var(--color-paper)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Dépistage: a magnifier detecting an abnormal cell among normal ones */}
          <g className="hpv-art">
            <circle cx="98" cy="360" r="28" fill="var(--color-clinic-soft)" />
            <circle cx="104" cy="416" r="21" fill="var(--color-clinic-soft)" />
            <circle cx="150" cy="392" r="23" fill="var(--color-coral)" />
            <circle cx="150" cy="392" r="7" fill="var(--color-paper)" />
          </g>
          <g className="hpv-art">
            <circle cx="126" cy="384" r="60" fill="none" stroke="var(--color-clinic-deep)" strokeWidth="10" />
            <path d="M169 427l44 44" stroke="var(--color-clinic-deep)" strokeWidth="14" strokeLinecap="round" />
          </g>
        </svg>

        <div className="relative z-10 ml-52 grid h-full grid-cols-2 gap-6">
          {FACTS.map((fact) => {
            const size = 210;
            const stroke = 16;
            const trackPath = ringPath({ value: 100, size, stroke });
            const arcPath = ringPath({ value: fact.value, size, stroke });
            return (
              <article key={fact.title} className="hpv-card flex min-h-[470px] flex-col justify-between rounded-lg border border-hair/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(27,29,36,0.08)]">
                <div>
                  <div className="relative grid place-items-center">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                      <g transform={`translate(${size / 2} ${size / 2})`}>
                        <path d={trackPath} fill="var(--color-hair)" opacity="0.45" />
                        <path className="hpv-arc" d={arcPath} fill={fact.color} />
                      </g>
                    </svg>
                    <p className="absolute font-display text-6xl font-light leading-none text-ink">
                      <span className="hpv-count" data-to={fact.value}>0</span><span style={{ color: fact.color }}>%</span>
                    </p>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight text-ink">{fact.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">{fact.copy}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["OMS", "prévention", "adolescents"].map((pill) => (
                    <span key={pill} className="hpv-pill rounded-full border border-hair/70 bg-paper/70 px-3 py-1.5 text-sm font-semibold text-muted">
                      {pill}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
