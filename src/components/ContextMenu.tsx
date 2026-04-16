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
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'a') return
      if (target.closest('input, textarea, select, a')) return
      if (!target.closest('main')) return

      e.preventDefault()
      const menuW = 220
      const menuH = 280
      const x = Math.min(e.clientX, window.innerWidth - menuW - 8)
      const y = Math.min(e.clientY, window.innerHeight - menuH - 8)
      setPos({ x, y })
      setShowNav(false)
      setCopied(false)
    }

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
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
    } catch { close() }
  }

  if (!pos) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-[55] bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1.5 w-[220px] font-mono text-sm"
      style={{ left: pos.x, top: pos.y }}
    >
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

      <button
        onClick={() => { window.dispatchEvent(new CustomEvent('open-command-palette')); close() }}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
      >
        Command palette
        <span className="text-slate-600 text-xs">Ctrl+K</span>
      </button>

      <button
        onClick={handleCopyUrl}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy page URL'}
      </button>

      <button
        onClick={() => { window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay')); close() }}
        className="w-full text-left px-3 py-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
      >
        Keyboard shortcuts
        <span className="text-slate-600 text-xs">?</span>
      </button>

      <div className="border-t border-slate-800 my-1" />

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
