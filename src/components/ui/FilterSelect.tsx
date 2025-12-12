'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  paramName: string
  options: FilterOption[]
  placeholder?: string
  className?: string
  theme?: 'light' | 'dark'
}

export function FilterSelect({
  paramName,
  options,
  placeholder = 'All',
  className,
  theme = 'dark',
}: FilterSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentValue = searchParams.get(paramName) || ''

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(paramName, value)
      params.set('page', '1') // Reset to first page on filter change
    } else {
      params.delete(paramName)
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const isDark = theme === 'dark'

  return (
    <select
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={cn(
        'block px-3 py-2 rounded-lg text-sm transition-colors',
        isDark
          ? 'bg-slate-700 border-slate-600 text-white focus:border-red-500 focus:ring-red-500/20'
          : 'bg-white border-slate-300 text-slate-900 focus:border-primary focus:ring-primary/20',
        'border focus:ring-2 focus:outline-none',
        isPending && 'opacity-50',
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
