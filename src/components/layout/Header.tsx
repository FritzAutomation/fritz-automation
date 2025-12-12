'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { navLinks } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="group hover:opacity-90 transition-opacity" aria-label="Fritz Automation home">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'px-4 py-2 rounded-lg transition-colors font-medium',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              <li className="ml-2">
                <Link href="/contact">
                  <Button size="sm">Get a Quote</Button>
                </Link>
              </li>
            </ul>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 z-50 md:hidden p-6 animate-slide-in-right shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-16">
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl transition-colors font-medium',
                          isActive
                            ? 'text-primary bg-white/20'
                            : 'text-white hover:bg-white/10'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
                <li className="pt-4">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get a Quote</Button>
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
