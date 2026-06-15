import { useRef } from "react";
import { EducationGroupe } from "@/components/illustrations/EducationGroupe";
import { RankedBars } from "@/components/illustrations/RankedBars";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

// Real study values from the Canva deck (page "4. Pratiques éducatives").
const RETICENCE = [
  { label: "Report de la discussion", value: 12, color: "var(--color-coral)" },
  { label: "Insistance directe", value: 30, color: "var(--color-coral)" },
  { label: "Approche adaptée (communication progressive)", value: 58, color: "var(--color-clinic)" },
];

const METHODES = [
  { label: "Approche traditionnelle", value: 54, color: "var(--color-clinic)" },
  { label: "Voie médiatique", value: 40, color: "var(--color-clinic-deep)" },
  { label: "Éducation par les pairs", value: 12, color: "var(--color-coral)" },
];

export default function PratiquesEducativesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".pe-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".pe-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".pe-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".pe-board", { opacity: 0, y: 30, duration: 0.65 }, 0.28)
        .from(".pe-head", { opacity: 0, y: 10, duration: 0.45, stagger: 0.12 }, 0.4)
        .from(".pe-card", { x: 26, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.5)
        .from(".pe-bar", { scaleX: 0, transformOrigin: "left", duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.58)
        .from(".pe-note", { opacity: 0, y: 10, duration: 0.45, stagger: 0.12 }, 0.78)
        .from(".ill-piece", { scale: 0.9, opacity: 0, transformOrigin: "center", duration: 0.55, stagger: 0.1, ease: "back.out(1.6)" }, 0.5);

      root.current?.querySelectorAll<HTMLElement>(".pe-count").forEach((node) => {
        const target = Number(node.dataset.to);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 0.9,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
          },
          0.6,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.82fr_1.18fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="pe-kicker mono-label text-clinic">Résultats · Pratiques éducatives</p>
        <h2 className="pe-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Face à la réticence, quelles méthodes ?
        </h2>
        <p className="pe-sub mt-6 max-w-lg text-xl leading-relaxed text-muted">
          Devant la réticence des adolescents, les infirmiers privilégient une
          communication progressive, mais l'approche traditionnelle reste
          dominante.
        </p>
      </section>

      <section className="pe-board relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-9 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <EducationGroupe className="pointer-events-none absolute -bottom-10 -right-8 w-[360px] opacity-[0.13]" />

        <div className="relative z-10 flex h-full flex-col justify-center gap-7">
          <div>
            <p className="pe-head mono-label text-coral">La réticence des adolescents</p>
            <RankedBars
              data={RETICENCE}
              rowClassName="pe-card"
              barClassName="pe-bar"
              countClassName="pe-count"
              className="mt-5 flex flex-col gap-5"
            />
            <p className="pe-note mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Cette approche semble adaptée car elle favorise l'instauration
              progressive d'un climat de confiance.
            </p>
          </div>

          <div className="border-t border-hair/40 pt-6">
            <p className="pe-head mono-label text-clinic">Méthode éducative utilisée</p>
            <RankedBars
              data={METHODES}
              rowClassName="pe-card"
              barClassName="pe-bar"
              countClassName="pe-count"
              className="mt-5 flex flex-col gap-5"
            />
            <p className="pe-note mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Ces résultats montrent que les méthodes innovantes pourraient être
              davantage développées afin d'améliorer l'efficacité des
              interventions éducatives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
