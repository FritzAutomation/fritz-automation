'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FritzLogo } from '@/components/FritzLogo'
import { cn } from '@/lib/utils'
import { track } from '@vercel/analytics'

const tabs = [
  { href: '/', label: '~/home' },
  { href: '/work', label: '~/work' },
  { href: '/services', label: '~/services' },
  { href: '/demos', label: '~/demos' },
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
  const [easter, setEaster] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--line)]">
        <div className="max-w-[100vw] mx-auto">
          <nav className="flex items-center h-12">
            <Link
              href="/"
              className="shrink-0 px-4 hover:opacity-80 transition-opacity relative"
              aria-label="Fritz Automation home"
              onMouseEnter={() => setEaster(true)}
              onMouseLeave={() => setEaster(false)}
            >
              <FritzLogo width={140} variant="dark" />
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute left-4 top-full mt-2 px-2.5 py-1 rounded-md border border-[var(--line)] bg-[var(--bg-card)] font-mono text-[12px] text-[var(--accent)] whitespace-nowrap transition-all duration-200 hidden md:block',
                  easter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                )}
              >
                // hi.
              </span>
            </Link>

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
                        ? 'text-[var(--accent-bright)] bg-[var(--surface)]'
                        : 'text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface)]'
                    )}
                    style={{ transitionDelay: mounted ? `${index * 60}ms` : '0ms' }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 shrink-0">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="px-2 py-1 rounded text-[var(--ink-dim)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors font-mono text-sm flex items-center gap-1.5"
                aria-label="Open command palette"
                title="Press / or Ctrl+K"
              >
                <span>&gt;_</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded border border-[var(--line)] border-b-2 bg-[var(--surface)] text-[10px] leading-none text-[var(--accent)]">/</kbd>
              </button>
              <Link
                href="/contact"
                onClick={() => track('start_project_clicked', { source: 'header_nav' })}
              >
                <Button size="sm">Start a project</Button>
              </Link>
            </div>

            <div className="md:hidden ml-auto px-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--bg-card)] transition-colors"
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

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[var(--bg)] z-50 md:hidden p-6 shadow-2xl border-l border-[var(--line)]">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--line-soft)] text-[var(--ink-soft)]"
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
                        ? 'text-[var(--accent-bright)] bg-[var(--accent-glow)]'
                        : 'text-[var(--ink-soft)] hover:bg-[var(--bg-card)]'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {tab.label}
                  </Link>
                )
              })}
              <div className="pt-4">
                <Link
                  href="/contact"
                  onClick={() => {
                    track('start_project_clicked', { source: 'header_mobile_menu' })
                    setMobileMenuOpen(false)
                  }}
                >
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
