'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Ripple {
  id: number
  x: number
  y: number
}

export function CursorEffects() {
  const [position, setPosition] = useState({ x: -9999, y: -9999 })
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [canHover, setCanHover] = useState(false)
  const rippleCounter = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mq = window.matchMedia('(hover: hover)')
    setCanHover(mq.matches)
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!canHover || prefersReducedMotion) return

    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [canHover, prefersReducedMotion])

  const handleClick = useCallback((e: MouseEvent) => {
    if (!canHover || prefersReducedMotion) return

    const id = ++rippleCounter.current
    const newRipple: Ripple = { id, x: e.clientX, y: e.clientY }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [canHover, prefersReducedMotion])

  useEffect(() => {
    if (!canHover || prefersReducedMotion) return

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [canHover, prefersReducedMotion, handleClick])

  if (!canHover || prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {/* Cursor glow */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full transition-transform duration-[50ms]"
        style={{
          left: position.x - 150,
          top: position.y - 150,
          background: 'radial-gradient(circle, rgba(0,217,126,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Click ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute animate-cursor-ripple rounded-full border-2 border-primary/40"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  )
}
