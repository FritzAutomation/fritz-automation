'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const STAGES = ['Input', 'Validate', 'Transform', 'Enrich', 'Output']

export function PipelineHero() {
  const [activeStage, setActiveStage] = useState(-1)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= STAGES.length - 1) return -1
        return prev + 1
      })
    }, 800)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <div className="hidden sm:block mb-6">
      <svg
        viewBox="0 0 520 60"
        className="w-full max-w-lg"
        role="img"
        aria-label="Automation pipeline: Input, Validate, Transform, Enrich, Output"
      >
        {/* Dashed connection line */}
        <line
          x1="40"
          y1="20"
          x2="480"
          y2="20"
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Flowing dots */}
        {!prefersReducedMotion && (
          <>
            <circle r="3" fill="#34d399" className="pipeline-flow" style={{ animationDelay: '0s' }}>
              <set attributeName="cy" to="20" />
            </circle>
            <circle r="3" fill="#34d399" className="pipeline-flow" style={{ animationDelay: '1.2s' }}>
              <set attributeName="cy" to="20" />
            </circle>
            <circle r="3" fill="#34d399" className="pipeline-flow" style={{ animationDelay: '2.4s' }}>
              <set attributeName="cy" to="20" />
            </circle>
          </>
        )}

        {/* Stage nodes */}
        {STAGES.map((stage, i) => {
          const cx = 40 + i * 110
          const isActive = i === activeStage
          return (
            <g key={stage}>
              {/* Glow ring */}
              <circle
                cx={cx}
                cy={20}
                r={14}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                style={{
                  opacity: isActive ? 1 : 0.3,
                  filter: isActive ? 'drop-shadow(0 0 6px #10b981)' : 'none',
                  transition: 'opacity 0.3s, filter 0.3s',
                }}
              />
              {/* Inner circle */}
              <circle
                cx={cx}
                cy={20}
                r={8}
                fill={isActive ? '#10b981' : '#1e293b'}
                stroke="#10b981"
                strokeWidth="1.5"
                style={{
                  transition: 'fill 0.3s',
                }}
              />
              {/* Label */}
              <text
                x={cx}
                y={48}
                textAnchor="middle"
                fill={isActive ? '#34d399' : '#94a3b8'}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                style={{ transition: 'fill 0.3s' }}
              >
                {stage}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
