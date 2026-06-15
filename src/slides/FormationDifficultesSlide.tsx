import { useRef } from "react";
import { RankedBars } from "@/components/illustrations/RankedBars";
import { StatRing } from "@/components/StatRing";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

// Real study values from the Canva deck (page "La formation sur le programme
// national IST-Sida" + "Principale difficulté rencontrée").
const DIFFICULTES = [
  { label: "Manque de temps", value: 36, color: "var(--color-clinic)" },
  { label: "Réticence des adolescents", value: 42, color: "var(--color-clinic)" },
  { label: "Manque de supports pédagogiques", value: 62, color: "var(--color-clinic-deep)" },
  { label: "Contraintes culturelles", value: 44, color: "var(--color-clinic)" },
  { label: "Insuffisance de formation", value: 76, color: "var(--color-coral)" },
];

export default function FormationDifficultesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".fd-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".fd-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".fd-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".fd-board", { opacity: 0, y: 30, duration: 0.65 }, 0.28)
        .from(".fd-head", { opacity: 0, y: 10, duration: 0.45, stagger: 0.12 }, 0.42)
        .from(".fd-split", { scaleY: 0, transformOrigin: "top", duration: 0.7, ease: "power2.inOut" }, 0.42)
        .from(".fd-card", { x: 26, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.6)
        .from(".fd-bar", { scaleX: 0, transformOrigin: "left", duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.66)
        .from(".fd-tip", { scale: 0, opacity: 0, transformOrigin: "top center", duration: 0.45, ease: "back.out(2)" }, 0.8)
        .from(".fd-note", { opacity: 0, y: 12, duration: 0.5 }, 0.85);

      root.current?.querySelectorAll<HTMLElement>(".fd-count").forEach((node) => {
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
          0.62,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="fd-kicker mono-label text-clinic">Résultats · Pratiques éducatives</p>
        <h2 className="fd-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Formation et difficultés rencontrées
        </h2>
        <p className="fd-sub mt-6 max-w-lg text-xl leading-relaxed text-muted">
          Le déficit de formation au programme national IST-Sida est le frein
          majeur des pratiques éducatives infirmières.
        </p>
      </section>

      <section className="fd-board relative grid min-h-[610px] grid-cols-[0.82fr_1.18fr] items-center gap-9 overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-9 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <p className="fd-head mono-label self-start text-left text-coral">
            Formation programme national IST-Sida
          </p>
          <div className="mt-2 grid flex-1 place-items-center">
            <StatRing value={76} active={active} size={210} />
          </div>

          {/* Ring caption as a tooltip; caret aimed up at the 76 %. */}
          <div
            className="fd-tip relative mt-6 max-w-[24ch] rounded-2xl px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(27,29,36,0.20)]"
            style={{ background: "var(--color-clinic-deep)" }}
          >
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px]"
              style={{ background: "var(--color-clinic-deep)" }}
            />
            <span className="relative">n'ont jamais suivi de formation IST-Sida</span>
          </div>
          <p className="fd-note text-[19px] leading-relaxed text-muted">
            Seuls 24 % des infirmiers ont bénéficié d'une telle formation : un
            déficit significatif dans la mise en place de formations spécifiques.
          </p>
        </div>

        <div className="fd-split absolute left-[34%] top-9 bottom-9 w-px bg-hair/45" aria-hidden />

        <div>
          <p className="fd-head mono-label text-clinic">Principale difficulté rencontrée</p>
          <RankedBars
            data={DIFFICULTES}
            rowClassName="fd-card"
            barClassName="fd-bar"
            countClassName="fd-count"
            className="mt-5 flex flex-col gap-4"
          />
        </div>
      </section>
    </div>
  );
}
