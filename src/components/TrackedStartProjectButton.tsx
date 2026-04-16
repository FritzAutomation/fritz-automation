'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/Button'

export function TrackedStartProjectButton({
  source,
  size = 'lg',
}: {
  source: string
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Link
      href="/contact"
      onClick={() => track('start_project_clicked', { source })}
    >
      <Button size={size}>Start a project</Button>
    </Link>
  )
}
