'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  className?: string
  theme?: 'light' | 'dark'
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
  theme = 'dark',
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (showEllipsisStart) {
        pages.push('...')
      }

      // Show pages around current page
      const start = showEllipsisStart ? currentPage - 1 : 2
      const end = showEllipsisEnd ? currentPage + 1 : totalPages - 1

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i)
        }
      }

      if (showEllipsisEnd) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  const isDark = theme === 'dark'
  const baseButtonClass = cn(
    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
    isDark
      ? 'text-slate-300 hover:bg-slate-700'
      : 'text-slate-600 hover:bg-slate-100'
  )
  const activeButtonClass = cn(
    'px-3 py-2 text-sm font-medium rounded-lg',
    isDark
      ? 'bg-primary text-white'
      : 'bg-primary text-white'
  )
  const disabledButtonClass = cn(
    'px-3 py-2 text-sm font-medium rounded-lg cursor-not-allowed',
    isDark
      ? 'text-slate-600'
      : 'text-slate-300'
  )

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>

      <nav className="flex items-center gap-1">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)} className={baseButtonClass}>
            Previous
          </Link>
        ) : (
          <span className={disabledButtonClass}>Previous</span>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span
              key={`ellipsis-${index}`}
              className={cn('px-2', isDark ? 'text-slate-500' : 'text-slate-400')}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(page)}
              className={page === currentPage ? activeButtonClass : baseButtonClass}
            >
              {page}
            </Link>
          )
        )}

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)} className={baseButtonClass}>
            Next
          </Link>
        ) : (
          <span className={disabledButtonClass}>Next</span>
        )}
      </nav>
    </div>
  )
}
