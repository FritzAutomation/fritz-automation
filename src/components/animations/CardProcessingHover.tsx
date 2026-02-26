'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

interface CardProcessingHoverProps {
  children: React.ReactNode
  className?: string
}

export function CardProcessingHover({ children, className = '' }: CardProcessingHoverProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`card-processing-hover ${className}`}>
      {children}
    </div>
  )
}
