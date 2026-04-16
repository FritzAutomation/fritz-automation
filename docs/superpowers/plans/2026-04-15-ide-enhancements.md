# IDE Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen the "you're inside a program" experience with an IDE tab bar, boot sequence, keyboard shortcuts, context menu, scroll-reveal animations, and adaptive minimap.

**Architecture:** 7 independent features layered onto the existing Next.js 15 App Router site. Each feature is a self-contained client component mounted in the root layout or consumed by individual pages. The IDE tab bar replaces the current Header. All other features are additive.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3.4, existing JetBrains Mono font.

**Development Process:**
- Branch: `ide-enhancements` off `main`.
- Vercel preview deploys on every push.
- No test infrastructure; verify via dev server + Vercel preview.

**Design Spec Reference:** `docs/superpowers/specs/2026-04-15-ide-enhancements-design.md`

---

## Phase 1 — Branch Setup + Boot Sequence

### Task 1.1: Create branch

**Files:** none

- [ ] **Step 1: Create and push branch**

```bash
git checkout main && git pull
git checkout -b ide-enhancements
git push -u origin ide-enhancements
```

---

### Task 1.2: Rewrite BootSplash

**Files:**
- Replace: `src/components/animations/BootSplash.tsx`

The existing BootSplash uses `sessionStorage` to skip on repeat visits. The new spec says: play on every full page load (no storage check), skip on client-side navigation (natural — layout persists). Also reduce total duration from ~2.8s to ~1.8s.

- [ ] **Step 1: Replace BootSplash.tsx**

```tsx
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

const LINE_DELAY = 150
const POST_READY_PAUSE = 300
const FADE_DURATION = 200

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
```

- [ ] **Step 2: Verify locally**

```bash
npm run dev
```

Hard-refresh homepage. Boot sequence should show 5 lines appearing ~150ms apart, then fade out. Navigate to `/work` via link — boot should NOT replay. Hard-refresh `/work` — boot SHOULD replay.

- [ ] **Step 3: Commit and push**

```bash
git add src/components/animations/BootSplash.tsx
git commit -m "Rewrite BootSplash with faster terminal-style sequence"
git push
```

---

## Phase 2 — IDE Tab Bar

### Task 2.1: Replace Header with IDE Tab Bar

**Files:**
- Replace: `src/components/layout/Header.tsx`

This is a complete rewrite. The existing Header is ~170 lines with a white background and MorphText. The new one is a dark IDE-style tab bar on desktop, dark hamburger on mobile.

- [ ] **Step 1: Replace Header.tsx with full IDE tab bar**

```tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FritzLogo } from '@/components/FritzLogo'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: '~/home' },
  { href: '/work', label: '~/work' },
  { href: '/services', label: '~/services' },
  { href: '/about', label: '~/about' },
  { href: '/contact', label: '~/contact' },
]

function isTabActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="max-w-[100vw] mx-auto">
          <nav className="flex items-center h-12">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 px-4 hover:opacity-80 transition-opacity"
              aria-label="Fritz Automation home"
            >
              <FritzLogo width={140} variant="dark" />
            </Link>

            {/* Tabs — desktop */}
            <div className="hidden md:flex items-center flex-1 h-full overflow-x-auto">
              {tabs.map((tab, index) => {
                const active = isTabActive(pathname, tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      'relative h-full px-4 flex items-center font-mono text-sm transition-colors shrink-0',
                      'transform transition-all duration-500 ease-out',
                      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
                      active
                        ? 'text-emerald-300 bg-slate-800/60'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
                    )}
                    style={{ transitionDelay: mounted ? `${index * 60}ms` : '0ms' }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right side — desktop */}
            <div className="hidden md:flex items-center gap-2 px-3 shrink-0">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="px-2 py-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors font-mono text-sm"
                aria-label="Open command palette"
                title="Ctrl+K"
              >
                &gt;_
              </button>
              <Link href="/contact">
                <Button size="sm">Start a project</Button>
              </Link>
            </div>

            {/* Hamburger — mobile */}
            <div className="md:hidden ml-auto px-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-950 z-50 md:hidden p-6 shadow-2xl border-l border-slate-800">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mt-16 space-y-2">
              {tabs.map(tab => {
                const active = isTabActive(pathname, tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-lg font-mono text-sm transition-colors',
                      active
                        ? 'text-emerald-300 bg-emerald-500/10'
                        : 'text-slate-400 hover:bg-slate-800'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {tab.label}
                  </Link>
                )
              })}
              <div className="pt-4">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Start a project</Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
```

- [ ] **Step 2: Run build to confirm compile**

```bash
npm run build
```

- [ ] **Step 3: Verify locally**

Open homepage. Should see a dark tab bar at top with `~/home` active (emerald text, bottom border). Navigate between pages — active tab switches. On mobile (375px), should show hamburger icon that opens a slide-out with monospace links.

- [ ] **Step 4: Commit and push**

```bash
git add src/components/layout/Header.tsx
git commit -m "Replace Header with IDE-style dark tab bar"
git push
```

---

### Task 2.2: Dark-mode audit

**Files:**
- Possibly modify: `src/components/layout/Footer.tsx`, various `loading.tsx` files

- [ ] **Step 1: Search for remaining light backgrounds**

Use Grep across `src/app/**/*.tsx` and `src/components/**/*.tsx` for:
- `bg-white`
- `bg-slate-50`
- `bg-slate-100`

**Step 2: For each match:**
- If it's in a page hero section or card that should be dark: convert (e.g., `bg-white` → `bg-slate-950`, `text-slate-900` → `text-white`, `border-slate-200` → `border-slate-800`).
- If it's inside the portal/admin auth-gated area: skip.
- If it's inside a loading.tsx skeleton: convert to dark equivalents.
- If it's a loading button spinner or small UI element: use judgment.

The Footer is already `bg-slate-900` — confirm no changes needed.

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

- [ ] **Step 4: Commit if changes were made**

```bash
git add -A
git commit -m "Convert remaining light sections to dark theme" || echo "No changes"
git push
```

---

**CHECKPOINT 1 — User reviews preview.** Tab bar and boot sequence are the two biggest visual changes.

---

## Phase 3 — Keyboard Shortcuts + Overlay

### Task 3.1: Create KeyboardShortcuts component

**Files:**
- Create: `src/components/KeyboardShortcuts.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
    // Escape always works — closes overlays
    if (e.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('close-overlays'))
      return
    }

    // All other shortcuts suppressed when typing in inputs
    if (isInputFocused()) return

    // ? toggles shortcut overlay
    if (e.key === '?') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay'))
      return
    }

    // Number keys navigate
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/KeyboardShortcuts.tsx
git commit -m "Add global keyboard shortcuts handler"
```

---

### Task 3.2: Create ShortcutOverlay component

**Files:**
- Create: `src/components/ShortcutOverlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'

const shortcuts = [
  { key: 'Ctrl+K', desc: 'Command palette' },
  { key: '1', desc: 'Home' },
  { key: '2', desc: 'Work' },
  { key: '3', desc: 'Services' },
  { key: '4', desc: 'About' },
  { key: '5', desc: 'Contact' },
  { key: '?', desc: 'This overlay' },
  { key: 'Esc', desc: 'Close overlays' },
]

export function ShortcutOverlay() {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev)
    const handleClose = () => setOpen(false)

    window.addEventListener('toggle-shortcut-overlay', handleToggle)
    window.addEventListener('close-overlays', handleClose)
    return () => {
      window.removeEventListener('toggle-shortcut-overlay', handleToggle)
      window.removeEventListener('close-overlays', handleClose)
    }
  }, [])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-black/60" onClick={close} />
      <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-sm text-slate-300">Keyboard shortcuts</h2>
            <button
              onClick={close}
              className="text-slate-500 hover:text-slate-300 text-sm font-mono"
            >
              esc
            </button>
          </div>
          <div className="space-y-2">
            {shortcuts.map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ShortcutOverlay.tsx
git commit -m "Add keyboard shortcut overlay modal"
```

---

### Task 3.3: Update StatusBar with shortcut hint

**Files:**
- Modify: `src/components/layout/StatusBar.tsx`

- [ ] **Step 1: Add the `? shortcuts` hint to the right side of the status bar**

In `StatusBar.tsx`, add a clickable element in the right-side flex container, before the clock:

In the right-side `<div>`, add between the "fritz-automation" span and the time span:

```tsx
<button
  onClick={() => window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay'))}
  className="text-slate-600 hover:text-slate-400 transition-colors"
  aria-label="Show keyboard shortcuts"
>
  ? shortcuts
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/StatusBar.tsx
git commit -m "Add shortcut hint to status bar"
```

---

### Task 3.4: Mount new components in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add imports and mount components**

Add imports at top of layout.tsx:

```tsx
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { ShortcutOverlay } from '@/components/ShortcutOverlay'
```

Inside `<body>`, after `<StatusBar />` and before `<CursorEffects />`, add:

```tsx
<KeyboardShortcuts />
<ShortcutOverlay />
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
npm run dev
```

Press `?` — overlay should appear. Press `1`–`5` — should navigate. Press `Esc` — overlay closes. Type in Contact form — shortcuts should NOT fire while input is focused.

- [ ] **Step 3: Commit and push**

```bash
git add src/app/layout.tsx
git commit -m "Mount keyboard shortcuts and overlay in root layout"
git push
```

---

## Phase 4 — Context Menu

### Task 4.1: Create ContextMenu component

**Files:**
- Create: `src/components/ContextMenu.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ContextMenu.tsx**

```tsx
'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function ContextMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [showNav, setShowNav] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setPos(null)
    setShowNav(false)
    setCopied(false)
  }, [])

  useEffect(() => {
    const handleContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tag = target.tagName.toLowerCase()
      // Don't intercept on inputs, textareas, selects, links
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'a') return
      if (target.closest('input, textarea, select, a')) return

      // Only intercept within main
      if (!target.closest('main')) return

      e.preventDefault()

      // Clamp position so menu doesn't overflow viewport
      const menuW = 220
      const menuH = 280
      const x = Math.min(e.clientX, window.innerWidth - menuW - 8)
      const y = Math.min(e.clientY, window.innerHeight - menuH - 8)

      setPos({ x, y })
      setShowNav(false)
      setCopied(false)
    }

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close()
      }
    }

    const handleScroll = () => close()
    const handleCloseOverlays = () => close()

    document.addEventListener('contextmenu', handleContext)
    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll, true)
    window.addEventListener('close-overlays', handleCloseOverlays)

    return () => {
      document.removeEventListener('contextmenu', handleContext)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('close-overlays', handleCloseOverlays)
    }
  }, [close])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(close, 600)
    } catch {
      close()
    }
  }

  if (!pos) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-[55] bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1.5 w-[220px] font-mono text-sm"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Navigate to */}
      <button
        onClick={() => setShowNav(prev => !prev)}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
      >
        Navigate to
        <span className="text-slate-600">{showNav ? '▾' : '▸'}</span>
      </button>
      {showNav && (
        <div className="border-t border-b border-slate-800 py-1">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => { router.push(item.href); close() }}
              className={`w-full text-left pl-6 pr-3 py-1 transition-colors ${
                pathname === item.href
                  ? 'text-emerald-400'
                  : 'text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Command palette */}
      <button
        onClick={() => { window.dispatchEvent(new CustomEvent('open-command-palette')); close() }}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
      >
        Command palette
        <span className="text-slate-600 text-xs">Ctrl+K</span>
      </button>

      {/* Copy URL */}
      <button
        onClick={handleCopyUrl}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy page URL'}
      </button>

      {/* Shortcuts */}
      <button
        onClick={() => { window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay')); close() }}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
      >
        Keyboard shortcuts
        <span className="text-slate-600 text-xs">?</span>
      </button>

      {/* Divider */}
      <div className="border-t border-slate-800 my-1" />

      {/* View source */}
      <a
        href="https://github.com/FritzAutomation/fritz-automation"
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
        className="block px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
      >
        View source on GitHub
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Mount in root layout**

Add to `src/app/layout.tsx`:

Import:
```tsx
import { ContextMenu } from '@/components/ContextMenu'
```

Inside `<body>`, after `<ShortcutOverlay />`:
```tsx
<ContextMenu />
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
npm run dev
```

Right-click in the main content area — custom menu appears. Right-click on an input (Contact form) — native browser menu appears. Click "Navigate to" — submenu expands. Click "Copy page URL" — clipboard gets the URL with "Copied!" feedback.

- [ ] **Step 4: Commit and push**

```bash
git add src/components/ContextMenu.tsx src/app/layout.tsx
git commit -m "Add custom right-click context menu"
git push
```

---

**CHECKPOINT 2 — User reviews preview.** Keyboard shortcuts, overlay, and context menu functional.

---

## Phase 5 — ScrollReveal + Hover Audit

### Task 5.1: Create ScrollReveal component

**Files:**
- Create: `src/components/ScrollReveal.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function ScrollReveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 400ms ease-out, transform 400ms ease-out',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScrollReveal.tsx
git commit -m "Add ScrollReveal IntersectionObserver wrapper"
```

---

### Task 5.2: Apply ScrollReveal to homepage sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current homepage**

Read `src/app/page.tsx` to identify each `<section>` element. The homepage has 6 sections: Hero, What I Build, Selected Work, Whoami, How It Works, Final CTA.

- [ ] **Step 2: Import ScrollReveal and wrap sections**

Add import at top:
```tsx
import { ScrollReveal } from '@/components/ScrollReveal'
```

Wrap each `<section>` EXCEPT the hero (hero should be visible immediately) in `<ScrollReveal>`:

For each of the 5 non-hero sections, wrap them like:
```tsx
<ScrollReveal>
  <section className="...">
    {/* existing content */}
  </section>
</ScrollReveal>
```

Do NOT wrap the hero section — it should be visible immediately on load.

- [ ] **Step 3: Verify locally**

Scroll down the homepage — sections should fade in as they enter the viewport.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "Add scroll-reveal animations to homepage sections"
```

---

### Task 5.3: Apply ScrollReveal to About and Services

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/services/page.tsx`

- [ ] **Step 1: About page**

Read `src/app/about/page.tsx`. Wrap the main content section (the code-file container) in `<ScrollReveal>`. Do not wrap the hero.

- [ ] **Step 2: Services page**

Read `src/app/services/page.tsx`. Wrap the tab content section in `<ScrollReveal>`. Do not wrap the hero.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx src/app/services/page.tsx
git commit -m "Add scroll-reveal to About and Services pages"
```

---

### Task 5.4: Audit hover classes for IDE line-highlight consistency

**Files:**
- Possibly modify: `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/services/page.tsx`

- [ ] **Step 1: Check interactive elements**

For each of these elements, confirm they have a `hover:bg-slate-800/40 transition-colors` or equivalent:
- Homepage "what I build" file-card links
- Homepage "selected work" project cards
- Work page file-tree sidebar buttons
- Services tab buttons

- [ ] **Step 2: Fix any missing or inconsistent hover states**

Use `hover:bg-slate-800/40 transition-colors duration-200` as the canonical pattern.

- [ ] **Step 3: Commit if changes made**

```bash
git add -A
git commit -m "Standardize IDE line-highlight hover across interactive elements" || echo "No changes"
git push
```

---

## Phase 6 — Adaptive Minimap

### Task 6.1: Create Minimap component

**Files:**
- Create: `src/components/Minimap.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create the Minimap component**

```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface SectionBlock {
  top: number
  height: number
  el: Element
}

export function Minimap() {
  const pathname = usePathname()
  const [sections, setSections] = useState<SectionBlock[]>([])
  const [viewportRatio, setViewportRatio] = useState({ top: 0, height: 0 })
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const measure = useCallback(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    const docH = document.documentElement.scrollHeight
    const vpH = window.innerHeight

    // Only show if page > 2x viewport
    setVisible(docH > vpH * 2)

    const sectionEls = main.querySelectorAll('section')
    const mapped: SectionBlock[] = []
    sectionEls.forEach(el => {
      const rect = el.getBoundingClientRect()
      mapped.push({
        top: (rect.top + window.scrollY) / docH,
        height: rect.height / docH,
        el,
      })
    })
    setSections(mapped)
  }, [])

  const updateScroll = useCallback(() => {
    const docH = document.documentElement.scrollHeight
    const vpH = window.innerHeight
    if (docH <= 0) return
    setViewportRatio({
      top: window.scrollY / docH,
      height: vpH / docH,
    })
  }, [])

  // Measure on mount, pathname change, resize
  useEffect(() => {
    // Delay measurement to let page render
    const t = setTimeout(() => {
      measure()
      updateScroll()
    }, 100)

    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [pathname, measure, updateScroll])

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updateScroll])

  // Hidden on mobile via CSS, and if page isn't tall enough
  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="fixed right-0 top-12 bottom-6 w-10 z-30 hidden md:block transition-opacity duration-200"
      style={{ opacity: hovered ? 0.8 : 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <div className="relative h-full bg-slate-900/40 rounded-l">
        {/* Section blocks */}
        {sections.map((sec, i) => (
          <button
            key={i}
            className="absolute left-1 right-1 bg-slate-700/60 rounded-sm hover:bg-slate-600/60 transition-colors cursor-pointer"
            style={{
              top: `${sec.top * 100}%`,
              height: `${Math.max(sec.height * 100, 0.5)}%`,
            }}
            onClick={() => sec.el.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}

        {/* Viewport indicator */}
        <div
          className="absolute left-0 right-0 bg-emerald-400/15 border border-emerald-400/30 rounded-sm pointer-events-none"
          style={{
            top: `${viewportRatio.top * 100}%`,
            height: `${viewportRatio.height * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mount in root layout**

Add import to `src/app/layout.tsx`:
```tsx
import { Minimap } from '@/components/Minimap'
```

Inside `<body>`, after `<ContextMenu />`:
```tsx
<Minimap />
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
npm run dev
```

Open the homepage (longest page). Minimap should appear on the right edge — subtle at 30% opacity, brighter on hover. Section blocks should be clickable and scroll to that section. Navigate to Contact (short page) — minimap should disappear. Resize to mobile — minimap hidden.

- [ ] **Step 4: Commit and push**

```bash
git add src/components/Minimap.tsx src/app/layout.tsx
git commit -m "Add adaptive minimap with section blocks and viewport indicator"
git push
```

---

**CHECKPOINT 3 — User reviews preview.** All features implemented. Full visual QA.

---

## Phase 7 — Polish + PR

### Task 7.1: Mobile QA pass

**Files:** any pages with layout issues at 375px

- [ ] **Step 1: Check each page at 375px in DevTools**

Pages to check:
- Homepage
- Work (file-tree sidebar may need vertical stacking — already handled in previous work)
- Services (tab bar should scroll horizontally)
- About
- Contact
- Demos

The tab bar header should show a hamburger, not cramped tabs.

- [ ] **Step 2: Fix any obvious breaks**

- [ ] **Step 3: Commit if fixes made**

```bash
git add -A
git commit -m "Mobile polish for IDE enhancements" || echo "No changes"
git push
```

---

### Task 7.2: Open PR

**Files:** none (GitHub step)

- [ ] **Step 1: Open PR**

```bash
gh pr create --title "IDE enhancements: tab bar, boot, shortcuts, context menu, minimap" --body "$(cat <<'EOF'
## Summary
- Replaces white header with IDE-style dark tab bar (`~/home`, `~/work`, etc.)
- Rewrites boot sequence for faster, cleaner terminal text
- Adds keyboard shortcuts (`1`–`5` to navigate, `?` for cheatsheet, `Esc` to close)
- Adds custom right-click context menu (navigate, copy URL, command palette, view source)
- Adds scroll-reveal section animations across homepage, About, Services
- Adds adaptive minimap (right edge, shows on tall pages, clickable section blocks)
- Full dark mode — no remaining light sections

## Design docs
- Spec: `docs/superpowers/specs/2026-04-15-ide-enhancements-design.md`
- Plan: `docs/superpowers/plans/2026-04-15-ide-enhancements.md`

## Test plan
- [ ] Boot sequence plays on hard refresh, does NOT replay on client-side navigation
- [ ] Tab bar shows active tab with emerald indicator; all tabs navigate correctly
- [ ] Mobile: hamburger menu works, no tab bar visible
- [ ] Keyboard: `1`–`5` navigate, `?` opens overlay, `Esc` closes, shortcuts suppressed in form inputs
- [ ] Right-click context menu appears on main content, NOT on form inputs or links
- [ ] "Copy page URL" copies and shows feedback
- [ ] ScrollReveal: sections fade in on scroll, hero is visible immediately
- [ ] Minimap: appears on homepage (tall), hidden on Contact (short), hidden on mobile
- [ ] Minimap section blocks are clickable and scroll smoothly
- [ ] Status bar shows `? shortcuts` hint
- [ ] No remaining `bg-white` sections on public pages

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report PR URL**

---

## Self-Review

**Spec coverage:**
- 2.1 Tab bar → Task 2.1 ✅
- 2.2 Dark mode → Task 2.2 ✅
- 2.3 Boot sequence → Task 1.2 ✅
- 2.4 Keyboard shortcuts → Tasks 3.1–3.4 ✅
- 2.5 Micro-animations (scroll reveal) → Tasks 5.1–5.3 ✅
- 2.5 Micro-animations (hover audit) → Task 5.4 ✅
- 2.5 Micro-animations (cursor blink) → existing TypingHero, no change needed ✅
- 2.6 Context menu → Task 4.1 ✅
- 2.7 Minimap → Task 6.1 ✅

**Placeholder scan:** No TBDs, TODOs, or vague instructions. All code blocks are complete.

**Type consistency:** Custom events use consistent names: `toggle-shortcut-overlay`, `close-overlays`, `open-command-palette`. Component names match imports across all files.
