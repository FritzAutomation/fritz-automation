import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <span className="text-[150px] md:text-[200px] font-bold text-slate-100 select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-24 h-24 md:w-32 md:h-32 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button size="lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">Or try one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: '/services', label: 'Services' },
                { href: '/case-studies', label: 'Case Studies' },
                { href: '/industries', label: 'Industries' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-primary hover:text-primary-dark hover:underline transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
