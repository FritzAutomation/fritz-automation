'use client'

import { useEffect, useState, useCallback } from 'react'

const shortcuts = [
  { key: 'Ctrl+K', desc: 'Command palette' },
  { key: '1', desc: 'Home' },
  { key: '2', desc: 'Work' },
  { key: '3', desc: 'Services' },
  { key: '4', desc: 'Demos' },
  { key: '5', desc: 'About' },
  { key: '6', desc: 'Contact' },
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
            <button onClick={close} className="text-slate-500 hover:text-slate-300 text-sm font-mono">esc</button>
          </div>
          <div className="space-y-2">
            {shortcuts.map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
