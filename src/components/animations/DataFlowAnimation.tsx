'use client'

import { useEffect, useState } from 'react'

interface DataFlowAnimationProps {
  variant: 'process' | 'integration'
}

export function DataFlowAnimation({ variant }: DataFlowAnimationProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [dataPackets, setDataPackets] = useState<number[]>([])

  useEffect(() => {
    // Cycle through steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 2000)

    // Create data packets
    const packetInterval = setInterval(() => {
      setDataPackets((prev) => {
        const newPackets = [...prev, Date.now()]
        // Keep only last 5 packets
        return newPackets.slice(-5)
      })
    }, 800)

    return () => {
      clearInterval(stepInterval)
      clearInterval(packetInterval)
    }
  }, [])

  if (variant === 'process') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="text-xs text-slate-500 mb-4 font-mono">process_automation.py</div>

        {/* Before/After comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Manual Process */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              MANUAL PROCESS
            </div>
            <div className="space-y-2">
              {['Open Excel', 'Copy Data', 'Paste to System', 'Verify Entry', 'Repeat 500x'].map((step, i) => (
                <div
                  key={step}
                  className={`text-xs py-1.5 px-2 rounded transition-all duration-300 ${
                    activeStep === i % 4 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="text-xs text-slate-500">Time: <span className="text-emerald-400 font-mono">4+ hours</span></div>
            </div>
          </div>

          {/* Automated Process */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs text-green-400 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              AUTOMATED
            </div>
            <div className="space-y-2">
              <div className="bg-green-500/20 text-green-300 text-xs py-1.5 px-2 rounded">
                Run Script
              </div>
              <div className="relative h-20 bg-slate-700/30 rounded overflow-hidden">
                {/* Animated data flow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-1 left-2 text-[10px] text-slate-500 font-mono">
                  Processing 2,847 rows...
                </div>
              </div>
              <div className="bg-green-500/20 text-green-300 text-xs py-1.5 px-2 rounded flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Complete
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="text-xs text-slate-500">Time: <span className="text-green-400 font-mono">1.2 seconds</span></div>
            </div>
          </div>
        </div>

        {/* Time saved counter */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Time Saved Per Day</span>
            <span className="text-lg font-bold text-green-400 font-mono">3h 59m 58.8s</span>
          </div>
        </div>
      </div>
    )
  }

  // Integration variant
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="text-xs text-slate-500 mb-4 font-mono">system_integration.py</div>

      {/* System nodes */}
      <div className="relative h-64">
        {/* Central hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-xl flex items-center justify-center z-10">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>

        {/* System nodes around the hub */}
        {[
          { name: 'ERP', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', top: '5%', left: '50%', transform: '-translate-x-1/2' },
          { name: 'CRM', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', top: '50%', left: '5%', transform: '-translate-y-1/2' },
          { name: 'Accounting', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', top: '50%', right: '5%', transform: '-translate-y-1/2' },
          { name: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', bottom: '5%', left: '50%', transform: '-translate-x-1/2' },
        ].map((system, index) => (
          <div
            key={system.name}
            className="absolute"
            style={{
              top: system.top,
              left: system.left,
              right: system.right,
              bottom: system.bottom,
              transform: system.transform
            }}
          >
            <div className={`w-14 h-14 bg-slate-700 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
              activeStep === index ? 'border-green-500 bg-green-500/10' : 'border-slate-600'
            }`}>
              <svg className={`w-5 h-5 ${activeStep === index ? 'text-green-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={system.icon} />
              </svg>
              <span className="text-[10px] text-slate-400 mt-1">{system.name}</span>
            </div>
          </div>
        ))}

        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
          {/* Lines from each system to center */}
          {[
            { x1: '50%', y1: '20%', x2: '50%', y2: '42%' },
            { x1: '20%', y1: '50%', x2: '42%', y2: '50%' },
            { x1: '80%', y1: '50%', x2: '58%', y2: '50%' },
            { x1: '50%', y1: '80%', x2: '50%', y2: '58%' },
          ].map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={activeStep === i ? '#22c55e' : '#475569'}
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Data packets animation */}
        {dataPackets.map((packet, i) => (
          <div
            key={packet}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDuration: '1s',
              opacity: 1 - i * 0.2
            }}
          />
        ))}
      </div>

      {/* Status bar */}
      <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Sync Status</span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Real-time Connected
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-[10px] text-slate-500">
          <span>Last sync: <span className="text-slate-300">2s ago</span></span>
          <span>Records: <span className="text-slate-300">12,847</span></span>
          <span>Errors: <span className="text-green-400">0</span></span>
        </div>
      </div>
    </div>
  )
}
