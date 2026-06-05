import { useRef } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { gsap, useGSAP } from "@/deck/gsap";

export interface Datum {
  label: string;
  /** Percentage, 0–100. */
  value: number;
}

/**
 * Hand-built SVG bar chart, animated with GSAP rather than a charting library —
 * libraries own their own render cycle and fight GSAP. d3-scale handles only the
 * tick/position math. On enter: gridlines fade, baseline draws across, bars rise
 * with a slight overshoot, and the value labels count up from 0.
 */
export function BarChart({ data, active }: { data: Datum[]; active: boolean }) {
  const root = useRef<SVGSVGElement>(null);

  const W = 760;
  const H = 420;
  const m = { top: 38, right: 8, bottom: 82, left: 8 };

  const x = scaleBand<string>()
    .domain(data.map((d) => d.label))
    .range([m.left, W - m.right])
    .padding(0.38);
  const y = scaleLinear().domain([0, 100]).range([H - m.bottom, m.top]);
  const ticks = [0, 25, 50, 75, 100];
  const baseline = y(0);

  useGSAP(
    () => {
      if (!active) return;
      const tl = gsap.timeline();

      tl.from(".grid-line", {
        scaleX: 0,
        transformOrigin: "left",
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      })
        .from(".axis-base", { drawSVG: 0, duration: 0.6, ease: "power2.inOut" }, 0)
        .from(
          ".bar",
          {
            scaleY: 0,
            transformOrigin: "bottom",
            duration: 0.85,
            ease: "back.out(1.5)",
            stagger: 0.08,
          },
          0.25,
        )
        .from(
          ".bar-label",
          { opacity: 0, y: 8, duration: 0.4, stagger: 0.08 },
          0.45,
        );

      // Count the value labels up from zero, snapped to whole percents.
      root.current
        ?.querySelectorAll<SVGTextElement>(".bar-value")
        .forEach((node) => {
          const target = Number(node.dataset.value);
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: target,
              duration: 0.85,
              ease: "power1.out",
              snap: { v: 1 },
              onUpdate: () => {
                node.textContent = `${Math.round(counter.v)}%`;
              },
            },
            0.45,
          );
        });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <svg ref={root} viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* gridlines + tick labels */}
      {ticks.map((t) => (
        <g key={t}>
          <line
            className="grid-line"
            x1={m.left}
            x2={W - m.right}
            y1={y(t)}
            y2={y(t)}
            stroke="var(--color-hair)"
            strokeOpacity={t === 0 ? 0 : 0.45}
            strokeDasharray={t === 0 ? undefined : "2 5"}
          />
          <text
            x={m.left}
            y={y(t) - 6}
            fontSize={12}
            className="mono-label"
            fill="var(--color-muted)"
          >
            {t}
          </text>
        </g>
      ))}

      <line
        className="axis-base"
        x1={m.left}
        x2={W - m.right}
        y1={baseline}
        y2={baseline}
        stroke="var(--color-ink)"
        strokeWidth={1.25}
      />

      {data.map((d) => {
        const bx = x(d.label)!;
        const bw = x.bandwidth();
        const by = y(d.value);
        const bh = baseline - by;
        return (
          <g key={d.label}>
            <rect
              className="bar"
              x={bx}
              y={by}
              width={bw}
              height={bh}
              rx={6}
              fill="var(--color-clinic)"
            />
            <text
              className="bar-value"
              data-value={d.value}
              x={bx + bw / 2}
              y={by - 12}
              textAnchor="middle"
              fontSize={20}
              fontWeight={600}
              fill="var(--color-clinic-deep)"
            >
              {d.value}%
            </text>
            <text
              className="bar-label"
              x={bx + bw / 2}
              y={H - m.bottom + 26}
              textAnchor="middle"
              fontSize={14}
              fill="var(--color-muted)"
            >
              {d.label.split(" ").map((part, i) => (
                <tspan key={`${d.label}-${part}`} x={bx + bw / 2} dy={i === 0 ? 0 : 17}>
                  {part}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
