import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
    />
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800/50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Light theme variants for portal
export function PortalTableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <Skeleton className="h-4 w-20 bg-slate-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton className="h-4 w-full bg-slate-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PortalCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <Skeleton className="h-4 w-24 mb-2 bg-slate-200" />
      <Skeleton className="h-8 w-16 bg-slate-200" />
    </div>
  )
}

export function PortalStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <PortalCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Homepage section skeletons
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <Skeleton className="w-14 h-14 rounded-xl mb-6 bg-slate-200" />
      <Skeleton className="h-6 w-3/4 mb-3 bg-slate-200" />
      <Skeleton className="h-4 w-full mb-2 bg-slate-200" />
      <Skeleton className="h-4 w-5/6 mb-4 bg-slate-200" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5 bg-slate-200" />
        <Skeleton className="h-4 w-3/4 bg-slate-200" />
        <Skeleton className="h-4 w-4/5 bg-slate-200" />
      </div>
    </div>
  )
}

export function ServicesSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function IndustryCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-100">
      <Skeleton className="w-12 h-12 rounded-xl mb-4 bg-slate-200" />
      <Skeleton className="h-5 w-3/4 mb-2 bg-slate-200" />
      <Skeleton className="h-4 w-full bg-slate-200" />
    </div>
  )
}

export function IndustriesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <IndustryCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-5 h-5 rounded bg-slate-200" />
        ))}
      </div>
      <Skeleton className="h-4 w-full mb-2 bg-slate-200" />
      <Skeleton className="h-4 w-full mb-2 bg-slate-200" />
      <Skeleton className="h-4 w-3/4 mb-6 bg-slate-200" />
      <Skeleton className="h-6 w-32 rounded-full mb-6 bg-slate-200" />
      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        <Skeleton className="w-12 h-12 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-slate-200" />
          <Skeleton className="h-3 w-20 bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  )
}
