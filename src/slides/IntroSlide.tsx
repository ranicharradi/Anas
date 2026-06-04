import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { VitalLine } from "@/components/VitalLine";

/**
 * Introduction: fuses pages 4 (context + key figures) and 5 (problématique) of
 * the Canva deck into one slide: two stat callouts and the nursing role up top,
 * the research question as the emphasised closing band. Numbers count up; the
 * rest reveals in a stagger. A clinical decor layer (medical-cross texture,
 * pulse rings, an ECG accent) carries the nursing theme without crowding text.
 */

const PILIERS = ["Sensibilisation", "Éducation", "Dépistage", "Accompagnement"];

export default function IntroSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".intro-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".decor-ring", {
          scale: 0,
          opacity: 0,
          transformOrigin: "center",
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        })
        .from(".intro-kicker", { y: 14, opacity: 0, duration: 0.5 }, 0.1)
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0.1)
        .from(
          ".reveal",
          { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 },
          0.3,
        );

      root.current
        ?.querySelectorAll<HTMLElement>(".stat-count")
        .forEach((node) => {
          const to = Number(node.dataset.to);
          const c = { v: 0 };
          tl.to(
            c,
            {
              v: to,
              duration: 1,
              ease: "power1.out",
              snap: { v: 1 },
              onUpdate: () => {
                node.textContent = String(Math.round(c.v));
              },
            },
            0.55,
          );
        });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col gap-7 overflow-hidden px-20 py-12"
    >
      <Decor />

      <header className="flex items-end justify-between gap-10">
        <div>
          <p className="intro-kicker mono-label flex items-center gap-2 text-clinic">
            <CrossGlyph />
            01 · Introduction
          </p>
          <h2 className="intro-title mt-2 font-display text-5xl font-light text-ink">
            Introduction
          </h2>
        </div>
        <div className="reveal mb-1 hidden w-[34%] max-w-sm opacity-60 lg:block">
          <VitalLine active={active} />
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[0.95fr_1.05fr] gap-14">
        {/* Key figures */}
        <div className="flex flex-col justify-center gap-5">
          <Stat
            icon={<IconGlobe />}
            count={374}
            unit="M"
            caption="nouvelles infections par an dans le monde"
          />
          <Stat
            icon={<IconDaily />}
            count={1}
            unit="M / jour"
            caption="IST évitables contractées chaque jour · 15–49 ans"
          />
        </div>

        {/* Narrative */}
        <div className="flex flex-col justify-center gap-6">
          <p className="reveal text-[17px] leading-relaxed text-ink/85">
            Les infections sexuellement transmissibles (IST) constituent un{" "}
            <strong className="font-semibold text-ink">
              problème majeur de santé publique
            </strong>{" "}
            à l'échelle mondiale et nationale. En Tunisie, elles font l'objet
            d'une déclaration obligatoire.
          </p>

          <div className="reveal">
            <p className="text-[17px] leading-relaxed text-ink/85">
              Les infirmiers sont{" "}
              <strong className="font-semibold text-ink">essentiels</strong>{" "}
              dans la lutte contre les IST chez les adolescents, un rôle adapté
              au contexte socioculturel&nbsp;:
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {PILIERS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-clinic/30 bg-clinic-soft/40 px-4 py-1.5 text-sm font-medium text-clinic-deep"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problématique */}
      <div className="reveal relative overflow-hidden rounded-2xl border border-hair/60 border-l-[5px] border-l-coral bg-white/55 px-10 py-6 backdrop-blur-sm">
        <span className="pointer-events-none absolute -right-4 -top-6 text-coral/[0.07] [&>svg]:h-32 [&>svg]:w-32">
          <IconCaduceus />
        </span>
        <p className="mono-label text-coral">Problématique</p>
        <p className="relative mt-2.5 font-display text-[21px] leading-snug text-ink">
          Malgré les efforts de prévention en Tunisie, les adolescents restent
          vulnérables aux IST en raison des insuffisances éducatives et des
          obstacles socioculturels.{" "}
          <span className="italic text-clinic-deep">
            Quel est le niveau réel des pratiques éducatives des infirmiers en
            matière de prévention des IST chez les adolescents ?
          </span>
        </p>
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
          id="med-cross"
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
        <radialGradient id="ring-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-clinic)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-clinic)" stopOpacity="1" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#med-cross)" opacity="0.045" />

      {/* concentric "pulse" rings, top-right */}
      <g
        fill="none"
        stroke="var(--color-clinic)"
        strokeWidth="1.5"
        opacity="0.12"
      >
        {[60, 120, 190, 270, 360].map((r) => (
          <circle key={r} className="decor-ring" cx="1500" cy="40" r={r} />
        ))}
      </g>

      {/* large faint cross, lower-left */}
      <g
        className="decor-ring"
        stroke="var(--color-clinic)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.05"
      >
        <path d="M150 690v150M75 765h150" />
      </g>
    </svg>
  );
}

function Stat({
  icon,
  count,
  unit,
  caption,
}: {
  icon: ReactNode;
  count: number;
  unit: string;
  caption: string;
}) {
  return (
    <div className="reveal relative flex items-center gap-5 overflow-hidden rounded-2xl border border-hair/60 bg-white/55 px-7 py-5 backdrop-blur-sm">
      <span className="pointer-events-none absolute -bottom-6 -right-3 text-clinic/[0.06] [&>svg]:h-28 [&>svg]:w-28">
        {icon}
      </span>
      <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-clinic-soft/50 text-clinic-deep">
        {icon}
      </span>
      <div className="relative">
        <p className="font-display text-[2.6rem] font-light leading-none text-ink">
          <span className="stat-count tabular-nums" data-to={count}>
            0
          </span>
          <span className="ml-1 text-clinic">{unit}</span>
        </p>
        <p className="mt-1.5 max-w-[22ch] text-sm leading-snug text-muted">
          {caption}
        </p>
      </div>
    </div>
  );
}

function CrossGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

function IconDaily() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/** Stethoscope motif, used as a faint watermark on the problématique band. */
function IconCaduceus() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3v5a4 4 0 0 0 8 0V3" />
      <path d="M8 16a6 6 0 0 0 6 6 5 5 0 0 0 5-5v-2" />
      <circle cx="19" cy="10" r="2.5" />
    </svg>
  );
}
