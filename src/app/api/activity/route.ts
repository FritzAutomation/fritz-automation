import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 30

type ActivityEvent = {
  t: string
  kind: 'e' | 'b'
  label: string
  text: string
}

/**
 * Recent site activity for the StatusAnchor live feed.
 *
 * For now this returns a curated set of mock events. When you wire it to a
 * real source (Vercel Analytics, Supabase pageview log, whatever), keep the
 * shape: { events: ActivityEvent[] }, and the StatusAnchor consumes it as-is.
 *
 * Cached for 30s so the same feed shows to many visitors at once.
 */

const MOCK_POOL: Omit<ActivityEvent, 't'>[] = [
  { kind: 'e', label: 'GET',     text: '/work · 22ms' },
  { kind: 'e', label: 'GET',     text: '/services · 18ms' },
  { kind: 'e', label: 'GET',     text: '/about · 14ms' },
  { kind: 'b', label: 'visit',   text: 'iowan, returning visitor' },
  { kind: 'b', label: 'visit',   text: 'des moines, ia' },
  { kind: 'b', label: 'visit',   text: 'cedar rapids, ia' },
  { kind: 'b', label: 'visit',   text: 'kansas city, mo' },
  { kind: 'e', label: 'POST',    text: '/contact · proposal sent' },
  { kind: 'e', label: 'POST',    text: '/contact · inquiry received' },
  { kind: 'e', label: 'deploy',  text: 'two-makers-co · v1.4.2' },
  { kind: 'b', label: 'compile', text: 'rebuilt portfolio in 412ms' },
  { kind: 'b', label: 'compile', text: 'rebuilt cards in 284ms' },
]

function pickEvent(seed: number): Omit<ActivityEvent, 't'> {
  return MOCK_POOL[seed % MOCK_POOL.length]
}

function ageLabel(ageMs: number): string {
  if (ageMs < 60_000) return `${Math.max(1, Math.floor(ageMs / 1000))}s`
  if (ageMs < 3_600_000) return `${Math.floor(ageMs / 60_000)}m`
  return `${Math.floor(ageMs / 3_600_000)}h`
}

export async function GET() {
  const now = Date.now()
  // Generate a stable-ish-looking feed: 5 events spaced over the last ~25 min
  const ages = [4_000, 32_000, 180_000, 480_000, 1_200_000]
  const events: ActivityEvent[] = ages.map((age, i) => {
    const seed = Math.floor((now - age) / 30_000) + i
    return {
      t: i === 0 ? 'now' : ageLabel(age),
      ...pickEvent(seed),
    }
  })

  return NextResponse.json({ events }, {
    headers: { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=60' },
  })
}
