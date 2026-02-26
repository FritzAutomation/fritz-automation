'use client'

import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type BootPhase = 'checking' | 'booting' | 'ready' | 'exiting' | 'done'

const BOOT_LINES = [
  '> Initializing Fritz Automation...',
  '> Loading modules...',
  '> Connecting services...',
  '> System ready.',
]

const LINE_DELAY = 400 // ms between lines
const EXIT_DELAY = 600 // ms after last line before exit
const EXIT_DURATION = 400 // ms for exit animation

export function BootSplash() {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<BootPhase>('checking')
  const [visibleLines, setVisibleLines] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Skip entirely if reduced motion
    if (prefersReducedMotion) {
      setPhase('done')
      return
    }

    // Check session storage
    try {
      if (sessionStorage.getItem('fritz-booted')) {
        setPhase('done')
        return
      }
    } catch {
      // sessionStorage blocked, skip splash
      setPhase('done')
      return
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Start boot sequence
    setPhase('booting')

    BOOT_LINES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1)
        if (i === BOOT_LINES.length - 1) {
          setPhase('ready')
        }
      }, i * LINE_DELAY)
      timersRef.current.push(t)
    })

    // Exit after last line + delay
    const exitTimer = setTimeout(() => {
      setPhase('exiting')
    }, BOOT_LINES.length * LINE_DELAY + EXIT_DELAY)
    timersRef.current.push(exitTimer)

    // Remove from DOM after exit animation
    const doneTimer = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = ''
      try {
        sessionStorage.setItem('fritz-booted', '1')
      } catch {
        // ignore
      }
    }, BOOT_LINES.length * LINE_DELAY + EXIT_DELAY + EXIT_DURATION)
    timersRef.current.push(doneTimer)

    return () => {
      timersRef.current.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [prefersReducedMotion])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center ${
        phase === 'exiting' ? 'boot-exit' : ''
      }`}
      aria-hidden="true"
    >
      <div className="font-mono text-sm sm:text-base text-emerald-400 space-y-2 px-6 max-w-lg w-full">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span>{line}</span>
            {i === visibleLines - 1 && phase !== 'ready' && phase !== 'exiting' && (
              <span className="boot-cursor inline-block w-2 h-4 bg-emerald-400 ml-1" />
            )}
          </div>
        ))}
        {phase === 'ready' && (
          <span className="boot-cursor inline-block w-2 h-4 bg-emerald-400 ml-1" />
        )}
      </div>
    </div>
  )
}
