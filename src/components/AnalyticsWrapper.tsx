'use client'

import { Analytics } from '@vercel/analytics/react'
import { usePathname } from 'next/navigation'

const EXCLUDED_PREFIXES = [
  '/portal',
  '/admin',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export function AnalyticsWrapper() {
  const pathname = usePathname()
  if (isExcluded(pathname)) return null
  return <Analytics />
}
