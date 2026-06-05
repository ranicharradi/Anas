import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Recommandations (Canva pages 23-25). Six numbered recommendation cards in a
 * 2x3 grid with clinic/coral badge accents. Header: kicker + font-display title.
 * All motion gated on `active`; cards stagger in from below.
 */

interface Reco {
  n: string;
  text: string;
  accent: string;
}

const RECOS: Reco[] = [
  {
    n: "01",
    text: "Intégrer davantage l'approche syndromique dans la pratique clinique quotidienne, notamment dans les structures aux moyens diagnostiques limités.",
    accent: "var(--color-clinic)",
  },
  {
    n: "02",
    text: "Développer des programmes éducatifs adaptés aux adolescents, dans un langage simple, accessible et respectueux des réalités socioculturelles.",
    accent: "var(--color-clinic-deep)",
  },
  {
    n: "03",
    text: "Encourager des supports pédagogiques variés (brochures, affiches, vidéos, outils numériques, réseaux sociaux) pour rendre la prévention plus attractive et compréhensible.",
    accent: "var(--color-coral)",
  },
  {
    n: "04",
    text: "Promouvoir une communication non jugeante fondée sur l'écoute active, l'empathie et la confidentialité, pour favoriser la confiance des adolescents.",
    accent: "var(--color-clinic)",
  },
  {
    n: "05",
    text: "Sensibiliser les adolescents au dépistage précoce, à l'utilisation correcte du préservatif et à la réduction des comportements à risque.",
    accent: "var(--color-clinic-deep)",
  },
  {
    n: "06",
    text: "Intégrer l'éducation à la sexualité de façon plus structurée dans les établissements scolaires et universitaires, avec les professionnels de santé.",
    accent: "var(--color-coral)",
  },
];

export default function RecommandationsSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".reco-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".reco-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".reco-lead", { y: 16, opacity: 0, duration: 0.5 }, 0.2)
        .from(
          ".reco-card",
          { y: 28, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          0.38,
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="flex h-full flex-col px-20 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="reco-kicker mono-label text-clinic">04 · Recommandations</p>
        <h2 className="reco-title mt-3 font-display text-6xl font-light text-ink">
          Pistes d'amélioration
        </h2>
        <p className="reco-lead mt-3 text-lg leading-relaxed text-muted">
          Six recommandations issues de l'analyse, à l'intention des équipes soignantes et des décideurs.
        </p>
      </div>

      {/* 2x3 grid of recommendation cards */}
      <div className="grid flex-1 grid-cols-2 grid-rows-3 gap-4">
        {RECOS.map((r) => (
          <article
            key={r.n}
            className="reco-card flex items-start gap-4 rounded-2xl border border-hair/60 bg-white/55 px-6 py-5 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm"
          >
            {/* Number badge */}
            <span
              className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg font-light text-white"
              style={{ background: r.accent }}
            >
              {r.n}
            </span>

            {/* Text */}
            <p className="text-[15px] leading-relaxed text-ink">{r.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
