interface FritzLogoProps {
  width?: number
  className?: string
  /** @deprecated Logo now flips with the active theme. Prop kept for back-compat. */
  variant?: 'light' | 'dark'
}

export function FritzLogo({ width = 220, className = '' }: FritzLogoProps) {
  const height = Math.round(width * (48 / 260))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 48"
      width={width}
      height={height}
      className={`fritz-logo ${className}`}
      aria-label="Fritz Automation"
    >
      <defs>
        <style>{`
          .fritz-logo .term-bg     { fill: var(--bg-card); stroke: var(--line); stroke-width: 1; }
          .fritz-logo .term-bar    { fill: var(--surface-strong); }
          .fritz-logo .dot-r       { fill: var(--traffic-r); }
          .fritz-logo .dot-y       { fill: var(--traffic-y); }
          .fritz-logo .dot-g       { fill: var(--traffic-g); }
          .fritz-logo .prompt      { fill: var(--accent); }
          .fritz-logo .name-fritz  { fill: var(--heading); }
          .fritz-logo .name-auto   { fill: var(--accent); }
        `}</style>
      </defs>
      {/* Terminal window */}
      <rect className="term-bg" x="0" y="4" width="44" height="40" rx="5" />
      {/* Title bar */}
      <rect className="term-bar" x="0" y="4" width="44" height="13" rx="5" />
      <rect className="term-bar" x="0" y="12" width="44" height="5" />
      {/* Traffic light dots */}
      <circle className="dot-r" cx="8"  cy="10.5" r="2.2" />
      <circle className="dot-y" cx="15" cy="10.5" r="2.2" />
      <circle className="dot-g" cx="22" cy="10.5" r="2.2" />
      {/* >_ prompt */}
      <text
        className="prompt"
        x="6" y="35"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="13"
        fontWeight="700"
      >
        {'>_'}
      </text>
      {/* "Fritz" — heading color (white on dark, ink on paper) */}
      <text
        className="name-fritz"
        x="56" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        Fritz
      </text>
      {/* "Automation" — accent color (emerald / amber / oxblood) */}
      <text
        className="name-auto"
        x="104" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="400"
        letterSpacing="-0.3"
      >
        Automation
      </text>
    </svg>
  )
}
