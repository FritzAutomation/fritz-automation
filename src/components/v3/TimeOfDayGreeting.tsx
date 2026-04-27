'use client'

import { useEffect, useState } from 'react'

function baseGreeting(hour: number): string {
  if (hour < 5) return 'still up'
  if (hour < 12) return 'good morning'
  if (hour < 17) return 'good afternoon'
  if (hour < 22) return 'good evening'
  return 'still up'
}

/**
 * "> good morning from burlington, iowa" — top of hero.
 * Renders a stable SSR placeholder, then swaps to time-of-day on mount.
 * Midwest-tz visitors see "..., neighbor".
 */
export function TimeOfDayGreeting() {
  const [tod, setTod] = useState<string | null>(null)

  useEffect(() => {
    const h = new Date().getHours()
    let base = baseGreeting(h)
    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase()
      if (tz.includes('chicago') || tz.includes('detroit') || tz.includes('indianapolis')) {
        base = `${base}, neighbor`
      }
    } catch {}
    setTod(base)
  }, [])

  return (
    <div
      className="font-mono text-[13px] text-[var(--ink-dim)] mb-3 flex items-center gap-2"
      style={{ animation: 'v3-fade-in 0.4s ease 0.05s both' }}
    >
      <span className="text-[var(--accent)]" aria-hidden>&gt;</span>
      <span suppressHydrationWarning>
        {tod ?? 'hello'} from <span className="text-[var(--accent)]">burlington, iowa</span>
      </span>
    </div>
  )
}
