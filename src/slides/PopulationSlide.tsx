import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Population d'étude (page 9). The four recruitment services as elevated glass
 * tiles, each with a bespoke line icon in a haloed ring. Tiles rise and settle
 * with a back-ease stagger; rings rotate-draw; icons fade in. Nursing theme via
 * the custom medical iconography (uterus, ER cross, microbe, health centre).
 */

interface Service {
  name: string[];
  icon: ReactNode;
}

const SERVICES: Service[] = [
  { name: ["Gynécologie"], icon: <IconGyneco /> },
  { name: ["Urgences"], icon: <IconUrgences /> },
  { name: ["Maladies", "infectieuses"], icon: <IconMicrobe /> },
  { name: ["CSB groupement", "du sud"], icon: <IconClinic /> },
];

export default function PopulationSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".pop-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".pop-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".pop-sub", { y: 16, opacity: 0, duration: 0.5 }, 0.2)
        .from(
          ".svc-card",
          {
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          0.35,
        )
        .from(
          ".svc-ring",
          { rotate: -120, scale: 0.4, opacity: 0, transformOrigin: "center", duration: 0.6, stagger: 0.12 },
          0.5,
        )
        .from(".svc-icon", { opacity: 0, scale: 0.5, transformOrigin: "center", duration: 0.4, stagger: 0.12 }, 0.7)
        .from(".svc-label", { opacity: 0, y: 10, duration: 0.4, stagger: 0.12 }, 0.8);

      // rings keep a slow perpetual spin
      gsap.to(".svc-ring-dash", {
        rotate: 360,
        transformOrigin: "center",
        duration: 22,
        ease: "none",
        repeat: -1,
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="flex h-full flex-col justify-center px-20 py-12">
      <header className="text-center">
        <p className="pop-kicker mono-label text-clinic">02 · Méthodologie</p>
        <h2 className="pop-title mt-3 font-display text-5xl font-light text-ink">
          Population d'étude
        </h2>
        <p className="pop-sub mt-4 text-muted">
          Infirmiers recrutés dans quatre services de soins
        </p>
      </header>

      <div className="mt-14 grid grid-cols-4 gap-7">
        {SERVICES.map((s, i) => (
          <div
            key={s.name.join(" ")}
            className="svc-card group relative flex flex-col items-center rounded-3xl border border-hair/60 bg-white/55 px-6 py-9 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2"
          >
            <span className="mono-label absolute right-5 top-5 text-clinic/40">
              0{i + 1}
            </span>

            <div className="relative grid h-28 w-28 place-items-center">
              {/* animated rings */}
              <svg className="svc-ring absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="var(--color-clinic-soft)" opacity="0.4" />
                <circle
                  className="svc-ring-dash"
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--color-clinic)"
                  strokeWidth="1.5"
                  strokeDasharray="3 7"
                  opacity="0.6"
                />
              </svg>
              <span className="svc-icon relative text-clinic-deep">{s.icon}</span>
            </div>

            <div className="svc-label mt-6 text-center">
              {s.name.map((ln) => (
                <p key={ln} className="text-lg font-semibold leading-snug text-ink">
                  {ln}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- bespoke service icons (44px, clinical line style) ---- */

function IconGyneco() {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4c0 4 1 6 3 7M17 4c0 4-1 6-3 7" />
      <path d="M12 11v9" />
      <path d="M8.5 16h7" />
      <circle cx="7" cy="4" r="1.4" />
      <circle cx="17" cy="4" r="1.4" />
    </svg>
  );
}

function IconUrgences() {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M4 21h16" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

function IconMicrobe() {
  // Virus: core circle, two inner knobs, and radiating spikes with end-dots.
  const spikes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const r1 = 6.5;
    const r2 = 9.5;
    return {
      x1: 12 + r1 * Math.cos(a),
      y1: 12 + r1 * Math.sin(a),
      x2: 12 + r2 * Math.cos(a),
      y2: 12 + r2 * Math.sin(a),
    };
  });
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="10" cy="11" r="1.2" />
      <circle cx="14" cy="13.5" r="1.2" />
      {spikes.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
          <circle cx={s.x2} cy={s.y2} r="0.9" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

function IconClinic() {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V10l9-6 9 6v11" />
      <path d="M3 21h18" />
      <rect x="9" y="14" width="6" height="7" />
      <path d="M12 7.5v3M10.5 9h3" />
    </svg>
  );
}
