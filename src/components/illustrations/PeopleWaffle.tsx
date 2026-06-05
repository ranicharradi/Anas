/**
 * People-grid pictograph: a 10×10 array of figures, `value` of them filled in the
 * accent colour (the rest a faint track), so a percentage reads as "X of 100
 * people". Presentational only — no animation. Filled figures carry the class
 * passed as `fillClassName` so the host slide's GSAP timeline can pop them in.
 */
const COLS = 10;
const ROWS = 10;
const CELL_W = 30;
const CELL_H = 32;
const TOTAL = COLS * ROWS;

export function PeopleWaffle({
  value,
  color,
  trackColor = "var(--color-hair)",
  className = "",
  fillClassName = "",
}: {
  value: number;
  color: string;
  trackColor?: string;
  className?: string;
  fillClassName?: string;
}) {
  const filled = Math.max(0, Math.min(TOTAL, Math.round(value)));

  return (
    <svg
      viewBox={`0 0 ${COLS * CELL_W} ${ROWS * CELL_H}`}
      className={className}
      role="img"
      aria-label={`${filled} sur 100`}
    >
      {Array.from({ length: TOTAL }, (_, k) => {
        // Fill bottom-up so the proportion reads like a filling container.
        const x = (k % COLS) * CELL_W;
        const y = (ROWS - 1 - Math.floor(k / COLS)) * CELL_H;
        const on = k < filled;
        const fill = on ? color : trackColor;
        return (
          <g
            key={k}
            transform={`translate(${x} ${y})`}
            className={on ? fillClassName : undefined}
            style={on ? { transformBox: "fill-box", transformOrigin: "center" } : undefined}
            opacity={on ? 1 : 0.4}
          >
            <circle cx={15} cy={9} r={5} fill={fill} />
            <path d="M15 16c-4.6 0-7.6 3.5-7.6 8.4V31h15.2v-6.6C22.6 19.5 19.6 16 15 16z" fill={fill} />
          </g>
        );
      })}
    </svg>
  );
}
