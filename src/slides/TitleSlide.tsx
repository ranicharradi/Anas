import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import logoUniversite from "@/assets/logo-universite-centrale.svg";
import emblemeTunisie from "@/assets/emblem-tunisie.png";
import drapeauTunisie from "@/assets/flag-tunisie.png";

/**
 * Page de garde rebuilt from the original Canva cover (page 1) as real markup,
 * styled in the deck's clinical-editorial language. All text is live; only the
 * institutional logos/emblem/flag are image assets.
 */
export default function TitleSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".cover-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cover-top", { y: -16, opacity: 0, duration: 0.7 })
        .from(".cover-kicker", { y: 16, opacity: 0, duration: 0.6 }, 0.1)
        .from(
          split.words,
          { yPercent: 120, duration: 0.8, stagger: 0.04 },
          0.2,
        )
        .from(
          ".cover-rule",
          { scaleX: 0, transformOrigin: "left", duration: 0.8 },
          0.5,
        )
        .from(
          ".cover-reveal",
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 },
          0.55,
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="flex h-full flex-col px-24 py-14">
      {/* Institutional header */}
      <header className="cover-top flex items-start justify-between">
        <img
          src={logoUniversite}
          alt="Université Centrale, Honoris United Universities"
          className="h-14 w-auto"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-end gap-3">
            <img
              src={emblemeTunisie}
              alt="Emblème de la République Tunisienne"
              className="h-16 w-auto"
            />
            <img
              src={drapeauTunisie}
              alt="Drapeau de la Tunisie"
              className="h-11 w-auto rounded-[2px] shadow-sm"
            />
          </div>
          <p className="text-center text-xs font-medium leading-snug tracking-wide text-muted">
            République Tunisienne
            <br />
            Ministère de l'Enseignement Supérieur
            <br />
            et de la Recherche Scientifique
          </p>
        </div>
      </header>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="cover-kicker mono-label text-clinic">
          Projet de fin d'études
        </p>

        <p className="cover-kicker mt-3 max-w-2xl font-display text-xl italic text-muted">
          En vue de l'obtention du Diplôme de Licence Nationale en Sciences
          Infirmières
        </p>

        <h1 className="cover-title mt-9 max-w-5xl font-display text-[3.35rem] font-light leading-[1.08] text-ink">
          Les pratiques éducatives des infirmiers pour la prévention des
          maladies sexuellement transmissibles chez les adolescents
        </h1>

        <div className="cover-rule mt-10 h-px w-40 bg-coral" />
      </div>

      {/* Credits */}
      <footer className="cover-reveal flex items-end justify-between">
        <Field label="Encadré par" value="Dr. Jemai Mohamed Amin" />

        <p className="mono-label pb-1 text-muted">
          Année universitaire&nbsp;: 2025 – 2026
        </p>

        <Field
          label="Présenté par"
          align="right"
          value={["Khouéldi Maram", "Ben Kahla Mohamed Anas"]}
        />
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string | string[];
  align?: "left" | "right";
}) {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="mono-label text-clinic">{label}</p>
      {values.map((v) => (
        <p key={v} className="mt-1.5 text-[17px] font-medium text-ink">
          {v}
        </p>
      ))}
    </div>
  );
}
