'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'fa.palette-hint-seen'

/**
 * Floating bottom-right hint that appears once per visitor after the first
 * meaningful scroll, advertising the `/` and Cmd+K palette shortcut.
 * Auto-dismisses after 8s, or on click of the X. Hidden if footer is in view.
 */
export function PaletteHint() {
  const [show, setShow] = useState(false)
  const [hidden, setHidden] = useState(false)
  const dismissedRef = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    try { if (sessionStorage.getItem(STORAGE_KEY)) return } catch {}

    function dismiss() {
      dismissedRef.current = true
      setShow(false)
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
    }

    let appearTimer: number | undefined
    let hideTimer: number | undefined

    function onScroll() {
      if (dismissedRef.current) return
      if (window.scrollY < 200) return
      window.removeEventListener('scroll', onScroll)
      appearTimer = window.setTimeout(() => {
        if (dismissedRef.current) return
        setShow(true)
        hideTimer = window.setTimeout(dismiss, 8000)
      }, 800)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (appearTimer) window.clearTimeout(appearTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    setHidden(false)
    let observer: IntersectionObserver | null = null
    const setup = window.setTimeout(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>('footer, [data-buildlog-hide]')
      )
      if (!targets.length) return
      const intersecting = new Set<Element>()
      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target)
            else intersecting.delete(entry.target)
          }
          setHidden(intersecting.size > 0)
        },
        { threshold: 0 }
      )
      targets.forEach(t => observer!.observe(t))
    }, 60)
    return () => {
      window.clearTimeout(setup)
      observer?.disconnect()
    }
  }, [pathname])

  if (!show) return null

  function dismiss() {
    setShow(false)
    try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  return (
    <div className={`v3-palette-hint ${hidden ? 'is-hidden' : ''}`} role="status">
      <span>
        Press <kbd>/</kbd> or <kbd>⌘K</kbd> to navigate by command
      </span>
      <button type="button" className="x" aria-label="Dismiss" onClick={dismiss}>×</button>
      <style jsx>{`
        .v3-palette-hint {
          position: fixed;
          bottom: 50px;
          left: 24px;
          z-index: 41;
          padding: 10px 14px;
          border: 1px solid var(--line);
          border-radius: 6px;
          background: var(--bg-card);
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: var(--ink-soft);
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-strong);
          opacity: 0;
          transform: translateY(8px);
          animation: v3-hint-in 0.3s ease forwards;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .v3-palette-hint.is-hidden { opacity: 0; transform: translateY(8px); }
        @keyframes v3-hint-in {
          to { opacity: 1; transform: translateY(0); }
        }
        kbd {
          background: var(--surface);
          border: 1px solid var(--line);
          border-bottom-width: 2px;
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 10px;
          color: var(--accent);
          font-family: inherit;
        }
        .x {
          color: var(--ink-dim);
          cursor: pointer;
          padding: 0 4px;
          background: transparent;
          border: 0;
          font-size: 16px;
          line-height: 1;
        }
        .x:hover { color: var(--ink); }
        @media (max-width: 700px) { .v3-palette-hint { display: none; } }
      `}</style>
    </div>
  )
}
