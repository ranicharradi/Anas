import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { DuotonePhoto } from "@/components/DuotonePhoto";
import nurseCare from "@/assets/photos/nurse-care.jpg";

// Real study values from the Canva deck (page "Facteurs favorisant une
// communication efficace"). Teal = bases solides, coral = lacunes à renforcer.
const FACTORS = [
  { label: "Écoute active", value: 100, strong: true },
  { label: "Respect et absence de jugement", value: 86, strong: true },
  { label: "Confidentialité", value: 64, strong: true },
  { label: "Empathie", value: 50, strong: false },
  { label: "Langage adapté et disponibilité", value: 40, strong: false },
];

const CLINIC_FILL = "linear-gradient(90deg, var(--color-clinic-deep), #1a93ac)";
const CORAL_FILL = "linear-gradient(90deg, var(--color-coral), #e07c70)";

export default function CommunicationSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".cm-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cm-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".cm-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".comm-photo", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.22)
        .from(".cm-board", { opacity: 0, y: 30, duration: 0.65 }, 0.28)
        .from(".cm-art", { opacity: 0, scale: 0.92, transformOrigin: "center", duration: 0.8, stagger: 0.14, ease: "power2.out" }, 0.4)
        .from(".cm-eyebrow", { opacity: 0, y: 10, duration: 0.45 }, 0.5)
        .from(".cm-row", { x: 28, opacity: 0, duration: 0.5, stagger: 0.09 }, 0.56)
        .from(".cm-bar", { scaleX: 0, transformOrigin: "left", duration: 0.9, stagger: 0.09, ease: "power3.out" }, 0.62)
        .from(".cm-cap", { opacity: 0, y: 12, duration: 0.5 }, 1);

      root.current?.querySelectorAll<HTMLElement>(".cm-count").forEach((node) => {
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
              node.textContent = `${Math.round(counter.v)}%`;
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
    <div ref={root} className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-14 px-20 py-12">
      <section>
        <p className="cm-kicker mono-label text-clinic">Résultats · Attitudes</p>
        <h2 className="cm-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Facteurs favorisant une communication efficace
        </h2>
        <p className="cm-sub mt-6 max-w-lg text-xl leading-relaxed text-muted">
          Les résultats montrent une bonne maîtrise de l'écoute active, du
          respect, de l'absence de jugement et de la confidentialité. Ces
          compétences sont essentielles pour établir une relation de confiance
          avec les adolescents.
        </p>
        <DuotonePhoto
          src={nurseCare}
          alt="Infirmier réconfortant une patiente"
          position="center"
          className="comm-photo mt-8 h-32 w-full rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
        />
      </section>

      <section className="cm-board relative min-h-[610px] overflow-hidden rounded-lg border border-hair/60 bg-white/55 p-9 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
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

        <div className="relative z-10 flex h-full flex-col justify-center">
          <div className="cm-eyebrow flex items-baseline justify-between">
            <p className="mono-label text-clinic">Maîtrise des compétences relationnelles</p>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-clinic-deep">
                <span className="h-2.5 w-2.5 rounded-full bg-clinic" /> Bases solides
              </span>
              <span className="flex items-center gap-1.5 text-coral">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" /> À renforcer
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {FACTORS.map((f) => (
              <div key={f.label} className="cm-row">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-lg font-semibold text-ink">{f.label}</span>
                  <span
                    className="cm-count font-display text-2xl font-medium leading-none"
                    data-to={f.value}
                    style={{ color: f.strong ? "var(--color-clinic-deep)" : "var(--color-coral)" }}
                  >
                    0%
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-hair/30">
                  <div
                    className="cm-bar h-full rounded-full"
                    style={{ width: `${f.value}%`, background: f.strong ? CLINIC_FILL : CORAL_FILL }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="cm-cap mt-9 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            Certaines lacunes persistent concernant l'empathie, le langage adapté
            et la disponibilité. Cela montre que les compétences techniques
            doivent être accompagnées de compétences relationnelles afin de
            garantir une communication plus efficace.
          </p>
        </div>
      </section>
    </div>
  );
}
