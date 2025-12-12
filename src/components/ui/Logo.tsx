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

  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect x="4" y="4" width="56" height="56" rx="12" fill="#ef4444" />
      <path d="M22 24L14 32L22 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 24L50 32L42 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 18L28 46" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <div className={className}>
        <LogoIcon />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon />
      <span className={`${textSize} font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent`}>
        Fritz Automation
      </span>
    </div>
  )
}

// For dark backgrounds (same design works on both)
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
      <rect x="4" y="4" width="56" height="56" rx="12" fill="#ef4444" />
      <path d="M22 24L14 32L22 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 24L50 32L42 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 18L28 46" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
