'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/v3/ThemeToggle'

function pathAsFsPath(pathname: string): string {
  if (pathname === '/') return '~'
  return '~' + pathname
}

export function StatusBar() {
  const pathname = usePathname()
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 h-6 bg-[var(--bg)] border-t border-[var(--line)] text-[11px] font-mono text-[var(--ink-soft)] flex items-center justify-between px-3 select-none"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          online
        </span>
        <span className="text-[var(--ink-dim)] truncate">{pathAsFsPath(pathname)}</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 pl-3">
        <ThemeToggle />
        {/* Redundant with the header on small screens, and shortcuts need a keyboard */}
        <span className="hidden sm:inline text-[var(--ink-dim)]">fritz-automation</span>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay'))}
          className="hidden sm:inline-flex text-[var(--ink-dim)] hover:text-[var(--ink-soft)] transition-colors"
          aria-label="Show keyboard shortcuts"
        >
          ? shortcuts
        </button>
        <span className="flex-shrink-0">{time || '--:--'}</span>
      </div>
    </div>
  )
}
