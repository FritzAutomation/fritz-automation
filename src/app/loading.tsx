import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Skeleton className="h-8 w-48 rounded-full mb-4 bg-slate-700" />
            <Skeleton className="h-12 w-full mb-4 bg-slate-700" />
            <Skeleton className="h-12 w-3/4 mb-6 bg-slate-700" />
            <Skeleton className="h-6 w-full mb-2 bg-slate-700" />
            <Skeleton className="h-6 w-5/6 mb-8 bg-slate-700" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36 rounded-xl bg-slate-700" />
              <Skeleton className="h-12 w-36 rounded-xl bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4 bg-slate-200" />
            <Skeleton className="h-6 w-96 mx-auto bg-slate-200" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100">
                <Skeleton className="w-14 h-14 rounded-xl mb-6 bg-slate-200" />
                <Skeleton className="h-6 w-3/4 mb-3 bg-slate-200" />
                <Skeleton className="h-4 w-full mb-2 bg-slate-200" />
                <Skeleton className="h-4 w-5/6 bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
