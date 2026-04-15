# Site Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the Fritz Automation marketing site as a personal-voice, IDE-flavored solo software studio — honest about scale, visually committed to the "program feel" aesthetic, and free of manufacturing/enterprise positioning.

**Architecture:** The existing Next.js 15 + Tailwind + Supabase app stays. This plan modifies copy, deletes three pages, restructures navigation, updates the visual system (typography + chrome components), and redesigns the content pages in an IDE-inspired idiom. No new routes added except a rename (`/portfolio` → `/work`).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3.4, existing Supabase backend. Adds one new font (JetBrains Mono via `next/font/google`).

**Development Process:**
- All work happens on branch `reframe-site` off of `main`.
- Every push triggers a Vercel preview deploy.
- Tasks are grouped into Phases. At the end of each Phase, stop for user review of the preview before proceeding.
- No test infrastructure currently exists in this repo; verification is visual (Vercel preview + local dev server).

**Design Spec Reference:** `docs/superpowers/specs/2026-04-14-site-reframe-design.md`

**Items requiring user input during execution (flagged in tasks):**
- Final tagline wording
- Pricing ranges (exact numbers) for each service
- Final monospace font choice (default: JetBrains Mono)
- Final confirmation on tone of About page copy

---

## Phase 0 — Branch Setup

### Task 0.1: Create the reframe branch

**Files:** none

- [ ] **Step 1: Confirm current state of main**

```bash
git status
git log -1 --oneline
```

Expected: clean working tree, HEAD at the spec-commit (`Add site reframe design spec`).

- [ ] **Step 2: Create and switch to reframe-site branch**

```bash
git checkout -b reframe-site
```

- [ ] **Step 3: Push empty branch to trigger first Vercel preview**

```bash
git push -u origin reframe-site
```

Expected: Vercel posts a preview URL (check GitHub PR or Vercel dashboard). Production remains unchanged.

- [ ] **Step 4: Verify preview URL shows current site**

Open the Vercel preview URL. Site should look identical to production. Confirm `/industries`, `/case-studies`, `/roi-calculator`, `/portfolio` all load (they will be removed in later tasks).

---

## Phase 1 — Metadata & Navigation Overhaul

Goal: Rip out manufacturing/enterprise framing from centralized metadata and nav so subsequent page work inherits the new voice.

### Task 1.1: Rewrite site metadata constants

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Update `siteConfig.description`**

Replace in `src/lib/constants.ts`:

```typescript
// OLD
export const siteConfig = {
  name: 'Fritz Automation',
  legalName: 'Fritz Automation LLC',
  url: 'https://fritzautomation.dev',
  description: 'Automation consulting, software development, and manufacturing systems integration built on 20+ years of experience.',
}

// NEW
export const siteConfig = {
  name: 'Fritz Automation',
  legalName: 'Fritz Automation LLC',
  url: 'https://fritzautomation.dev',
  description: 'A small software studio by Joshua Fritzjunker. I build websites and custom web tools for small businesses.',
}
```

- [ ] **Step 2: Delete `companyStats` export**

Remove the `companyStats` const block (currently lines 102–107). The stats bar will be removed from the homepage and is not used elsewhere.

- [ ] **Step 3: Replace `navLinks` with flat structure**

Replace the entire `navLinks` export:

```typescript
export const navLinks: NavItem[] = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
```

- [ ] **Step 4: Rewrite `commandPalettePages` for the new page inventory**

Replace `commandPalettePages` with:

```typescript
export const commandPalettePages = [
  { href: '/', label: 'Home', section: 'Pages', keywords: ['home', 'landing', 'main'] },
  { href: '/work', label: 'Work', section: 'Pages', keywords: ['work', 'portfolio', 'projects', 'websites'] },
  { href: '/services', label: 'Services', section: 'Pages', keywords: ['services', 'websites', 'automation', 'internal tools'] },
  { href: '/demos', label: 'Demos', section: 'Pages', keywords: ['demos', 'examples', 'interactive'] },
  { href: '/about', label: 'About', section: 'Pages', keywords: ['about', 'josh', 'founder', 'story'] },
  { href: '/contact', label: 'Contact', section: 'Pages', keywords: ['contact', 'hire', 'email', 'project'] },
  { href: '/portal', label: 'Client Portal', section: 'Account', keywords: ['login', 'portal', 'account', 'client'] },
]
```

- [ ] **Step 5: Verify locally**

```bash
npm run dev
```

Visit the homepage. Check navigation shows the four flat links. Confirm the command palette (⌘K or the `>_` button) lists the new pages.

- [ ] **Step 6: Commit**

```bash
git add src/lib/constants.ts
git commit -m "Flatten navigation and strip enterprise framing from site constants"
git push
```

### Task 1.2: Rewrite root layout metadata

**Files:**
- Modify: `src/app/layout.tsx:18-60`

- [ ] **Step 1: Replace metadata object**

Replace the `metadata` export in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Fritz Automation — Custom software for small businesses',
    template: '%s | Fritz Automation',
  },
  description: 'A small software studio by Joshua Fritzjunker in Burlington, Iowa. I build websites and custom web tools for small businesses.',
  keywords: ['small business software', 'custom web development', 'web apps', 'internal tools', 'automation', 'Iowa web developer', 'Next.js developer'],
  authors: [{ name: 'Joshua Fritzjunker' }],
  creator: 'Joshua Fritzjunker',
  publisher: 'Fritz Automation LLC',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  metadataBase: new URL('https://fritzautomation.dev'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Fritz Automation — Custom software for small businesses',
    description: 'A small software studio by Joshua Fritzjunker. I build websites and custom web tools for small businesses.',
    url: 'https://fritzautomation.dev',
    siteName: 'Fritz Automation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fritz Automation — Custom software for small businesses',
    description: 'A small software studio by Joshua Fritzjunker.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Rewrite root metadata to small-studio framing"
git push
```

### Task 1.3: Update Header to the flat nav and remove dropdown code

**Files:**
- Modify: `src/components/layout/Header.tsx`

The existing Header has heavy dropdown logic that is no longer needed since all nav items are standalone links. We simplify it to just render the four flat links.

- [ ] **Step 1: Rewrite Header.tsx**

Replace the entire file content with:

```tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FritzLogo } from '@/components/FritzLogo'
import { navLinks } from '@/lib/constants'
import { cn } from '@/lib/utils'

function MorphText({ text, isActive }: { text: string; isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <span
      className="inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={cn(
            'inline-block transition-all duration-300',
            isActive ? 'text-primary' : isHovered ? 'text-primary' : 'text-slate-700'
          )}
          style={{
            transitionDelay: isHovered ? `${i * 30}ms` : '0ms',
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <Link href="/" className="group hover:opacity-90 transition-opacity" aria-label="Fritz Automation home">
              <FritzLogo width={200} variant="light" />
            </Link>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((item, index) => {
                if (!('href' in item)) return null
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li
                    key={item.href}
                    className={cn(
                      'transform transition-all duration-500 ease-out',
                      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    )}
                    style={{ transitionDelay: mounted ? `${index * 75}ms` : '0ms' }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'px-4 py-2 rounded-lg transition-colors font-medium block',
                        isActive ? 'bg-primary/10' : 'hover:bg-primary/5'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <MorphText text={item.label} isActive={isActive} />
                    </Link>
                  </li>
                )
              })}
              <li
                className={cn(
                  'ml-1 transform transition-all duration-500 ease-out',
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                )}
                style={{ transitionDelay: mounted ? `${navLinks.length * 75}ms` : '0ms' }}
              >
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                  className="px-3 py-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors font-mono text-sm"
                  aria-label="Open command palette"
                  title="Ctrl+K"
                >
                  &gt;_
                </button>
              </li>
              <li
                className={cn(
                  'ml-1 transform transition-all duration-500 ease-out',
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                )}
                style={{ transitionDelay: mounted ? `${(navLinks.length + 1) * 75}ms` : '0ms' }}
              >
                <Link href="/contact">
                  <Button size="sm">Start a project</Button>
                </Link>
              </li>
            </ul>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 z-50 md:hidden p-6 animate-slide-in-right shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mt-16">
              <ul className="space-y-2">
                {navLinks.map((item) => {
                  if (!('href' in item)) return null
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl transition-colors font-medium',
                          isActive ? 'text-primary bg-white/20' : 'text-white hover:bg-white/10'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
                <li className="pt-4">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Start a project</Button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify locally**

```bash
npm run dev
```

Visit homepage. Nav should show four links. Mobile menu should show the same four. Command palette `>_` button still present. No dropdown hover behavior remains.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "Simplify Header to flat navigation"
git push
```

### Task 1.4: Update Footer links and framing

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Read current Footer to identify dead links**

```bash
cat src/components/layout/Footer.tsx | head -200
```

- [ ] **Step 2: Remove links to deleted pages**

Remove any Footer references to `/industries`, `/case-studies`, `/roi-calculator`. If Footer uses a grouped nav structure, consolidate "Explore" / "Resources" columns into a single column containing: Work, Services, Demos, About, Contact.

Add a small "Client Portal" link in a less prominent position (e.g., below the copyright line, or in a "Account" column).

- [ ] **Step 3: Replace founder/company tagline**

Any footer byline along the lines of "Enterprise automation solutions" should be replaced with the short studio tagline, e.g., "A small software studio by Joshua Fritzjunker · Burlington, Iowa".

- [ ] **Step 4: Verify locally and commit**

```bash
npm run dev
```

Scroll to footer on any page. Confirm: no links to removed pages, Portal link is present but not emphasized, tagline is studio-voiced.

```bash
git add src/components/layout/Footer.tsx
git commit -m "Update footer links and tagline to studio framing"
git push
```

---

**CHECKPOINT 1 — User reviews Vercel preview.** Navigation, footer, metadata updated. Next phase deletes three pages.

---

## Phase 2 — Delete Dead Pages

### Task 2.1: Delete the Industries page

**Files:**
- Delete: `src/app/industries/` (entire directory and all contents)

- [ ] **Step 1: Remove the directory**

```bash
rm -rf src/app/industries
```

- [ ] **Step 2: Search for any remaining references**

Use Grep:

Pattern: `industries`
Glob: `src/**/*.{ts,tsx,md}`

For each match, determine if it's a route link (update or remove) or unrelated word usage (leave).

- [ ] **Step 3: Verify locally**

```bash
npm run dev
```

Visit `/industries` → should show 404. No nav or footer links should point to it.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove Industries page"
git push
```

### Task 2.2: Delete the Case Studies page

**Files:**
- Delete: `src/app/case-studies/`

- [ ] **Step 1: Remove the directory**

```bash
rm -rf src/app/case-studies
```

- [ ] **Step 2: Search for remaining references**

Grep pattern `case-studies` over `src/**/*.{ts,tsx,md}`. Remove any lingering links (there may be one in the Footer or an old homepage section — update or delete).

- [ ] **Step 3: Verify locally**

`/case-studies` → 404. Nothing in nav or footer links to it.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove Case Studies page"
git push
```

### Task 2.3: Delete the ROI Calculator page

**Files:**
- Delete: `src/app/roi-calculator/`

- [ ] **Step 1: Remove the directory**

```bash
rm -rf src/app/roi-calculator
```

- [ ] **Step 2: Search for remaining references**

Grep pattern `roi-calculator` or `ROI Calculator` over `src/**/*.{ts,tsx,md}`. Remove any lingering links.

- [ ] **Step 3: Verify locally and commit**

```bash
npm run dev
git add -A
git commit -m "Remove ROI Calculator page"
git push
```

### Task 2.4: Update sitemap and structured data

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/StructuredData.tsx` (if it references removed pages)

- [ ] **Step 1: Read and update sitemap**

```bash
cat src/app/sitemap.ts
```

Remove any entries for `/industries`, `/case-studies`, `/roi-calculator`. Add `/work` if `/portfolio` is listed (portfolio is being renamed in Phase 4, but sitemap can be updated now with the new URL — broken for a brief window, fine on the branch).

- [ ] **Step 2: Check StructuredData**

```bash
cat src/components/StructuredData.tsx
```

If it references removed pages or hard-coded manufacturing keywords, update to the new voice. Otherwise leave alone.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Update sitemap and structured data for new page inventory"
git push
```

---

**CHECKPOINT 2 — User reviews Vercel preview.** Three pages gone, nav and footer cleaned up. `/work` route still points to old `/portfolio` at this stage; that's addressed in Phase 4.

---

## Phase 3 — Typography & Program-Feel Chrome

Goal: Establish the visual system (monospace accent font, global chrome components) that every redesigned page will consume.

### Task 3.1: Add JetBrains Mono as an accent font

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts` (or `tailwind.config.js` — check which exists)

- [ ] **Step 1: Load the font via next/font**

In `src/app/layout.tsx`, replace the Inter import block:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})
```

Then update the `<html>` element in `RootLayout` to expose both variables:

```tsx
<html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
```

And the body:

```tsx
<body className="font-sans">
```

(Removes the direct `inter.className` usage in favor of CSS-variable-driven Tailwind classes, which the next step wires up.)

- [ ] **Step 2: Wire fonts into Tailwind config**

Find the tailwind config (`tailwind.config.ts` or `.js`). Extend `fontFamily`:

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
},
```

(If there's an existing `extend.fontFamily`, merge — don't overwrite.)

- [ ] **Step 3: Verify locally**

```bash
npm run dev
```

Open DevTools, inspect any element. Body should still look like Inter. Add `className="font-mono"` temporarily on any text to confirm JetBrains Mono renders.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add JetBrains Mono as accent font via Tailwind"
git push
```

### Task 3.2: Build the status bar component

**Files:**
- Create: `src/components/layout/StatusBar.tsx`
- Modify: `src/app/layout.tsx` (add component to root layout)

- [ ] **Step 1: Create the StatusBar component**

Create `src/components/layout/StatusBar.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

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
      className="fixed bottom-0 inset-x-0 z-40 h-6 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between px-3 select-none"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          online
        </span>
        <span className="text-slate-500">{pathAsFsPath(pathname)}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-500">fritz-automation</span>
        <span>{time || '--:--'}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add StatusBar to root layout**

In `src/app/layout.tsx`, import and render inside `<body>`:

```tsx
import { StatusBar } from '@/components/layout/StatusBar'

// ...inside <body>, after <Toaster>:
<StatusBar />
```

- [ ] **Step 3: Add bottom padding to main content**

To prevent the fixed status bar from overlapping page content, add `pb-6` to the `<main>` element in the root layout:

```tsx
<main id="main-content" className="pb-6">
  {children}
</main>
```

- [ ] **Step 4: Verify locally**

```bash
npm run dev
```

Bottom of every page: 24px dark status bar with a green dot, "online", current path like `~/about`, "fritz-automation", and a clock. Does not overlap page content.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add IDE-style status bar to every page"
git push
```

### Task 3.3: Build the file-path breadcrumbs component

**Files:**
- Create: `src/components/layout/PathCrumbs.tsx`

This is used by individual pages (About, Services, Work, etc.) near the top. Not global — pages opt in.

- [ ] **Step 1: Create PathCrumbs.tsx**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PathCrumbs({ trail }: { trail?: { label: string; href?: string }[] }) {
  const pathname = usePathname()

  // Auto-build from pathname if no explicit trail passed
  const segments = trail ?? pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg,
      href: '/' + arr.slice(0, i + 1).join('/'),
    }))

  return (
    <div className="font-mono text-xs text-slate-500 flex items-center gap-1 flex-wrap">
      <Link href="/" className="hover:text-emerald-400 transition-colors">~</Link>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-slate-600">/</span>
          {seg.href && i < segments.length - 1 ? (
            <Link href={seg.href} className="hover:text-emerald-400 transition-colors">
              {seg.label}
            </Link>
          ) : (
            <span className="text-slate-300">{seg.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

No visual change yet — component will be consumed by pages in later phases.

```bash
git add -A
git commit -m "Add PathCrumbs component for IDE-style breadcrumbs"
git push
```

### Task 3.4: Update CommandPalette content to the new page inventory

**Files:**
- Modify: `src/components/CommandPalette.tsx`

- [ ] **Step 1: Read current CommandPalette**

```bash
cat src/components/CommandPalette.tsx
```

- [ ] **Step 2: Confirm it consumes `commandPalettePages` from constants**

If it imports `commandPalettePages` from `@/lib/constants`, Task 1.1 already updated the data — no further change needed, just confirm it works. If it hard-codes a list, replace with an import.

- [ ] **Step 3: Verify locally**

Press `⌘K` / `Ctrl+K` or click the `>_` button. Confirm the listed pages match the new inventory: Home, Work, Services, Demos, About, Contact, Client Portal.

- [ ] **Step 4: Commit (if changes made)**

```bash
git add -A
git commit -m "Sync CommandPalette to new page inventory" || echo "No changes needed"
git push
```

---

**CHECKPOINT 3 — User reviews Vercel preview.** Status bar visible on every page, typography upgraded, command palette current. Homepage and content pages still use old copy; that's Phase 4+.

---

## Phase 4 — Rename Portfolio → Work

Goal: Move `/portfolio` to `/work` and strip back to the two real projects. Keep the file-tree + preview layout for later implementation.

### Task 4.1: Move the portfolio directory to /work

**Files:**
- Rename directory: `src/app/portfolio/` → `src/app/work/`

- [ ] **Step 1: Rename directory**

```bash
git mv src/app/portfolio src/app/work
```

- [ ] **Step 2: Search for any links to `/portfolio`**

Grep pattern `/portfolio` over `src/**/*.{ts,tsx,md}`. Replace with `/work`.

- [ ] **Step 3: Update any hard-coded page title or metadata in the moved page**

Open `src/app/work/page.tsx`:
- Change metadata `title: 'Portfolio'` → `'Work'`.
- Change hero `<h1>Website Portfolio</h1>` → `<h1>Selected work</h1>`.
- Change the "Our Work" badge text if present → `work/`.
- Update the hero subheading to studio-voiced copy, e.g., *"A small sample of sites I've built for clients. Each one shipped and in production."*

- [ ] **Step 4: Verify locally**

`/work` loads. `/portfolio` 404s (expected). Remaining content (Iowan Foodie, Two Makers Co cards) displays.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Rename /portfolio to /work and retitle page"
git push
```

### Task 4.2: Redesign Work page as file-tree + preview layout

**Files:**
- Modify: `src/app/work/page.tsx`

The IDE file-tree + preview-pane treatment is the signature "program feel" moment on this page.

- [ ] **Step 1: Replace the Work page body**

Full replacement of `src/app/work/page.tsx`:

```tsx
'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { DataStream } from '@/components/animations/DataStream'
import { MouseGrid } from '@/components/animations/MouseGrid'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const projects = [
  {
    id: 'iowan-foodie',
    file: 'iowan-foodie.tsx',
    title: 'Iowan Foodie',
    category: 'Content creator',
    description: 'A food content creator portfolio and blog showcasing Iowa\'s culinary scene. Clean, image-forward design built for engagement and discoverability.',
    url: 'https://www.iowanfoodie.com',
    image: '/portfolio/iowan-foodie.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      'Image-forward layout',
      'Mobile-responsive design',
      'Fast page loads',
      'SEO-optimized content',
      'Social media integration',
    ],
  },
  {
    id: 'two-makers-co',
    file: 'two-makers-co.tsx',
    title: 'Two Makers Co',
    category: 'E-commerce',
    description: 'An online store for handcrafted 3D-printed home decor and office products. Full shopping experience with cart, wishlist, and product filtering.',
    url: 'https://www.twomakers.co',
    image: '/portfolio/two-makers-co.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    highlights: [
      'Full e-commerce checkout',
      'Product filtering by category',
      'Shopping cart & wishlist',
      'User authentication',
      'Supabase image storage',
      'Mobile-first design',
    ],
  },
]

export default function WorkPage() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const active = projects.find(p => p.id === activeId) ?? projects[0]

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'work' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Selected work</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">
            A small sample of sites I've built for clients. Each one shipped and in production.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[220px_1fr] gap-6 rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
            {/* File tree */}
            <aside className="bg-slate-950/60 border-r border-slate-800 p-3">
              <div className="font-mono text-xs text-slate-500 px-2 py-1">EXPLORER</div>
              <ul className="mt-1 space-y-0.5">
                {projects.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveId(p.id)}
                      className={`w-full text-left font-mono text-sm px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                        activeId === p.id
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-slate-600">└─</span>
                      {p.file}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Preview pane */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {active.category}
                </span>
                <span>{active.file}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{active.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{active.description}</p>

              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mb-6">
                <Image
                  src={active.image}
                  alt={`${active.title} website screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {active.technologies.map(tech => (
                      <span key={tech} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Highlights</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {active.highlights.map(h => <li key={h}>· {h}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <Link
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-emerald-400 hover:text-emerald-300"
                >
                  $ open {active.url} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Verify locally**

`/work` loads. File-tree sidebar on the left with two entries. Clicking either switches the preview pane. Screenshot, description, stack, highlights all display. "$ open [url]" link opens the live site.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Redesign Work page with IDE file-tree + preview layout"
git push
```

---

**CHECKPOINT 4 — User reviews Vercel preview.** Work page is now the strongest expression of the program-feel aesthetic. Good moment for feedback before extending the pattern to other pages.

---

## Phase 5 — Homepage Reframe

The homepage is the biggest copy rewrite. Break into the six sections.

### Task 5.1: Draft homepage copy for user approval

**Files:** none (text review step)

- [ ] **Step 1: Draft concrete copy for each homepage section**

Assistant drafts the full homepage copy and presents it to user inline for approval before coding. Draft must include:
- Hero: tagline (≤ 18 words)
- What I build: two one-sentence outcomes + 3 bullets each
- Selected work: section intro sentence
- Who you're working with: 2–3 sentence personal intro
- How it works: 4 engagement steps in `$ command → output` style
- Final CTA: headline + subtext + button label

- [ ] **Step 2: User approves or edits copy**

User reviews and approves, or requests changes. Do not proceed until copy is locked.

### Task 5.2: Build new homepage — Hero section

**Files:**
- Modify: `src/app/page.tsx` (may involve near-complete rewrite)

- [ ] **Step 1: Read current homepage to identify reusable pieces**

```bash
cat src/app/page.tsx
ls src/components/home/
```

Note any existing components that can be reused (e.g., AnimatedCodeHero, AnimatedSections). Plan for replacement vs. reuse.

- [ ] **Step 2: Scaffold new homepage structure**

Replace `src/app/page.tsx` with a section-based layout. Keep the `<Header />` and `<Footer />` wrappers and the dark gradient backdrop with MouseGrid/DataStream.

Hero section with typing-cursor animated tagline. If a `TypingHero` component doesn't exist, create a small one:

```tsx
'use client'
import { useEffect, useState } from 'react'

export function TypingHero({ text, speed = 55 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return (
    <span className="font-mono">
      {shown}
      <span className="inline-block w-2 h-[1em] align-[-0.15em] bg-emerald-400 animate-pulse ml-1" />
    </span>
  )
}
```

Create this at `src/components/home/TypingHero.tsx`.

- [ ] **Step 3: Render the Hero section**

Replace the homepage hero JSX with the new structure. Use the approved tagline copy from Task 5.1:

```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-28">
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    <MouseGrid />
    <DataStream />
  </div>

  <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="inline-block mb-6 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-mono">
      fritz-automation ~ idle
    </div>
    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
      {/* Approved tagline from Task 5.1, wrapped in TypingHero */}
      <TypingHero text="<APPROVED_TAGLINE>" />
    </h1>
    <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
      {/* Approved subheading */}
    </p>
    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
      <Link href="/contact"><Button size="lg">Start a project</Button></Link>
      <Link href="/work"><Button size="lg" variant="outline">See my work</Button></Link>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verify locally**

Hero animates in, tagline types out letter by letter with a cursor, two CTAs visible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Homepage hero with typing tagline and new CTAs"
git push
```

### Task 5.3: Build "What I build" section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add two "file card" offerings below hero**

```tsx
<section className="bg-slate-950 py-20">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="font-mono text-xs text-slate-500 mb-2">// what i build</div>
    <h2 className="text-3xl md:text-4xl font-bold text-white">Two kinds of projects</h2>
    <p className="mt-3 text-slate-400 max-w-2xl">Both aimed at the same thing: software that gets out of your way so your business runs better.</p>

    <div className="mt-10 grid md:grid-cols-2 gap-5">
      <Link href="/services#websites" className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
          <span className="px-1.5 py-0.5 bg-slate-800 rounded">websites.tsx</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Websites &amp; online stores</h3>
        <p className="mt-2 text-slate-300">{/* approved one-sentence outcome */}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-400 font-mono">
          <li>· {/* approved bullet 1 */}</li>
          <li>· {/* approved bullet 2 */}</li>
          <li>· {/* approved bullet 3 */}</li>
        </ul>
        <div className="mt-5 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
      </Link>

      <Link href="/services#automation" className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
          <span className="px-1.5 py-0.5 bg-slate-800 rounded">automation.py</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Internal tools &amp; automation</h3>
        <p className="mt-2 text-slate-300">{/* approved one-sentence outcome */}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-400 font-mono">
          <li>· {/* approved bullet 1 */}</li>
          <li>· {/* approved bullet 2 */}</li>
          <li>· {/* approved bullet 3 */}</li>
        </ul>
        <div className="mt-5 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify locally and commit**

```bash
git add -A
git commit -m "Homepage 'what I build' file-card section"
git push
```

### Task 5.4: Build "Selected work" section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import project data and render preview tiles**

Below "What I build", add a section that shows the same two projects from Work page as smaller tiles:

```tsx
<section className="bg-slate-900 py-20 border-t border-slate-800">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="font-mono text-xs text-slate-500 mb-2">// selected work</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Shipped and in production</h2>
      </div>
      <Link href="/work" className="font-mono text-sm text-emerald-400 hover:text-emerald-300">see all →</Link>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      {/* For each of: iowan-foodie, two-makers-co */}
      <Link href="/work" className="group rounded-xl border border-slate-800 overflow-hidden bg-slate-950 hover:border-emerald-500/40 transition-colors">
        <div className="relative aspect-[16/10] bg-slate-900">
          <Image src="/portfolio/iowan-foodie.png" alt="Iowan Foodie" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="p-5">
          <div className="font-mono text-xs text-emerald-400">content-creator</div>
          <h3 className="text-lg font-semibold text-white mt-1">Iowan Foodie</h3>
          <p className="text-sm text-slate-400 mt-1">Food content portfolio and blog.</p>
        </div>
      </Link>

      <Link href="/work" className="group rounded-xl border border-slate-800 overflow-hidden bg-slate-950 hover:border-emerald-500/40 transition-colors">
        <div className="relative aspect-[16/10] bg-slate-900">
          <Image src="/portfolio/two-makers-co.png" alt="Two Makers Co" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="p-5">
          <div className="font-mono text-xs text-emerald-400">e-commerce</div>
          <h3 className="text-lg font-semibold text-white mt-1">Two Makers Co</h3>
          <p className="text-sm text-slate-400 mt-1">Custom online store for 3D-printed home decor.</p>
        </div>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify locally and commit**

```bash
git add -A
git commit -m "Homepage selected-work section"
git push
```

### Task 5.5: Build "Who you're working with" section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add personal intro section**

```tsx
<section className="bg-slate-950 py-20">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="font-mono text-xs text-slate-500 mb-2">// whoami</div>
    <h2 className="text-3xl md:text-4xl font-bold text-white">Hi, I'm Josh</h2>
    <p className="mt-5 text-lg text-slate-300 leading-relaxed">
      {/* Approved 2–3 sentence intro from Task 5.1 */}
    </p>
    <div className="mt-6">
      <Link href="/about" className="font-mono text-sm text-emerald-400 hover:text-emerald-300">about me →</Link>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Homepage personal intro section"
git push
```

### Task 5.6: Build "How it works" terminal-output section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add engagement-process section styled as terminal output**

```tsx
<section className="bg-slate-900 py-20 border-t border-slate-800">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="font-mono text-xs text-slate-500 mb-2">// how it works</div>
    <h2 className="text-3xl md:text-4xl font-bold text-white">What hiring me looks like</h2>

    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        <span className="font-mono text-xs text-slate-500 ml-2">~/fritz-automation/process.sh</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">
        {/* Use approved process steps from Task 5.1; 3–4 steps in this pattern */}
        <div><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz chat</span></div>
        <div className="text-slate-500">→ 30-min call, no pressure. We figure out if I'm the right fit.</div>
        <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz propose</span></div>
        <div className="text-slate-500">→ Within a few days: written proposal with scope, timeline, and fixed price.</div>
        <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz build</span></div>
        <div className="text-slate-500">→ I build. You see progress weekly. Changes are easy during the build.</div>
        <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz launch</span></div>
        <div className="text-slate-500">→ Ship it. Ongoing support included for the first month; retainer after that if you want it.</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Homepage terminal-style how-it-works section"
git push
```

### Task 5.7: Build final CTA section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add closing CTA**

```tsx
<section className="bg-slate-950 py-24">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-white">Have a project in mind?</h2>
    <p className="mt-4 text-slate-400">
      Tell me about it. I reply to every inquiry personally, usually within a day.
    </p>
    <div className="mt-8">
      <Link href="/contact"><Button size="lg">Start a project</Button></Link>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Remove stale homepage sections**

Review the imports and remaining JSX in `src/app/page.tsx`. Delete any imported-but-unused components (old stats bars, testimonials, industries grid, ROI teaser). Delete unused imports.

- [ ] **Step 3: Verify locally**

Full homepage scroll: hero → what I build → selected work → whoami → how it works → final CTA → footer. No leftover sections. No console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Homepage final CTA and remove stale sections"
git push
```

### Task 5.8: Clean up unused homepage components

**Files:**
- Delete (if unused): `src/components/home/AnimatedSections.tsx`
- Delete (if unused): `src/components/AnimatedCodeHero.tsx`
- Delete (if unused): any FAQ or demo-preview components referenced only by old homepage

- [ ] **Step 1: Check usage**

For each candidate file, Grep its export name across `src/**/*.{ts,tsx}`. If no other consumer, delete.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Remove unused homepage components"
git push
```

---

**CHECKPOINT 5 — User reviews Vercel preview.** Homepage is fully reframed. Biggest visible change in the project. Good moment for significant copy/tone feedback before extending to Services/About/Contact.

---

## Phase 6 — Services Page

### Task 6.1: Draft Services copy for user approval

**Files:** none (text review step)

- [ ] **Step 1: Draft copy for both services**

For each of `websites.tsx` and `automation.py` tabs, draft:
- Outcome-first intro paragraph (2–3 sentences)
- "What's included" bullet list (5–8 items)
- Typical project shapes (3–4 examples)
- Timeline ranges (e.g., "2–6 weeks")
- Price range with softening language — **user provides the actual numbers** (e.g., "Most projects land in $X–$Y")
- For automation only: the honest "ask me about past work" note

- [ ] **Step 2: User approves copy and provides pricing numbers**

Do not proceed until copy and pricing are locked.

### Task 6.2: Build tabbed Services page

**Files:**
- Modify: `src/app/services/page.tsx`

- [ ] **Step 1: Read current services page structure**

```bash
ls src/components/services
cat src/app/services/page.tsx | head -100
```

Note any reusable components.

- [ ] **Step 2: Replace services page with tabbed layout**

Full replacement. Use approved copy from Task 6.1. Structure:

```tsx
'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useState } from 'react'

const tabs = [
  { id: 'websites', file: 'websites.tsx', label: 'Websites & online stores' },
  { id: 'automation', file: 'automation.py', label: 'Internal tools & automation' },
] as const

export default function ServicesPage() {
  const [tab, setTab] = useState<typeof tabs[number]['id']>('websites')

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'services' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Services</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">{/* approved lead-in */}</p>
        </div>
      </section>

      <section className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab bar */}
          <div className="flex border-b border-slate-800 mb-8 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.file}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'websites' && <WebsitesPanel />}
          {tab === 'automation' && <AutomationPanel />}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function WebsitesPanel() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Websites &amp; online stores</h2>
      <p className="mt-3 text-slate-300 leading-relaxed">{/* approved intro */}</p>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">What's included</h3>
      <ul className="mt-2 space-y-1.5 text-slate-300">
        {/* approved bullets */}
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Typical projects</h3>
      <ul className="mt-2 space-y-1.5 text-slate-300">
        {/* approved bullets */}
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Timeline &amp; pricing</h3>
      <p className="mt-2 text-slate-300">
        {/* approved "Most projects land in $X–$Y, typically 2–6 weeks" copy */}
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/contact"><Button>Start a project</Button></Link>
        <Link href="/work"><Button variant="outline">See examples</Button></Link>
      </div>
    </div>
  )
}

function AutomationPanel() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Internal tools &amp; automation</h2>
      <p className="mt-3 text-slate-300 leading-relaxed">{/* approved intro */}</p>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">What's included</h3>
      <ul className="mt-2 space-y-1.5 text-slate-300">
        {/* approved bullets */}
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Typical projects</h3>
      <ul className="mt-2 space-y-1.5 text-slate-300">
        {/* approved bullets */}
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Timeline &amp; pricing</h3>
      <p className="mt-2 text-slate-300">
        {/* approved "Most projects land in $X–$Y" copy */}
      </p>

      <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-sm text-slate-400">
        {/* approved "ask me about past work" honest note */}
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/contact"><Button>Start a project</Button></Link>
        <Link href="/demos"><Button variant="outline">See demos</Button></Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Anchor links from homepage file-cards**

The homepage "what I build" cards link to `/services#websites` and `/services#automation`. Add URL-hash → tab-state sync:

Inside `ServicesPage`, use a `useEffect` that reads `window.location.hash`:

```tsx
import { useEffect } from 'react'

// inside ServicesPage, right after useState:
useEffect(() => {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'websites' || hash === 'automation') setTab(hash)
}, [])
```

- [ ] **Step 4: Clean up obsolete services sub-components**

```bash
ls src/components/services
```

Remove any that are no longer referenced (seven-service grid, industry selector, etc.).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Redesign Services page with two-tab IDE layout"
git push
```

---

**CHECKPOINT 6 — User reviews Vercel preview.**

---

## Phase 7 — About Page

### Task 7.1: Draft About copy for user approval

**Files:** none (text review)

- [ ] **Step 1: Draft the problem-solver narrative**

Blocks to draft:
- Opener: 1-sentence who/where (*"I'm Josh Fritzjunker. I build software in Burlington, Iowa."*)
- The 15-year arc: self-taught → software degree → professional roles → independent via Fritz Automation (3–5 sentences, no specific employer names)
- How I work: 4–5 short value statements
- Why Fritz Automation exists: 2–3 sentences on motivation/approach
- Closing CTA

- [ ] **Step 2: User approves copy**

### Task 7.2: Build About page with code-file treatment

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Replace About page**

Structure the prose as a syntax-highlighted source file — line numbers on the left gutter, prose rendered as `//` comments and `const` declarations. Keep it readable:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'About Joshua Fritzjunker and Fritz Automation.',
}

// Renders one "line" of the code-style prose layout
function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-xs text-slate-600 select-none w-8 text-right pt-1">{n}</span>
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  )
}

export default function AboutPage() {
  // Each entry becomes a line. Mix of prose-as-comment and faux-code declarations.
  // Content populated with user-approved copy from Task 7.1.
  const lines: React.ReactNode[] = [
    <span className="font-mono text-emerald-400">// about.md</span>,
    <span> </span>,
    <span className="text-slate-200">{/* opening sentence from approved copy */}</span>,
    <span> </span>,
    <span className="font-mono text-slate-500">// the 15-year arc</span>,
    <span className="text-slate-300">{/* paragraph 1 */}</span>,
    <span className="text-slate-300">{/* paragraph 2 */}</span>,
    <span> </span>,
    <span className="font-mono text-slate-500">// how i work</span>,
    <span className="font-mono text-emerald-300">const values = [</span>,
    <span className="pl-6 text-slate-300">"{/* value 1 */}",</span>,
    <span className="pl-6 text-slate-300">"{/* value 2 */}",</span>,
    <span className="pl-6 text-slate-300">"{/* value 3 */}",</span>,
    <span className="pl-6 text-slate-300">"{/* value 4 */}",</span>,
    <span className="font-mono text-emerald-300">]</span>,
    <span> </span>,
    <span className="font-mono text-slate-500">// why fritz automation exists</span>,
    <span className="text-slate-300">{/* approved paragraph */}</span>,
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'about' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">About</h1>
        </div>
      </section>

      <section className="bg-slate-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="font-mono text-xs text-slate-500 ml-2">~/about.md</span>
            </div>
            <div className="p-6 space-y-1">
              {lines.map((ln, i) => <Line key={i} n={i + 1}>{ln}</Line>)}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact"><Button>Start a project</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Remove obsolete About sub-components**

Check `src/app/about/` and `src/components/` for anything only used by the old About page (animated timeline, team grid, etc.) and remove if unused.

- [ ] **Step 3: Verify locally**

`/about` renders the code-file style body. Prose readable, line numbers visible, macOS-style window chrome in place.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Redesign About page in code-file style"
git push
```

---

**CHECKPOINT 7 — User reviews Vercel preview.**

---

## Phase 8 — Contact Page

### Task 8.1: Rebuild Contact page in dev-tool-form style

**Files:**
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1: Read current contact form implementation**

```bash
cat src/app/contact/page.tsx
```

Identify the form submit handler and preserve it. Only the visual treatment and field labels change.

- [ ] **Step 2: Rebuild with config-file framing**

Wrap the form in an IDE window-chrome container. Labels use `key:` format. Submit button says `deploy` or `submit →`. Keep all fields, validation, submit handler.

Minimal structure (adapt to existing submit logic):

```tsx
<div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
  <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
    <span className="font-mono text-xs text-slate-500 ml-2">~/new-project.yaml</span>
  </div>
  <form className="p-6 space-y-4 font-mono text-sm" onSubmit={/* existing handler */}>
    <div>
      <label className="block text-emerald-400 mb-1">name:</label>
      <input name="name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:border-emerald-500 outline-none" />
    </div>
    {/* email, company, project_type (select: website | internal_tool | not_sure), budget_range (optional select), message */}
    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded transition-colors">
      $ submit →
    </button>
  </form>
</div>
```

Keep existing form validation + server-action / API route intact.

- [ ] **Step 3: Update page hero + PathCrumbs like the other pages**

- [ ] **Step 4: Verify locally**

Submit a test inquiry. Confirm email actually sends (or whatever the existing backend does). Confirm all fields have proper labels/validation.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Redesign Contact page in dev-tool-form style"
git push
```

---

**CHECKPOINT 8 — User reviews Vercel preview.** Validate end-to-end form submission in preview.

---

## Phase 9 — Demos Page Stub

### Task 9.1: Replace Demos page with coming-soon stub

**Files:**
- Modify: `src/app/demos/page.tsx`

- [ ] **Step 1: Check existing Demos content**

```bash
ls src/app/demos
ls src/components/demos
cat src/app/demos/page.tsx | head -80
```

If the existing page shows fake/aspirational demos, replace it. If it shows real working demos, wrap them in the new visual treatment and keep them.

- [ ] **Step 2: Replace with honest placeholder**

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Demos',
  description: 'Live demo projects showing internal-tool and automation capabilities.',
}

export default function DemosPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Demos</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Small, self-contained example projects that show what I can build on the internal-tools &amp; automation side.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 font-mono text-sm text-slate-400">
            <div className="text-emerald-400">$ ls -la ~/demos</div>
            <div className="mt-2">total 0</div>
            <div>drwxr-xr-x  Josh  staff     .</div>
            <div>drwxr-xr-x  Josh  staff     ..</div>
            <div className="mt-4 text-slate-500">// Working on a few of these — will live here when they ship.</div>
            <div className="text-slate-500">// In the meantime, <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 underline">tell me about your project</Link> and I can walk through what I've built for past employers.</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Delete obsolete demo components if any are aspirational/fake**

Check `src/components/demos/`. Keep components that will be reused for real demos; delete any that are fake.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Replace Demos page with honest coming-soon stub"
git push
```

---

## Phase 10 — Final Polish

### Task 10.1: Global copy scrub for voice consistency

**Files:** any page with lingering old voice

- [ ] **Step 1: Grep for leftover enterprise vocabulary**

Run Grep for each of these strings across `src/app/**/*.tsx` and `src/components/**/*.tsx`:

- `enterprise`
- `our team`
- `we build`, `we help`, `we deliver`
- `solutions` (as noun referring to products)
- `20+ years`
- `10,000,000` or `10M+`
- `99.9%`
- `manufacturing`
- `mission-critical`

For each match:
- If page is updated in earlier phases: confirm the match is intentional (e.g., a legal disclaimer) or fix.
- If page is not in scope (Privacy, Terms, Portal, Admin): touch only metadata/tagline text, leave functional code alone.

- [ ] **Step 2: Commit any edits**

```bash
git add -A
git commit -m "Scrub leftover enterprise vocabulary across site" || echo "No changes"
git push
```

### Task 10.2: Mobile QA pass

**Files:** any page that renders on mobile poorly

- [ ] **Step 1: Test each updated page at 375px width**

In browser DevTools, set viewport to 375x812. Walk every updated page:
- Home
- Work (file-tree may need to stack vertically on mobile)
- Services (tabs may need to scroll horizontally)
- About (code-file container)
- Contact
- Demos

- [ ] **Step 2: Fix any overflow or layout bugs**

Likely candidates: file-tree sidebar on Work, tab bar overflow on Services, long monospace strings wrapping badly.

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "Mobile polish across reframed pages"
git push
```

### Task 10.3: Delete unused components and assets

**Files:**
- Various under `src/components/`

- [ ] **Step 1: Identify orphans**

For each component file under `src/components/` not touched in earlier phases, Grep for its export name. If zero consumers, it's an orphan from deleted pages.

High-probability orphans to check:
- `src/components/home/AnimatedSections.tsx`
- `src/components/AnimatedCodeHero.tsx`
- `src/components/FAQ.tsx` (if not used on About or Services)
- `src/components/NewsletterForm.tsx` (if not used anywhere)
- Anything under `src/components/demos/` not used by the new Demos stub
- Anything under `src/components/services/` not used by the new Services page

Also check `public/portfolio/aquila-group.png` — Aquila was removed in a prior PR; the image is probably safe to delete now.

- [ ] **Step 2: Delete orphans**

```bash
rm <each confirmed orphan>
```

- [ ] **Step 3: Build to confirm nothing broke**

```bash
npm run build
```

Expected: clean build, no missing-import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove orphaned components and assets from reframe"
git push
```

### Task 10.4: Open pull request

**Files:** none (GitHub step)

- [ ] **Step 1: Confirm branch state**

```bash
git status
git log --oneline main..HEAD | head -30
```

Expected: clean working tree; many commits on `reframe-site` vs. `main`.

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "Site reframe: personal-voice studio with IDE aesthetic" --body "$(cat <<'EOF'
## Summary
- Reframes Fritz Automation from an enterprise-consultancy brand to a personal-voice small software studio.
- Removes all manufacturing-industry framing (conflict-of-interest with day-job employer).
- Commits fully to an IDE/program-feel visual identity (tabs, status bar, breadcrumbs, file-tree, terminal-output sections).
- Trims site from 10+ routes to 6 content pages; deletes fictional case studies.
- Narrows 7 services to 2 outcome-named offerings.

## Design docs
- Spec: `docs/superpowers/specs/2026-04-14-site-reframe-design.md`
- Plan: `docs/superpowers/plans/2026-04-14-site-reframe.md`

## Test plan
- [ ] Vercel preview deploys without errors.
- [ ] Every nav link lands on a 200 page.
- [ ] `/industries`, `/case-studies`, `/roi-calculator`, `/portfolio` all 404.
- [ ] `/work` and the new services tabs render correctly on desktop and mobile.
- [ ] Contact form submits end-to-end.
- [ ] Client portal + admin (auth-gated) unaffected by changes.
- [ ] Command palette lists updated page set.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Share PR URL with user for final review**

---

## Self-Review Checklist (performed during plan writing)

**Spec coverage:** Every major spec section has at least one implementation task:
- Audience / voice → Phase 1 (metadata) + Phase 5 (homepage personal intro) + Phase 7 (About)
- Aesthetic direction → Phase 3 (typography, status bar, breadcrumbs) + per-page IDE treatments in Phases 4–8
- Page inventory → Phase 2 (deletions) + all page-rebuild phases
- Services structure → Phase 6
- Proof strategy → Phase 4 (Work) + Phase 9 (Demos stub)
- Pricing → Task 6.1 copy draft includes price-range placeholder
- Navigation → Task 1.1 and Task 1.3
- Copy voice → Task 10.1 scrub pass

**Placeholder scan:** Task 5.1, 6.1, and 7.1 explicitly flag copy-draft placeholders that must be resolved with user approval before the subsequent coding tasks. Price numbers are user-provided. Tagline is user-provided. No "TODO" or "fill in later" in code steps.

**Type consistency:** `navLinks`, `commandPalettePages`, `projects`, `tabs` all use consistent shapes within the tasks that reference them. Component names (`StatusBar`, `PathCrumbs`, `TypingHero`) are used consistently.
