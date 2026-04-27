'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PathCrumbs({ trail }: { trail?: { label: string; href?: string }[] }) {
  const pathname = usePathname()

  const segments = trail ?? pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg,
      href: '/' + arr.slice(0, i + 1).join('/'),
    }))

  return (
    <div className="font-mono text-xs text-[var(--ink-dim)] flex items-center gap-1 flex-wrap">
      <Link href="/" className="hover:text-[var(--accent)] transition-colors">~</Link>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-[var(--ink-dim)]">/</span>
          {seg.href && i < segments.length - 1 ? (
            <Link href={seg.href} className="hover:text-[var(--accent)] transition-colors">
              {seg.label}
            </Link>
          ) : (
            <span className="text-[var(--ink)]">{seg.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
