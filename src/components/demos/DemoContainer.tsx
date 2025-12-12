'use client'

import { ReactNode } from 'react'

interface DemoContainerProps {
  title: string
  description: string
  children: ReactNode
}

export function DemoContainer({ title, description, children }: DemoContainerProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
