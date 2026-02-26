interface FritzLogoProps {
  width?: number
  className?: string
  variant?: 'light' | 'dark'  // light = white navbar, dark = dark footer
}

export function FritzLogo({ width = 220, className = '', variant = 'light' }: FritzLogoProps) {
  const height = Math.round(width * (48 / 260))
  const fritzColor     = variant === 'dark' ? '#00d97e' : '#1e293b'
  const autoColor      = variant === 'dark' ? '#f8fafc' : '#64748b'
  // On dark backgrounds the terminal window (#1a1a2e) blends into footer (#0f172a).
  // A slate-600 stroke lifts it just enough without inverting the whole icon.
  const termStroke     = variant === 'dark' ? '#334155' : 'none'
  const termStrokeW    = variant === 'dark' ? '1' : '0'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 48"
      width={width}
      height={height}
      className={className}
      aria-label="Fritz Automation"
    >
      {/* Terminal window background */}
      <rect x="0" y="4" width="44" height="40" rx="5" fill="#1a1a2e"
            stroke={termStroke} strokeWidth={termStrokeW} />
      {/* Title bar */}
      <rect x="0" y="4" width="44" height="13" rx="5" fill="#16213e"
            stroke={termStroke} strokeWidth={termStrokeW} />
      <rect x="0" y="12" width="44" height="5" fill="#16213e" />
      {/* Traffic light dots */}
      <circle cx="8"  cy="10.5" r="2.2" fill="#ff5f57" />
      <circle cx="15" cy="10.5" r="2.2" fill="#febc2e" />
      <circle cx="22" cy="10.5" r="2.2" fill="#28c840" />
      {/* >_ prompt */}
      <text
        x="6" y="35"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="13"
        fontWeight="700"
        fill="#00d97e"
      >
        {'>_'}
      </text>
      {/* "Fritz" — dark on light navbar, green on dark footer */}
      <text
        x="56" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={fritzColor}
        letterSpacing="-0.5"
      >
        Fritz
      </text>
      {/* "Automation" — slate-500 on light, white on dark */}
      <text
        x="104" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="400"
        fill={autoColor}
        letterSpacing="-0.3"
      >
        Automation
      </text>
    </svg>
  )
}
