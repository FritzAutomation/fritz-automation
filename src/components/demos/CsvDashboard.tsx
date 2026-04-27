'use client'

import { useState, useMemo, useCallback } from 'react'
import Papa from 'papaparse'
import { track } from '@vercel/analytics'
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

  const parseCSV = useCallback((csvText: string, source: 'sample' | 'file' = 'file') => {
    const result = Papa.parse<Record<string, string>>(csvText.trim(), {
      header: true,
      skipEmptyLines: true,
    })
    if (result.data.length > 0 && result.meta.fields) {
      setData({ headers: result.meta.fields, rows: result.data })
      setFilters({})
      setSortCol(null)
      if (source === 'file') {
        track('demo_interaction', { action: 'file_uploaded' })
      }
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
        className="border-2 border-dashed border-[var(--line-soft)] rounded-lg p-12 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="font-mono text-[var(--ink-dim)] mb-4">
          <div className="text-2xl mb-2">↑</div>
          Drop a CSV file here
        </div>
        <div className="text-[var(--ink-dim)] text-sm mb-4">or</div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <label className="cursor-pointer px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--line-soft)] text-[var(--ink)] rounded-lg font-mono text-sm transition-colors">
            Browse files
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => {
              track('demo_interaction', { action: 'sample_data_loaded' })
              parseCSV(sampleCsvString, 'sample')
            }}
            className="px-4 py-2 bg-[var(--accent-glow)] hover:bg-emerald-500/30 text-[var(--accent)] rounded-lg font-mono text-sm transition-colors border border-[var(--accent)]"
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
        <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line-soft)]/50">
          <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide">Rows</div>
          <div className="text-2xl font-bold text-[var(--heading)] mt-1">{formatNumber(filteredRows.length)}</div>
        </div>
        {stats.slice(0, 3).map(s => (
          <div key={s.col} className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line-soft)]/50">
            <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide">{s.col} (total)</div>
            <div className="text-2xl font-bold text-[var(--heading)] mt-1">{formatNumber(s.sum)}</div>
            <div className="text-xs text-[var(--ink-dim)] mt-1">avg: {formatNumber(s.avg)}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {chartData.bar && (
          <div className="bg-[var(--bg-card)]/40 rounded-lg p-4 border border-[var(--line-soft)]/50">
            <div className="font-mono text-xs text-[var(--ink-dim)] mb-3">{chartData.bar.label} by category</div>
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
          <div className="bg-[var(--bg-card)]/40 rounded-lg p-4 border border-[var(--line-soft)]/50">
            <div className="font-mono text-xs text-[var(--ink-dim)] mb-3">{chartData.line.label} over time</div>
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
      <div className="rounded-lg border border-[var(--line-soft)]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-card)]/80">
                {data.headers.map(h => (
                  <th key={h} className="text-left px-3 py-2">
                    <button
                      onClick={() => handleSort(h)}
                      className="font-mono text-xs text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors uppercase tracking-wide flex items-center gap-1"
                    >
                      {h}
                      {sortCol === h && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                    <input
                      type="text"
                      placeholder="filter..."
                      value={filters[h] || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, [h]: e.target.value }))}
                      className="mt-1 w-full bg-[var(--bg-soft)] border border-[var(--line-soft)] rounded px-2 py-0.5 text-xs text-[var(--ink)] placeholder-slate-600 focus:border-[var(--accent)] outline-none"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice(0, 50).map((row, i) => (
                <tr key={i} className="border-t border-[var(--line)] hover:bg-[var(--bg-card)]/40 transition-colors">
                  {data.headers.map(h => (
                    <td key={h} className="px-3 py-1.5 text-[var(--ink)] font-mono text-xs">{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length > 50 && (
          <div className="px-3 py-2 text-xs text-[var(--ink-dim)] font-mono bg-[var(--bg-card)]/40 border-t border-[var(--line)]">
            Showing 50 of {filteredRows.length} rows
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadReport}
          className="px-4 py-2 bg-[var(--accent-glow)] hover:bg-emerald-500/30 text-[var(--accent)] rounded-lg font-mono text-sm transition-colors border border-[var(--accent)]"
        >
          $ download report.csv
        </button>
        <button
          onClick={() => { setData(null); setFilters({}); setSortCol(null) }}
          className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--line-soft)] text-[var(--ink-soft)] rounded-lg font-mono text-sm transition-colors"
        >
          $ load new file
        </button>
      </div>
    </div>
  )
}
