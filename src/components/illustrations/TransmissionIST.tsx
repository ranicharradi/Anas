/**
 * Transmission des IST: two routes matching the slide's two stat cards —
 * partner→partner (top, coral) and parent→infant (bottom, clinic). Weighted to
 * the left so the right third stays quiet behind the overlaid cards. Flat
 * two-tone; each revealable group carries `ill-piece` (host slide animates).
 */
export function TransmissionIST({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 660 560"
      className={className}
      role="img"
      aria-label="Schéma de transmission des IST: au partenaire et de la mère à l'enfant"
    >
      <defs>
        <marker id="trans-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
          <path d="M0 0l6 3-6 3z" fill="var(--color-ink)" opacity="0.55" />
        </marker>
      </defs>

      {/* faint cross texture, left field only */}
      <g stroke="var(--color-clinic)" strokeWidth="1.1" strokeLinecap="round" opacity="0.12">
        {[60, 140, 220, 300].map((y) =>
          [50, 130, 210, 290].map((x) => (
            <path key={`${x}-${y}`} d={`M${x} ${y - 6}v12M${x - 6} ${y}h12`} />
          )),
        )}
      </g>

      {/* Row 1: partner -> partner (coral) */}
      <g className="ill-piece">
        <circle cx="90" cy="150" r="34" fill="var(--color-coral)" />
        <circle cx="90" cy="120" r="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx="250" cy="150" r="34" fill="var(--color-coral)" opacity="0.55" />
        <circle cx="250" cy="120" r="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M134 140h78" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#trans-arrow)" opacity="0.55" />
      </g>

      {/* Row 2: parent -> infant (clinic) */}
      <g className="ill-piece">
        <circle cx="90" cy="380" r="38" fill="var(--color-clinic)" />
        <circle cx="90" cy="346" r="17" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        {/* infant: smaller figure */}
        <circle cx="248" cy="392" r="24" fill="var(--color-clinic-deep)" />
        <circle cx="248" cy="370" r="11" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M134 374h74" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#trans-arrow)" opacity="0.55" />
      </g>
    </svg>
  );
}
