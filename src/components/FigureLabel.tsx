/**
 * Monograph chrome: a figure index ("Fig. 02") with a hairline and an italic
 * caption. Pure layout, no animation — slides animate it via the `.reveal` class
 * if they want.
 */
export function FigureLabel({
  index,
  caption,
  className = "",
}: {
  index: string;
  caption: string;
  className?: string;
}) {
  return (
    <figcaption className={`flex items-baseline gap-4 ${className}`}>
      <span className="mono-label whitespace-nowrap text-clinic">
        Fig. {index}
      </span>
      <span className="h-px flex-1 translate-y-[-3px] bg-hair" />
      <span className="font-display text-base italic text-muted">{caption}</span>
    </figcaption>
  );
}
