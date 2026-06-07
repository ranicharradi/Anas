import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { BarChart, type Datum } from "@/components/BarChart";
import { FigureLabel } from "@/components/FigureLabel";
import { VitalLine } from "@/components/VitalLine";

// NOTE: only the 86% headline figure comes from the study. The remaining values
// are PLACEHOLDERS to demonstrate the chart pattern — replace with real data.
const signesCliniques: Datum[] = [
  { label: "Brûlure miction", value: 86 },
  { label: "Écoulement", value: 78 },
  { label: "Plaies génitales", value: 72 },
  { label: "Douleurs abdo.", value: 61 },
  { label: "Fièvre", value: 54 },
  { label: "Démangeaisons", value: 49 },
];

export default function StatSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      // Word-staggered, line-clipped reveal of the display heading.
      const split = new SplitText(".headline", {
        type: "lines,words",
        linesClass: "split-line",
      });
      gsap.from(split.words, {
        yPercent: 120,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
      });

      gsap.from(".reveal", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="grid h-full grid-cols-[0.85fr_1.15fr] items-center gap-16 px-20"
    >
      <div>
        <p className="reveal mono-label text-clinic">Résultats · Connaissances</p>
        <h2 className="headline mt-5 max-w-xl font-display text-6xl font-light leading-[1.04]">
          Identification des signes cliniques des IST
        </h2>
        <p className="reveal mt-7 max-w-lg text-xl leading-relaxed text-muted">
          Les professionnels reconnaissent plus facilement les signes évidents
          que les symptômes atypiques — un constat conforme aux données du CDC.
        </p>
        <div className="reveal mt-12 max-w-md opacity-80">
          <VitalLine active={active} />
        </div>
      </div>

      <figure className="reveal">
        <BarChart data={signesCliniques} active={active} />
        <FigureLabel
          index="04"
          caption="Taux de reconnaissance par signe clinique (n = 100)"
          className="reveal mt-2"
        />
      </figure>
    </div>
  );
}
