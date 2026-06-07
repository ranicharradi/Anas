import { useRef } from "react";
import excelLogo from "@/assets/logos/microsoft-excel.svg";
import wordLogo from "@/assets/logos/microsoft-word.svg";
import spssLogo from "@/assets/logos/spss.svg";
import canvaLogo from "@/assets/logos/canva.svg";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { DuotonePhoto } from "@/components/DuotonePhoto";
import nurseDigital from "@/assets/photos/nurse-digital.jpg";

interface ToolItem {
  n: string;
  name: string;
  role: string;
  detail: string;
  logo: string;
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    n: "01",
    name: "Microsoft Excel",
    role: "Saisie et codage",
    detail: "Organisation initiale des données recueillies.",
    logo: excelLogo,
    color: "#107c41",
  },
  {
    n: "02",
    name: "SPSS",
    role: "Analyse statistique",
    detail: "Traitement descriptif et lecture des résultats.",
    logo: spssLogo,
    color: "#d71920",
  },
  {
    n: "03",
    name: "Microsoft Word",
    role: "Rédaction",
    detail: "Mise en forme du rapport de fin d'études.",
    logo: wordLogo,
    color: "#185abd",
  },
  {
    n: "04",
    name: "Canva",
    role: "Support visuel",
    detail: "Conception graphique de la présentation.",
    logo: canvaLogo,
    color: "#00c4cc",
  },
];

export default function OutilsInformatiquesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".tools-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".tools-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".tools-sub", { y: 16, opacity: 0, duration: 0.5 }, 0.2)
        .from(".tools-note", { y: 20, opacity: 0, duration: 0.55 }, 0.35)
        .from(".tools-stage", { y: 34, opacity: 0, duration: 0.65 }, 0.28)
        .from(".tool-link", { drawSVG: "0%", duration: 1.15, ease: "power2.inOut" }, 0.45)
        .from(
          ".tool-card",
          { y: 42, opacity: 0, duration: 0.68, stagger: 0.12, ease: "back.out(1.35)" },
          0.58,
        )
        .from(
          ".tool-logo",
          { scale: 0.72, opacity: 0, transformOrigin: "center", duration: 0.44, stagger: 0.12 },
          0.72,
        )
        .from(
          ".tool-accent",
          { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.1 },
          0.88,
        )
        .from(".outils-photo", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.38);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.82fr_1.18fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="tools-kicker mono-label text-clinic">02 · Méthodologie</p>
        <h2 className="tools-title mt-3 max-w-lg font-display text-6xl font-light leading-[1.04] text-ink">
          Outils informatiques
        </h2>
        <p className="tools-sub mt-5 max-w-lg text-[20px] leading-relaxed text-muted">
          Les données ont été préparées, analysées, rédigées puis présentées avec
          quatre outils complémentaires.
        </p>

        <DuotonePhoto
          src={nurseDigital}
          alt="Infirmier utilisant un outil numérique"
          position="center"
          className="outils-photo mt-8 h-28 w-full rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
        />

        <div className="tools-note mt-6 rounded-lg border border-hair/70 bg-white/45 p-5 backdrop-blur-sm">
          <p className="mono-label text-clinic">Flux de travail</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-base font-semibold text-ink">
            {["Données", "Analyse", "Rapport", "Soutenance"].map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-md bg-paper/70 px-3 py-2">
                <span className="tabular-nums text-clinic/70">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tools-stage relative min-h-[560px] overflow-hidden rounded-lg border border-hair/60 bg-white/50 p-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 720 560" aria-hidden>
          <defs>
            <pattern id="tools-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="var(--color-hair)" strokeWidth="1" opacity="0.26" />
            </pattern>
            <linearGradient id="tools-flow" x1="110" x2="610" y1="150" y2="420" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-clinic)" />
              <stop offset="0.5" stopColor="var(--color-coral)" />
              <stop offset="1" stopColor="var(--color-clinic-deep)" />
            </linearGradient>
          </defs>
          <rect width="720" height="560" fill="url(#tools-grid)" />
          <path
            className="tool-link"
            d="M178 156 C298 106 410 110 532 154 C612 185 611 268 534 304 C410 361 292 357 178 414"
            fill="none"
            stroke="url(#tools-flow)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 14"
            opacity="0.72"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="mono-label text-clinic">Collecte · Traitement · Présentation</p>
            <p className="mt-2 max-w-lg text-lg leading-relaxed text-muted">
              De la base de données au support de soutenance.
            </p>
          </div>
          <span className="rounded-md border border-clinic/20 bg-clinic-soft/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-clinic-deep">
            4 outils
          </span>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 gap-5">
          {TOOLS.map((tool) => (
            <article
              key={tool.name}
              className="tool-card relative min-h-[205px] overflow-hidden rounded-lg border border-hair/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(27,29,36,0.08)]"
            >
              <div className="tool-accent absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: tool.color }} />
              <div className="flex items-start justify-between gap-5">
                <div
                  className="tool-logo grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-hair/50 bg-white shadow-[0_14px_30px_rgba(27,29,36,0.08)]"
                  style={{ boxShadow: `0 18px 42px ${tool.color}26` }}
                >
                  <img src={tool.logo} alt="" className="max-h-14 max-w-14 object-contain" />
                </div>
                <span className="mono-label text-muted/60">{tool.n}</span>
              </div>

              <div className="mt-5">
                <h3 className="text-[22px] font-semibold leading-tight text-ink">{tool.name}</h3>
                <p className="mt-1 text-[17px] font-semibold" style={{ color: tool.color }}>
                  {tool.role}
                </p>
                <p className="mt-3 text-[17px] leading-relaxed text-muted">{tool.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
