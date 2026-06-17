import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Points forts et limites (discussion of the study itself). A balanced two-panel
 * board with a centre divider, echoing FormationDifficultesSlide's layout:
 * strengths on the left (clinic accent), limitations on the right (coral accent).
 * Each side breaks its narrative into the three discrete points it actually makes,
 * so the panels read as a weighed balance rather than two text blocks. A faint
 * clinical backdrop ties the slide to the deck. All motion is GSAP, gated on
 * `active`.
 */

const FORTS = [
  "Propose des actions concrètes pour renforcer la prévention des IST.",
  "Met en valeur le rôle éducatif de l'infirmier, au-delà du soin curatif.",
  "Confronte la théorie aux réalités du terrain, notamment les tabous liés à la sexualité.",
];

const LIMITES = [
  "La petite taille de l'échantillon limite la généralisation des résultats.",
  "La sensibilité du sujet a pu entraîner des refus de participation et des réponses biaisées.",
  "La courte durée de l'étude n'a pas permis d'évaluer l'impact sur le long terme.",
];

export default function PointsFortsLimitesSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".pfl-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".decor-ring-p", {
          scale: 0,
          opacity: 0,
          transformOrigin: "center",
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        })
        .from(".pfl-kicker", { y: 14, opacity: 0, duration: 0.5 }, 0.1)
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0.1)
        .from(".pfl-board", { opacity: 0, y: 30, duration: 0.65 }, 0.3)
        .from(
          ".pfl-split",
          { scaleY: 0, transformOrigin: "top", duration: 0.7, ease: "power2.inOut" },
          0.5,
        )
        .from(".pfl-rule", { scaleX: 0, transformOrigin: "left", duration: 0.6, stagger: 0.16 }, 0.5)
        .from(".pfl-head", { opacity: 0, y: 10, duration: 0.45, stagger: 0.16 }, 0.5)
        .from(
          ".pfl-icon",
          { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.5, stagger: 0.16, ease: "back.out(1.8)" },
          0.55,
        )
        .from(".pfl-item", { opacity: 0, x: 18, duration: 0.5, stagger: 0.09 }, 0.66);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col justify-center gap-10 overflow-hidden px-20 py-12"
    >
      <Decor />

      <header>
        <p className="pfl-kicker mono-label text-clinic">Résultats · Discussion</p>
        <h2 className="pfl-title mt-3 max-w-3xl font-display text-6xl font-light leading-[1.03] text-ink">
          Points forts et limites
        </h2>
      </header>

      <section className="pfl-board relative grid grid-cols-2 items-start gap-16 overflow-hidden rounded-lg border border-hair/60 bg-white/55 px-14 py-12 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        {/* vertical divider between the two halves */}
        <div
          className="pfl-split absolute left-1/2 top-10 bottom-10 w-px -translate-x-1/2 bg-hair/45"
          aria-hidden
        />

        <Panel
          title="Points forts"
          accent="var(--color-clinic-deep)"
          tint="var(--color-clinic-soft)"
          icon={<IconCheck />}
          items={FORTS}
          marker="check"
        />

        <Panel
          title="Limites"
          accent="var(--color-coral)"
          tint="color-mix(in srgb, var(--color-coral) 16%, transparent)"
          icon={<IconAlert />}
          items={LIMITES}
          marker="dash"
        />
      </section>
    </div>
  );
}

function Panel({
  title,
  accent,
  tint,
  icon,
  items,
  marker,
}: {
  title: string;
  accent: string;
  tint: string;
  icon: React.ReactNode;
  items: string[];
  marker: "check" | "dash";
}) {
  return (
    <div className="flex flex-col">
      <div className="pfl-head flex items-center gap-4">
        <span
          className="pfl-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl"
          style={{ background: tint, color: accent }}
          aria-hidden
        >
          {icon}
        </span>
        <h3 className="font-display text-[2.2rem] font-light" style={{ color: accent }}>
          {title}
        </h3>
      </div>
      <span
        className="pfl-rule mt-5 block h-[3px] w-16 rounded-full"
        style={{ background: accent }}
        aria-hidden
      />

      <ul className="mt-10 flex flex-col gap-9">
        {items.map((item) => (
          <li key={item} className="pfl-item flex items-start gap-5">
            <span
              className="mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{ background: tint, color: accent }}
              aria-hidden
            >
              {marker === "check" ? <MarkCheck /> : <MarkDash />}
            </span>
            <p className="text-[25px] leading-[1.7] text-ink">{item}</p>
          </li>
        ))}
      </ul>
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
        <pattern id="med-cross-p" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M25 19v12M19 25h12"
            stroke="var(--color-clinic)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#med-cross-p)" opacity="0.04" />

      <g fill="none" stroke="var(--color-clinic)" strokeWidth="1.5" opacity="0.10">
        {[70, 140, 220, 310].map((r) => (
          <circle key={r} className="decor-ring-p" cx="80" cy="860" r={r} />
        ))}
      </g>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <line x1={12} y1={9} x2={12} y2={13} />
      <line x1={12} y1={17} x2={12} y2={17} />
    </svg>
  );
}

function MarkCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

function MarkDash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
      <path d="M6 12h12" />
    </svg>
  );
}
