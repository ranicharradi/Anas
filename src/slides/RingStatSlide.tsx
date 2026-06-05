import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { StatRing } from "@/components/StatRing";
import { FigureLabel } from "@/components/FigureLabel";

export default function RingStatSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;
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
      className="grid h-full grid-cols-[1.1fr_0.9fr] items-center gap-16 px-20"
    >
      <div>
        <p className="reveal mono-label text-clinic">Résultats · Attitudes</p>
        <h2 className="headline mt-5 max-w-2xl font-display text-6xl font-light leading-[1.04]">
          Une volonté nette de renforcer les compétences
        </h2>
        <p className="reveal mt-7 max-w-lg text-lg leading-relaxed text-muted">
          94 % des infirmiers souhaitent renforcer leurs compétences en éducation
          aux IST — une prise de conscience de leurs limites actuelles et une
          volonté d’améliorer leurs pratiques professionnelles.
        </p>
        <FigureLabel
          index="07"
          caption="Motivation déclarée à la formation continue"
          className="reveal mt-12 max-w-md"
        />
      </div>

      <div className="reveal grid place-items-center">
        <StatRing
          value={94}
          label="souhaitent se former davantage"
          active={active}
        />
      </div>
    </div>
  );
}
