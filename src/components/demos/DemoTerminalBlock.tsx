import type { ReactNode } from 'react'

export function DemoTerminalBlock({
  filename,
  children,
}: {
  filename: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        <span className="font-mono text-xs text-slate-500 ml-2">{filename}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}
