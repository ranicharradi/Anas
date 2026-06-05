/**
 * Ranked horizontal bar chart: aligned labels on the left, bars on a shared
 * 0–100 axis, values on the right — so several proportions read as one
 * comparison instead of separate gauges. Presentational only; the host slide
 * drives animation through the class hooks passed in (`barClassName` for the
 * grow tween, `countClassName` + `data-to` for the count-up, `rowClassName` for
 * the row entrance).
 */
export function RankedBars({
  data,
  className = "",
  rowClassName = "",
  barClassName = "",
  countClassName = "",
}: {
  data: { label: string; value: number; color: string }[];
  className?: string;
  rowClassName?: string;
  barClassName?: string;
  countClassName?: string;
}) {
  return (
    <div className={className}>
      {data.map((d) => (
        <div
          key={d.label}
          className={`${rowClassName} grid grid-cols-[8.5rem_1fr_3.2rem] items-center gap-4`}
        >
          <span className="text-[13px] font-semibold leading-tight text-ink">{d.label}</span>
          <div className="h-7 rounded-md bg-hair/25">
            <div
              className={`${barClassName} h-full rounded-md`}
              style={{ width: `${d.value}%`, background: d.color }}
            />
          </div>
          <span
            className="text-right font-display text-xl font-light leading-none"
            style={{ color: d.color }}
          >
            <span className={countClassName} data-to={d.value}>0</span>%
          </span>
        </div>
      ))}
    </div>
  );
}
