'use client'

import { useEffect, useRef, useState, createElement, type ElementType } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CHARS = '!@#$%^&*ABCDEFxyz0123456789'

interface TextScrambleProps {
  text: string
  as?: ElementType
  className?: string
  duration?: number
  delay?: number
}

export function TextScramble({
  text,
  as: Tag = 'span',
  className,
  duration = 800,
  delay = 0,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(el)
          // Start scramble after delay
          const delayTimer = setTimeout(() => {
            scramble()
          }, delay)
          return () => clearTimeout(delayTimer)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion, hasAnimated, delay])

  function scramble() {
    const length = text.length
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Number of characters that have settled (left-to-right)
      const settled = Math.floor(progress * length)

      let result = ''
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          result += ' '
        } else if (i < settled) {
          result += text[i]
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }

      setDisplay(result)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplay(text)
        setHasAnimated(true)
      }
    }

    requestAnimationFrame(tick)
  }

  return createElement(
    Tag,
    { ref, className, 'aria-label': text },
    display
  )
}
