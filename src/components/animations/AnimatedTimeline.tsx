'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Milestone {
  year: string
  title: string
  description: string
}

interface AnimatedTimelineProps {
  milestones: Milestone[]
}

function TimelineItem({
  milestone,
  index,
  reducedMotion,
}: {
  milestone: Milestone
  index: number
  reducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div
      ref={ref}
      className="flex gap-4 transition-all duration-500 ease-out"
      style={
        reducedMotion
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${index * 150}ms`,
            }
      }
    >
      <div className="flex-shrink-0">
        <div
          className="w-16 h-8 bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center transition-transform duration-400 ease-out"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: visible ? 'scale(1)' : 'scale(0)',
                  transitionDelay: `${index * 150}ms`,
                }
          }
        >
          {milestone.year}
        </div>
      </div>
      <div className="pb-6">
        <h3 className="font-bold text-slate-900">{milestone.title}</h3>
        <p className="text-sm text-slate-600">{milestone.description}</p>
      </div>
    </div>
  )
}

export function AnimatedTimeline({ milestones }: AnimatedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineVisible, setLineVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setLineVisible(true)
      return
    }
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  // Compute line height: we need space between the first and last milestones
  // The SVG is positioned absolutely within the container
  const lineHeight = milestones.length > 1 ? (milestones.length - 1) * 64 : 0

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 border border-slate-200"
    >
      <div className="relative space-y-0">
        {/* SVG connecting line */}
        {milestones.length > 1 && (
          <svg
            className="absolute left-[31px] top-[32px] pointer-events-none"
            width="2"
            height={lineHeight}
            aria-hidden="true"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2={lineHeight}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray={lineHeight}
              strokeDashoffset={prefersReducedMotion || lineVisible ? 0 : lineHeight}
              className={
                !prefersReducedMotion && lineVisible ? 'timeline-line-draw' : ''
              }
              style={
                !prefersReducedMotion
                  ? ({ '--line-len': lineHeight } as React.CSSProperties)
                  : undefined
              }
            />
          </svg>
        )}

        {milestones.map((milestone, index) => (
          <TimelineItem
            key={milestone.year}
            milestone={milestone}
            index={index}
            reducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  )
}
