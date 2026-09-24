type ServiceIconName = "customs" | "wholesale" | "label" | "organic";

/** Recreates the "Beyond the grain" icon glyphs from the reference design. */
export function ServiceIcon({
  name,
  accent,
  className,
}: {
  name: ServiceIconName;
  accent: string;
  className?: string;
}) {
  switch (name) {
    case "customs":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
          <circle cx="16" cy="16" r="8" fill="#FFFFFF" />
          <circle cx="16" cy="16" r="3.8" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.75" />
        </svg>
      );
    case "wholesale":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
          <rect x="8" y="14.5" width="7" height="7" rx="1" fill="#FFFFFF" />
          <rect x="17" y="14.5" width="7" height="7" rx="1" fill="#FFFFFF" />
          <rect x="12.5" y="6.5" width="7" height="7" rx="1" fill="#FFFFFF" />
        </svg>
      );
    case "label":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
          <path d="M14 6 L23 15 L15.5 22.5 L6.5 13.5 Z" fill="#FFFFFF" />
          <circle cx="11.5" cy="10.5" r="2.1" fill={accent} />
          <line x1="15.5" y1="15" x2="19.7" y2="19.2" stroke={accent} strokeWidth="1.7" />
        </svg>
      );
    case "organic":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
          <path
            d="M9.5 22.5 Q7 12 18 8 Q21 18 9.5 22.5 Z"
            fill="#FFFFFF"
          />
          <path
            d="M10.9 20.3 Q15.5 15.5 19.5 9.7"
            fill="none"
            stroke={accent}
            strokeWidth="1.6"
            opacity="0.75"
          />
        </svg>
      );
  }
}
