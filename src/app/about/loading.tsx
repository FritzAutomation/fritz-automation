import { Skeleton } from '@/components/ui/Skeleton'

export default function AboutLoading() {
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
      <div className="py-12 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-10 w-16 mx-auto mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-28 mx-auto bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story skeleton */}
      <div className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-8 w-32 rounded-full mb-4 bg-slate-800" />
              <Skeleton className="h-10 w-full mb-6 bg-slate-800" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-5/6 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-4/5 bg-slate-800" />
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <Skeleton className="w-16 h-8 rounded bg-slate-800" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2 bg-slate-800" />
                    <Skeleton className="h-4 w-full bg-slate-800" />
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
