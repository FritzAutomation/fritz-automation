'use client'

import { useEffect, useState } from 'react'
import { cycleTheme, getStoredTheme, type V3Theme } from './ThemeProvider'

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setT] = useState<V3Theme>('dark')
  useEffect(() => {
    setT(getStoredTheme())
    function onChange(e: Event) {
      setT((e as CustomEvent).detail)
    }
    document.addEventListener('fa:theme-change', onChange)
    return () => document.removeEventListener('fa:theme-change', onChange)
  }, [])

  return (
    <button
      type="button"
      className={`v3-theme-toggle ${className || ''}`}
      onClick={() => setT(cycleTheme())}
      aria-label={`cycle theme — current: ${theme}`}
    >
      theme: <span className="v">{theme}</span>
      <style jsx>{`
        .v3-theme-toggle {
          background: transparent;
          border: 0;
          color: var(--ink-dim);
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .v3-theme-toggle:hover { color: var(--accent); }
        .v {
          color: var(--accent);
          margin-left: 2px;
        }
      `}</style>
    </button>
  )
}
