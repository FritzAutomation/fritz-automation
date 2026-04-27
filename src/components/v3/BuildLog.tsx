'use client'

import { useEffect, useRef, useState } from 'react'

type Entry = { ts: string; level: string; text: string; kind?: 'e' | 'b' }

const SCROLL_EVENTS: Omit<Entry, 'ts'>[] = [
  { level: 'compile',  text: 'hero.tsx · 12ms', kind: 'e' },
  { level: 'prefetch', text: '/services', kind: 'e' },
  { level: 'load',     text: 'portfolio.json (4.2kb)', kind: 'e' },
  { level: 'compile',  text: 'cards.tsx · 8ms', kind: 'e' },
  { level: 'prefetch', text: '/work · /about', kind: 'e' },
  { level: 'paint',    text: 'whoami section · 16ms', kind: 'e' },
  { level: 'compile',  text: 'process.tsx · 11ms', kind: 'e' },
  { level: 'load',     text: 'analytics ping', kind: 'e' },
  { level: 'cache',    text: 'hit · /portfolio', kind: 'e' },
]

function nowTs() {
  const t = new Date()
  return `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`
}

/**
 * Fixed bottom-right "build log" strip that emits compile-output lines
 * as the visitor scrolls and clicks. Visible on desktop only. On mobile,
 * MobileTicker handles the same idea in a single rotating line.
 *
 * Hides itself when the footer (or any [data-buildlog-hide] element)
 * scrolls into view, so it doesn't overlap footer links / CTAs.
 */
export function BuildLog({ pageName = 'home' }: { pageName?: string }) {
  const [rows, setRows] = useState<Entry[]>([{ ts: nowTs(), level: 'ready', text: `serving /${pageName}`, kind: 'e' }])
  const [hidden, setHidden] = useState(false)
  const idxRef = useRef(0)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      if (Math.abs(y - lastScrollRef.current) < 240) return
      lastScrollRef.current = y
      const ev = SCROLL_EVENTS[idxRef.current % SCROLL_EVENTS.length]
      idxRef.current++
      setRows(curr => [...curr.slice(-5), { ts: nowTs(), ...ev }])
    }
    function onClick(e: MouseEvent) {
      const a = (e.target as Element)?.closest?.('a, button') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href')
      if (href && href.startsWith('http')) {
        try {
          const host = new URL(href).hostname
          setRows(curr => [...curr.slice(-5), { ts: nowTs(), level: 'exit', text: `external · ${host}`, kind: 'e' }])
        } catch {}
      } else if (href && href !== '#') {
        setRows(curr => [...curr.slice(-5), { ts: nowTs(), level: 'route', text: `${href} requested`, kind: 'e' }])
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)

    // Hide when the footer (or any opt-out element) enters view.
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('footer, [data-buildlog-hide]')
    )
    let observer: IntersectionObserver | null = null
    if (targets.length) {
      observer = new IntersectionObserver(
        entries => {
          // hidden if ANY watched element is intersecting
          const anyVisible = entries.some(e => e.isIntersecting)
          // re-check the rest by reading their current state via getBoundingClientRect
          // (entries only contains the ones whose intersection just changed)
          if (anyVisible) {
            setHidden(true)
            return
          }
          const stillIntersecting = targets.some(t => {
            const r = t.getBoundingClientRect()
            return r.top < window.innerHeight && r.bottom > 0
          })
          setHidden(stillIntersecting)
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
      )
      targets.forEach(t => observer!.observe(t))
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      observer?.disconnect()
    }
  }, [])

  return (
    <div className={`v3-buildlog ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      {rows.map((r, i) => (
        <div className="row" key={`${r.ts}-${i}`}>
          <span className="t">[{r.ts}]</span>
          <span className={r.kind === 'b' ? 'b' : 'e'}> {r.level} </span>
          <span className="text">{r.text}</span>
        </div>
      ))}
      <style jsx>{`
        .v3-buildlog {
          position: fixed;
          bottom: 36px;
          right: 16px;
          width: 320px;
          max-height: 140px;
          overflow: hidden;
          pointer-events: none;
          z-index: 30;
          mask-image: linear-gradient(to top, black 65%, transparent 100%);
          display: flex;
          flex-direction: column;
          opacity: 1;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .v3-buildlog.is-hidden {
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
        }
        .row {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          line-height: 1.6;
          padding: 1px 0;
          opacity: 0;
          animation: v3-fade-in-row 0.4s ease forwards;
        }
        .t { color: var(--ink-dim); }
        .e { color: var(--accent); }
        .b { color: var(--blue); }
        .text { color: var(--ink-soft); }
        @media (max-width: 700px) { .v3-buildlog { display: none; } }
      `}</style>
    </div>
  )
}

/** Mobile-only single-line ticker that rotates through events every 5s.
 *  Hides when the footer enters view (same pattern as BuildLog). */
export function MobileTicker() {
  const [event, setEvent] = useState({ e: 'ready', text: 'serving home' })
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const events = [
      { e: 'GET',     text: '/work · 22ms' },
      { e: 'compile', text: 'cards.tsx · 8ms' },
      { e: 'visit',   text: 'iowan, returning visitor' },
      { e: 'deploy',  text: 'two-makers-co · v1.4.2' },
      { e: 'GET',     text: '/services · 18ms' },
      { e: 'paint',   text: 'whoami section · 16ms' },
    ]
    let i = 0
    const interval = window.setInterval(() => {
      setEvent(events[i % events.length])
      i++
    }, 5000)

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('footer, [data-buildlog-hide]')
    )
    let observer: IntersectionObserver | null = null
    if (targets.length) {
      observer = new IntersectionObserver(
        () => {
          const stillIntersecting = targets.some(t => {
            const r = t.getBoundingClientRect()
            return r.top < window.innerHeight && r.bottom > 0
          })
          setHidden(stillIntersecting)
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
      )
      targets.forEach(t => observer!.observe(t))
    }

    return () => {
      window.clearInterval(interval)
      observer?.disconnect()
    }
  }, [])

  return (
    <div className={`v3-mobile-ticker ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <span className="e">{event.e}</span> {event.text}
      <style jsx>{`
        .v3-mobile-ticker {
          display: none;
        }
        @media (max-width: 700px) {
          .v3-mobile-ticker {
            display: block;
            position: fixed;
            bottom: 36px;
            left: 0;
            right: 0;
            padding: 5px 14px;
            font-family: var(--font-mono), monospace;
            font-size: 10.5px;
            color: var(--ink-dim);
            background: var(--surface-strong);
            border-top: 1px solid var(--line);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 30;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          .v3-mobile-ticker.is-hidden {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        .e { color: var(--accent); }
      `}</style>
    </div>
  )
}
