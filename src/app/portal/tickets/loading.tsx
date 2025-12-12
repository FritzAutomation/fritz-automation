import { PortalTableSkeleton } from '@/components/ui/Skeleton'

export default function PortalTicketsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      <PortalTableSkeleton rows={8} columns={4} />
    </div>
  )
}
