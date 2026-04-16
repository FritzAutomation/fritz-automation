import { Skeleton } from '@/components/ui/Skeleton'

export default function ContactLoading() {
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

      {/* Contact section skeleton */}
      <div className="py-20 md:py-32 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto rounded-full mb-4 bg-slate-800" />
            <Skeleton className="h-14 w-64 mx-auto mb-4 bg-slate-800" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto bg-slate-800" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info skeleton */}
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-sm">
                <Skeleton className="h-6 w-48 mb-6 bg-slate-800" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="w-11 h-11 rounded-xl bg-slate-800" />
                      <div>
                        <Skeleton className="h-5 w-20 mb-1 bg-slate-800" />
                        <Skeleton className="h-4 w-40 bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Skeleton className="h-32 w-full rounded-2xl bg-slate-800" />
            </div>

            {/* Form skeleton */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-sm">
              <Skeleton className="h-6 w-40 mb-6 bg-slate-800" />
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-slate-800" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2 bg-slate-800" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 bg-slate-800" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 bg-slate-800" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-slate-800" />
                  <Skeleton className="h-36 w-full rounded-xl bg-slate-800" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
