/**
 * Le rôle infirmier: a nurse presenting an education leaflet to an adolescent.
 * Flat two-tone illustration. Each revealable group carries `ill-piece` so the
 * host slide's GSAP timeline animates it; this component owns no animation.
 */
export function RoleInfirmier({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      className={className}
      role="img"
      aria-label="Infirmière présentant un support éducatif à un adolescent"
    >
      {/* soft ground */}
      <ellipse cx="180" cy="268" rx="150" ry="16" fill="var(--color-clinic-soft)" opacity="0.55" />

      {/* Nurse (left) */}
      <g className="ill-piece">
        <rect x="66" y="150" width="78" height="104" rx="26" fill="var(--color-clinic)" />
        {/* cross badge */}
        <path d="M98 178h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="var(--color-paper)" />
        {/* head */}
        <circle cx="105" cy="120" r="26" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        {/* hair / cap */}
        <path d="M79 116a26 26 0 0 1 52 0z" fill="var(--color-clinic-deep)" />
        {/* extended arm offering leaflet */}
        <rect x="138" y="172" width="56" height="18" rx="9" fill="var(--color-clinic)" />
      </g>

      {/* Leaflet */}
      <g className="ill-piece">
        <rect x="156" y="150" width="48" height="60" rx="5" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M164 164h32M164 174h32M164 184h22" stroke="var(--color-coral)" strokeWidth="3" strokeLinecap="round" />
        {/* small heart accent */}
        <path d="M180 196c-6-5-12-1-12 4 0 5 12 11 12 11s12-6 12-11c0-5-6-9-12-4z" fill="var(--color-coral)" />
      </g>

      {/* Adolescent (right) */}
      <g className="ill-piece">
        <rect x="222" y="156" width="70" height="98" rx="24" fill="var(--color-coral)" />
        <circle cx="257" cy="126" r="24" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M233 122a24 24 0 0 1 48 0z" fill="var(--color-ink)" />
        {/* arm reaching toward leaflet */}
        <rect x="200" y="178" width="34" height="17" rx="8.5" fill="var(--color-coral)" />
      </g>
    </svg>
  );
}
