import { Skeleton } from '@/components/ui/Skeleton'

export default function ContactLoading() {
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

      {/* Contact section skeleton */}
      <div className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto rounded-full mb-4 bg-slate-200" />
            <Skeleton className="h-14 w-64 mx-auto mb-4 bg-slate-200" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto bg-slate-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <Skeleton className="h-6 w-48 mb-6 bg-slate-200" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="w-11 h-11 rounded-xl bg-slate-200" />
                      <div>
                        <Skeleton className="h-5 w-20 mb-1 bg-slate-200" />
                        <Skeleton className="h-4 w-40 bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Skeleton className="h-32 w-full rounded-2xl bg-slate-200" />
            </div>

            {/* Form skeleton */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <Skeleton className="h-6 w-40 mb-6 bg-slate-200" />
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-slate-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2 bg-slate-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 bg-slate-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 bg-slate-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-slate-200" />
                  <Skeleton className="h-36 w-full rounded-xl bg-slate-200" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
