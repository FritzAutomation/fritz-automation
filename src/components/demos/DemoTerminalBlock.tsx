import type { ReactNode } from 'react'

export function DemoTerminalBlock({
  filename,
  children,
}: {
  filename: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
      <div className="bg-[var(--bg-soft)] border-b border-[var(--line)] px-4 py-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-r)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-y)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-g)]" />
        <span className="font-mono text-xs text-[var(--ink-dim)] ml-2">{filename}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}
