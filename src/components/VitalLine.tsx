import { useRef } from "react";
import { gsap, useGSAP } from "@/deck/gsap";

/** Build an ECG-style baseline with `beats` QRS complexes across the viewBox. */
function ecgPath(width: number, mid: number, beats: number): string {
  const gap = width / beats;
  let d = `M0 ${mid}`;
  for (let i = 0; i < beats; i++) {
    const c = i * gap + gap * 0.5;
    d +=
      ` L${c - 22} ${mid}` + // flat approach
      ` L${c - 12} ${mid - 4}` + // P
      ` L${c - 4} ${mid + 16}` + // Q
      ` L${c + 3} ${mid - 26}` + // R spike
      ` L${c + 10} ${mid + 8}` + // S
      ` L${c + 20} ${mid}` + // back to baseline
      ` L${i * gap + gap} ${mid}`;
  }
  return d;
}

/**
 * Signature motif for data slides: a faint vital-sign trace that draws itself in
 * left-to-right on enter (DrawSVGPlugin), with a pulse dot riding the line.
 */
export function VitalLine({ active }: { active: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  const W = 600;
  const H = 48;
  const d = ecgPath(W, H / 2, 4);

  useGSAP(
    () => {
      if (!active) return;
      gsap.fromTo(
        ".ecg-trace",
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: 2.2, ease: "power1.inOut" },
      );
      gsap.fromTo(
        ".ecg-pulse",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.3 },
      );
      gsap.to(".ecg-pulse", {
        keyframes: { scale: [1, 1.9, 1] },
        transformOrigin: "center",
        repeat: -1,
        duration: 1.4,
        ease: "power2.out",
        delay: 0.6,
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      className="h-12 w-full"
      aria-hidden
    >
      <line
        x1="0"
        x2={W}
        y1={H / 2}
        y2={H / 2}
        stroke="var(--color-hair)"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <path
        className="ecg-trace"
        d={d}
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        className="ecg-pulse"
        cx={W - 8}
        cy={H / 2}
        r="3.5"
        fill="var(--color-coral)"
      />
    </svg>
  );
}
