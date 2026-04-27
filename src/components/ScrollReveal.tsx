import type { ReactNode } from 'react'

/**
 * Previously a fade-in-on-scroll wrapper. Removed because the SSR-to-hydration
 * transition caused a visible flash (content rendered, then briefly hidden, then
 * fading back in). Kept as a pass-through so existing call sites still compile.
 */
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
