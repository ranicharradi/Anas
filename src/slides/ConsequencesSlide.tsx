import { useRef } from "react";
import { TransmissionIST } from "@/components/illustrations/TransmissionIST";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const RISKS = [
  {
    label: "Transmission au partenaire",
    value: 80,
    copy: "L'absence de prise en charge maintient une forte contagiosité.",
    color: "var(--color-coral)",
  },
  {
    label: "Transmission mère-enfant",
    value: 80,
    copy: "Les IST pendant la grossesse exposent le nouveau-né à des conséquences graves.",
    color: "var(--color-clinic)",
  },
];

export default function ConsequencesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".cs-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cs-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".cs-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".cs-body", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.25)
        .from(".ill-piece", { scale: 0.9, opacity: 0, transformOrigin: "center", duration: 0.6, stagger: 0.12, ease: "back.out(1.6)" }, 0.4)
        .from(".cs-card", { y: 36, opacity: 0, duration: 0.6, stagger: 0.14 }, 0.78)
        .from(".cs-meter", { scaleX: 0, transformOrigin: "left", duration: 0.75, stagger: 0.12 }, 0.98);

      root.current?.querySelectorAll<HTMLElement>(".cs-count").forEach((node) => {
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
          0.85,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.86fr_1.14fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="cs-kicker mono-label text-clinic">Résultats · Conséquences</p>
        <h2 className="cs-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Conséquences des IST non traitées
        </h2>
        <p className="cs-sub mt-6 max-w-lg text-lg leading-relaxed text-muted">
          La non-prise en charge des IST reste un défi sanitaire majeur,
          notamment par le risque de transmission.
        </p>
      </section>

      <section className="cs-body relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <TransmissionIST className="absolute inset-0 h-full w-full" />

        <div className="relative z-10 ml-auto flex h-full w-[330px] flex-col justify-center gap-5">
          {RISKS.map((risk) => (
            <article key={risk.label} className="cs-card rounded-lg border border-hair/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(27,29,36,0.08)]">
              <p className="font-display text-6xl font-light leading-none text-ink">
                <span className="cs-count" data-to={risk.value}>0</span><span style={{ color: risk.color }}>%</span>
              </p>
              <h3 className="mt-3 text-xl font-semibold text-ink">{risk.label}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{risk.copy}</p>
              <div className="mt-4 h-2 rounded-full bg-hair/40">
                <div className="cs-meter h-full rounded-full" style={{ width: `${risk.value}%`, background: risk.color }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
