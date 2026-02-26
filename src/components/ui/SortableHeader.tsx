'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

interface SortableHeaderProps {
  column: string
  label: string
  className?: string
  theme?: 'light' | 'dark'
}

export function SortableHeader({
  column,
  label,
  className,
  theme = 'dark',
}: SortableHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get('sort') || ''
  const currentOrder = searchParams.get('order') || 'desc'

  const isActive = currentSort === column
  const nextOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc'

  const handleSort = () => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', column)
    params.set('order', isActive ? nextOrder : 'desc')
    params.set('page', '1') // Reset to first page on sort change

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const isDark = theme === 'dark'

  return (
    <th
      className={cn(
        'text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors',
        isDark
          ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
        isPending && 'opacity-50',
        className
      )}
      onClick={handleSort}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className={cn('flex flex-col', !isActive && 'opacity-30')}>
          <svg
            className={cn(
              'w-3 h-3 -mb-1',
              isActive && currentOrder === 'asc'
                ? isDark ? 'text-emerald-400' : 'text-primary'
                : ''
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 12l5-5 5 5H5z" />
          </svg>
          <svg
            className={cn(
              'w-3 h-3 -mt-1',
              isActive && currentOrder === 'desc'
                ? isDark ? 'text-emerald-400' : 'text-primary'
                : ''
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 8l5 5 5-5H5z" />
          </svg>
        </span>
      </div>
    </th>
  )
}
