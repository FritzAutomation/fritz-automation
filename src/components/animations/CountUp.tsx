'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({ end, suffix = '', duration = 2000, className }: CountUpProps) {
  const [display, setDisplay] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const animate = useCallback(() => {
    if (hasAnimated) return
    setHasAnimated(true)

    if (prefersReducedMotion) {
      setDisplay(end.toLocaleString('en-US'))
      return
    }

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * end)
      setDisplay(current.toLocaleString('en-US'))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [end, duration, prefersReducedMotion, hasAnimated])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If reduced motion, show final value immediately
    if (prefersReducedMotion) {
      setDisplay(end.toLocaleString('en-US'))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate, prefersReducedMotion, end])

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  )
}
