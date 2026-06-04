import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";

/**
 * Méthodologie — act divider (page 7). A bold split: deep-clinic panel with an
 * oversized "02" and the act title, beside an animated DNA double-helix (the
 * strands draw themselves in, rungs pop, then the whole helix breathes). Pushes
 * the deck's clinical-science theme while staying on the teal/coral/paper tokens.
 */

const HELIX = (() => {
  const H = 560;
  const A = 70; // strand amplitude
  const cx = 90;
  const turns = 2.4;
  const steps = 60;
  const ptsA: [number, number][] = [];
  const ptsB: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const y = (i / steps) * H;
    ptsA.push([cx + A * Math.sin(t), y]);
    ptsB.push([cx + A * Math.sin(t + Math.PI), y]);
  }
  const toPath = (p: [number, number][]) =>
    p.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  // rungs at every 4th step
  const rungs: { x1: number; y1: number; x2: number; y2: number; mid: number }[] =
    [];
  for (let i = 2; i <= steps - 2; i += 4) {
    rungs.push({
      x1: ptsA[i][0],
      y1: ptsA[i][1],
      x2: ptsB[i][0],
      y2: ptsB[i][1],
      mid: (ptsA[i][0] + ptsB[i][0]) / 2,
    });
  }
  return { H, W: cx + A + 10, dA: toPath(ptsA), dB: toPath(ptsB), rungs };
})();

export default function MethodoSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".md-title", { type: "chars" });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".md-panel", { xPercent: -100, duration: 0.9, ease: "power4.out" })
        .from(".md-02", { opacity: 0, scale: 0.7, duration: 0.9 }, 0.2)
        .from(".md-kicker", { opacity: 0, y: 16, duration: 0.5 }, 0.5)
        .from(
          split.chars,
          { opacity: 0, yPercent: 110, duration: 0.6, stagger: 0.04 },
          0.55,
        )
        .from(
          ".helix-strand",
          { drawSVG: "0%", duration: 1.4, ease: "power1.inOut", stagger: 0.15 },
          0.3,
        )
        .from(
          ".helix-rung",
          { scaleX: 0, opacity: 0, transformOrigin: "center", duration: 0.4, stagger: 0.04 },
          0.9,
        )
        .from(
          ".helix-node",
          { scale: 0, transformOrigin: "center", duration: 0.4, stagger: 0.02 },
          1,
        );

      // gentle perpetual breathe of the helix
      gsap.to(".helix-wrap", {
        rotateY: 12,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center",
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root} className="relative grid h-full grid-cols-[1.15fr_0.85fr] overflow-hidden">
      {/* Left: deep clinical panel */}
      <div className="md-panel relative flex flex-col justify-center overflow-hidden bg-clinic-deep px-20 text-paper">
        {/* faint cross texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
          <defs>
            <pattern id="md-cross" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M23 17v12M17 23h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#md-cross)" />
        </svg>

        <span className="md-02 pointer-events-none absolute -bottom-16 right-6 font-display text-[20rem] font-light leading-none text-paper/10">
          02
        </span>

        <p className="md-kicker mono-label text-clinic-soft">Deuxième partie</p>
        <h2 className="md-title mt-4 font-display text-7xl font-light leading-none">
          Méthodologie
        </h2>
        <div className="md-kicker mt-8 h-[3px] w-28 bg-coral" />
        <p className="md-kicker mt-8 max-w-sm leading-relaxed text-paper/70">
          Conception de l'enquête, terrain d'étude, population ciblée et outil de
          collecte des données.
        </p>
      </div>

      {/* Right: DNA helix on paper */}
      <div className="relative grid place-items-center">
        <div className="helix-wrap" style={{ perspective: 800 }}>
          <svg
            viewBox={`0 0 ${HELIX.W} ${HELIX.H}`}
            className="h-[78vh] max-h-[640px] w-auto overflow-visible"
            aria-hidden
          >
            {HELIX.rungs.map((r, i) => (
              <g key={i}>
                <line
                  className="helix-rung"
                  x1={r.x1}
                  y1={r.y1}
                  x2={r.x2}
                  y2={r.y2}
                  stroke={i % 2 ? "var(--color-coral)" : "var(--color-clinic)"}
                  strokeWidth={2.5}
                  strokeOpacity={0.55}
                />
              </g>
            ))}
            <path
              className="helix-strand"
              d={HELIX.dA}
              fill="none"
              stroke="var(--color-clinic)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <path
              className="helix-strand"
              d={HELIX.dB}
              fill="none"
              stroke="var(--color-clinic-deep)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {HELIX.rungs.map((r, i) => (
              <g key={`n${i}`}>
                <circle className="helix-node" cx={r.x1} cy={r.y1} r={5} fill="var(--color-clinic)" />
                <circle className="helix-node" cx={r.x2} cy={r.y2} r={5} fill="var(--color-clinic-deep)" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
