'use client'

import { useEffect, useState } from 'react'

interface DashboardAnimationProps {
  variant: 'software' | 'analytics'
}

export function DashboardAnimation({ variant }: DashboardAnimationProps) {
  const [buildPhase, setBuildPhase] = useState(0)
  const [counters, setCounters] = useState({ revenue: 0, orders: 0, users: 0, growth: 0 })
  const [chartBars, setChartBars] = useState([0, 0, 0, 0, 0, 0])

  useEffect(() => {
    // Build phases animation
    const phaseInterval = setInterval(() => {
      setBuildPhase((prev) => (prev + 1) % 5)
    }, 2500)

    return () => clearInterval(phaseInterval)
  }, [])

  useEffect(() => {
    // Counter animation
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const targets = { revenue: 847293, orders: 2847, users: 1243, growth: 23.5 }

    let step = 0
    const counterInterval = setInterval(() => {
      step++
      const progress = step / steps
      setCounters({
        revenue: Math.floor(targets.revenue * progress),
        orders: Math.floor(targets.orders * progress),
        users: Math.floor(targets.users * progress),
        growth: Math.round(targets.growth * progress * 10) / 10
      })

      if (step >= steps) {
        clearInterval(counterInterval)
      }
    }, interval)

    return () => clearInterval(counterInterval)
  }, [buildPhase])

  useEffect(() => {
    // Chart bars animation
    const targetBars = [65, 45, 80, 55, 90, 70]
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const barInterval = setInterval(() => {
      step++
      const progress = step / steps
      setChartBars(targetBars.map(target => Math.floor(target * progress)))

      if (step >= steps) {
        clearInterval(barInterval)
      }
    }, interval)

    return () => clearInterval(barInterval)
  }, [buildPhase])

  if (variant === 'software') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700 overflow-hidden">
        <div className="text-xs text-slate-500 mb-3 font-mono flex items-center justify-between">
          <span>custom_dashboard.tsx</span>
          <span className="text-green-400">● Live</span>
        </div>

        {/* Mock application building itself */}
        <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
          {/* App header */}
          <div className={`h-10 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-2 transition-all duration-500 ${buildPhase >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-xs text-slate-300 font-medium">Fritz Dashboard</span>
            <div className="ml-auto flex gap-2">
              <div className="w-6 h-6 bg-slate-700 rounded"></div>
              <div className="w-6 h-6 bg-slate-700 rounded"></div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className={`w-12 bg-slate-800/50 border-r border-slate-700 py-3 transition-all duration-500 ${buildPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="space-y-3 px-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded transition-all duration-300 ${
                      i === 0 ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-3 min-h-[200px]">
              {/* Stats row */}
              <div className={`grid grid-cols-4 gap-2 mb-3 transition-all duration-500 ${buildPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {[
                  { label: 'Revenue', value: `$${counters.revenue.toLocaleString()}`, color: 'text-green-400' },
                  { label: 'Orders', value: counters.orders.toLocaleString(), color: 'text-blue-400' },
                  { label: 'Users', value: counters.users.toLocaleString(), color: 'text-purple-400' },
                  { label: 'Growth', value: `+${counters.growth}%`, color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-800/50 rounded p-2">
                    <div className="text-[10px] text-slate-500">{stat.label}</div>
                    <div className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className={`bg-slate-800/50 rounded p-2 mb-3 transition-all duration-500 ${buildPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-[10px] text-slate-500 mb-2">Weekly Performance</div>
                <div className="flex items-end gap-1 h-16">
                  {chartBars.map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <span key={day} className="text-[8px] text-slate-600">{day}</span>
                  ))}
                </div>
              </div>

              {/* Table preview */}
              <div className={`bg-slate-800/50 rounded p-2 transition-all duration-500 ${buildPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-[10px] text-slate-500 mb-2">Recent Orders</div>
                <div className="space-y-1">
                  {[
                    { id: '#2847', customer: 'Acme Corp', status: 'Completed', amount: '$1,234' },
                    { id: '#2846', customer: 'Tech Inc', status: 'Processing', amount: '$567' },
                    { id: '#2845', customer: 'Global Ltd', status: 'Completed', amount: '$2,891' },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center text-[10px] py-1 border-b border-slate-700/50 last:border-0">
                      <span className="text-slate-400 w-12">{order.id}</span>
                      <span className="text-slate-300 flex-1">{order.customer}</span>
                      <span className={`w-16 ${order.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>{order.status}</span>
                      <span className="text-slate-300 w-14 text-right">{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Build progress */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
              style={{ width: `${(buildPhase + 1) * 20}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">Building...</span>
        </div>
      </div>
    )
  }

  // Analytics variant
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700">
      <div className="text-xs text-slate-500 mb-3 font-mono flex items-center justify-between">
        <span>analytics_dashboard.py</span>
        <span className="text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Live Data
        </span>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Total Revenue', value: `$${counters.revenue.toLocaleString()}`, change: '+12.5%', up: true },
            { label: 'Active Users', value: counters.users.toLocaleString(), change: '+8.3%', up: true },
            { label: 'Conversion Rate', value: `${counters.growth}%`, change: '+2.1%', up: true },
            { label: 'Avg. Order Value', value: `$${Math.floor(counters.revenue / (counters.orders || 1))}`, change: '-0.5%', up: false },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-[10px] text-slate-500 mb-1">{kpi.label}</div>
              <div className="text-lg font-bold text-white font-mono">{kpi.value}</div>
              <div className={`text-[10px] flex items-center gap-1 ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                <svg className={`w-3 h-3 ${kpi.up ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {kpi.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="bg-slate-800/30 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">Revenue Trend</span>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y'].map((period, i) => (
                <button
                  key={period}
                  className={`text-[10px] px-2 py-0.5 rounded ${
                    i === 2 ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Line chart simulation */}
          <div className="relative h-24">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 20, 40, 60].map((y) => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#334155" strokeWidth="0.5" />
              ))}

              {/* Area fill */}
              <path
                d={`M0,60 L20,${60 - chartBars[0] * 0.6} L60,${60 - chartBars[1] * 0.6} L100,${60 - chartBars[2] * 0.6} L140,${60 - chartBars[3] * 0.6} L180,${60 - chartBars[4] * 0.6} L200,${60 - chartBars[5] * 0.6} L200,80 L0,80 Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-500"
              />

              {/* Line */}
              <path
                d={`M0,60 L20,${60 - chartBars[0] * 0.6} L60,${60 - chartBars[1] * 0.6} L100,${60 - chartBars[2] * 0.6} L140,${60 - chartBars[3] * 0.6} L180,${60 - chartBars[4] * 0.6} L200,${60 - chartBars[5] * 0.6}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                className="transition-all duration-500"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Mini insights */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Peak Hour', value: '2-3 PM', icon: '⏰' },
            { label: 'Top Product', value: 'Widget Pro', icon: '📦' },
            { label: 'Best Region', value: 'Northeast', icon: '📍' },
          ].map((insight) => (
            <div key={insight.label} className="bg-slate-800/30 rounded p-2 text-center">
              <div className="text-sm mb-1">{insight.icon}</div>
              <div className="text-[10px] text-slate-500">{insight.label}</div>
              <div className="text-xs text-slate-300 font-medium">{insight.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
