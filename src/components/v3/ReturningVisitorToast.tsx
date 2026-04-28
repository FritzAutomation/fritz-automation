'use client'

import { useEffect, useState } from 'react'

const VISIT_KEY = 'fa.visit'
const TOAST_SHOWN_KEY = 'fa.welcome-toast-shown'

type StoredVisit = { last?: number; lastPage?: string; count?: number }

function whenLabel(ms: number): string {
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor(ms / 60000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'a moment ago'
}

/**
 * Top-right "welcome back" chip for returning visitors.
 * Reads fa.visit (set by StatusAnchor) and shows once per session, after
 * a small delay so it doesn't compete with hero animations.
 */
export function ReturningVisitorToast() {
  const [show, setShow] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TOAST_SHOWN_KEY)) return
    } catch {}

    let v: StoredVisit | null = null
    try {
      const raw = localStorage.getItem(VISIT_KEY)
      v = raw ? (JSON.parse(raw) as StoredVisit) : null
    } catch {}

    if (!v?.last) return // first time — StatusAnchor will write the entry

    const sinceMs = Date.now() - v.last
    if (sinceMs < 2 * 60 * 1000) return // same session, skip

    setLabel(`welcome back · last seen ${whenLabel(sinceMs)}`)

    const appearTimer = window.setTimeout(() => {
      setShow(true)
      try { sessionStorage.setItem(TOAST_SHOWN_KEY, '1') } catch {}
    }, 1400)
    const dismissTimer = window.setTimeout(() => setShow(false), 8400)

    return () => {
      window.clearTimeout(appearTimer)
      window.clearTimeout(dismissTimer)
    }
  }, [])

  if (!label) return null

  return (
    <div className={`v3-recog-toast ${show ? 'show' : ''}`} role="status" aria-live="polite">
      <span className="dot" aria-hidden />
      <span>{label}</span>
      <button
        type="button"
        className="x"
        aria-label="Dismiss"
        onClick={() => setShow(false)}
      >×</button>
      <style jsx>{`
        .v3-recog-toast {
          position: fixed;
          top: 60px;
          right: 16px;
          z-index: 41;
          padding: 8px 14px 8px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--bg-card);
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: var(--ink-soft);
          display: flex;
          align-items: center;
          gap: 9px;
          box-shadow: var(--shadow-strong);
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.35s ease, transform 0.35s ease;
          pointer-events: none;
        }
        .v3-recog-toast.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }
        .x {
          color: var(--ink-dim);
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 0 2px;
          font-size: 14px;
          line-height: 1;
        }
        .x:hover { color: var(--ink); }
        @media (max-width: 700px) { .v3-recog-toast { display: none; } }
      `}</style>
    </div>
  )
}
