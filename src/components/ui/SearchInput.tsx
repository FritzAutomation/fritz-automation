'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  className?: string
  theme?: 'light' | 'dark'
}

export function SearchInput({
  placeholder = 'Search...',
  className,
  theme = 'dark',
}: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('search') || '')

  // Update input when URL changes
  useEffect(() => {
    setValue(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = (term: string) => {
    setValue(term)
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('search', term)
      params.set('page', '1') // Reset to first page on search
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const isDark = theme === 'dark'

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={cn(
            'h-5 w-5',
            isDark ? 'text-slate-400' : 'text-slate-500',
            isPending && 'animate-pulse'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'block w-full pl-10 pr-3 py-2 rounded-lg text-sm transition-colors',
          isDark
            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500/20'
            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-primary focus:ring-primary/20',
          'border focus:ring-2 focus:outline-none'
        )}
      />
      {value && (
        <button
          onClick={() => handleSearch('')}
          className={cn(
            'absolute inset-y-0 right-0 pr-3 flex items-center',
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
