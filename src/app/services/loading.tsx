import { Skeleton, ServicesSkeleton } from '@/components/ui/Skeleton'

export default function ServicesLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="max-w-[100vw] mx-auto">
          <div className="flex items-center h-12 px-4 gap-4">
            <Skeleton className="h-5 w-36 bg-slate-800" />
            <div className="hidden md:flex items-center gap-6 flex-1">
              <Skeleton className="h-4 w-16 bg-slate-800" />
              <Skeleton className="h-4 w-16 bg-slate-800" />
              <Skeleton className="h-4 w-16 bg-slate-800" />
              <Skeleton className="h-4 w-16 bg-slate-800" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg bg-slate-800 ml-auto" />
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-8 w-32 mx-auto rounded-full mb-4 bg-slate-700" />
          <Skeleton className="h-14 w-72 mx-auto mb-6 bg-slate-700" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-slate-700" />
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesSkeleton />
        </div>
      </div>
    </div>
  )
}
