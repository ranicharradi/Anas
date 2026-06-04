import { useRef } from "react";
import { gsap, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

export default function TitleSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;
      gsap.from(".reveal", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="flex h-full flex-col justify-center px-20">
      <p className="reveal text-sm uppercase tracking-[0.3em] text-clinic">
        Projet de fin d’études · Licence Nationale en Sciences Infirmières
      </p>

      <h1 className="reveal mt-7 max-w-5xl font-display text-6xl font-light leading-[1.08]">
        Les pratiques éducatives des infirmiers pour la prévention des maladies
        sexuellement transmissibles chez les adolescents
      </h1>

      <div className="reveal mt-12 flex flex-wrap gap-x-16 gap-y-6 text-sm">
        <Field label="Encadré par" value="Dr. Jemai Mohamed Amin" />
        <Field
          label="Présenté par"
          value="Khouéldi Maram · Ben Kahla Mohamed Anas"
        />
        <Field label="Année universitaire" value="2025 – 2026" />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-1.5 text-ink">{value}</p>
    </div>
  );
}
