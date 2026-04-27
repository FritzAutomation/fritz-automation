'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Subtle on-scroll fade-in. Designed to never flash:
 *   - SSR renders fully visible (no hidden content for crawlers / JS-off users)
 *   - On mount, if the element is already in the initial viewport, it stays
 *     visible — no animation is applied.
 *   - If the element is below the fold, it's hidden and revealed via
 *     IntersectionObserver as the visitor scrolls to it.
 * That means no first-paint flash for above-the-fold content, and a
 * gentle rise for sections farther down.
 */
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    // Element is at least partly in the initial viewport — leave it alone.
    if (rect.top < vh - 60) return

    // Below the fold — hide and observe.
    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={
        state === 'hidden'
          ? { opacity: 0, transform: 'translateY(16px)', transition: 'none' }
          : state === 'shown'
            ? {
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }
            : undefined
      }
    >
      {children}
    </div>
  )
}
