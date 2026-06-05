import { useRef } from "react";
import { smoothLinePath } from "@/components/chartGeometry";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import { DuotonePhoto } from "@/components/DuotonePhoto";
import nurseTablet from "@/assets/photos/nurse-tablet.jpg";

const DOTS = Array.from({ length: 54 }, (_, i) => {
  const row = Math.floor(i / 9);
  const col = i % 9;
  return {
    x: 120 + col * 46 + (row % 2) * 18,
    y: 108 + row * 44,
    r: 4 + ((i * 7) % 5),
  };
});

const RESULT_AXIS = smoothLinePath([
  [76, 390],
  [170, 260],
  [244, 332],
  [328, 224],
  [408, 122],
  [482, 176],
  [544, 88],
]);

export default function ResultatsDiscussionSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".rd-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".rd-panel", { xPercent: -100, duration: 0.9, ease: "power4.out" })
        .from(".rd-03", { opacity: 0, scale: 0.72, duration: 0.9 }, 0.15)
        .from(".rd-kicker", { opacity: 0, y: 16, duration: 0.5 }, 0.35)
        .from(split.words, { yPercent: 120, duration: 0.75, stagger: 0.055 }, 0.42)
        .from(".rd-rule", { scaleX: 0, transformOrigin: "left", duration: 0.7 }, 0.72)
        .from(".rd-copy", { y: 18, opacity: 0, duration: 0.55 }, 0.8)
        .from(".rd-axis", { drawSVG: "0%", duration: 1.3, ease: "power2.inOut" }, 0.25)
        .from(".rd-dot", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.55, stagger: 0.018, ease: "back.out(2)" }, 0.55)
        .from(".rd-card", { y: 28, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.9)
        .from(".res-photo", { opacity: 0, scale: 0.96, transformOrigin: "center", duration: 0.7 }, 0.2);

      gsap.to(".rd-scan", {
        x: 410,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="relative grid h-full grid-cols-[0.92fr_1.08fr] overflow-hidden">
      <section className="rd-panel relative flex flex-col justify-center overflow-hidden bg-clinic-deep px-20 text-paper">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
          <defs>
            <pattern id="rd-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M42 0H0V42" fill="none" stroke="white" strokeWidth="1" />
              <path d="M21 14v14M14 21h14" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rd-grid)" />
        </svg>

        <span className="rd-03 pointer-events-none absolute -bottom-16 right-6 font-display text-[20rem] font-light leading-none text-paper/10">
          03
        </span>
        <p className="rd-kicker mono-label text-clinic-soft">Troisième partie</p>
        <h2 className="rd-title mt-4 max-w-xl font-display text-7xl font-light leading-[0.96]">
          Résultat et discussion
        </h2>
        <div className="rd-rule mt-8 h-[3px] w-28 bg-coral" />
        <p className="rd-copy mt-8 max-w-md text-xl leading-relaxed text-paper/75">
          Lecture des profils, des connaissances, des attitudes et des pratiques
          éducatives infirmières face aux IST chez les adolescents.
        </p>
      </section>

      <section className="relative grid place-items-center px-14">
        <DuotonePhoto
          src={nurseTablet}
          alt="Infirmière consultant une tablette"
          position="top"
          className="res-photo absolute right-8 top-10 h-28 w-44 rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
        />
        <div className="relative h-[560px] w-[620px]">
          <svg viewBox="0 0 620 560" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="rd-axis-grad" x1="80" x2="540" y1="310" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--color-clinic)" />
                <stop offset="0.55" stopColor="var(--color-coral)" />
                <stop offset="1" stopColor="var(--color-clinic-deep)" />
              </linearGradient>
              <filter id="rd-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              className="rd-axis"
              d={RESULT_AXIS}
              fill="none"
              stroke="url(#rd-axis-grad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line className="rd-scan" x1="82" x2="82" y1="72" y2="438" stroke="var(--color-coral)" strokeWidth="2" strokeOpacity="0.45" filter="url(#rd-glow)" />
            {DOTS.map((d, i) => (
              <circle
                key={i}
                className="rd-dot"
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill={i % 4 === 0 ? "var(--color-coral)" : "var(--color-clinic)"}
                opacity={0.75}
              />
            ))}
          </svg>

          <div className="rd-card absolute left-2 top-8 rounded-lg border border-hair/60 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-sm">
            <p className="mono-label text-clinic">Axe 01</p>
            <p className="mt-1 text-lg font-semibold text-ink">Profil</p>
          </div>
          <div className="rd-card absolute right-10 top-36 rounded-lg border border-hair/60 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-sm">
            <p className="mono-label text-clinic">Axe 02</p>
            <p className="mt-1 text-lg font-semibold text-ink">Connaissances</p>
          </div>
          <div className="rd-card absolute bottom-24 left-20 rounded-lg border border-hair/60 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-sm">
            <p className="mono-label text-clinic">Axe 03</p>
            <p className="mt-1 text-lg font-semibold text-ink">Attitudes</p>
          </div>
          <div className="rd-card absolute bottom-12 right-2 rounded-lg border border-hair/60 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-sm">
            <p className="mono-label text-clinic">Axe 04</p>
            <p className="mt-1 text-lg font-semibold text-ink">Pratiques</p>
          </div>
        </div>
      </section>
    </div>
  );
}
