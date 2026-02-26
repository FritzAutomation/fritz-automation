'use client'

import { useEffect, useState, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const COLUMN_COUNT = 20
const CHARS_PER_COLUMN = 35

function generateChars(count: number): string[] {
  const charset = '0123456789ABCDEF>|{}[];:./\\+=*&^%$#@!'
  const chars: string[] = []
  for (let i = 0; i < count; i++) {
    chars.push(charset[Math.floor(Math.random() * charset.length)])
  }
  return chars
}

export function DataStream() {
  // Default to hidden (mobile) until client hydration
  const [isMobile, setIsMobile] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const columns = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, i) => ({
      id: i,
      chars: generateChars(CHARS_PER_COLUMN),
      opacity: 0.05 + Math.random() * 0.1,
      duration: 15 + Math.random() * 20,
      left: `${(i / COLUMN_COUNT) * 100}%`,
    }))
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile || prefersReducedMotion) return null

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 animate-data-stream font-mono text-emerald-400 text-xs leading-relaxed select-none pointer-events-none whitespace-pre"
          style={{
            left: col.left,
            opacity: col.opacity,
            animationDuration: `${col.duration}s`,
          }}
        >
          {col.chars.map((char, i) => (
            <div key={i}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
