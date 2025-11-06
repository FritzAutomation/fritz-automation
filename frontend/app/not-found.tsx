import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* 404 Graphic */}
        <div className="mb-8 fade-in">
          <div className="text-9xl font-bold mb-4">
            <span className="gradient-text">404</span>
          </div>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Message */}
        <div className="mb-8 fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '200ms' }}>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </Link>

          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            View Projects
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/#skills" className="text-primary hover:underline">
              Skills
            </Link>
            <Link href="/#experience" className="text-primary hover:underline">
              Experience
            </Link>
            <Link href="/#projects" className="text-primary hover:underline">
              Projects
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
