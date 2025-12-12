import { Skeleton, IndustriesSkeleton } from '@/components/ui/Skeleton'

export default function IndustriesLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton className="h-8 w-40 bg-slate-200" />
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <Skeleton className="h-10 w-28 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-8 w-32 mx-auto rounded-full mb-4 bg-slate-700" />
          <Skeleton className="h-14 w-80 mx-auto mb-6 bg-slate-700" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-slate-700" />
        </div>
      </div>

      {/* Industries grid skeleton */}
      <div className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3 bg-slate-200" />
                <Skeleton className="h-4 w-20 mx-auto bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed section skeleton */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <IndustriesSkeleton />
        </div>
      </div>
    </div>
  )
}
