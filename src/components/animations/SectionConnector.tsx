'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SectionConnectorProps {
  height?: number
}

export function SectionConnector({ height = 80 }: SectionConnectorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <div ref={ref} className="flex justify-center" style={{ height }}>
      <svg
        width="2"
        height={height}
        viewBox={`0 0 2 ${height}`}
        className="overflow-visible"
      >
        {/* Dashed background line */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2={height}
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {/* Green glow line that draws on scroll */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2={height}
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray={height}
          strokeDashoffset={isVisible ? 0 : height}
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out',
            filter: 'drop-shadow(0 0 4px #10b981)',
          }}
        />
        {/* Top dot */}
        <circle
          cx="1"
          cy="0"
          r="3"
          fill="#10b981"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            filter: 'drop-shadow(0 0 3px #10b981)',
          }}
        />
        {/* Bottom dot */}
        <circle
          cx="1"
          cy={height}
          r="3"
          fill="#10b981"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out 0.7s',
            filter: 'drop-shadow(0 0 3px #10b981)',
          }}
        />
        {/* Traveling dot */}
        {isVisible && !prefersReducedMotion && (
          <circle
            cx="1"
            cy="0"
            r="2.5"
            fill="#34d399"
            className="connector-dot-travel"
            style={
              { '--connector-height': `${height}px` } as React.CSSProperties
            }
          />
        )}
      </svg>
    </div>
  )
}
