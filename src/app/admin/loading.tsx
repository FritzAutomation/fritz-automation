import { StatsCardsSkeleton, TableSkeleton } from '@/components/ui/Skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-700/50 rounded animate-pulse" />
      </div>

      <StatsCardsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
          <TableSkeleton rows={5} columns={3} />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
          <TableSkeleton rows={5} columns={3} />
        </div>
      </div>
    </div>
  )
}
