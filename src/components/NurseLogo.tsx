/** Nurse logo: white cap (with a clinical cross), head, and shoulders. The
 *  cap/head/shoulders use `currentColor`; the cross uses `crossColor`. */
export default function NurseLogo({
  className,
  crossColor = "var(--color-clinic)",
}: {
  className?: string;
  crossColor?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M5.3 20.8C5.3 17.2 8.3 15 12 15s6.7 2.2 6.7 5.8a.7.7 0 0 1-.7.7H6a.7.7 0 0 1-.7-.7Z"
        fill="currentColor"
      />
      <circle cx="12" cy="11.6" r="3.1" fill="currentColor" />
      <path
        d="M6.4 9.1C8 6 9.8 4.5 12 4.5s4 1.5 5.6 4.6c.2.4-.1.9-.6.9H7c-.5 0-.8-.5-.6-.9Z"
        fill="currentColor"
      />
      <path
        d="M11.3 5.5h1.4v1h1v1.4h-1v1h-1.4v-1h-1V6.5h1z"
        fill={crossColor}
      />
    </svg>
  );
}
