import { PortalStatsCardsSkeleton, PortalTableSkeleton } from '@/components/ui/Skeleton'

export default function PortalDashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
      </div>

      <PortalStatsCardsSkeleton />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />
        <PortalTableSkeleton rows={5} columns={4} />
      </div>
    </div>
  )
}
