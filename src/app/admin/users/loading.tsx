import { TableSkeleton } from '@/components/ui/Skeleton'

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-slate-700/50 rounded animate-pulse" />
        </div>
      </div>

      <TableSkeleton rows={10} columns={6} />
    </div>
  )
}
