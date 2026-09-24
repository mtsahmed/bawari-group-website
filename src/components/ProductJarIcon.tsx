/**
 * Recreates the jar illustration from the brand team's
 * "Products & Services Webpage" reference design, using its exact fills.
 */
export function ProductJarIcon({
  accent,
  grain,
  pillLabel,
  className,
}: {
  accent: string;
  grain: string;
  pillLabel: string;
  className?: string;
}) {
  const grainSpots = [
    { cx: 78.1, cy: 87.4, rx: 6.1, ry: 1.9, r: 12 },
    { cx: 69.7, cy: 81.2, rx: 7.1, ry: 2.2, r: -35 },
    { cx: 92.1, cy: 86.4, rx: 6.2, ry: 1.9, r: -34 },
    { cx: 61.0, cy: 63.9, rx: 6.8, ry: 2.1, r: 6 },
    { cx: 82.1, cy: 86.2, rx: 7.7, ry: 2.4, r: -15 },
    { cx: 71.7, cy: 86.0, rx: 7.5, ry: 2.3, r: 24 },
  ];

  return (
    <svg viewBox="0 0 160 232" aria-hidden="true" className={className}>
      <ellipse cx="80" cy="226" rx="56" ry="7" fill="#000000" opacity="0.08" />
      <path
        d="M 25.6,18 C 3.2,40 0.0,68 0.0,94 L 0.0,210 Q 0.0,232 20,232 L 140,232 Q 160,232 160,210 L 160,94 C 160,68 156.8,40 134.4,18 Z"
        fill="#FDFCF8"
        stroke="#E4E0D2"
        strokeWidth="1.5"
      />
      <rect x="25.6" y="2" width="108.8" height="18" rx="4" fill={accent} />
      <line x1="25.6" y1="9" x2="134.4" y2="9" stroke="#FFFFFF" strokeWidth="1" opacity="0.35" />
      <circle cx="80" cy="83.52" r="48" fill="#FBF9F4" stroke="#C99A50" strokeWidth="2.6" />
      <circle cx="80" cy="83.52" r="44" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
      {grainSpots.map((spot, i) => (
        <ellipse
          key={i}
          cx={spot.cx}
          cy={spot.cy}
          rx={spot.rx}
          ry={spot.ry}
          transform={`rotate(${spot.r} ${spot.cx} ${spot.cy})`}
          fill={grain}
          stroke="#B7A472"
          strokeWidth="0.6"
          opacity="0.97"
        />
      ))}
      <rect x="8" y="139.2" width="144" height="46.4" rx="6" fill={accent} />
      <text
        x="80"
        y="168.4"
        textAnchor="middle"
        fontSize={pillLabel.length > 8 ? "14" : "18"}
        fontWeight="bold"
        letterSpacing="1"
        fill="#FFFFFF"
        fontFamily="Georgia, serif"
      >
        {pillLabel}
      </text>
      <text
        x="80"
        y="218"
        textAnchor="middle"
        fontSize="9.5"
        letterSpacing="1.2"
        fill="#6E7674"
        fontFamily="Verdana, Arial, sans-serif"
      >
        BAWARI GROUP
      </text>
    </svg>
  );
}
