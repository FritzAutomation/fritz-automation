'use client'

import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const BOOT_LINES = [
  { text: '[fritz-automation v1.0.0]', color: 'text-slate-300' },
  { text: 'loading modules...........', suffix: ' OK', color: 'text-slate-500' },
  { text: 'establishing connection...', suffix: ' OK', color: 'text-slate-500' },
  { text: 'initializing ui...........', suffix: ' OK', color: 'text-slate-500' },
  { text: 'ready.', color: 'text-white' },
]

const LINE_DELAY = 350
const POST_READY_PAUSE = 500
const FADE_DURATION = 400

export function BootSplash() {
  const prefersReducedMotion = useReducedMotion()
  const [visibleLines, setVisibleLines] = useState(0)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (prefersReducedMotion) {
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'

    BOOT_LINES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), (i + 1) * LINE_DELAY)
      timersRef.current.push(t)
    })

    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, BOOT_LINES.length * LINE_DELAY + POST_READY_PAUSE)
    timersRef.current.push(fadeTimer)

    const doneTimer = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, BOOT_LINES.length * LINE_DELAY + POST_READY_PAUSE + FADE_DURATION)
    timersRef.current.push(doneTimer)

    return () => {
      timersRef.current.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [prefersReducedMotion])

  if (done) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950 flex items-center justify-center transition-opacity"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_DURATION}ms`,
      }}
      aria-hidden="true"
    >
      <div className="font-mono text-sm sm:text-base space-y-1.5 px-6 max-w-lg w-full">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={line.color}>
            {line.text}
            {line.suffix && <span className="text-emerald-400">{line.suffix}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
