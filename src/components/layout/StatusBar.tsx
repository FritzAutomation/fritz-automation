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
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-shortcut-overlay'))}
          className="text-slate-600 hover:text-slate-400 transition-colors"
          aria-label="Show keyboard shortcuts"
        >
          ? shortcuts
        </button>
        <span>{time || '--:--'}</span>
      </div>
    </div>
  )
}
