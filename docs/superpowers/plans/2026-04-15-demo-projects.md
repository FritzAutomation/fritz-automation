# Demo Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two interactive demo projects (CSV Dashboard and Client Portal) on the Fritz Automation marketing site to prove internal-tool/automation capability.

**Architecture:** Each demo is a Next.js App Router sub-route under `/demos/`. Demo logic lives in client components under `src/components/demos/`. A shared `DemoTerminalBlock` component provides the IDE-chrome terminal containers used for pain-point framing and production callouts. Sample data is co-located in a single `SampleData.ts` file. The demos index page is updated from a stub to a directory listing with cards.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3.4, Recharts (charting), PapaParse (CSV parsing), existing JetBrains Mono font.

**Development Process:**
- Branch: `demo-projects` off `main`.
- Vercel preview on every push.
- Production untouched until PR merged.

**Design Spec Reference:** `docs/superpowers/specs/2026-04-15-demo-projects-design.md`

---

## Phase 0 — Setup

### Task 0.1: Create branch and install dependencies

**Files:** `package.json`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b demo-projects
```

- [ ] **Step 2: Install dependencies**

```bash
npm install recharts papaparse
npm install -D @types/papaparse
```

- [ ] **Step 3: Commit and push**

```bash
git add package.json package-lock.json
git commit -m "Add recharts and papaparse dependencies for demo projects"
git push -u origin demo-projects
```

---

## Phase 1 — Shared Components + Sample Data

### Task 1.1: Create DemoTerminalBlock component

**Files:**
- Create: `src/components/demos/DemoTerminalBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demos/DemoTerminalBlock.tsx
git commit -m "Add reusable DemoTerminalBlock component"
```

---

### Task 1.2: Create SampleData

**Files:**
- Create: `src/components/demos/SampleData.ts`

- [ ] **Step 1: Create sample CSV data and portal projects**

```typescript
// Realistic sales data — 30 rows with Date, Product, Category, Region, Units, Revenue
export const sampleCsvString = `Date,Product,Category,Region,Units,Revenue
2026-01-05,Widget A,Hardware,Midwest,120,4800
2026-01-08,Service Plan,Services,Northeast,45,6750
2026-01-12,Widget B,Hardware,Southeast,85,5100
2026-01-15,Gadget Pro,Electronics,Midwest,30,8700
2026-01-19,Widget A,Hardware,West,200,8000
2026-01-22,Consulting,Services,Northeast,12,9600
2026-01-26,Gadget Lite,Electronics,Southeast,65,3250
2026-02-02,Widget B,Hardware,Midwest,150,9000
2026-02-06,Service Plan,Services,West,38,5700
2026-02-10,Widget A,Hardware,Northeast,90,3600
2026-02-14,Gadget Pro,Electronics,Midwest,55,15950
2026-02-18,Consulting,Services,Southeast,8,6400
2026-02-22,Widget B,Hardware,West,110,6600
2026-02-25,Gadget Lite,Electronics,Northeast,72,3600
2026-03-01,Widget A,Hardware,Midwest,180,7200
2026-03-05,Service Plan,Services,Southeast,50,7500
2026-03-08,Gadget Pro,Electronics,West,40,11600
2026-03-12,Consulting,Services,Midwest,15,12000
2026-03-15,Widget B,Hardware,Northeast,95,5700
2026-03-19,Widget A,Hardware,Southeast,140,5600
2026-03-22,Gadget Lite,Electronics,Midwest,88,4400
2026-03-26,Service Plan,Services,West,42,6300
2026-03-29,Gadget Pro,Electronics,Northeast,35,10150
2026-04-02,Widget A,Hardware,Midwest,160,6400
2026-04-05,Widget B,Hardware,Southeast,105,6300
2026-04-08,Consulting,Services,West,10,8000
2026-04-12,Gadget Lite,Electronics,Midwest,60,3000
2026-04-15,Widget A,Hardware,Northeast,175,7000
2026-04-18,Service Plan,Services,Midwest,55,8250
2026-04-22,Gadget Pro,Electronics,Southeast,48,13920`

export interface Project {
  id: string
  title: string
  client: string
  status: 'submitted' | 'in-progress' | 'under-review' | 'completed'
  timeline: { date: string; note: string }[]
  files: { name: string; size: string }[]
  messages: { from: string; text: string; date: string }[]
}

export const sampleProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'Company Website Redesign',
    client: 'Sarah Chen',
    status: 'in-progress',
    timeline: [
      { date: '2026-03-15', note: 'Project submitted' },
      { date: '2026-03-17', note: 'Proposal sent and approved' },
      { date: '2026-03-24', note: 'Design mockups delivered' },
      { date: '2026-04-01', note: 'Development started' },
      { date: '2026-04-10', note: 'Homepage and About page complete' },
    ],
    files: [
      { name: 'brand-guidelines.pdf', size: '2.4 MB' },
      { name: 'logo-files.zip', size: '8.1 MB' },
      { name: 'content-draft.docx', size: '340 KB' },
    ],
    messages: [
      { from: 'Sarah', text: 'Excited to get started! Here are our brand files.', date: '2026-03-15' },
      { from: 'Josh', text: 'Got them — I\'ll have mockups for you by end of next week.', date: '2026-03-16' },
      { from: 'Sarah', text: 'The mockups look great. Let\'s move forward with option B.', date: '2026-03-25' },
    ],
  },
  {
    id: 'proj-002',
    title: 'Inventory Tracking Dashboard',
    client: 'Mike Torres',
    status: 'under-review',
    timeline: [
      { date: '2026-02-20', note: 'Project submitted' },
      { date: '2026-02-22', note: 'Discovery call completed' },
      { date: '2026-03-01', note: 'Proposal approved — development started' },
      { date: '2026-03-28', note: 'v1 delivered for review' },
    ],
    files: [
      { name: 'current-inventory.xlsx', size: '1.2 MB' },
      { name: 'requirements.pdf', size: '156 KB' },
    ],
    messages: [
      { from: 'Mike', text: 'We\'re tracking everything in a spreadsheet right now. It\'s a mess.', date: '2026-02-20' },
      { from: 'Josh', text: 'I see this a lot. Let\'s talk through what you actually need to see at a glance.', date: '2026-02-21' },
      { from: 'Mike', text: 'The dashboard looks solid. Reviewing with my team this week.', date: '2026-03-29' },
    ],
  },
  {
    id: 'proj-003',
    title: 'Online Store Setup',
    client: 'Lisa Park',
    status: 'completed',
    timeline: [
      { date: '2026-01-10', note: 'Project submitted' },
      { date: '2026-01-12', note: 'Proposal sent and approved' },
      { date: '2026-01-20', note: 'Design phase complete' },
      { date: '2026-02-15', note: 'Store launched' },
      { date: '2026-02-28', note: 'Post-launch support completed' },
    ],
    files: [
      { name: 'product-photos.zip', size: '45 MB' },
      { name: 'product-descriptions.csv', size: '28 KB' },
      { name: 'final-invoice.pdf', size: '89 KB' },
    ],
    messages: [
      { from: 'Lisa', text: 'I need an online store for my candle business. Nothing too complex.', date: '2026-01-10' },
      { from: 'Josh', text: 'Perfect — I\'ll build something clean that you can manage yourself.', date: '2026-01-11' },
      { from: 'Lisa', text: 'The store is live and I already got my first order! Thank you!', date: '2026-02-16' },
    ],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demos/SampleData.ts
git commit -m "Add sample data for CSV dashboard and client portal demos"
```

---

### Task 1.3: Create sample CSV file for download

**Files:**
- Create: `public/demos/sample-sales-data.csv`

- [ ] **Step 1: Create the file**

Copy the CSV content from `sampleCsvString` (without the backticks) into `public/demos/sample-sales-data.csv` as a plain text file. This allows visitors to download it directly.

- [ ] **Step 2: Commit**

```bash
git add public/demos/sample-sales-data.csv
git commit -m "Add downloadable sample CSV file"
git push
```

---

**CHECKPOINT 1 — Dependencies installed, shared components and data ready.**

---

## Phase 2 — CSV Dashboard Demo

### Task 2.1: Build the CsvDashboard component

**Files:**
- Create: `src/components/demos/CsvDashboard.tsx`

This is the largest single component. It handles CSV upload/parsing, stat calculation, filtering, sorting, charting, and CSV export.

- [ ] **Step 1: Create CsvDashboard.tsx**

```tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import Papa from 'papaparse'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { sampleCsvString } from './SampleData'

interface ParsedData {
  headers: string[]
  rows: Record<string, string>[]
}

function detectColumnType(values: string[]): 'numeric' | 'date' | 'categorical' {
  const nonEmpty = values.filter(v => v.trim() !== '')
  if (nonEmpty.length === 0) return 'categorical'

  const allNumeric = nonEmpty.every(v => !isNaN(Number(v)))
  if (allNumeric) return 'numeric'

  const datePattern = /^\d{4}-\d{2}-\d{2}/
  const mostDates = nonEmpty.filter(v => datePattern.test(v)).length > nonEmpty.length * 0.8
  if (mostDates) return 'date'

  return 'categorical'
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function CsvDashboard() {
  const [data, setData] = useState<ParsedData | null>(null)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const parseCSV = useCallback((csvText: string) => {
    const result = Papa.parse<Record<string, string>>(csvText.trim(), {
      header: true,
      skipEmptyLines: true,
    })
    if (result.data.length > 0 && result.meta.fields) {
      setData({ headers: result.meta.fields, rows: result.data })
      setFilters({})
      setSortCol(null)
    }
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) parseCSV(text)
    }
    reader.readAsText(file)
  }, [parseCSV])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith('.csv')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) parseCSV(text)
    }
    reader.readAsText(file)
  }, [parseCSV])

  const columnTypes = useMemo(() => {
    if (!data) return {}
    const types: Record<string, 'numeric' | 'date' | 'categorical'> = {}
    data.headers.forEach(h => {
      types[h] = detectColumnType(data.rows.map(r => r[h] || ''))
    })
    return types
  }, [data])

  const filteredRows = useMemo(() => {
    if (!data) return []
    let rows = data.rows
    Object.entries(filters).forEach(([col, val]) => {
      if (val) rows = rows.filter(r => (r[col] || '').toLowerCase().includes(val.toLowerCase()))
    })
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const aVal = a[sortCol] || ''
        const bVal = b[sortCol] || ''
        const aNum = Number(aVal)
        const bNum = Number(bVal)
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === 'asc' ? aNum - bNum : bNum - aNum
        }
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }
    return rows
  }, [data, filters, sortCol, sortDir])

  const stats = useMemo(() => {
    if (!data) return []
    const numericCols = data.headers.filter(h => columnTypes[h] === 'numeric')
    return numericCols.map(col => {
      const values = filteredRows.map(r => Number(r[col] || 0))
      const sum = values.reduce((a, b) => a + b, 0)
      const avg = values.length > 0 ? sum / values.length : 0
      return { col, sum, avg, count: values.length }
    })
  }, [data, columnTypes, filteredRows])

  const chartData = useMemo(() => {
    if (!data) return { bar: null, line: null }

    const categoricalCol = data.headers.find(h => columnTypes[h] === 'categorical')
    const numericCol = data.headers.find(h => columnTypes[h] === 'numeric')
    const dateCol = data.headers.find(h => columnTypes[h] === 'date')

    let bar = null
    if (categoricalCol && numericCol) {
      const groups: Record<string, number> = {}
      filteredRows.forEach(r => {
        const key = r[categoricalCol] || 'Unknown'
        groups[key] = (groups[key] || 0) + Number(r[numericCol] || 0)
      })
      bar = { data: Object.entries(groups).map(([name, value]) => ({ name, value })), label: numericCol }
    }

    let line = null
    if (dateCol && numericCol) {
      const sorted = [...filteredRows].sort((a, b) =>
        (a[dateCol] || '').localeCompare(b[dateCol] || '')
      )
      line = { data: sorted.map(r => ({ date: r[dateCol], value: Number(r[numericCol] || 0) })), label: numericCol }
    }

    return { bar, line }
  }, [data, columnTypes, filteredRows])

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const downloadReport = () => {
    if (!stats.length) return
    let csv = 'Metric,Column,Value\n'
    csv += `Total Rows,,${filteredRows.length}\n`
    stats.forEach(s => {
      csv += `Sum,${s.col},${s.sum}\n`
      csv += `Average,${s.col},${s.avg.toFixed(2)}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dashboard-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Upload state
  if (!data) {
    return (
      <div
        className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="font-mono text-slate-500 mb-4">
          <div className="text-2xl mb-2">↑</div>
          Drop a CSV file here
        </div>
        <div className="text-slate-600 text-sm mb-4">or</div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-sm transition-colors">
            Browse files
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => parseCSV(sampleCsvString)}
            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-mono text-sm transition-colors border border-emerald-500/30"
          >
            Use sample data
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
          <div className="font-mono text-xs text-slate-500 uppercase tracking-wide">Rows</div>
          <div className="text-2xl font-bold text-white mt-1">{formatNumber(filteredRows.length)}</div>
        </div>
        {stats.slice(0, 3).map(s => (
          <div key={s.col} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
            <div className="font-mono text-xs text-slate-500 uppercase tracking-wide">{s.col} (total)</div>
            <div className="text-2xl font-bold text-white mt-1">{formatNumber(s.sum)}</div>
            <div className="text-xs text-slate-500 mt-1">avg: {formatNumber(s.avg)}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {chartData.bar && (
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
            <div className="font-mono text-xs text-slate-500 mb-3">{chartData.bar.label} by category</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.bar.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartData.line && (
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
            <div className="font-mono text-xs text-slate-500 mb-3">{chartData.line.label} over time</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData.line.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Data table */}
      <div className="rounded-lg border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                {data.headers.map(h => (
                  <th key={h} className="text-left px-3 py-2">
                    <button
                      onClick={() => handleSort(h)}
                      className="font-mono text-xs text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wide flex items-center gap-1"
                    >
                      {h}
                      {sortCol === h && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                    <input
                      type="text"
                      placeholder="filter..."
                      value={filters[h] || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, [h]: e.target.value }))}
                      className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-300 placeholder-slate-600 focus:border-emerald-500 outline-none"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice(0, 50).map((row, i) => (
                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                  {data.headers.map(h => (
                    <td key={h} className="px-3 py-1.5 text-slate-300 font-mono text-xs">{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length > 50 && (
          <div className="px-3 py-2 text-xs text-slate-500 font-mono bg-slate-800/40 border-t border-slate-800">
            Showing 50 of {filteredRows.length} rows
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadReport}
          className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-mono text-sm transition-colors border border-emerald-500/30"
        >
          $ download report.csv
        </button>
        <button
          onClick={() => { setData(null); setFilters({}); setSortCol(null) }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-mono text-sm transition-colors"
        >
          $ load new file
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demos/CsvDashboard.tsx
git commit -m "Build interactive CSV Dashboard demo component"
```

---

### Task 2.2: Build the CSV Dashboard page

**Files:**
- Create: `src/app/demos/csv-dashboard/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { ScrollReveal } from '@/components/ScrollReveal'
import { DemoTerminalBlock } from '@/components/demos/DemoTerminalBlock'
import { CsvDashboard } from '@/components/demos/CsvDashboard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'CSV Dashboard Demo',
  description: 'Upload a CSV and get an instant dashboard with charts, filters, and stats.',
}

export default function CsvDashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[
            { label: 'demos', href: '/demos' },
            { label: 'csv-dashboard' },
          ]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">CSV Dashboard</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">
            Upload a spreadsheet and get an instant dashboard. Charts, filters, stats — all in the browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Recharts', 'CSV parsing'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Before */}
      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/the-problem.sh">
              <div className="text-slate-500">// the problem</div>
              <div className="mt-2">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-slate-200">open sales-data-Q1.xlsx</span>
              </div>
              <div className="text-slate-500 ml-3">→ 14 tabs. 6 people editing. 3 versions on the shared drive.</div>
              <div className="text-slate-500 ml-3">→ Your Monday starts with 45 minutes of copy-paste to get one number.</div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* Interactive demo */}
      <ScrollReveal>
        <section className="bg-slate-900 py-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="font-mono text-xs text-slate-500 mb-4">// the solution — try it</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="font-mono text-xs text-slate-500 ml-2">~/csv-dashboard.app</span>
              </div>
              <div className="p-5">
                <CsvDashboard />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* In production */}
      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/in-production.md">
              <div className="text-slate-500">// in production, this connects to your database</div>
              <div className="mt-2 text-slate-500 space-y-1">
                <div>→ Live data from your POS, ERP, or spreadsheets — updated automatically.</div>
                <div>→ Role-based access so your team sees what they need.</div>
                <div>→ Scheduled email reports every Monday morning.</div>
                <div className="mt-3 text-emerald-400/70">→ This demo runs entirely in your browser. Nothing is uploaded or stored.</div>
              </div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Need something like this?</h2>
          <p className="mt-3 text-slate-400">I build custom dashboards connected to your real data.</p>
          <div className="mt-6">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit and push**

```bash
git add src/app/demos/csv-dashboard/page.tsx
git commit -m "Add CSV Dashboard demo page with pain-point framing"
git push
```

---

**CHECKPOINT 2 — CSV Dashboard demo is live on preview.**

---

## Phase 3 — Client Portal Demo

### Task 3.1: Build the ClientPortal component

**Files:**
- Create: `src/components/demos/ClientPortal.tsx`

- [ ] **Step 1: Create ClientPortal.tsx**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { sampleProjects, type Project } from './SampleData'

const STATUS_LABELS: Record<Project['status'], string> = {
  'submitted': 'Submitted',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  'completed': 'Completed',
}

const STATUS_COLORS: Record<Project['status'], string> = {
  'submitted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'under-review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const STATUSES: Project['status'][] = ['submitted', 'in-progress', 'under-review', 'completed']

export function ClientPortal() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [view, setView] = useState<'client' | 'admin'>('client')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')

  const selected = projects.find(p => p.id === selectedId) ?? null

  const updateStatus = useCallback((id: string, status: Project['status']) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status } : p
    ))
  }, [])

  const addNote = useCallback((id: string) => {
    if (!newNote.trim()) return
    const today = new Date().toISOString().split('T')[0]
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, timeline: [...p.timeline, { date: today, note: newNote.trim() }] }
        : p
    ))
    setNewNote('')
  }, [newNote])

  const handleSubmitRequest = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const message = formData.get('message') as string
    if (!title.trim()) return

    const today = new Date().toISOString().split('T')[0]
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      client: 'You',
      status: 'submitted',
      timeline: [{ date: today, note: 'Project submitted' }],
      files: [],
      messages: message.trim()
        ? [{ from: 'You', text: message.trim(), date: today }]
        : [],
    }
    setProjects(prev => [newProject, ...prev])
    form.reset()
    setSelectedId(newProject.id)
  }, [])

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-slate-800 mb-6">
        <button
          onClick={() => setView('client')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
            view === 'client'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          client-view.tsx
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
            view === 'admin'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          admin-view.tsx
        </button>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        {/* Project list */}
        <div className="space-y-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedId === p.id
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-sm text-slate-200 font-medium">{p.title}</div>
              <div className="text-xs text-slate-500 mt-1">{p.client}</div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>
            </button>
          ))}

          {/* Submit new (client view only) */}
          {view === 'client' && (
            <form onSubmit={handleSubmitRequest} className="mt-4 p-3 rounded-lg border border-dashed border-slate-700 space-y-2">
              <div className="font-mono text-xs text-slate-500">+ new request</div>
              <input
                name="title"
                placeholder="Project title"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none"
              />
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded font-mono text-xs transition-colors border border-emerald-500/30"
              >
                $ submit
              </button>
            </form>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">{selected.title}</h3>
              <div className="text-sm text-slate-500 mt-1">Client: {selected.client}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                {view === 'admin' && (
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as Project['status'])}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-slate-300 focus:border-emerald-500 outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Timeline</div>
              <div className="space-y-2 border-l-2 border-slate-800 pl-4">
                {selected.timeline.map((entry, i) => (
                  <div key={i}>
                    <div className="font-mono text-xs text-slate-600">{entry.date}</div>
                    <div className="text-sm text-slate-300">{entry.note}</div>
                  </div>
                ))}
              </div>
              {view === 'admin' && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote(selected.id) } }}
                  />
                  <button
                    onClick={() => addNote(selected.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs transition-colors"
                  >
                    + add
                  </button>
                </div>
              )}
            </div>

            {/* Files */}
            {selected.files.length > 0 && (
              <div>
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Files</div>
                <div className="space-y-1">
                  {selected.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-slate-800/40 text-sm">
                      <span className="text-slate-300 font-mono text-xs">{f.name}</span>
                      <span className="text-slate-600 text-xs">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {selected.messages.length > 0 && (
              <div>
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Messages</div>
                <div className="space-y-2">
                  {selected.messages.map((m, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/40">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-emerald-400">{m.from}</span>
                        <span className="text-slate-600">{m.date}</span>
                      </div>
                      <div className="text-sm text-slate-300 mt-1">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 flex items-center justify-center">
            <div className="text-slate-600 font-mono text-sm">Select a project to view details</div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demos/ClientPortal.tsx
git commit -m "Build interactive Client Portal demo component"
```

---

### Task 3.2: Build the Client Portal page

**Files:**
- Create: `src/app/demos/client-portal/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { ScrollReveal } from '@/components/ScrollReveal'
import { DemoTerminalBlock } from '@/components/demos/DemoTerminalBlock'
import { ClientPortal } from '@/components/demos/ClientPortal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Client Portal Demo',
  description: 'A simple client portal with project tracking, timelines, and status updates.',
}

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[
            { label: 'demos', href: '/demos' },
            { label: 'client-portal' },
          ]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Client Portal</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">
            Two views of the same tool. Clients see their project status; you manage everything from the admin side.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'State management'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/the-problem.sh">
              <div className="text-slate-500">// the problem</div>
              <div className="mt-2">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-slate-200">grep -r &quot;status update&quot; ~/inbox</span>
              </div>
              <div className="text-slate-500 ml-3">→ 47 emails. 12 phone calls. 3 sticky notes.</div>
              <div className="text-slate-500 ml-3">→ Your client asks &quot;where&apos;s my project?&quot; and you dig for 10 minutes.</div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-slate-900 py-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="font-mono text-xs text-slate-500 mb-4">// the solution — try both views</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="font-mono text-xs text-slate-500 ml-2">~/client-portal.app</span>
              </div>
              <div className="p-5">
                <ClientPortal />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/in-production.md">
              <div className="text-slate-500">// in production, this connects to your database</div>
              <div className="mt-2 text-slate-500 space-y-1">
                <div>→ Real authentication — clients log in and see only their projects.</div>
                <div>→ Email notifications on status changes.</div>
                <div>→ File upload and storage.</div>
                <div className="mt-3 text-emerald-400/70">→ This demo uses sample data. Nothing is saved.</div>
              </div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Need a client portal?</h2>
          <p className="mt-3 text-slate-400">I build custom portals connected to your real workflow.</p>
          <div className="mt-6">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit and push**

```bash
git add src/app/demos/client-portal/page.tsx
git commit -m "Add Client Portal demo page with pain-point framing"
git push
```

---

**CHECKPOINT 3 — Both demos are live on preview.**

---

## Phase 4 — Update Demos Index Page

### Task 4.1: Replace demos index with directory listing

**Files:**
- Modify: `src/app/demos/page.tsx`

- [ ] **Step 1: Read the current demos page**

Read `src/app/demos/page.tsx` to see the current stub.

- [ ] **Step 2: Replace with demo cards**

Replace the entire file:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'Demos',
  description: 'Small working apps that show what I build on the internal-tools side.',
}

const demos = [
  {
    href: '/demos/csv-dashboard',
    file: 'csv-dashboard.app',
    title: 'CSV Dashboard',
    tagline: 'Spreadsheet chaos → clean dashboard',
    description: 'Upload a CSV and get instant charts, filters, and summary stats. All in the browser.',
  },
  {
    href: '/demos/client-portal',
    file: 'client-portal.app',
    title: 'Client Portal',
    tagline: 'Email chaos → organized client portal',
    description: 'Two views of one tool: clients track their project status, you manage it from admin.',
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Demos</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">
            Small working apps that show what I build on the internal-tools side. Play with them — everything runs in your browser.
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-slate-950 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-5">
              {demos.map(demo => (
                <Link
                  key={demo.href}
                  href={demo.href}
                  className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{demo.file}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{demo.title}</h2>
                  <p className="mt-1 text-sm text-emerald-400 font-mono">{demo.tagline}</p>
                  <p className="mt-3 text-slate-400 text-sm">{demo.description}</p>
                  <div className="mt-4 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Remove old demos layout if it conflicts**

Check `src/app/demos/layout.tsx`. If it exists and exports metadata that conflicts with the new page metadata, either remove the layout or remove its metadata export (let the page handle metadata).

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "Update Demos index with directory listing of demo projects"
git push
```

---

## Phase 5 — Polish + PR

### Task 5.1: Mobile QA and build verification

**Files:** any needing fixes

- [ ] **Step 1: Build to confirm everything compiles**

```bash
npm run build
```

- [ ] **Step 2: Audit responsive classes**

Check key layouts:
- `CsvDashboard.tsx` — stat grid uses `grid-cols-2 md:grid-cols-4`, chart grid uses `md:grid-cols-2`, table has `overflow-x-auto`
- `ClientPortal.tsx` — sidebar/detail uses `md:grid-cols-[280px_1fr]`, should stack on mobile
- Demo index — card grid uses `md:grid-cols-2`

- [ ] **Step 3: Fix any issues and commit**

```bash
git add -A
git commit -m "Mobile polish for demo projects" || echo "No changes"
git push
```

---

### Task 5.2: Open PR

- [ ] **Step 1: Open PR**

```bash
gh pr create --title "Add interactive demo projects: CSV Dashboard and Client Portal" --body "$(cat <<'EOF'
## Summary
- Adds two interactive demo projects to `/demos/` proving internal-tool capability.
- **CSV Dashboard** (`/demos/csv-dashboard`): upload a CSV or use sample data → instant charts, filters, stats, and report export. Uses Recharts + PapaParse.
- **Client Portal** (`/demos/client-portal`): tabbed client/admin views with project tracking, timeline, status updates, and a submit-request form. Shared state between views.
- Both demos frame a relatable pain point ("before"), provide a working solution ("after"), and explain what production would include.
- Demos index page updated from empty stub to a directory listing with file-cards.
- All demos are fully client-side — no backend, no data persistence, nothing uploaded.

## Design docs
- Spec: `docs/superpowers/specs/2026-04-15-demo-projects-design.md`
- Plan: `docs/superpowers/plans/2026-04-15-demo-projects.md`

## Test plan
- [ ] `/demos` shows two demo cards linking to sub-pages
- [ ] CSV Dashboard: "Use sample data" loads data, charts/stats/table render
- [ ] CSV Dashboard: upload a real CSV → dashboard adapts to columns
- [ ] CSV Dashboard: filters and sorting work on the data table
- [ ] CSV Dashboard: "Download report" produces a valid CSV
- [ ] Client Portal: client view shows 3 projects, click to expand detail
- [ ] Client Portal: admin view status dropdown updates project, reflected in client view
- [ ] Client Portal: admin "add note" appears in timeline
- [ ] Client Portal: "Submit new request" form adds a project to the list
- [ ] All pages render correctly at 375px mobile width
- [ ] Pain-point and production-callout terminal blocks display correctly

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report PR URL**

---

## Self-Review

**Spec coverage:**
- Demo 1 CSV Dashboard → Tasks 2.1–2.2 ✅
- Demo 2 Client Portal → Tasks 3.1–3.2 ✅
- Demos index page update → Task 4.1 ✅
- Shared DemoTerminalBlock → Task 1.1 ✅
- SampleData → Task 1.2 ✅
- Sample CSV file → Task 1.3 ✅
- Pain-point framing on each demo → included in page tasks ✅
- "In production" callouts → included in page tasks ✅
- Tech badges → included in page tasks ✅
- ScrollReveal on sections → included in page tasks ✅
- CTA sections → included in page tasks ✅
- Dependencies (recharts, papaparse) → Task 0.1 ✅

**Placeholder scan:** No TBDs, TODOs, or vague instructions. All component code is complete.

**Type consistency:** `Project` interface defined in `SampleData.ts`, imported by `ClientPortal.tsx`. Status types consistent (`'submitted' | 'in-progress' | 'under-review' | 'completed'`). `sampleCsvString` and `sampleProjects` export names match imports.
