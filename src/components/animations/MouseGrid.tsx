'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function MouseGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(true) // SSR-safe default

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window
      setIsMobile(mobile)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DOT_RADIUS = 1.5
    const BASE_ALPHA = 0.07
    const HOVER_ALPHA = 0.3
    const PROXIMITY = 150
    const SPACING_X = 50
    const SPACING_Y = 50

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = parent.clientWidth * dpr
      canvas.height = parent.clientHeight * dpr
      canvas.style.width = `${parent.clientWidth}px`
      canvas.style.height = `${parent.clientHeight}px`
      ctx.scale(dpr, dpr)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.parentElement!)
    resize()

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    canvas.parentElement!.addEventListener('mousemove', onMouseMove)
    canvas.parentElement!.addEventListener('mouseleave', onMouseLeave)

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let x = SPACING_X; x < w; x += SPACING_X) {
        for (let y = SPACING_Y; y < h; y += SPACING_Y) {
          const dx = x - mx
          const dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const alpha = dist < PROXIMITY
            ? BASE_ALPHA + (HOVER_ALPHA - BASE_ALPHA) * (1 - dist / PROXIMITY)
            : BASE_ALPHA

          ctx.beginPath()
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      resizeObserver.disconnect()
      canvas.parentElement?.removeEventListener('mousemove', onMouseMove)
      canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [isMobile, prefersReducedMotion])

  if (isMobile || prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
