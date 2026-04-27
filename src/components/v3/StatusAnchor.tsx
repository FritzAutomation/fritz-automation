'use client'

import { useEffect, useRef, useState } from 'react'

type Activity = { t: string; kind: 'e' | 'b'; label: string; text: string }

const MOCK_BASE: Activity[] = [
  { t: 'now', kind: 'e', label: 'GET',     text: '/work · 22ms' },
  { t: '12s', kind: 'b', label: 'visit',   text: 'iowan, returning visitor' },
  { t: '2m',  kind: 'e', label: 'POST',    text: '/contact · proposal sent' },
  { t: '3m',  kind: 'e', label: 'deploy',  text: 'two-makers-co · v1.4.2' },
]
const MOCK_FRESH: Omit<Activity, 't'>[] = [
  { kind: 'e', label: 'GET',    text: '/services · 19ms' },
  { kind: 'e', label: 'GET',    text: '/about · 14ms' },
  { kind: 'b', label: 'visit',  text: 'cedar rapids, ia' },
  { kind: 'b', label: 'visit',  text: 'kansas city, mo' },
  { kind: 'e', label: 'POST',   text: '/contact · inquiry received' },
  { kind: 'b', label: 'compile', text: 'rebuilt portfolio in 412ms' },
]

function fmtSince(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ${seconds % 60}s ago`
  return `${Math.floor(seconds/3600)}h ${Math.floor((seconds % 3600)/60)}m ago`
}

const VISIT_KEY = 'fa.visit'

/**
 * Hero "live status" panel. Right side of the v3 split-layout hero.
 * Shows uptime, in-production, avg-reply, last-deploy (ticking), and a live activity log.
 * Recognizes returning visitors via localStorage and shows their last visit.
 */
export function StatusAnchor() {
  const [deployT, setDeployT] = useState(194)
  const [activity, setActivity] = useState<Activity[]>(MOCK_BASE)
  const [collapsed, setCollapsed] = useState(false)
  const [lastVisit, setLastVisit] = useState('first time here')
  const recognizedRef = useRef(false)

  useEffect(() => {
    // Returning-visitor recognition (read once, then bump)
    try {
      const raw = localStorage.getItem(VISIT_KEY)
      const v = raw ? JSON.parse(raw) : null
      if (v?.last) {
        const ago = Date.now() - v.last
        const days = Math.floor(ago / 86400000)
        const hours = Math.floor(ago / 3600000)
        const mins = Math.floor(ago / 60000)
        const when = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : mins > 0 ? `${mins}m ago` : 'a moment ago'
        setLastVisit(`${when} · ${v.lastPage || 'home'}`)
        recognizedRef.current = true
      }
      localStorage.setItem(VISIT_KEY, JSON.stringify({ last: Date.now(), lastPage: 'home', count: (v?.count || 0) + 1 }))
    } catch {}

    // Last-deploy ticker
    const tickInterval = window.setInterval(() => setDeployT(t => t + 1), 1000)

    // Activity ticker — adds new event every 25-45s, ages the rest
    const ageMap = ['now', '12s', '45s', '2m', '5m', '14m']
    function scheduleFresh() {
      const delay = 25000 + Math.random() * 20000
      window.setTimeout(() => {
        setActivity(curr => {
          const ev = MOCK_FRESH[Math.floor(Math.random() * MOCK_FRESH.length)]
          const aged = curr.map(r => ({ ...r, t: ageMap[Math.min(ageMap.indexOf(r.t) + 1, ageMap.length - 1)] || r.t }))
          return [{ t: 'now', ...ev }, ...aged].slice(0, 5)
        })
        scheduleFresh()
      }, delay)
    }
    scheduleFresh()

    return () => window.clearInterval(tickInterval)
  }, [])

  return (
    <aside className="v3-anchor relative">
      <div className="v3-anchor-head">
        <span className="v3-anchor-label">~/fritz-automation/status</span>
        <span className="v3-anchor-live"><span className="v3-pulse-dot" />live</span>
      </div>
      <div className="v3-anchor-body">
        <div className="v3-stat-row"><span className="k">status</span><span className="v"><span className="h">accepting projects</span></span></div>
        <div className={`v3-stat-row ${collapsed ? 'hidden' : ''}`}><span className="k">uptime</span><span className="v tabular">15y · 4m · 12d</span></div>
        <div className={`v3-stat-row ${collapsed ? 'hidden' : ''}`}><span className="k">in production</span><span className="v">2 sites · 1 in progress</span></div>
        <div className={`v3-stat-row ${collapsed ? 'hidden' : ''}`}><span className="k">avg reply</span><span className="v"><span className="h">&lt; 1 hr</span> during workdays</span></div>
        <div className={`v3-stat-row ${collapsed ? 'hidden' : ''}`}><span className="k">last deploy</span><span className="v tabular">{fmtSince(deployT)}</span></div>
        <div className={`v3-stat-row ${recognizedRef.current ? 'recognized' : ''} ${collapsed ? 'hidden' : ''}`}><span className="k">last visit</span><span className="v tabular">{lastVisit}</span></div>
        <div className={`v3-stat-row v3-stat-row-meta ${collapsed ? 'hidden' : ''}`}><span className="k">// recent</span><span className="v meta">tail -f activity.log</span></div>
        <div className={`v3-activity-log ${collapsed ? 'hidden' : ''}`}>
          {activity.map((ev, i) => (
            <div key={`${ev.t}-${i}`} className="row" style={{ animation: 'v3-fade-in-row 0.3s ease forwards' }}>
              <span className="t">{ev.t}</span>
              <span className={ev.kind}>{ev.label}</span>
              <span className="text">{ev.text}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="v3-anchor-toggle"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'expand status panel' : 'collapse status panel'}
      >
        {collapsed ? '▸ tap to expand' : '▾ tap to collapse'}
      </button>

      <style jsx>{`
        .v3-anchor {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          backdrop-filter: blur(8px);
          overflow: hidden;
        }
        .v3-anchor-head {
          padding: 11px 16px;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: var(--ink-dim);
          background: var(--surface-overlay);
        }
        .v3-anchor-label { color: var(--ink-soft); }
        .v3-anchor-live {
          margin-left: auto;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        :global(.v3-stat-row) {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 12px 18px;
          border-bottom: 1px dashed var(--line);
          align-items: baseline;
          transition: background 0.15s ease;
        }
        :global(.v3-stat-row.hidden) { display: none; }
        :global(.v3-stat-row:hover) { background: var(--accent-glow); }
        :global(.v3-stat-row .k) {
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          color: var(--ink-dim);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        :global(.v3-stat-row .v) {
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          color: var(--heading);
          font-weight: 500;
        }
        :global(.v3-stat-row .v.tabular) { font-variant-numeric: tabular-nums; }
        :global(.v3-stat-row .v .h) { color: var(--accent); }
        :global(.v3-stat-row .v.meta) { font-size: 11px; color: var(--ink-dim); }
        :global(.v3-stat-row.recognized .v) { color: var(--accent); font-style: italic; }
        :global(.v3-stat-row-meta) { border-bottom: 0; }
        :global(.v3-activity-log) {
          padding: 10px 18px 14px;
          max-height: 100px;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
        }
        :global(.v3-activity-log .row) {
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          line-height: 1.65;
          display: flex;
          gap: 10px;
        }
        :global(.v3-activity-log .row .t) { color: var(--ink-dim); }
        :global(.v3-activity-log .row .e) { color: var(--accent); }
        :global(.v3-activity-log .row .b) { color: var(--blue); }
        :global(.v3-activity-log .row .text) { color: var(--ink-soft); }
        :global(.v3-anchor-toggle) {
          display: none;
        }
        @media (max-width: 820px) {
          :global(.v3-anchor-toggle) {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 0;
            border: 0;
            border-top: 1px dashed var(--line);
            background: transparent;
            font-family: var(--font-mono), monospace;
            font-size: 11px;
            color: var(--ink-dim);
            cursor: pointer;
          }
        }
        :global(.v3-anchor-toggle:hover) { color: var(--accent); }
      `}</style>
    </aside>
  )
}
