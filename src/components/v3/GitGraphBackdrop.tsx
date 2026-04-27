'use client'

import { useEffect, useRef } from 'react'

/**
 * Faint emerald horizon "git activity" graph for hero backdrops.
 * Replaces the v2 contour-line idea — this looks like commit dots on a horizon.
 * Generated procedurally so each page-load looks fresh.
 */
export function GitGraphBackdrop({ height = 600 }: { height?: number }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const W = 1200
    const H = height
    const points: [number, number][] = []
    let baseY = H * 0.65
    for (let x = -50; x <= W + 50; x += 22) {
      baseY += (Math.random() - 0.5) * 22
      baseY = Math.max(H * 0.4, Math.min(H * 0.9, baseY))
      points.push([x, baseY])
    }
    let d = `M${points[0][0]},${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i]
      const [px, py] = points[i - 1]
      d += ` Q${px},${py} ${(x + px) / 2},${(y + py) / 2}`
    }
    d += ` T${points[points.length - 1][0]},${points[points.length - 1][1]}`
    const dots = points.filter((_, i) => i % 3 === 1)

    let inner = `<path class="v3-git-line" d="${d}" />`
    for (let n = 0; n < 4; n++) {
      const offset = 60 + n * 40
      const opacity = 0.06 - n * 0.012
      inner += `<path class="v3-git-line" d="${d}" style="opacity:${opacity};" transform="translate(0,${-offset})" />`
    }
    dots.forEach(([x, y], idx) => {
      inner += `<circle class="v3-git-dot" cx="${x}" cy="${y}" r="2.5" data-i="${idx}" />`
    })
    svg.innerHTML = inner

    const dotEls = svg.querySelectorAll<SVGCircleElement>('.v3-git-dot')
    const interval = window.setInterval(() => {
      if (!dotEls.length) return
      const target = dotEls[Math.floor(Math.random() * dotEls.length)]
      target.classList.remove('fresh')
      void target.getBBox()
      target.classList.add('fresh')
    }, 3500)
    return () => window.clearInterval(interval)
  }, [height])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      <svg
        ref={ref}
        viewBox={`0 0 1200 ${height}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        style={{ ['--git-stroke' as string]: 'var(--accent)' }}
      />
      <style>{`
        .v3-git-line { stroke: var(--accent); fill: none; stroke-width: 1.5; opacity: 0.18; }
        .v3-git-dot { fill: var(--accent); opacity: 0.55; }
        .v3-git-dot.fresh { animation: v3-dot-pulse 2s ease-out forwards; }
      `}</style>
    </div>
  )
}
