interface FritzLogoProps {
  width?: number
  variant?: 'light' | 'dark'
  className?: string
}

export function FritzLogo({ width = 220, variant = 'light', className = '' }: FritzLogoProps) {
  const height = Math.round(width * (48 / 260))

  const fritzFill = variant === 'dark' ? '#f1f5f9' : '#1e293b'    // slate-100 / slate-800
  const autoFill  = variant === 'dark' ? '#94a3b8' : '#64748b'    // slate-400 / slate-500

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
      <rect x="0" y="4" width="44" height="40" rx="5" fill="#1a1a2e" />
      {/* Title bar */}
      <rect x="0" y="4" width="44" height="13" rx="5" fill="#16213e" />
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

      {/* "Fritz" — bold */}
      <text
        x="56" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={fritzFill}
        letterSpacing="-0.5"
      >
        Fritz
      </text>
      {/* "Automation" — regular weight, subdued */}
      <text
        x="104" y="33"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="400"
        fill={autoFill}
        letterSpacing="-0.3"
      >
        Automation
      </text>
    </svg>
  )
}
