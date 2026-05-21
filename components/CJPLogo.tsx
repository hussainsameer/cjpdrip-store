type Props = {
  height?: number;
  showText?: boolean;
};

/**
 * Inline SVG version of the Cockroach Janta Party logo.
 * - Cockroach inside a circle with tricolor (saffron-top, green-bottom) arcs.
 * - Wordmark beside it (optional).
 * No image file required.
 */
export default function CJPLogo({ height = 44, showText = true }: Props) {
  const viewW = showText ? 600 : 200;
  const viewH = 200;
  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      height={height}
      width={(viewW / viewH) * height}
      role="img"
      aria-label="Cockroach Janta Party"
      style={{ display: 'block' }}
    >
      <LogoMark />
      {showText && (
        <g transform="translate(220, 22)" fontFamily="Antonio, Impact, sans-serif" fontWeight={700} letterSpacing="0.5">
          <text x="0" y="60" fontSize="64" fill="#1A1714">COCKROACH</text>
          <text x="0" y="120" fontSize="64" fill="#1A1714">JANTA</text>
          <text x="0" y="180" fontSize="64" fill="#1A1714">PARTY</text>
        </g>
      )}
    </svg>
  );
}

/** Compact icon-only version (for favicons, badges, small spots) */
export function CJPLogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="CJP Mark" style={{ display: 'block' }}>
      <LogoMark />
    </svg>
  );
}

function LogoMark() {
  return (
    <g>
      {/* Outer circle frame */}
      <circle cx="100" cy="100" r="86" fill="#EFE6D2" stroke="#1A1714" strokeWidth="2.5" />
      {/* Saffron arc (top-right) */}
      <path
        d="M 100 14 A 86 86 0 0 1 186 100"
        fill="none"
        stroke="#FF9933"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Green arc (bottom-left) */}
      <path
        d="M 14 100 A 86 86 0 0 1 100 186"
        fill="none"
        stroke="#138808"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Cockroach inside */}
      <g transform="translate(100,108)">
        {/* antennae forming a V */}
        <path d="M -10 -42 Q -28 -68 -42 -78" fill="none" stroke="#1A1714" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 10 -42 Q 28 -68 42 -78" fill="none" stroke="#1A1714" strokeWidth="4.5" strokeLinecap="round" />

        {/* body — teardrop oval */}
        <ellipse cx="0" cy="6" rx="32" ry="46" fill="#5C2E14" />
        {/* head ellipse, slightly above body */}
        <ellipse cx="0" cy="-32" rx="22" ry="14" fill="#5C2E14" />

        {/* dark horizontal band across upper body — the signature stripe */}
        <rect x="-22" y="-14" width="44" height="10" rx="2" fill="#1A1714" />

        {/* center wing line */}
        <line x1="0" y1="-2" x2="0" y2="48" stroke="#3a1d0c" strokeWidth="1.2" opacity="0.5" />

        {/* legs — short subtle */}
        <path d="M -28 -10 L -42 -16" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        <path d="M -30 6 L -46 8" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        <path d="M -28 22 L -42 32" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        <path d="M 28 -10 L 42 -16" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        <path d="M 30 6 L 46 8" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        <path d="M 28 22 L 42 32" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}
