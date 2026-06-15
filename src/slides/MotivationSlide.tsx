import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { PeopleWaffle } from "@/components/illustrations/PeopleWaffle";

const STATS = [
  {
    id: "role",
    value: 84,
    color: "var(--color-coral)",
    label: "perçoivent l'éducation à la sexualité comme partie de leur rôle",
    note: "Ce chiffre traduit une forte implication des infirmiers dans la promotion de la santé sexuelle des adolescents.",
  },
  {
    id: "competences",
    value: 94,
    color: "var(--color-clinic)",
    label: "souhaitent renforcer leurs compétences",
    note: "Cette motivation représente un point très positif, car elle montre une volonté d'améliorer la qualité des pratiques professionnelles.",
  },
] as const;

export default function MotivationSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".mot-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".mot-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".mot-sub", { y: 18, opacity: 0, duration: 0.55 }, 0.18)
        .from(".mot-panel", { y: 34, opacity: 0, duration: 0.65 }, 0.28)
        .from(".mot-ring-shell", { y: 28, opacity: 0, duration: 0.6, stagger: 0.12, ease: "back.out(1.4)" }, 0.44)
        .from(".pw-on", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.4, stagger: 0.006, ease: "back.out(2)" }, 0.55)
        .from(".mot-caption", { y: 14, opacity: 0, duration: 0.45, stagger: 0.1 }, 0.78)
        .from(".mot-note", { y: 12, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.92);

      STATS.forEach((stat, i) => {
        const numberNode = root.current?.querySelector<HTMLElement>(`.mot-count-${stat.id}`);
        const counter = { v: 0 };

        tl.to(
          counter,
          {
            v: stat.value,
            duration: 1.1,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              if (numberNode) numberNode.textContent = String(Math.round(counter.v));
            },
          },
          0.6 + i * 0.1,
        );
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="grid h-full grid-cols-[0.76fr_1.24fr] items-center gap-12 px-20 py-12">
      <section>
        <p className="mot-kicker mono-label text-clinic">Attitudes des professionnels</p>
        <h2 className="mot-title mt-4 max-w-xl font-display text-5xl font-light leading-[1.04] text-ink">
          Motivation et perception du rôle infirmier
        </h2>
        <p className="mot-sub mt-5 max-w-lg text-xl leading-relaxed text-muted">
          Les infirmiers se montrent impliqués dans la santé sexuelle des adolescents
          et conscients de leurs limites actuelles.
        </p>
      </section>

      <section className="mot-panel relative flex min-h-[560px] flex-col justify-center rounded-2xl border border-hair/50 bg-white/65 px-9 py-10 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <p className="mono-label text-clinic">Attitudes mesurées sur 50 répondants</p>
        <h3 className="mt-2 font-display text-2xl font-light leading-tight text-ink">
          Engagement et conscience professionnelle
        </h3>

        <div className="mt-10 grid grid-cols-2 gap-10">
          {STATS.map((stat) => (
            <div key={stat.id} className="mot-ring-shell flex flex-col items-center gap-4">
              <p className="font-display text-[3.4rem] leading-none text-ink">
                <span className={`mot-count-${stat.id}`}>0</span>
                <span style={{ color: stat.color }}>%</span>
              </p>

              {/* Enhanced tooltip captioning the figure; caret aimed up at the % above. */}
              <div
                className="mot-caption relative max-w-[22ch] rounded-2xl px-5 py-2.5 text-center text-sm font-semibold leading-snug text-white ring-1 ring-inset ring-white/25"
                style={{
                  backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${stat.color} 78%, white), ${stat.color})`,
                  boxShadow: `0 16px 34px color-mix(in srgb, ${stat.color} 38%, transparent)`,
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[3px]"
                  style={{ background: `color-mix(in srgb, ${stat.color} 78%, white)` }}
                />
                <span className="relative drop-shadow-sm">{stat.label}</span>
              </div>

              <PeopleWaffle
                value={stat.value}
                color={stat.color}
                fillClassName="pw-on"
                className="h-[208px] w-auto"
              />
              <p className="mot-note max-w-[24ch] text-center text-sm leading-relaxed text-ink">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
