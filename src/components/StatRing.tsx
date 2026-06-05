import { useRef } from "react";
import { gsap, useGSAP } from "@/deck/gsap";
import { ringPath } from "./chartGeometry";

/**
 * Big single-percentage callout: a ring whose arc draws to the value while the
 * centre number counts up. The deck has many of these (60%, 86%, 94%…) — use
 * one per headline figure.
 */
export function StatRing({
  value,
  label,
  active,
  size = 280,
}: {
  value: number;
  label: string;
  active: boolean;
  size?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const stroke = 14;
  const cx = size / 2;
  const trackPath = ringPath({ value: 100, size, stroke });
  const valuePath = ringPath({ value, size, stroke });

  useGSAP(
    () => {
      if (!active) return;
      const tl = gsap.timeline();
      tl.from(".ring-track", { opacity: 0, duration: 0.4 }).from(
        ".ring-arc",
        {
          opacity: 0,
          rotate: -45,
          scale: 0.9,
          transformOrigin: "center",
          duration: 1.3,
          ease: "power2.out",
        },
        0,
      );

      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: value,
          duration: 1.3,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            if (numRef.current)
              numRef.current.textContent = String(Math.round(counter.v));
          },
        },
        0,
      );
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div
      ref={root}
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <g transform={`translate(${cx} ${cx})`}>
          <path className="ring-track" d={trackPath} fill="var(--color-clinic-soft)" />
          <path className="ring-arc" d={valuePath} fill="var(--color-clinic)" />
        </g>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-7xl leading-none text-ink">
            <span ref={numRef}>0</span>
            <span className="text-clinic">%</span>
          </p>
          <p className="mono-label mt-4 max-w-[16ch] text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
