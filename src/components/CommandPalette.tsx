'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { commandPalettePages } from '@/lib/constants'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = commandPalettePages.filter((page) => {
    const q = query.toLowerCase()
    return (
      page.label.toLowerCase().includes(q) ||
      page.section.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })

  // Group by section
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, page) => {
    if (!acc[page.section]) acc[page.section] = []
    acc[page.section].push(page)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const navigate = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router]
  )

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Listen for custom event from Header button
  useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener('open-command-palette', onOpen)
    return () => window.removeEventListener('open-command-palette', onOpen)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % flatFiltered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + flatFiltered.length) % flatFiltered.length)
    } else if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
      e.preventDefault()
      navigate(flatFiltered[selectedIndex].href)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  if (!open) return null

  let flatIndex = 0

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm palette-backdrop-enter"
        onClick={close}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl palette-enter overflow-hidden"
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <svg
            className="w-5 h-5 text-slate-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 outline-none font-mono text-sm"
            aria-label="Search commands"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 bg-slate-800 border border-slate-700 rounded font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {flatFiltered.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm font-mono">
              No results found
            </div>
          ) : (
            Object.entries(grouped).map(([section, pages]) => (
              <div key={section}>
                <div className="px-4 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  {section}
                </div>
                {pages.map((page) => {
                  const idx = flatIndex++
                  const isSelected = idx === selectedIndex
                  return (
                    <button
                      key={page.href}
                      onClick={() => navigate(page.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="text-sm font-mono">{page.label}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-700 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
              &uarr;&darr;
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
              &crarr;
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  )
}
