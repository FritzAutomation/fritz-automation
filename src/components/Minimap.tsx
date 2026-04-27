'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface SectionBlock {
  top: number
  height: number
  el: Element
}

export function Minimap() {
  const pathname = usePathname()
  const [sections, setSections] = useState<SectionBlock[]>([])
  const [viewportRatio, setViewportRatio] = useState({ top: 0, height: 0 })
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const rafRef = useRef<number>(0)

  const measure = useCallback(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    const docH = document.documentElement.scrollHeight
    const vpH = window.innerHeight

    setVisible(docH > vpH * 2)

    const sectionEls = main.querySelectorAll('section')
    const mapped: SectionBlock[] = []
    sectionEls.forEach(el => {
      const rect = el.getBoundingClientRect()
      mapped.push({
        top: (rect.top + window.scrollY) / docH,
        height: rect.height / docH,
        el,
      })
    })
    setSections(mapped)
  }, [])

  const updateScroll = useCallback(() => {
    const docH = document.documentElement.scrollHeight
    const vpH = window.innerHeight
    if (docH <= 0) return
    setViewportRatio({
      top: window.scrollY / docH,
      height: vpH / docH,
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      measure()
      updateScroll()
    }, 100)

    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [pathname, measure, updateScroll])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updateScroll])

  if (!visible) return null

  return (
    <div
      className="fixed right-0 top-12 bottom-6 w-10 z-30 hidden md:block transition-opacity duration-200"
      style={{ opacity: hovered ? 0.8 : 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <div className="relative h-full bg-[var(--surface-overlay)] rounded-l">
        {sections.map((sec, i) => (
          <button
            key={i}
            className="absolute left-1 right-1 bg-[var(--line-soft)]/60 rounded-sm hover:bg-slate-600/60 transition-colors cursor-pointer"
            style={{
              top: `${sec.top * 100}%`,
              height: `${Math.max(sec.height * 100, 0.5)}%`,
            }}
            onClick={() => sec.el.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}

        <div
          className="absolute left-0 right-0 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-sm pointer-events-none"
          style={{
            top: `${viewportRatio.top * 100}%`,
            height: `${viewportRatio.height * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
