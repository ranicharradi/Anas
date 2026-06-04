/**
 * Éducation de groupe: a nurse beside a flip-chart presenting to two adolescent
 * learners. Flat two-tone; quiet backdrop behind the slide's card grid. Each
 * revealable group carries `ill-piece` (host slide animates).
 */
export function EducationGroupe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 560"
      className={className}
      role="img"
      aria-label="Infirmière animant une séance d'éducation de groupe"
    >
      {/* ground */}
      <ellipse cx="360" cy="500" rx="320" ry="22" fill="var(--color-clinic-soft)" opacity="0.5" />

      {/* Flip-chart / board */}
      <g className="ill-piece">
        <rect x="70" y="120" width="180" height="220" rx="10" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3" />
        <path d="M100 170h120M100 200h120M100 230h80" stroke="var(--color-clinic)" strokeWidth="6" strokeLinecap="round" />
        {/* coral bar mimicking a chart on the board */}
        <rect x="100" y="262" width="36" height="46" rx="4" fill="var(--color-coral)" />
        <rect x="146" y="280" width="36" height="28" rx="4" fill="var(--color-clinic)" />
        {/* easel legs */}
        <path d="M96 340l-22 70M224 340l22 70" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Nurse presenting (teal) */}
      <g className="ill-piece">
        <rect x="300" y="270" width="86" height="150" rx="30" fill="var(--color-clinic)" />
        <path d="M334 300h10v10h10v10h-10v10h-10v-10h-10v-10h10z" fill="var(--color-paper)" />
        <circle cx="343" cy="232" r="30" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M313 228a30 30 0 0 1 60 0z" fill="var(--color-clinic-deep)" />
        {/* pointing arm toward board */}
        <rect x="262" y="298" width="48" height="18" rx="9" fill="var(--color-clinic)" transform="rotate(-12 286 307)" />
      </g>

      {/* Adolescent learners (coral), seated right */}
      <g className="ill-piece">
        <rect x="470" y="330" width="72" height="98" rx="26" fill="var(--color-coral)" />
        <circle cx="506" cy="300" r="24" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M482 296a24 24 0 0 1 48 0z" fill="var(--color-ink)" />
      </g>
      <g className="ill-piece">
        <rect x="560" y="346" width="68" height="92" rx="24" fill="var(--color-coral)" opacity="0.8" />
        <circle cx="594" cy="318" r="22" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M572 314a22 22 0 0 1 44 0z" fill="var(--color-clinic-deep)" />
      </g>
    </svg>
  );
}
