'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const NAV_KEYS: Record<string, string> = {
  '1': '/',
  '2': '/work',
  '3': '/services',
  '4': '/about',
  '5': '/contact',
}

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if ((el as HTMLElement).isContentEditable) return true
  return false
}

export function KeyboardShortcuts() {
  const router = useRouter()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('close-overlays'))
      return
    }

    if (isInputFocused()) return

    if (e.key === '?') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay'))
      return
    }

    const route = NAV_KEYS[e.key]
    if (route && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      router.push(route)
      return
    }
  }, [router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return null
}
