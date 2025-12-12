'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

type WidgetType = 'kpi' | 'bar-chart' | 'line-chart' | 'table' | 'alert'

interface Widget {
  id: string
  type: WidgetType
  title: string
  gridArea: string
  value?: number
  targetValue?: number
  data?: number[]
  items?: Array<{ label: string; value: string }>
}

interface WidgetConfig {
  type: WidgetType
  label: string
  icon: string
  defaultTitle: string
}

const WIDGET_CONFIGS: WidgetConfig[] = [
  { type: 'kpi', label: 'KPI Card', icon: '📊', defaultTitle: 'Total Revenue' },
  { type: 'bar-chart', label: 'Bar Chart', icon: '📶', defaultTitle: 'Sales by Region' },
  { type: 'line-chart', label: 'Line Chart', icon: '📈', defaultTitle: 'Trend' },
  { type: 'table', label: 'Data Table', icon: '📋', defaultTitle: 'Recent Orders' },
  { type: 'alert', label: 'Alert', icon: '🔔', defaultTitle: 'Alerts' },
]

const GRID_AREAS = [
  'a', 'b', 'c', 'd', 'e', 'f'
]

export function DashboardBuilderDemo() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [draggingType, setDraggingType] = useState<WidgetType | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  // Live data simulation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setAnimatedValues(prev => {
        const updated = { ...prev }
        widgets.forEach(widget => {
          if (widget.type === 'kpi') {
            const currentValue = prev[widget.id] || widget.value || 0
            const change = (Math.random() - 0.4) * 100
            updated[widget.id] = Math.max(0, currentValue + change)
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLive, widgets])

  // Initialize values when widget is added
  useEffect(() => {
    const newValues: Record<string, number> = {}
    widgets.forEach(widget => {
      if (widget.type === 'kpi' && !animatedValues[widget.id]) {
        newValues[widget.id] = widget.value || Math.floor(Math.random() * 50000) + 10000
      }
    })
    if (Object.keys(newValues).length > 0) {
      setAnimatedValues(prev => ({ ...prev, ...newValues }))
    }
  }, [widgets, animatedValues])

  const handleDrop = (gridArea: string) => {
    if (!draggingType) return
    if (widgets.find(w => w.gridArea === gridArea)) return

    const config = WIDGET_CONFIGS.find(c => c.type === draggingType)
    if (!config) return

    const newWidget: Widget = {
      id: `${draggingType}-${Date.now()}`,
      type: draggingType,
      title: config.defaultTitle,
      gridArea,
      value: draggingType === 'kpi' ? Math.floor(Math.random() * 50000) + 10000 : undefined,
      targetValue: draggingType === 'kpi' ? Math.floor(Math.random() * 60000) + 20000 : undefined,
      data: ['bar-chart', 'line-chart'].includes(draggingType)
        ? Array.from({ length: 6 }, () => Math.floor(Math.random() * 100))
        : undefined,
      items: draggingType === 'table'
        ? [
            { label: 'Order #1234', value: '$450.00' },
            { label: 'Order #1235', value: '$320.00' },
            { label: 'Order #1236', value: '$890.00' },
          ]
        : draggingType === 'alert'
          ? [
              { label: 'Low inventory: Widget A', value: 'Warning' },
              { label: 'New order received', value: 'Info' },
            ]
          : undefined,
    }

    setWidgets(prev => [...prev, newWidget])
    setDraggingType(null)
  }

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId))
    setAnimatedValues(prev => {
      const updated = { ...prev }
      delete updated[widgetId]
      return updated
    })
  }

  const handleClear = () => {
    setWidgets([])
    setIsLive(false)
    setAnimatedValues({})
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderWidget = (widget: Widget) => {
    const value = animatedValues[widget.id] ?? widget.value ?? 0

    switch (widget.type) {
      case 'kpi':
        const change = widget.targetValue ? ((value - widget.targetValue) / widget.targetValue) * 100 : 0
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatCurrency(value)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{change >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="text-slate-400">vs target</span>
            </div>
          </div>
        )

      case 'bar-chart':
        const maxBar = Math.max(...(widget.data || [1]))
        return (
          <div className="h-full flex items-end gap-1 pt-4">
            {widget.data?.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-t transition-all duration-500"
                style={{ height: `${(val / maxBar) * 100}%` }}
              />
            ))}
          </div>
        )

      case 'line-chart':
        const points = widget.data || []
        const maxLine = Math.max(...points, 1)
        const pathPoints = points.map((val, i) => {
          const x = (i / (points.length - 1)) * 100
          const y = 100 - (val / maxLine) * 100
          return `${x},${y}`
        }).join(' ')
        return (
          <svg className="w-full h-full pt-4" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={pathPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <polyline
              points={`0,100 ${pathPoints} 100,100`}
              fill="currentColor"
              className="text-primary/10"
            />
          </svg>
        )

      case 'table':
        return (
          <div className="space-y-2 pt-2">
            {widget.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )

      case 'alert':
        return (
          <div className="space-y-2 pt-2">
            {widget.items?.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm p-2 rounded ${
                  item.value === 'Warning' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
                }`}
              >
                <span>{item.value === 'Warning' ? '⚠️' : 'ℹ️'}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
        <strong>How to use:</strong> Drag widgets from the sidebar to the dashboard grid. Click &quot;Go Live&quot; to see real-time data updates.
      </div>

      <div className="flex gap-4">
        {/* Sidebar with widget types */}
        <div className="w-32 flex-shrink-0">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Widgets</h4>
          <div className="space-y-2">
            {WIDGET_CONFIGS.map(config => (
              <div
                key={config.type}
                draggable
                onDragStart={() => setDraggingType(config.type)}
                onDragEnd={() => setDraggingType(null)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-slate-300 bg-slate-50 transition-all"
              >
                <span className="text-xl">{config.icon}</span>
                <span className="text-sm font-medium text-slate-700">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard canvas */}
        <div className="flex-1">
          <div
            className="grid grid-cols-3 grid-rows-2 gap-3 h-[350px]"
            style={{
              gridTemplateAreas: `
                "a b c"
                "d e f"
              `
            }}
          >
            {GRID_AREAS.map(area => {
              const widget = widgets.find(w => w.gridArea === area)

              return (
                <div
                  key={area}
                  className={`rounded-xl p-4 transition-all relative ${
                    widget
                      ? 'bg-white border border-slate-200 shadow-sm'
                      : draggingType
                        ? 'bg-slate-100 border-2 border-dashed border-primary'
                        : 'bg-slate-100 border-2 border-dashed border-slate-300'
                  }`}
                  style={{ gridArea: area }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(area)}
                >
                  {widget ? (
                    <>
                      {/* Widget header */}
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-slate-700">{widget.title}</h5>
                        <button
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      {/* Widget content */}
                      <div className="h-[calc(100%-2rem)]">
                        {renderWidget(widget)}
                      </div>

                      {/* Live indicator */}
                      {isLive && widget.type === 'kpi' && (
                        <div className="absolute top-2 right-8 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      {draggingType ? 'Drop here' : 'Empty slot'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setIsLive(!isLive)}
          disabled={widgets.length === 0}
          className={isLive ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {isLive ? '● Live' : 'Go Live'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Status */}
      {isLive && (
        <div className="text-center text-sm text-green-600">
          Dashboard is receiving live data updates
        </div>
      )}
    </div>
  )
}
