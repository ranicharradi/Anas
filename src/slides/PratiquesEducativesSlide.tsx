import { useRef } from "react";
import { EducationGroupe } from "@/components/illustrations/EducationGroupe";
import { RankedBars } from "@/components/illustrations/RankedBars";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

const METHODS = [
  { label: "Approche traditionnelle", value: 54, color: "var(--color-clinic)" },
  { label: "Voie médiatique", value: 40, color: "var(--color-clinic-deep)" },
  { label: "Éducation par les pairs", value: 12, color: "var(--color-coral)" },
];

const BARRIERS = [
  { label: "Communication progressive face à la réticence", value: 58 },
  { label: "Absence de formation programme IST-Sida", value: 76 },
  { label: "Formation suivie", value: 24 },
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
        .from(".pe-card", { y: 30, opacity: 0, duration: 0.52, stagger: 0.09 }, 0.52)
        .from(".pe-bar", { scaleX: 0, transformOrigin: "left", duration: 0.75, stagger: 0.08, ease: "power2.out" }, 0.74)
        .from(".ill-piece", { scale: 0.9, opacity: 0, transformOrigin: "center", duration: 0.55, stagger: 0.1, ease: "back.out(1.6)" }, 0.5);

      root.current?.querySelectorAll<HTMLElement>(".pe-count").forEach((node) => {
        const target = Number(node.dataset.to);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: target,
            duration: 0.95,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
          },
          0.78,
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
          Méthodes utilisées et difficultés rencontrées
        </h2>
        <p className="pe-sub mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Les pratiques restent dominées par les approches traditionnelles et
          limitées par le déficit de formation spécifique.
        </p>
      </section>

      <section className="pe-board relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <EducationGroupe className="pointer-events-none absolute -bottom-10 -right-8 w-[360px] opacity-[0.13]" />

        <div className="relative z-10 grid grid-cols-[1fr_0.88fr] gap-5">
          <div className="flex flex-col justify-center gap-4">
            <p className="mono-label text-clinic">Méthodes éducatives</p>
            <RankedBars
              data={METHODS}
              rowClassName="pe-card"
              barClassName="pe-bar"
              countClassName="pe-count"
              className="mt-2 flex flex-col gap-7"
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="mono-label text-coral">Freins clés</p>
            {BARRIERS.map((barrier, i) => (
              <article key={barrier.label} className="pe-card rounded-lg border border-hair/70 bg-paper/85 p-5 shadow-[0_14px_35px_rgba(27,29,36,0.07)]">
                <p className="font-display text-5xl font-light leading-none text-ink">
                  <span className="pe-count" data-to={barrier.value}>0</span><span className={i === 2 ? "text-clinic" : "text-coral"}>%</span>
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-ink">{barrier.label}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
