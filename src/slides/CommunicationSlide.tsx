import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { DuotonePhoto } from "@/components/DuotonePhoto";
import nurseCare from "@/assets/photos/nurse-care.jpg";

const STRENGTHS = ["Écoute active", "Respect", "Absence de jugement", "Confidentialité"];
const GAPS = ["Empathie", "Langage adapté", "Disponibilité"];

export default function CommunicationSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".cm-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cm-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".cm-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".cm-board", { opacity: 0, y: 30, duration: 0.65 }, 0.28)
        .from(".cm-art", { opacity: 0, scale: 0.92, transformOrigin: "center", duration: 0.8, stagger: 0.14, ease: "power2.out" }, 0.4)
        .from(".cm-chip", { y: 22, opacity: 0, duration: 0.42, stagger: 0.06 }, 0.78)
        .from(".cm-gap", { x: 34, opacity: 0, duration: 0.46, stagger: 0.08 }, 0.9)
        .from(".comm-photo", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.22);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="cm-kicker mono-label text-clinic">Résultats · Attitudes</p>
        <h2 className="cm-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Facteurs favorisant une communication efficace
        </h2>
        <p className="cm-sub mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Les bases relationnelles sont présentes, mais certaines compétences
          restent à renforcer pour mieux dialoguer avec les adolescents.
        </p>
        <DuotonePhoto
          src={nurseCare}
          alt="Infirmier réconfortant une patiente"
          position="center"
          className="comm-photo mt-8 h-32 w-full rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
        />
      </section>

      <section className="cm-board relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-8 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <svg viewBox="0 0 660 560" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {/* Calm dialogue motif: two speech bubbles (nurse · adolescent) as a faint watermark. */}
          <g fill="none" strokeLinecap="round" opacity="0.1">
            <g className="cm-art" stroke="var(--color-clinic)" strokeWidth="3">
              <path d="M300 56h252a24 24 0 0 1 24 24v98a24 24 0 0 1-24 24H424l-42 42v-42h-82a24 24 0 0 1-24-24V80a24 24 0 0 1 24-24z" />
              <path d="M338 118h176M338 152h132" />
            </g>
            <g className="cm-art" stroke="var(--color-coral)" strokeWidth="3">
              <path d="M104 358h224a24 24 0 0 1 24 24v86a24 24 0 0 1-24 24H244v42l-42-42h-98a24 24 0 0 1-24-24v-86a24 24 0 0 1 24-24z" />
              <path d="M144 408h152M144 442h104" />
            </g>
          </g>
        </svg>

        <div className="relative z-10 grid h-full grid-cols-[1fr_0.82fr] gap-6">
          <div className="flex flex-col justify-end">
            <p className="mono-label text-clinic">Bases solides</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {STRENGTHS.map((item) => (
                <div key={item} className="cm-chip rounded-lg border border-clinic/20 bg-clinic-soft/50 px-4 py-4">
                  <p className="text-lg font-semibold leading-tight text-clinic-deep">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mono-label text-coral">Lacunes à renforcer</p>
            <div className="mt-4 flex flex-col gap-3">
              {GAPS.map((item) => (
                <div key={item} className="cm-gap rounded-lg border border-coral/25 bg-white/80 px-5 py-4 shadow-sm">
                  <p className="text-lg font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
            <p className="cm-gap mt-6 text-[15px] leading-relaxed text-muted">
              Ces lacunes rejoignent les recommandations de l'UNESCO sur
              l'adaptation du langage et la disponibilité relationnelle.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
