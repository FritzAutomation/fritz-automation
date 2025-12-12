import { Skeleton } from '@/components/ui/Skeleton'

export default function AboutLoading() {
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
            <Skeleton className="h-8 w-32 rounded-full mb-4 bg-slate-700" />
            <Skeleton className="h-14 w-full mb-2 bg-slate-700" />
            <Skeleton className="h-14 w-3/4 mb-6 bg-slate-700" />
            <Skeleton className="h-6 w-full bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-10 w-16 mx-auto mb-2 bg-slate-200" />
                <Skeleton className="h-4 w-28 mx-auto bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-8 w-32 rounded-full mb-4 bg-slate-200" />
              <Skeleton className="h-10 w-full mb-6 bg-slate-200" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-slate-200" />
                <Skeleton className="h-4 w-full bg-slate-200" />
                <Skeleton className="h-4 w-5/6 bg-slate-200" />
                <Skeleton className="h-4 w-full bg-slate-200" />
                <Skeleton className="h-4 w-4/5 bg-slate-200" />
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <Skeleton className="w-16 h-8 rounded bg-slate-200" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2 bg-slate-200" />
                    <Skeleton className="h-4 w-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
