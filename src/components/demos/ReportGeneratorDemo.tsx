'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface DataRow {
  date: string
  product: string
  quantity: number
  revenue: number
}

const MOCK_DATA: DataRow[] = [
  { date: '2024-01-01', product: 'Widget A', quantity: 150, revenue: 4500 },
  { date: '2024-01-02', product: 'Widget B', quantity: 89, revenue: 2670 },
  { date: '2024-01-03', product: 'Widget A', quantity: 203, revenue: 6090 },
  { date: '2024-01-04', product: 'Widget C', quantity: 67, revenue: 3350 },
  { date: '2024-01-05', product: 'Widget B', quantity: 145, revenue: 4350 },
  { date: '2024-01-06', product: 'Widget A', quantity: 178, revenue: 5340 },
  { date: '2024-01-07', product: 'Widget C', quantity: 92, revenue: 4600 },
]

type Stage = 'idle' | 'pulling' | 'cleaning' | 'analyzing' | 'visualizing' | 'exporting' | 'complete'

const STAGES: { id: Stage; label: string; icon: string }[] = [
  { id: 'pulling', label: 'Pull Data', icon: '📥' },
  { id: 'cleaning', label: 'Clean', icon: '🧹' },
  { id: 'analyzing', label: 'Analyze', icon: '🔍' },
  { id: 'visualizing', label: 'Visualize', icon: '📊' },
  { id: 'exporting', label: 'Export', icon: '📄' },
]

export function ReportGeneratorDemo() {
  const [stage, setStage] = useState<Stage>('idle')
  const [visibleRows, setVisibleRows] = useState<number>(0)
  const [cleanedRows, setCleanedRows] = useState<Set<number>>(new Set())
  const [calculations, setCalculations] = useState<{
    totalRevenue: number
    totalQuantity: number
    avgRevenue: number
  } | null>(null)
  const [chartBars, setChartBars] = useState<number[]>([])
  const [exportReady, setExportReady] = useState(false)
  const [dateRange, setDateRange] = useState('week')
  const [format, setFormat] = useState('pdf')

  // Animation effects for each stage
  useEffect(() => {
    if (stage === 'pulling') {
      let row = 0
      const interval = setInterval(() => {
        if (row < MOCK_DATA.length) {
          setVisibleRows(row + 1)
          row++
        } else {
          clearInterval(interval)
          setTimeout(() => setStage('cleaning'), 500)
        }
      }, 200)
      return () => clearInterval(interval)
    }

    if (stage === 'cleaning') {
      let row = 0
      const interval = setInterval(() => {
        if (row < MOCK_DATA.length) {
          setCleanedRows(prev => new Set([...prev, row]))
          row++
        } else {
          clearInterval(interval)
          setTimeout(() => setStage('analyzing'), 500)
        }
      }, 150)
      return () => clearInterval(interval)
    }

    if (stage === 'analyzing') {
      setTimeout(() => {
        const totalRevenue = MOCK_DATA.reduce((sum, row) => sum + row.revenue, 0)
        const totalQuantity = MOCK_DATA.reduce((sum, row) => sum + row.quantity, 0)
        setCalculations({
          totalRevenue,
          totalQuantity,
          avgRevenue: totalRevenue / MOCK_DATA.length,
        })
        setTimeout(() => setStage('visualizing'), 800)
      }, 500)
    }

    if (stage === 'visualizing') {
      const revenueByProduct: Record<string, number> = {}
      MOCK_DATA.forEach(row => {
        revenueByProduct[row.product] = (revenueByProduct[row.product] || 0) + row.revenue
      })
      const maxRevenue = Math.max(...Object.values(revenueByProduct))
      const bars = Object.values(revenueByProduct).map(v => (v / maxRevenue) * 100)

      let barIndex = 0
      const interval = setInterval(() => {
        if (barIndex < bars.length) {
          setChartBars(prev => [...prev, bars[barIndex]])
          barIndex++
        } else {
          clearInterval(interval)
          setTimeout(() => setStage('exporting'), 500)
        }
      }, 300)
      return () => clearInterval(interval)
    }

    if (stage === 'exporting') {
      setTimeout(() => {
        setExportReady(true)
        setStage('complete')
      }, 1000)
    }
  }, [stage])

  const handleGenerate = () => {
    // Reset everything
    setVisibleRows(0)
    setCleanedRows(new Set())
    setCalculations(null)
    setChartBars([])
    setExportReady(false)
    setStage('pulling')
  }

  const handleReset = () => {
    setStage('idle')
    setVisibleRows(0)
    setCleanedRows(new Set())
    setCalculations(null)
    setChartBars([])
    setExportReady(false)
  }

  const getCurrentStageIndex = () => {
    return STAGES.findIndex(s => s.id === stage)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
            disabled={stage !== 'idle'}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Format:</span>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['pdf', 'excel', 'csv'].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                disabled={stage !== 'idle'}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  format === f
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress stages */}
      <div className="flex items-center justify-between">
        {STAGES.map((s, index) => {
          const currentIndex = getCurrentStageIndex()
          const isComplete = currentIndex > index || stage === 'complete'
          const isCurrent = s.id === stage
          const isPending = currentIndex < index && stage !== 'complete'

          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-primary text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isComplete ? '✓' : s.icon}
                </div>
                <span className={`text-xs mt-1 ${isCurrent ? 'font-medium text-primary' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
              {index < STAGES.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-1 transition-all ${
                    currentIndex > index || stage === 'complete' ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Main content area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Data table */}
        <div className="bg-slate-50 rounded-xl p-4 overflow-hidden">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>📋</span> Data
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.slice(0, visibleRows).map((row, index) => (
                  <tr
                    key={index}
                    className={`border-t border-slate-200 transition-all ${
                      cleanedRows.has(index) ? 'bg-green-50' : 'animate-fade-in'
                    }`}
                  >
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.product}</td>
                    <td className="py-2 text-right">{row.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
                {visibleRows === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      {stage === 'idle' ? 'Click "Generate Report" to start' : 'Loading...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results area */}
        <div className="space-y-4">
          {/* Calculations */}
          <div className={`bg-slate-50 rounded-xl p-4 transition-all ${calculations ? 'opacity-100' : 'opacity-50'}`}>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span>🔢</span> Calculations
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {calculations ? formatCurrency(calculations.totalRevenue) : '--'}
                </div>
                <div className="text-xs text-slate-500">Total Revenue</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {calculations ? calculations.totalQuantity : '--'}
                </div>
                <div className="text-xs text-slate-500">Units Sold</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {calculations ? formatCurrency(calculations.avgRevenue) : '--'}
                </div>
                <div className="text-xs text-slate-500">Avg/Day</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className={`bg-slate-50 rounded-xl p-4 transition-all ${chartBars.length > 0 ? 'opacity-100' : 'opacity-50'}`}>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span>📊</span> Revenue by Product
            </h4>
            <div className="flex items-end gap-4 h-32">
              {['Widget A', 'Widget B', 'Widget C'].map((product, index) => (
                <div key={product} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full max-w-[60px] bg-primary rounded-t transition-all duration-500"
                      style={{ height: chartBars[index] ? `${chartBars[index]}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{product}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className={`bg-slate-50 rounded-xl p-4 transition-all ${exportReady ? 'opacity-100' : 'opacity-50'}`}>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span>📄</span> Export
            </h4>
            {exportReady ? (
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    {format === 'pdf' ? '📕' : format === 'excel' ? '📗' : '📄'}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">sales_report.{format}</div>
                    <div className="text-xs text-slate-500">Generated just now</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                  Download
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 text-slate-400 text-sm">
                {stage === 'exporting' ? 'Generating file...' : 'Report will appear here'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={handleGenerate} disabled={stage !== 'idle' && stage !== 'complete'}>
          {stage === 'complete' ? 'Generate Another' : stage === 'idle' ? 'Generate Report' : 'Generating...'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
