'use client'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ variant = 'full', className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  const GearCodeIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Outer gear */}
      <path
        d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
        fill="url(#gearGradient)"
        stroke="#dc2626"
        strokeWidth="2"
      />

      {/* Inner circle cutout */}
      <circle cx="32" cy="30" r="14" fill="#0f172a" />

      {/* Code brackets */}
      <path
        d="M26 24L20 30L26 36"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 24L44 30L38 36"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center dot / cursor */}
      <circle cx="32" cy="30" r="2" fill="#ef4444" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gearGradient" x1="4" y1="4" x2="60" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
    </svg>
  )

  if (variant === 'icon') {
    return (
      <div className={className}>
        <GearCodeIcon />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GearCodeIcon />
      <span className={`${textSize} font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent`}>
        Fritz Automation
      </span>
    </div>
  )
}

// Alternative minimalist version
export function LogoMinimal({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simplified gear with 6 teeth */}
      <path
        d="M32 6L36 10L42 8L46 14L52 14L54 20L60 24L56 32L60 40L54 44L52 50L46 50L42 56L36 54L32 58L28 54L22 56L18 50L12 50L10 44L4 40L8 32L4 24L10 20L12 14L18 14L22 8L28 10L32 6Z"
        fill="none"
        stroke="url(#gearStroke)"
        strokeWidth="3"
      />

      {/* Code brackets */}
      <path
        d="M24 26L18 32L24 38"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 26L46 32L40 38"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Forward slash */}
      <path
        d="M35 24L29 40"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="gearStroke" x1="4" y1="6" x2="60" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Dark background version
export function LogoDark({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gear body */}
      <path
        d="M32 4L36.5 8.5L43 7L46 13L53 13L54 20L60 23.5L57 30L60 36.5L54 40L53 47L46 47L43 53L36.5 51.5L32 56L27.5 51.5L21 53L18 47L11 47L10 40L4 36.5L7 30L4 23.5L10 20L11 13L18 13L21 7L27.5 8.5L32 4Z"
        fill="#ef4444"
      />

      {/* Inner dark circle */}
      <circle cx="32" cy="30" r="16" fill="#0f172a" />

      {/* Code brackets - white for contrast */}
      <path
        d="M26 24L19 30L26 36"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 24L45 30L38 36"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
