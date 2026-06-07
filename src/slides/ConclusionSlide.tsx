import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { DuotonePhoto } from "@/components/DuotonePhoto";
import careTeam from "@/assets/photos/care-team.jpg";

/**
 * Conclusion (Canva page 27). A calm, editorial closing slide:
 * narrative paragraph + three takeaway pillars + optional sign-off.
 * Faint clinical decor mirrors IntroSlide's spirit without crowding text.
 */

const PILLARS = [
  {
    label: "Renforcer la formation",
    gloss: "des infirmiers en prévention des IST.",
    accent: "var(--color-clinic)",
  },
  {
    label: "Améliorer les outils éducatifs",
    gloss: "des supports pédagogiques adaptés et variés.",
    accent: "var(--color-clinic-deep)",
  },
  {
    label: "Adapter la prévention",
    gloss: "des stratégies adaptées au contexte tunisien.",
    accent: "var(--color-coral)",
  },
];

export default function ConclusionSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".concl-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".decor-ring-c", {
          scale: 0,
          opacity: 0,
          transformOrigin: "center",
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        })
        .from(".concl-kicker", { y: 14, opacity: 0, duration: 0.5 }, 0.1)
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0.1)
        .from(".concl-narrative", { y: 22, opacity: 0, duration: 0.6 }, 0.4)
        .from(".concl-photo", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.45)
        .from(
          ".concl-pillar",
          { y: 28, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" },
          0.58,
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col gap-8 overflow-hidden px-20 py-12"
    >
      <Decor />

      {/* Header */}
      <header>
        <p className="concl-kicker mono-label flex items-center gap-2 text-clinic">
          <CrossGlyph />
          05 · Conclusion
        </p>
        <h2 className="concl-title mt-2 font-display text-6xl font-light text-ink">
          Conclusion
        </h2>
      </header>

      {/* Narrative + closing photo */}
      <div className="grid grid-cols-[1.3fr_0.7fr] items-center gap-10">
        <p className="concl-narrative text-[20px] leading-relaxed text-ink/85">
          Les IST constituent un{" "}
          <strong className="font-semibold text-ink">
            problème majeur de santé publique
          </strong>
          , en particulier chez les adolescents. Les infirmiers jouent un{" "}
          <strong className="font-semibold text-ink">rôle essentiel</strong> dans
          la prévention et l'éducation à la santé sexuelle. Notre étude montre
          que, malgré des attitudes positives, leurs pratiques éducatives restent
          limitées par le{" "}
          <strong className="font-semibold text-clinic-deep">
            manque de formation
          </strong>
          , l'insuffisance des supports pédagogiques et les{" "}
          <strong className="font-semibold text-clinic-deep">
            obstacles socioculturels
          </strong>
          .
        </p>

        <DuotonePhoto
          src={careTeam}
          alt="Équipe soignante souriante"
          position="center"
          className="concl-photo h-52 w-full rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
        />
      </div>

      {/* Three takeaway pillars */}
      <div className="grid flex-1 grid-cols-3 items-center gap-5">
        {PILLARS.map((p) => (
          <article
            key={p.label}
            className="concl-pillar flex h-full flex-col justify-between rounded-2xl border border-hair/60 bg-white/55 px-7 py-6 shadow-[0_28px_90px_rgba(27,29,36,0.10)] backdrop-blur-sm"
          >
            {/* Accent strip */}
            <span
              className="mb-5 block h-1 w-12 rounded-full"
              style={{ backgroundColor: p.accent }}
            />
            <div className="flex-1">
              <h3
                className="font-display text-[1.45rem] font-light leading-snug"
                style={{ color: p.accent }}
              >
                {p.label}
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">
                {p.gloss}
              </p>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}

/** Faint clinical backdrop: tiled medical crosses + concentric pulse rings. */
function Decor() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern
          id="med-cross-c"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 19v12M19 25h12"
            stroke="var(--color-clinic)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#med-cross-c)" opacity="0.04" />

      {/* Concentric pulse rings, bottom-right */}
      <g
        fill="none"
        stroke="var(--color-clinic)"
        strokeWidth="1.5"
        opacity="0.10"
      >
        {[70, 140, 220, 310, 410].map((r) => (
          <circle key={r} className="decor-ring-c" cx="1520" cy="870" r={r} />
        ))}
      </g>

      {/* Large faint cross, top-left */}
      <g
        className="decor-ring-c"
        stroke="var(--color-clinic)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.04"
      >
        <path d="M80 60v150M5 135h150" />
      </g>
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
    </svg>
  );
}
