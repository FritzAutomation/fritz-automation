'use client'

import { useEffect, useState } from 'react'

export function WebsiteBuilderAnimation() {
  const [buildPhase, setBuildPhase] = useState(0)
  const [lighthouseScore, setLighthouseScore] = useState(0)

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setBuildPhase((prev) => (prev + 1) % 5)
    }, 2500)

    return () => clearInterval(phaseInterval)
  }, [])

  useEffect(() => {
    // Animate lighthouse score when phase 4 is active
    if (buildPhase === 4) {
      const target = 100
      const steps = 40
      const interval = 30
      let step = 0
      const scoreInterval = setInterval(() => {
        step++
        setLighthouseScore(Math.floor(target * (step / steps)))
        if (step >= steps) clearInterval(scoreInterval)
      }, interval)
      return () => clearInterval(scoreInterval)
    } else {
      setLighthouseScore(0)
    }
  }, [buildPhase])

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700 overflow-hidden">
      <div className="text-xs text-slate-500 mb-3 font-mono flex items-center justify-between">
        <span>website_build.tsx</span>
        <span className="text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Building
        </span>
      </div>

      <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
        {/* Phase 0: Browser chrome */}
        <div className={`transition-all duration-500 ${buildPhase >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-slate-700 rounded-full h-5 flex items-center px-3">
                <svg className="w-3 h-3 text-slate-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] text-slate-400 truncate">fritzautomation.dev</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 1: Navbar */}
        <div className={`transition-all duration-500 ${buildPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="h-8 bg-slate-900/80 border-b border-slate-700/50 flex items-center px-3 justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-emerald-500 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">F</span>
              </div>
              <span className="text-[9px] text-slate-300 font-semibold">Fritz</span>
            </div>
            <div className="flex gap-3">
              {['Services', 'About', 'Contact'].map((item) => (
                <span key={item} className="text-[8px] text-slate-500">{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 2: Hero section */}
        <div className={`px-4 py-5 transition-all duration-500 ${buildPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center">
            <div className="inline-block mb-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-[8px] text-emerald-400">Automation Experts</span>
            </div>
            <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-3/4 mx-auto mb-2" />
            <div className="h-2 bg-slate-700 rounded w-1/2 mx-auto mb-3" />
            <div className="flex justify-center gap-2">
              <div className="px-3 py-1 bg-emerald-500 rounded text-[8px] text-white">Get Started</div>
              <div className="px-3 py-1 bg-slate-700 rounded text-[8px] text-slate-300">Learn More</div>
            </div>
          </div>
        </div>

        {/* Phase 3: Content cards */}
        <div className={`px-3 pb-3 transition-all duration-500 ${buildPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Automation', color: 'from-emerald-500/20 to-emerald-500/5' },
              { label: 'Integration', color: 'from-cyan-500/20 to-cyan-500/5' },
              { label: 'Analytics', color: 'from-purple-500/20 to-purple-500/5' },
            ].map((card) => (
              <div key={card.label} className={`bg-gradient-to-b ${card.color} rounded-lg p-2 border border-slate-700/50`}>
                <div className="w-5 h-5 bg-slate-700 rounded mb-1.5" />
                <div className="text-[8px] text-slate-300 font-medium mb-1">{card.label}</div>
                <div className="h-1.5 bg-slate-700/50 rounded w-full mb-1" />
                <div className="h-1.5 bg-slate-700/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>

        {/* Phase 4: Footer + Lighthouse badge */}
        <div className={`transition-all duration-500 ${buildPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="h-10 bg-slate-800/50 border-t border-slate-700/50 flex items-center justify-between px-3">
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1.5 w-8 bg-slate-700 rounded" />
              ))}
            </div>
            {/* Lighthouse score badge */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#334155" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={lighthouseScore >= 90 ? '#10b981' : lighthouseScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${lighthouseScore * 0.942} 100`}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-emerald-400">
                  {lighthouseScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Build progress */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(buildPhase + 1) * 20}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500">
          {['Chrome...', 'Navbar...', 'Hero...', 'Content...', 'Complete!'][buildPhase]}
        </span>
      </div>
    </div>
  )
}
