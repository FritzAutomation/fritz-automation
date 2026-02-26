'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Phase = 'idle' | 'input' | 'processing' | 'output' | 'complete'

interface Scenario {
  id: string
  label: string
  icon: string
  input: { icon: string; label: string }
  steps: string[]
  output: { icon: string; label: string; stat: string }
}

const scenarios: Scenario[] = [
  {
    id: 'reporting',
    label: 'Manual Reporting',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    input: { icon: 'M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7', label: 'Raw Data Files' },
    steps: ['Parse & validate', 'Aggregate metrics', 'Format reports'],
    output: { icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Auto Reports', stat: '95% faster' },
  },
  {
    id: 'data-entry',
    label: 'Data Entry',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    input: { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Paper Forms' },
    steps: ['OCR extraction', 'Field mapping', 'Database insert'],
    output: { icon: 'M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7', label: 'Structured DB', stat: '99.5% accurate' },
  },
  {
    id: 'integration',
    label: 'System Integration',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    input: { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Legacy Systems' },
    steps: ['API translation', 'Data transform', 'Sync & verify'],
    output: { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Unified Platform', stat: '100% synced' },
  },
  {
    id: 'email',
    label: 'Email Processing',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    input: { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Inbox Queue' },
    steps: ['Classify intent', 'Extract data', 'Route & respond'],
    output: { icon: 'M5 13l4 4L19 7', label: 'Auto Handled', stat: '85% auto-resolved' },
  },
]

function SvgIcon({ d, className = 'w-6 h-6' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  )
}

export function ProcessWidget() {
  const prefersReducedMotion = useReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [visibleSteps, setVisibleSteps] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const active = scenarios.find((s) => s.id === activeId) ?? null

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }, [])

  const run = useCallback(
    (scenario: Scenario) => {
      clearTimers()
      setVisibleSteps(0)

      if (prefersReducedMotion) {
        setPhase('complete')
        setVisibleSteps(scenario.steps.length)
        return
      }

      setPhase('input')
      const t1 = setTimeout(() => {
        setPhase('processing')
        scenario.steps.forEach((_, i) => {
          const t = setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 400)
          timerRef.current.push(t)
        })
      }, 500)

      const t2 = setTimeout(() => setPhase('output'), 500 + scenario.steps.length * 400)
      const t3 = setTimeout(() => setPhase('complete'), 500 + scenario.steps.length * 400 + 300)

      timerRef.current.push(t1, t2, t3)
    },
    [clearTimers, prefersReducedMotion]
  )

  const selectScenario = useCallback(
    (id: string) => {
      const scenario = scenarios.find((s) => s.id === id)!
      setActiveId(id)
      run(scenario)
    },
    [run]
  )

  useEffect(() => {
    return clearTimers
  }, [clearTimers])

  const show = (fromPhase: Phase) => {
    if (prefersReducedMotion && phase !== 'idle') return true
    const order: Phase[] = ['idle', 'input', 'processing', 'output', 'complete']
    return order.indexOf(phase) >= order.indexOf(fromPhase)
  }

  return (
    <section className="py-20 md:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
            See It in Action
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How Automation Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pick a scenario to see how we transform manual processes into automated workflows
          </p>
        </div>

        {/* Scenario buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => selectScenario(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeId === s.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <SvgIcon d={s.icon} className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Animation area */}
        {active && (
          <div className="grid md:grid-cols-3 gap-6 items-start relative">
            {/* Input column */}
            <div
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-all duration-500"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: show('input') ? 1 : 0,
                      transform: show('input') ? 'translateX(0)' : 'translateX(-30px)',
                    }
              }
            >
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Input</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
                  <SvgIcon d={active.input.icon} className="w-5 h-5" />
                </div>
                <span className="text-slate-200 font-medium">{active.input.label}</span>
              </div>
            </div>

            {/* Processing column */}
            <div
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-all duration-300"
              style={
                prefersReducedMotion
                  ? undefined
                  : { opacity: show('processing') ? 1 : 0 }
              }
            >
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Processing</div>
              <div className="space-y-3">
                {active.steps.map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 ${
                      prefersReducedMotion || i < visibleSteps ? 'process-step-enter' : 'opacity-0'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i < visibleSteps
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-500'
                      } transition-colors duration-300`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Output column */}
            <div
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-all duration-500"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: show('output') ? 1 : 0,
                      transform: show('output') ? 'translateX(0)' : 'translateX(30px)',
                    }
              }
            >
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Output</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                  <SvgIcon d={active.output.icon} className="w-5 h-5" />
                </div>
                <span className="text-slate-200 font-medium">{active.output.label}</span>
              </div>
              {show('complete') && (
                <div
                  className={`mt-4 inline-flex px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold ${
                    prefersReducedMotion ? '' : 'stat-pop'
                  }`}
                >
                  {active.output.stat}
                </div>
              )}
            </div>

            {/* Arrows between columns (desktop) */}
            <div className="hidden md:flex absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 items-center pointer-events-none">
              <svg width="32" height="16" viewBox="0 0 32 16" aria-hidden="true">
                <path
                  d="M0 8h28m0 0l-6-6m6 6l-6 6"
                  stroke={show('processing') ? '#10b981' : '#334155'}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-300"
                />
              </svg>
            </div>
            <div className="hidden md:flex absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 items-center pointer-events-none">
              <svg width="32" height="16" viewBox="0 0 32 16" aria-hidden="true">
                <path
                  d="M0 8h28m0 0l-6-6m6 6l-6 6"
                  stroke={show('output') ? '#10b981' : '#334155'}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-300"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Idle state prompt */}
        {!active && (
          <div className="text-center py-16 text-slate-500">
            <SvgIcon
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              className="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <p className="text-lg">Choose a scenario above to see the automation flow</p>
          </div>
        )}
      </div>
    </section>
  )
}
