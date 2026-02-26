'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FritzLogo } from '@/components/FritzLogo'
import { navLinks, isNavGroup } from '@/lib/constants'
import type { NavGroup, NavLink as NavLinkType } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Text morph component - letters animate on hover with staggered wave effect
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
            isActive
              ? 'text-primary'
              : isHovered
                ? 'text-primary'
                : 'text-slate-700'
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

// Chevron icon for dropdowns
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-4 h-4 transition-transform duration-200', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLUListElement>(null)

  // Trigger staggered animation on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(label)
    }, 75)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }, [])

  // Keyboard navigation for dropdowns
  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent, group: NavGroup) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setOpenDropdown(prev => prev === group.label ? null : group.label)
        break
      case 'Escape':
        e.preventDefault()
        setOpenDropdown(null)
        // Return focus to the trigger button
        ;(e.currentTarget as HTMLElement).focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        if (openDropdown !== group.label) {
          setOpenDropdown(group.label)
        }
        // Focus the first menu item
        requestAnimationFrame(() => {
          const panel = (e.currentTarget as HTMLElement).closest('li')?.querySelector('[role="menu"]')
          const firstItem = panel?.querySelector('a') as HTMLElement | null
          firstItem?.focus()
        })
        break
    }
  }, [openDropdown])

  const handleMenuItemKeyDown = useCallback((e: React.KeyboardEvent) => {
    const menuItems = Array.from(
      (e.currentTarget as HTMLElement).closest('[role="menu"]')?.querySelectorAll('a') || []
    ) as HTMLElement[]
    const currentIndex = menuItems.indexOf(e.currentTarget as HTMLElement)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        menuItems[(currentIndex + 1) % menuItems.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length]?.focus()
        break
      case 'Escape':
        e.preventDefault()
        setOpenDropdown(null)
        // Return focus to the parent trigger button
        ;(e.currentTarget as HTMLElement).closest('li')?.querySelector('button')?.focus()
        break
    }
  }, [])

  // Check if any child of a group is the active page
  function isGroupActive(group: NavGroup): boolean {
    return group.children.some(
      child => pathname === child.href || pathname.startsWith(child.href + '/')
    )
  }

  // Toggle mobile accordion group
  function toggleMobileGroup(label: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="group hover:opacity-90 transition-opacity" aria-label="Fritz Automation home">
              <FritzLogo width={200} variant="light" />
            </Link>

            {/* Desktop Navigation */}
            <ul ref={navRef} className="hidden md:flex items-center gap-1">
              {navLinks.map((item, index) => {
                if (isNavGroup(item)) {
                  const groupActive = isGroupActive(item)
                  return (
                    <li
                      key={item.label}
                      className={cn(
                        'relative transform transition-all duration-500 ease-out',
                        mounted
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-4'
                      )}
                      style={{
                        transitionDelay: mounted ? `${index * 75}ms` : '0ms'
                      }}
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 rounded-lg transition-colors font-medium',
                          groupActive
                            ? 'bg-primary/10 text-primary'
                            : openDropdown === item.label
                              ? 'bg-primary/5 text-primary'
                              : 'text-slate-700 hover:bg-primary/5 hover:text-primary'
                        )}
                        onClick={() => setOpenDropdown(prev => prev === item.label ? null : item.label)}
                        onKeyDown={(e) => handleDropdownKeyDown(e, item)}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            openDropdown === item.label && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Dropdown panel */}
                      {openDropdown === item.label && (
                        <div
                          role="menu"
                          className="absolute top-full left-0 mt-1 min-w-[180px] bg-white rounded-xl shadow-lg border border-slate-200/50 py-2 dropdown-enter"
                        >
                          {item.children.map((child) => {
                            const childActive = pathname === child.href || pathname.startsWith(child.href + '/')
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                role="menuitem"
                                tabIndex={0}
                                onKeyDown={handleMenuItemKeyDown}
                                className={cn(
                                  'block px-4 py-2.5 text-sm font-medium transition-colors',
                                  childActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-slate-700 hover:bg-primary/5 hover:text-primary'
                                )}
                                aria-current={childActive ? 'page' : undefined}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </li>
                  )
                }

                // Standalone link
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li
                    key={item.href}
                    className={cn(
                      'transform transition-all duration-500 ease-out',
                      mounted
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4'
                    )}
                    style={{
                      transitionDelay: mounted ? `${index * 75}ms` : '0ms'
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'px-4 py-2 rounded-lg transition-colors font-medium block',
                        isActive
                          ? 'bg-primary/10'
                          : 'hover:bg-primary/5'
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
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
                )}
                style={{
                  transitionDelay: mounted ? `${navLinks.length * 75}ms` : '0ms'
                }}
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
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
                )}
                style={{
                  transitionDelay: mounted ? `${(navLinks.length + 1) * 75}ms` : '0ms'
                }}
              >
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
                {navLinks.map((item) => {
                  if (isNavGroup(item)) {
                    const groupActive = isGroupActive(item)
                    const isExpanded = expandedGroups.has(item.label)
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => toggleMobileGroup(item.label)}
                          className={cn(
                            'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors font-medium',
                            groupActive
                              ? 'text-primary bg-white/20'
                              : 'text-white hover:bg-white/10'
                          )}
                          aria-expanded={isExpanded}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              'text-white/60',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const childActive = pathname === child.href || pathname.startsWith(child.href + '/')
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                      'block px-4 py-2.5 rounded-xl transition-colors font-medium text-sm',
                                      childActive
                                        ? 'text-primary bg-white/20'
                                        : 'text-white/80 hover:bg-white/10'
                                    )}
                                    aria-current={childActive ? 'page' : undefined}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  }

                  // Standalone mobile link
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl transition-colors font-medium',
                          isActive
                            ? 'text-primary bg-white/20'
                            : 'text-white hover:bg-white/10'
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
