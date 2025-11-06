export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-28 h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-48 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-full h-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="w-36 h-12 bg-gray-200 rounded-xl animate-pulse" />
                <div className="w-36 h-12 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Skills Marquee Skeleton */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-32 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* Skills Section Skeleton */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-40 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
              </div>
              <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section Skeleton */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-40 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Skeleton */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-40 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-32 h-6 bg-gray-700 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
