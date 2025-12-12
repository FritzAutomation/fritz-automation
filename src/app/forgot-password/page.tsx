import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Fritz Automation account password.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Fritz Automation home">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Reset Password</h1>
          <p className="text-slate-600 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-10 bg-slate-200 rounded"></div><div className="h-10 bg-slate-200 rounded"></div></div>}>
            <ForgotPasswordForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-primary transition-colors text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
