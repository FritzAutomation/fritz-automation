'use client'

import { cn } from '@/lib/utils'

interface Demo {
  id: string
  label: string
  icon: ReactNode
}

import { ReactNode } from 'react'

interface DemoTabsProps {
  demos: Demo[]
  activeDemo: string
  onSelect: (id: string) => void
}

export function DemoTabs({ demos, activeDemo, onSelect }: DemoTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-xl">
      {demos.map((demo) => (
        <button
          key={demo.id}
          onClick={() => onSelect(demo.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all',
            activeDemo === demo.id
              ? 'bg-white text-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          )}
        >
          {demo.icon}
          <span className="hidden sm:inline">{demo.label}</span>
        </button>
      ))}
    </div>
  )
}
