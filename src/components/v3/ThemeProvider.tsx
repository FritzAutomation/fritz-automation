'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'fa.theme'
const THEMES = ['dark', 'dim', 'paper'] as const
export type V3Theme = typeof THEMES[number]

export function getStoredTheme(): V3Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'dark' || v === 'dim' || v === 'paper') return v
  } catch {}
  return 'dark'
}

export function setTheme(theme: V3Theme) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  document.documentElement.setAttribute('data-theme', theme)
  document.dispatchEvent(new CustomEvent('fa:theme-change', { detail: theme }))
}

export function cycleTheme(): V3Theme {
  const cur = getStoredTheme()
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]
  setTheme(next)
  return next
}

/**
 * Mounted in layout.tsx. Reads stored theme on first render and writes
 * it to <html data-theme=...>. Inline-script could replace this for SSR
 * flash avoidance, but for now the dark default + first-paint flash is
 * acceptable.
 */
export function ThemeProvider() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', getStoredTheme())
  }, [])
  return null
}
