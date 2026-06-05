interface DuotonePhotoProps {
  src: string;
  alt: string;
  /** Classes for the wrapper (size, rounding, ring, etc.). */
  className?: string;
  /** object-position for the cover crop, e.g. "center", "top", "30% 20%". */
  position?: string;
  /** Add a bottom-up scrim for text laid over the image. */
  scrim?: boolean;
}

/**
 * A bundled photo rendered as a teal duotone so stock imagery blends into the
 * deck palette. Pure CSS (grayscale + blended color overlays), so nothing is
 * pre-processed and everything stays offline-safe. Tune the look here once and
 * every slide that uses a photo follows.
 */
export function DuotonePhoto({ src, alt, className = "", position = "center", scrim = false }: DuotonePhotoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.08)_brightness(1.04)]"
        style={{ objectPosition: position }}
      />
      {/* shadows -> deep clinical teal */}
      <div className="pointer-events-none absolute inset-0 bg-clinic-deep mix-blend-multiply opacity-[0.42]" />
      {/* highlights -> soft palette tint */}
      <div className="pointer-events-none absolute inset-0 bg-clinic-soft mix-blend-lighten opacity-[0.34]" />
      {/* gentle overall unify */}
      <div className="pointer-events-none absolute inset-0 bg-clinic mix-blend-soft-light opacity-20" />
      {scrim && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
      )}
    </div>
  );
}
