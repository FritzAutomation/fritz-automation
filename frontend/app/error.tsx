'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Error Graphic */}
        <div className="mb-8 fade-in">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Something Went Wrong
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            We encountered an unexpected error. Don't worry, it's not your fault!
          </p>
        </div>

        {/* Error Details (Dev Mode) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 fade-in bg-gray-100 rounded-2xl p-6 text-left">
            <p className="text-sm font-mono text-red-600 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '100ms' }}>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200 fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-sm text-gray-600">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-primary hover:underline font-semibold">
              contact me
            </Link>
            {' '}and let me know what happened.
          </p>
        </div>
      </div>
    </div>
  );
}
